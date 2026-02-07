const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testImageAnalysis() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    const imagePath = path.join(process.cwd(), 'news.png');
    if (!fs.existsSync(imagePath)) {
        console.error("Error: news.png not found at", imagePath);
        process.exit(1);
    }

    console.log("Reading news.png...");
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString("base64");

    console.log("Initializing Gemini...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Analyze this image. Identify the main context, objects, or scenario. 
    Then, generate 20 engaging, open-ended English conversation questions related to this image. 
    Suitable for intermediate to advanced learners.
    
    Return ONLY a raw JSON array of strings. 
    Example: ["Question 1?", "Question 2?"]
    Do not include markdown formatting like \`\`\`json.`;

    console.log("Sending request to Gemini...");
    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/png",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("\n--- Raw Response ---\n");
        console.log(text);

        const questions = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
        console.log("\n--- Parsed Questions ---\n");
        console.log(questions);

    } catch (error) {
        console.error("Error during generation:", error);
    }
}

testImageAnalysis();
