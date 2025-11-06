// app.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json({ limit: "4mb" }));

// ====== Your HuggingFace /generate logic ======
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await fetch("https://api-inference.huggingface.co/models/your-model", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });
    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default app;
