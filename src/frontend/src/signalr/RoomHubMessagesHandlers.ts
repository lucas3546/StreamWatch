import type { HubConnection } from "@microsoft/signalr";
import { useRoomStore } from "../stores/roomStore";
import type { RoomChatMessage } from "../components/sidebar/Room/RoomChat";
import { type User } from "../contexts/UserContext";

export class RoomHubChatHandlers {
  private connection: HubConnection;
  private currentUser: User | null;
  private store = useRoomStore.getState();
  constructor(connection: HubConnection, user: User) {
    this.connection = connection;
    this.currentUser = user;
  }

  private onReceiveMessage = (chatMessage: RoomChatMessage) => {
    console.log("Received chat message:", chatMessage);
    if (this.currentUser?.name === chatMessage.userName) {
      chatMessage.fromMe = true;
    }
    this.store.addChatMessage(chatMessage);
  };

  public registerAll() {
    this.connection.on("ReceiveMessage", this.onReceiveMessage);
  }

  public unregisterAll() {
    this.connection.off("ReceiveMessage", this.onReceiveMessage);
  }
}
