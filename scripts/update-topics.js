const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const TOPICS_FILE_PATH = path.join(__dirname, '../src/app/data/topics.json');

async function updateTopics() {
    console.log('Starting topics update (batch mode)...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set');
        process.exit(1);
    }

    try {
        const fileContent = fs.readFileSync(TOPICS_FILE_PATH, 'utf8');
        const topicsData = JSON.parse(fileContent);

        const categories = topicsData.categories;
        const categoryTitles = categories.map(c => c.title).join(', ');

        console.log(`Generating questions for categories: ${categoryTitles}`);

        // Logic adapted from src/lib/topic-generator.js
        const prompt = `Generate engaging, open-ended English conversation questions for the following categories: ${categoryTitles}.
  For EACH category, generate 50 high-quality questions suitable for intermediate learners.
  
  IMPORTANT: The questions should be relevant to Korean culture or daily life in Korea (e.g., questions about Korean work culture, food, holidays, societal trends, or living in Korea).
  
  Return ONLY a raw JSON object where:
  - Keys are the EXACT category titles provided (e.g., "${categories[0].title}", "${categories[1].title}").
  - Values are arrays of strings (the questions).
  
  Example JSON structure:
  {
    "Category Name 1": ["Question 1", "Question 2"],
    "Category Name 2": ["Question 1", "Question 2"]
  }
  
  Do NOT use markdown formatting (no \`\`\`json blocks). Return just the JSON string.`;

        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let allQuestionsData;

        try {
            allQuestionsData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            console.error("Response text:", text);
            process.exit(1);
        }

        if (!allQuestionsData) {
            console.error("No data received from API.");
            process.exit(1);
        }

        let totalQuestionsAdded = 0;

        const updatedCategories = categories.map(category => {
            const newQuestions = allQuestionsData[category.title];

            if (newQuestions && Array.isArray(newQuestions) && newQuestions.length > 0) {
                console.log(`Updated ${category.title} with ${newQuestions.length} questions.`);
                totalQuestionsAdded += newQuestions.length;
                return {
                    ...category,
                    questions: newQuestions
                };
            } else {
                console.warn(`No new questions found for category: ${category.title}, keeping old ones.`);
                return category;
            }
        });

        topicsData.categories = updatedCategories;
        topicsData.lastUpdated = new Date().toISOString().split('T')[0];

        fs.writeFileSync(TOPICS_FILE_PATH, JSON.stringify(topicsData, null, 2));
        console.log(`Topics updated successfully! Total questions: ${totalQuestionsAdded}`);

    } catch (error) {
        console.error('Error updating topics:', error);
        process.exit(1);
    }
}

updateTopics();
