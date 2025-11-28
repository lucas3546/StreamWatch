import type { HubConnection } from "@microsoft/signalr";
import type { BasicUserRoomModel } from "../components/types/BasicUserRoomModel";
import { useRoomStore } from "../stores/roomStore";

export class RoomHubUsersHandlers {
  private connection: HubConnection;
  private store = useRoomStore.getState();
  constructor(connection: HubConnection) {
    this.connection = connection;
  }

  private onNewUserJoined = (user: BasicUserRoomModel) => {
    console.log("User joined:", user);
    this.store.addUserRoom(user);
  };

  private onUserLeftRoom = (userId: string) => {
    console.log("User left room:", userId);
    this.store.removeUserRoom(userId);
  };

  public registerAll() {
    this.connection.on("NewUserJoined", this.onNewUserJoined);
    this.connection.on("UserLeftRoom", this.onUserLeftRoom);
  }

  public unregisterAll() {
    this.connection.off("NewUserJoined", this.onNewUserJoined);
    this.connection.off("UserLeftRoom", this.onUserLeftRoom);
  }
}
