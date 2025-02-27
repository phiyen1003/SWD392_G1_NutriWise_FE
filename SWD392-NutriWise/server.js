import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ Lỗi OpenAI:", error);
    res.status(500).json({ error: "Lỗi xử lý OpenAI" });
  }
});
console.log("🔑 API KEY:", process.env.OPENAI_API_KEY);

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
