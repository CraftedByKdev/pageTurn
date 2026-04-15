const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Get your key from: https://aistudio.google.com/
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/recommend", async (req, res) => {
    try {
        const { prompt } = req.body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
      
         
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Recommend exactly 10 popular non-academic books for: ${prompt}. 
Return ONLY a raw JSON array of objects with these keys: 
"title", "author", "desc", "rating" (decimal 4.0-5.0), "reviews" (number between 500-5000). 
No extra text.`}]
                }],
                generationConfig: {
                    temperature: 0.7,
                    response_mime_type: "application/json" // Forces Gemini to speak JSON
                }
            })
        });

        const data = await response.json();
        
        // 1. Extract the text from Gemini's deep structure
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.log("Gemini returned empty or blocked content:", data);
            return res.json([]); // Return empty instead of hardcoded books
        }

        // 2. CLEANER: Remove markdown if it exists
        const cleanJson = rawText.replace(/```json|```/gi, "").trim();

        // 3. Parse and Send
        const books = JSON.parse(cleanJson);
        
        // Return the array (handling nested {books: []} just in case)
        res.json(Array.isArray(books) ? books : (books.books || []));

    } catch (err) {
        console.error("PARSE ERROR OR SERVER ERROR:", err);
        // REMOVE YOUR FALLBACK LIST HERE so you can see if it's truly working
        res.status(500).json({ error: "Failed to parse AI response" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));