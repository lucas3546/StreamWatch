import type { HubConnection } from "@microsoft/signalr";
import type { RoomState } from "../components/types/RoomState";
import type { RoomChatMessage } from "../components/sidebar/Room/RoomChat";
import type { BasicUserRoomModel } from "../components/types/BasicUserRoomModel";

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

  /*
  const onVideoSourceChanged = (handler: (src: string) => void) => {
    connection.on("VideoSourceChanged", handler);
  };

  const onVideoAddedToPlaylist = (handler: (src: string) => void) => {
    connection.on("VideoAddedToPlaylist", handler);
  };

  */

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
    /*
    onVideoSourceChanged,
    onVideoAddedToPlaylist,
    */
    onReconnected,
    onReconnecting,
    onReceiveMessage,
  };
};
