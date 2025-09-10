import type { HubConnection } from "@microsoft/signalr";
import type { RoomState } from "../components/types/RoomState";

export const roomRealtimeService = (connection: HubConnection) => {
  const connectToRoom = async (roomId: string): Promise<RoomState> => {
    return await connection.invoke<RoomState>("ConnectToRoom", roomId);
  };

  /*
  const onVideoSourceChanged = (handler: (src: string) => void) => {
    connection.on("VideoSourceChanged", handler);
  };

  const onVideoAddedToPlaylist = (handler: (src: string) => void) => {
    connection.on("VideoAddedToPlaylist", handler);
  };

  */
  const onReconnected = (handler: (id?: string) => void) => {
    connection.onreconnected(handler);
  };

  const onReconnecting = (handler: (err?: Error) => void) => {
    connection.onreconnecting(handler);
  };

  return {
    connectToRoom,
    /*
    onVideoSourceChanged,
    onVideoAddedToPlaylist,
    */
    onReconnected,
    onReconnecting,
  };
};
