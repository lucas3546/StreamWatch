import { create } from "zustand";
import type { RoomChatMessage } from "../components/sidebar/Room/RoomChat";
import type { BasicUserRoomModel } from "../components/types/BasicUserRoomModel";
import type { PlaylistVideoItemModel } from "../components/types/PlaylistVideoItemModel";
import type { RoomState } from "../components/types/RoomState";

interface RoomStore {
  room: RoomState | null;
  playlistItems: PlaylistVideoItemModel[];
  chatMessages: RoomChatMessage[];
  roomUsers: BasicUserRoomModel[];
  isLeader: boolean;

  //setters
  setRoom: (room: RoomState) => void;
  addPlaylistItem: (item: PlaylistVideoItemModel) => void;
  addChatMessage: (msg: RoomChatMessage) => void;
  addUserRoom: (user: BasicUserRoomModel) => void;
  setRoomUsers: (users: BasicUserRoomModel[]) => void;
  removeUserRoom: (userId: string) => void;
  setIsLeader: (isleader: boolean) => void;
  reset: () => void;
}

const initialState = {
  room: null,
  playlistItems: [],
  chatMessages: [],
  roomUsers: [],
  isLeader: false,
};

export const useRoomStore = create<RoomStore>((set) => ({
  ...initialState,

  setRoom: (room) =>
    set({
      room,
      playlistItems: room.playlistVideoItems ?? [],
    }),

  addPlaylistItem: (item) =>
    set((state) => ({
      playlistItems: [...state.playlistItems, item],
    })),

  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, msg],
    })),

  setRoomUsers: (users) => set({ roomUsers: users }),

  addUserRoom: (user) =>
    set((state) => ({
      roomUsers: [...state.roomUsers, user],
    })),

  removeUserRoom: (userId: string) =>
    set((state) => ({
      roomUsers: state.roomUsers.filter((u) => u.userId !== userId),
    })),

  setIsLeader: (isleader) => set({ isLeader: isleader }),

  reset: () => set(initialState),
}));
