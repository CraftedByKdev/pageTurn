const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Get your key from: https://aistudio.google.com/
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
    // ✅ Allow only POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return res.status(500).json({ error: "Server misconfiguration" });
        }

        // 🔥 Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Recommend exactly 10 popular non-academic books for: ${prompt}.
Return ONLY a raw JSON array with keys:
"title", "author", "desc", "rating", "reviews".
No extra text.`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        response_mime_type: "application/json"
                    }
                })
            }
        );

        const data = await response.json();

        // 🧠 Extract Gemini response
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error("Empty Gemini response:", data);
            return res.status(200).json([]);
        }

        // 🧹 Clean markdown if present
        rawText = rawText.replace(/```json|```/gi, "").trim();

        let books = [];

        // 🛡️ Safe JSON parsing
        try {
            books = JSON.parse(rawText);
        } catch (err) {
            console.error("JSON Parse Failed:", rawText);
            return res.status(200).json([]);
        }

        // ✅ Ensure array output
        if (!Array.isArray(books)) {
            return res.status(200).json([]);
        }

        // 🎯 Final response
        return res.status(200).json(books);

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
