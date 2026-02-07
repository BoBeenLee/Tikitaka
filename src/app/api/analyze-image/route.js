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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        const prompt = `Analyze this image. Identify the main context, objects, or scenario. 
    Then, generate 20 engaging, open-ended English conversation questions related to this image. 
    Suitable for intermediate to advanced learners.
    
    Return ONLY a raw JSON array of strings. 
    Example: ["Question 1?", "Question 2?"]
    Do not include markdown formatting like \`\`\`json.`;

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
