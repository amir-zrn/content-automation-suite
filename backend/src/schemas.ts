import { z } from "zod";

export const AccountSchema = z.object({
  account: z.string(),
  platform: z.enum(["tiktok", "instagram", "youtube", "pinterest"]),
  type: z.string(),
  status: z.enum(["active", "paused"]),
  timezone: z.string().default("Asia/Tehran"),
  postquedAccountId: z.string().optional()
});

export const DraftJobSchema = z.object({
  postId: z.string(),
  platform: z.enum(["tiktok", "instagram", "youtube", "pinterest"]),
  account: z.string(),
  caption: z.string().default(""),
  mediaUrls: z.array(z.string().url()).min(1),
  scheduledAt: z.string().optional(),
  meta: z.record(z.any()).optional()
});

export type DraftJob = z.infer<typeof DraftJobSchema>;
