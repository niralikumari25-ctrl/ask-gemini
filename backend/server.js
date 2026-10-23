import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing in .env file");
}

const ai = new GoogleGenAI({ apiKey });

// Parse JSON requests
app.use(express.json({ limit: "10kb" }));

// Serve frontend files
const frontendPath = path.resolve(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Gemini API route
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body ?? {};

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a valid question."
      });
    }

    if (question.length > 5000) {
      return res.status(400).json({
        error: "Question must be 5000 characters or fewer."
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: question.trim()
    });

    const answer = result.text;

    if (!answer) {
      return res.status(502).json({
        error: "Gemini returned no text answer."
      });
    }

    return res.json({ answer });

  
  } catch (error) {
    console.error("Gemini API error name:", error?.name);
    console.error("Gemini API error message:", error?.message);
    console.error("Gemini API error status:", error?.status);
    console.error("Full error:", error);

    return res.status(500).json({
      error: error?.message || "Unable to generate an answer."
    });
  }

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
