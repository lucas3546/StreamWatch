import z from "zod";

export const sendRoomMessageSchema = z.object({
  roomId: z.string(),
  message: z
    .string()
    .min(1, "The message must be between 1 and 200 characters long.")
    .max(200),
  replyToMessageId: z.guid().nullable().default(null),
});

export type SendMessageRequest = z.infer<typeof sendRoomMessageSchema>;
