import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const notificationActorSchema = z.object({
  id: z.number(),
  str: z.string(),
  type: z.enum(["user", "game", "company", "other"]), // Adjust based on actual backend types if known
});

export type NotificationActor = z.infer<typeof notificationActorSchema>;
