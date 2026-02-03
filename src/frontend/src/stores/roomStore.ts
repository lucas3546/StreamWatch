import { create } from "zustand";
import type { BasicUserRoomModel } from "../components/types/BasicUserRoomModel";
import type { PlaylistVideoItemModel } from "../components/types/PlaylistVideoItemModel";
import type { RoomState } from "../components/types/RoomState";
import type { LiveStatusType } from "../components/types/LiveStatusType";
import type { RoomChatMessageType } from "../components/types/RoomMessageType";

interface RoomStore {
  playerKey : string;
  room: RoomState | null;
  playlistItems: PlaylistVideoItemModel[];
  chatMessages: RoomChatMessageType[];
  roomUsers: BasicUserRoomModel[];
  isLeader: boolean;
  liveButtonAlive: LiveStatusType;

  //setters
  setRoom: (room: RoomState) => void;
  addPlaylistItem: (item: PlaylistVideoItemModel) => void;
  addChatMessage: (msg: RoomChatMessageType) => void;
  addUserRoom: (user: BasicUserRoomModel) => void;
  setRoomUsers: (users: BasicUserRoomModel[]) => void;
  removeUserRoom: (userId: string) => void;
  setIsLeader: (isleader: boolean) => void;
  setLiveButton: (type: LiveStatusType) => void;
  setPlayerKey: (key : string) => void;
  reset: () => void;
}

const initialState = {
  playerKey: "",
  room: null,
  playlistItems: [],
  chatMessages: [],
  roomUsers: [],
  isLeader: false,
  liveButtonAlive: "offline" as LiveStatusType,
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

  setLiveButton: (livebutton) => set({ liveButtonAlive: livebutton }),

  setPlayerKey: (key) => set({ playerKey: key }),

  reset: () => set(initialState),
}));
