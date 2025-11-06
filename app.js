// app.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json({ limit: "5mb" }));

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt field in request body" });
    }

    if (!process.env.HUGGINGFACE_TOKEN) {
      console.error("Missing HUGGINGFACE_TOKEN");
      return res.status(500).json({ error: "Server misconfigured: missing API token" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("HF API error:", text);
      return res.status(response.status).json({ error: "Hugging Face error", details: text });
    }

    const result = await response.json();
    res.json(result);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

export default app;
