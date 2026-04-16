export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Give 5 book recommendations for: ${prompt}.
Return ONLY JSON like this:
[
 { "title": "...", "author": "...", "desc": "..." }
]`
                }
              ]
            }
          ]
        })
      }
    );

    // 🔥 Check if API failed
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(500).json({ error: "Gemini API failed" });
    }

    const data = await response.json();

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW GEMINI:", rawText);

    // 🔥 Extract JSON safely
    const jsonMatch = rawText.match(/\[.*\]/s);
    const books = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return res.status(200).json(books);

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
