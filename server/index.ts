import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const WEBHOOK_URL = "https://webhook.site/5f9836e0-1184-48c5-9631-a46a40580b67";

app.post("/api/save-segment", async (req: Request, res: Response) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text()
    res.status(200).json({ ok: true, response: text });
  } catch (err) {
    console.error("Error forwarding to webhook:", err);
    res.status(500).json({ ok: false, error: "Failed to forward request" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`);
});

