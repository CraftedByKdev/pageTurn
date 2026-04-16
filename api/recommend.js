export default async function handler(req, res) {

  console.log("API KEY:", process.env.GEMINI_API_KEY); // 👈 ADD HERE

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
Return ONLY a raw JSON array like:
[
 { "title": "...", "author": "...", "desc": "...", "rating": 4.5, "reviews": 1200 }
]
NO explanation. NO markdown.`
                 
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = rawText.match(/\[.*\]/s);
    const books = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return res.status(200).json(books);

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
