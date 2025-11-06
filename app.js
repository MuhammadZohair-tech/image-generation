import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// === Image generation endpoint ===
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    if (!process.env.HUGGINGFACE_TOKEN)
      return res.status(500).json({ error: "Missing HUGGINGFACE_TOKEN" });

    const hfUrl = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4";
    const response = await fetch(hfUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Hugging Face API error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    res.json(data);
  } catch (err) {
    console.error("Internal error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

export default app;
