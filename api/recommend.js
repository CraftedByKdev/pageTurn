export default async function handler(req, res) {
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
              parts: [{ text: `Suggest 10 books for: ${prompt}. Return JSON array with title, author, desc.` }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Extract JSON safely
    const jsonMatch = text.match(/\[.*\]/s);
    const books = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.status(200).json(books);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
}
