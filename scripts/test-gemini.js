const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but usually we can try to hit the endpoint or just try a simple generation.
        // Actually, the SDK doesn't always expose listModels directly in the simplified client.
        // Let's rely on the error message suggesting "Call ListModels".
        // We can try to use the modelManager if available or just raw fetch.

        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("gemini-pro success:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        const result2 = await model2.generateContent("Hello");
        console.log("gemini-1.5-flash success:", result2.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }
}

listModels();
