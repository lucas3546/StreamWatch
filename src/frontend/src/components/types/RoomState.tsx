import type { PlaylistVideoItemModel } from "./PlaylistVideoItemModel";

export interface RoomState {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  isPublic: boolean;
  videoProvider: string;
  leaderAccountId: string;
  isPaused: boolean;
  lastLeaderUpdateTime: number;
  currentVideoTime: number;
  playlistVideoItems: PlaylistVideoItemModel[];
  createdAt: string;
  usersCount: number;
}
