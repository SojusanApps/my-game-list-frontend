import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();
export const slugSchema = z.string().min(1);
