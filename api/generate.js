export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImage?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: "Realistic food photograph. " + prompt
          }
        })
      }
    );

    const json = await response.json();

    if (!json.images || !json.images[0] || !json.images[0].data) {
      return res.status(500).json({ error: "No image returned", raw: json });
    }

    res.status(200).json({ base64: json.images[0].data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
