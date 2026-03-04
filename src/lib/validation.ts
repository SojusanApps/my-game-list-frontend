import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const notificationEntitySchema = z.object({
  id: z.number(),
  str: z.string(),
  type: z.enum(["user", "game", "company", "other"]), // Adjust based on actual backend types if known
  gravatar_url: z.url().nullable().optional(),
});

export type NotificationEntity = z.infer<typeof notificationEntitySchema>;
