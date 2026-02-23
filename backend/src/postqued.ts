import axios from "axios";
import { DraftJob } from "./schemas.js";

const baseURL = process.env.POSTQUED_BASE_URL || "https://api.postqued.com/v1";
const apiKey = process.env.POSTQUED_API_KEY || "";
const dryRun = (process.env.DRY_RUN || "true") === "true";

const client = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  timeout: 20000
});

export async function createDraft(job: DraftJob) {
  if (dryRun) {
    return { ok: true, dryRun: true, job };
  }

  // TODO: Confirm exact PostQued endpoint/body once credentials + account config are available.
  const payload = {
    platform: job.platform,
    account: job.account,
    caption: job.caption,
    media_urls: job.mediaUrls,
    scheduled_at: job.scheduledAt,
    metadata: job.meta || {}
  };

  const { data } = await client.post("/drafts", payload);
  return data;
}
