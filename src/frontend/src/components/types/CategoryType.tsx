export const categories = [
  "Movies",
  "Series",
  "Music",
  "Anime",
  "Sports",
  "Nsfw",
] as const;

export type Category = (typeof categories)[number];
