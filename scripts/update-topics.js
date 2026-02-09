const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const DATA_DIR = path.join(__dirname, '../src/app/data');

async function generateForLanguage(lang, filename) {
    const filePath = path.join(DATA_DIR, filename);
    console.log(`\nStarting topics update for [${lang}] in ${filename}...`);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return 0; // Skip if file doesn't exist
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const topicsData = JSON.parse(fileContent);

        const categories = topicsData.categories;
        const categoryTitles = categories.map(c => c.title).join(', ');

        console.log(`Generating questions for categories: ${categoryTitles}`);

        let prompt;
        if (lang === 'ja') {
            prompt = `Generate engaging, open-ended Japanese conversation questions for Korean learners studying Japanese.
  Categories: ${categoryTitles}.
  For EACH category, generate 50 high-quality questions suitable for intermediate learners.
  
  IMPORTANT: 
  - The questions should be designed for Koreans practicing Japanese conversation.
  - Topics should be relevant to daily life in Korea or Japan, or comparing the two cultures.
  - Questions should be natural and encourage extended answers.
  - The output MUST be in Japanese language.
  
  Return ONLY a raw JSON object where:
  - Keys are the EXACT category titles provided (e.g., "${categories[0].title}", "${categories[1].title}").
  - Values are arrays of strings (the questions).
  
  Example JSON structure:
  {
    "カテゴリ名": ["質問1", "質問2"],
    "カテゴリ名2": ["質問1", "質問2"]
  }
  
  Do NOT use markdown formatting (no \`\`\`json blocks). Return just the JSON string.`;
        } else {
            prompt = `Generate engaging, open-ended English conversation questions for Korean learners studying English.
  Categories: ${categoryTitles}.
  For EACH category, generate 50 high-quality questions suitable for intermediate learners.
  
  IMPORTANT: 
  - The questions should be designed for Koreans practicing English conversation.
  - Topics should be known interesting topics for Koreans (e.g. K-pop, Korean Work culture, Travel, etc) or general global topics that are easy to discuss.
  - Questions should be clear, natural, and encourage extended answers.
  
  Return ONLY a raw JSON object where:
  - Keys are the EXACT category titles provided (e.g., "${categories[0].title}", "${categories[1].title}").
  - Values are arrays of strings (the questions).
  
  Example JSON structure:
  {
    "Category Name 1": ["Question 1", "Question 2"],
    "Category Name 2": ["Question 1", "Question 2"]
  }
  
  Do NOT use markdown formatting (no \`\`\`json blocks). Return just the JSON string.`;
        }

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
            return 0;
        }

        if (!allQuestionsData) {
            console.error("No data received from API.");
            return 0;
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

        fs.writeFileSync(filePath, JSON.stringify(topicsData, null, 2));
        console.log(`Topics updated successfully for ${lang}! Total questions: ${totalQuestionsAdded}`);
        return totalQuestionsAdded;

    } catch (error) {
        console.error(`Error updating topics for ${lang}:`, error);
        return 0;
    }
}

async function main() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set');
        process.exit(1);
    }

    const targetLang = process.argv[2];

    if (!targetLang || targetLang === 'en') {
        await generateForLanguage('en', 'topics.en.json');
    }

    if (!targetLang || targetLang === 'ja') {
        await generateForLanguage('ja', 'topics.ja.json');
    }
}

main();
