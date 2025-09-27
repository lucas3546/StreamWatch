import type { HubConnection } from "@microsoft/signalr";
import type { RoomState } from "../components/types/RoomState";
import type { RoomChatMessage } from "../components/sidebar/Room/RoomChat";
import type { BasicUserRoomModel } from "../components/types/BasicUserRoomModel";
import type { PlaylistVideoItemModel } from "../components/types/PlaylistVideoItemModel";

export interface AddVideoToPlaylistType {
  roomId: string;
  videoUrl: string | null;
  mediaId: string | null;
  provider: "YouTube" | "S3" | string;
}

export interface ChangeVideoFromPlaylistItemType {
  roomId: string;
  playlistItemId: string;
}

export const roomRealtimeService = (connection: HubConnection) => {
  const connectToRoom = async (roomId: string): Promise<RoomState> => {
    return await connection.invoke<RoomState>("ConnectToRoom", roomId);
  };

  const getUsersFromRoom = async (
    roomId: string,
  ): Promise<BasicUserRoomModel[]> => {
    return await connection.invoke<BasicUserRoomModel[]>(
      "GetUsersFromRoom",
      roomId,
    );
  };

  const addVideoToPlaylist = async (
    data: AddVideoToPlaylistType,
  ): Promise<void> => {
    return await connection.invoke("AddVideoToPlaylist", data);
  };

  const changeVideoFromPlaylist = async (
    data: ChangeVideoFromPlaylistItemType,
  ): Promise<void> => {
    return await connection.invoke("ChangeVideoRoomFromPlaylistItem", data);
  };

  /*
  const onVideoSourceChanged = (handler: (src: string) => void) => {
    connection.on("VideoSourceChanged", handler);
  };

  const onVideoAddedToPlaylist = (handler: (src: string) => void) => {
    connection.on("VideoAddedToPlaylist", handler);
  };

  */

  const onReceiveNewVideoToPlaylist = (
    handler: (src: PlaylistVideoItemModel) => void,
  ) => {
    connection.on("NewPlaylistVideo", handler);
  };

  const onReceiveMessage = (handler: (src: RoomChatMessage) => void) => {
    connection.on("ReceiveMessage", handler);
  };

  const onReconnected = (handler: (id?: string) => void) => {
    connection.onreconnected(handler);
  };

  const onReconnecting = (handler: (err?: Error) => void) => {
    connection.onreconnecting(handler);
  };

  return {
    connectToRoom,
    getUsersFromRoom,
    addVideoToPlaylist,
    onReceiveNewVideoToPlaylist,
    changeVideoFromPlaylist,
    /*
    onVideoSourceChanged,
    onVideoAddedToPlaylist,
    */
    onReconnected,
    onReconnecting,
    onReceiveMessage,
  };
};
