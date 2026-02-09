import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
            return Response.json({ error: "No image file provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return Response.json({ error: "Gemini API key not found" }, { status: 500 });
        }

        const lang = formData.get("lang") || "en";

        // ... (API Key check)

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        let prompt;
        if (lang === 'ja') {
            prompt = `Analyze this image. 
        1. Identify the main context, objects, or scenario.
        2. Look for any visible Japanese text or cultural elements in the image.
        3. If no text is visible, infer relevant Japanese topics that fit the situation.

        Then, generate 20 engaging, open-ended Japanese conversation questions suitable for Korean learners of Japanese.
        - Questions should be natural and encourage extended answers.
        - The output MUST be in Japanese language.
    
        Return ONLY a raw JSON array of strings. 
        Example: ["質問1?", "質問2?"]
        Do not include markdown formatting like \`\`\`json.`;
        } else {
            prompt = `Analyze this image. 
        1. Identify the main context, objects, or scenario.
        2. Look for any visible English text, phrases, or idiomatic expressions in the image.
        3. If no text is visible, infer relevant English topics or patterns that fit the situation.

        Then, generate 20 engaging, open-ended English conversation questions suitable for Korean learners of English.
        - Questions should be suitable for intermediate to advanced learners.
    
        Return ONLY a raw JSON array of strings. 
        Example: ["Question 1?", "Question 2?"]
        Do not include markdown formatting like \`\`\`json.`;
        }

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type || "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let questions = [];
        try {
            questions = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse JSON:", text);
            return Response.json({ error: "Failed to parse API response", raw: text }, { status: 500 });
        }

        return Response.json({ questions });
    } catch (error) {
        console.error("Error analyzing image:", error);
        return Response.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
