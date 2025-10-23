import { useRoomStore } from "../../../stores/roomStore";
import RoomUsertabItem from "./RoomUserTabItem";

export default function RoomUsersTab() {
  const roomUsers = useRoomStore((state) => state.roomUsers);

  return (
    <div key={Date.now()}>
      <ul>
        {roomUsers.map((user, index) => (
          <RoomUsertabItem key={index} userRoom={user}></RoomUsertabItem>
        ))}
      </ul>
    </div>
  );
}
