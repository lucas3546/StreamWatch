import { useEffect } from "react";
import { roomRealtimeService } from "../../../services/roomRealtimeService";
import { useSignalR } from "../../../hooks/useSignalR";
import ProfilePic from "../../avatar/ProfilePic";
import { HiUserAdd } from "react-icons/hi";
import Icon from "../../icon/Icon";
import { useRoomStore } from "../../../stores/roomStore";

export default function RoomUsersTab() {
  const { connection } = useSignalR();
  const room = useRoomStore((state) => state.room);
  const roomUsers = useRoomStore((state) => state.roomUsers);
  const setRoomUsers = useRoomStore((state) => state.setRoomUsers);

  useEffect(() => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    const fetchUsers = async () => {
      const basicUsers = await service.getUsersFromRoom(room?.id ?? "");

      setRoomUsers(basicUsers);
    };

    fetchUsers();
  }, [room?.id, connection]);

  return (
    <div>
      <ul>
        {roomUsers.map((user, index) => (
          <li
            key={index}
            className="flex flex-row p-2 text-xl gap-3 bg-neutral-800 items-center"
          >
            <ProfilePic
              userName={user.userName}
              fileName={user.profilePic}
            ></ProfilePic>
            <p>{user.userName}</p>
            <button className="ml-auto border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
              <Icon icon={HiUserAdd}></Icon>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
