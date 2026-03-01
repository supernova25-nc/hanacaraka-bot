import express from "express";
import fetch from "node-fetch";
import { createCanvas, loadImage } from "canvas";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

app.post("/", async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text;

  if (text.startsWith("/")) {
    return res.sendStatus(200);
  }

  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("./template.png");
  ctx.drawImage(bg, 0, 0, 1080, 1080);

  ctx.fillStyle = "#3e2a1c";
  ctx.font = "80px serif";
  ctx.textAlign = "center";

  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, 540, 500 + i * 100);
  });

  const buffer = canvas.toBuffer("image/png");

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", buffer, "soal.png");

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: formData
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Bot running...");
});
