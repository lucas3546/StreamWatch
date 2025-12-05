import z from "zod";
import { categories } from "../types/CategoryType";

export const updateRoomSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(40),
  category: z.enum(categories),
  isPublic: z.boolean(),
});

export type UpdateRoomRequest = z.infer<typeof updateRoomSchema>;
