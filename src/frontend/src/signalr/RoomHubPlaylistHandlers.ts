import type { HubConnection } from "@microsoft/signalr";
import type { User } from "../contexts/UserContext";
import { useRoomStore } from "../stores/roomStore";
import type { PlaylistVideoItemModel } from "../components/types/PlaylistVideoItemModel";

export class RoomHubPlaylistHandlers {
  private connection: HubConnection;
  private currentUser: User | null;
  private store = useRoomStore.getState();
  constructor(connection: HubConnection, user: User) {
    this.connection = connection;
    this.currentUser = user;
  }

  private onReceiveNewVideoToPlaylist = (
    playlistItem: PlaylistVideoItemModel,
  ) => {
    console.log("Received new playlist item:", playlistItem);
    this.store.addPlaylistItem(playlistItem);
  };

  public registerAll() {
    this.connection.on("NewPlaylistVideo", this.onReceiveNewVideoToPlaylist);
  }

  public unregisterAll() {
    this.connection.off("NewPlaylistVideo", this.onReceiveNewVideoToPlaylist);
  }
}
