export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/imagen-3.0:generateImage?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          image: { size: "1024x1024" }
        })
      }
    );

    const data = await response.json();

    const base64 = data?.images?.[0]?.data;

    if (!base64) {
      return res.status(500).json({
        error: "No image returned",
        raw: data
      });
    }

    res.status(200).json({ base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
