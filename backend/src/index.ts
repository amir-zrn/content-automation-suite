import "dotenv/config";
import express from "express";
import { DraftJobSchema } from "./schemas.js";
import { createDraft } from "./postqued.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "content-automation-backend" });
});

app.post("/draft", async (req, res) => {
  const parsed = DraftJobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() });

  try {
    const result = await createDraft(parsed.data);
    res.json({ ok: true, result });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || "draft_failed" });
  }
});

const port = Number(process.env.PORT || 4311);
app.listen(port, () => console.log(`backend running on :${port}`));
