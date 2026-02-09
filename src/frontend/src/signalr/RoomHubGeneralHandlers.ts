import type { HubConnection } from "@microsoft/signalr";
import { type User } from "../contexts/UserContext";
import { useRoomStore } from "../stores/roomStore";
import type { RoomUpdatedModel } from "../components/types/RoomUpdatedModel";

export class RoomHubGeneralHandlers {
  private connection: HubConnection;
  private currentUser: User | null;
  private store = useRoomStore.getState();
  constructor(connection: HubConnection, user: User) {
    this.connection = connection;
    this.currentUser = user;
  }

  private onRoomUpdated = (model: RoomUpdatedModel) => {
    console.log("Received new room basic data update:", model);

    const { room } = useRoomStore.getState();
    if (!room) return;

    useRoomStore.setState({
      room: {
        ...room,
        title: model.title ?? room.title,
        category: model.category ?? room.category,
        isPublic: model.isPublic ?? room.isPublic,
      },
    });
  };
  

  private onNewLeader = (userId: string) => {
    const { room } = useRoomStore.getState();
    const { setLiveButton } = useRoomStore.getState();
    console.log("New leader received", userId);
    console.log(room);
    if (!room) return;


    if (this.currentUser?.nameid === userId) {
      useRoomStore.setState({
        isLeader: true,
      });
    } else {
      useRoomStore.setState({
        isLeader: false,
      });

      setLiveButton("live")
    }
  };

  public registerAll() {
    this.connection.on("RoomUpdated", this.onRoomUpdated);
    this.connection.on("NewLeader", this.onNewLeader);
  }

  public unregisterAll() {
    this.connection.off("RoomUpdated", this.onRoomUpdated);
  }
}
