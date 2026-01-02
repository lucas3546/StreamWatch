import { z } from "zod";
const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\s]*)$/;

export const createRoomSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    category: z.enum([
      "Movies",
      "Series",
      "Music",
      "Anime",
      "Videos",
      "Sports",
    ]),

    provider: z.enum(["youtube", "local"]),

    videoUrl: z.string().or(z.null()),

    media: z.string().or(z.null()),
  })
  .superRefine((data, ctx) => {
    const { provider, videoUrl, media } = data;

    if (provider === "youtube") {
      if (!videoUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["videoUrl"],
          message: "A YouTube link is required.",
        });
      } else {
        if (!YOUTUBE_REGEX.test(videoUrl)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["videoUrl"],
            message: "Invalid YouTube URL.",
          });
        }
      }

      if (media) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mediaId"],
          message: "Local media must be empty when using YouTube.",
        });
      }
    }

    // --- LOCAL ---
    if (provider === "local") {
      if (!media) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mediaId"],
          message: "You must select local media.",
        });
      }

      if (videoUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["videoUrl"],
          message: "YouTube link must be empty when using local media.",
        });
      }
    }
  });

export type CreateRoomRequest = z.infer<typeof createRoomSchema>;
