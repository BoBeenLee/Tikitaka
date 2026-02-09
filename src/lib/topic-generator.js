import { model } from './gemini';

export async function generateAllQuestions(categories) {
    const categoryTitles = categories.map(c => c.title).join(', ');

    // We ask for 50 questions per category to be safe with output token limits.
    // 6 categories * 50 questions = 300 questions.
    const prompt = `Generate engaging, open-ended English conversation questions for the following categories: ${categoryTitles}.
  For EACH category, generate 50 high-quality questions suitable for intermediate learners.
  
  IMPORTANT: The questions should be relevant to daily life in Korea (e.g., questions about work culture, food, holidays, societal trends, or living in Korea).
  
  Return ONLY a raw JSON object where:
  - Keys are the EXACT category titles provided (e.g., "${categories[0].title}", "${categories[1].title}").
  - Values are arrays of strings (the questions).
  
  Example JSON structure:
  {
    "Category Name 1": ["Question 1", "Question 2"],
    "Category Name 2": ["Question 1", "Question 2"]
  }
  
  Do NOT use markdown formatting (no \`\`\`json blocks). Return just the JSON string.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedText);
        return data;
    } catch (error) {
        console.error("Error generating all questions:", error);
        return null;
    }
}

export async function updateAllTopics(currentCategories) {
    console.log("Updating all topics with a single API call...");

    // We use the new single-call function
    const allQuestionsData = await generateAllQuestions(currentCategories);

    if (!allQuestionsData) {
        console.warn("Failed to generate questions payload. Aborting update.");
        return {
            categories: currentCategories,
            lastUpdated: new Date().toISOString().split('T')[0] // Return current date so we don't retry immediately if API is down
        };
    }

    const updatedCategories = currentCategories.map(category => {
        const newQuestions = allQuestionsData[category.title];

        if (newQuestions && Array.isArray(newQuestions) && newQuestions.length > 0) {
            console.log(`Updated ${category.title} with ${newQuestions.length} questions.`);
            return {
                ...category,
                questions: newQuestions
            };
        } else {
            console.warn(`No new questions found for category: ${category.title}, keeping old ones.`);
            return category;
        }
    });

    return {
        categories: updatedCategories,
        lastUpdated: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
}
