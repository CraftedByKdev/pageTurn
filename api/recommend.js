export default async function handler(req, res) {
  // Allow CORS (important for mobile app)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
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
Return ONLY a raw JSON array of objects with:
"title", "author", "desc", "rating", "reviews".`
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

    let rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.json([]);
    }

    const cleanJson = rawText.replace(/```json|```/gi, "").trim();

    const books = JSON.parse(cleanJson);

    return res.status(200).json(
      Array.isArray(books) ? books : books.books || []
    );

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch AI data" });
  }
}
