import "dotenv/config";
import { createDraft } from "../src/postqued.js";

const sample = {
  postId: "P-001",
  platform: "tiktok" as const,
  account: "@sample",
  caption: "Sample draft",
  mediaUrls: ["https://example.com/slide1.jpg"]
};

const run = async () => {
  const r = await createDraft(sample);
  console.log(JSON.stringify(r, null, 2));
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
