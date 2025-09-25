import { useEffect, useState } from "react";
import { roomRealtimeService } from "../../../services/roomRealtimeService";
import { useSignalR } from "../../../hooks/useSignalR";
import type { BasicUserRoomModel } from "../../types/BasicUserRoomModel";
import ProfilePic from "../../avatar/ProfilePic";
import { HiUserAdd } from "react-icons/hi";
import Icon from "../../icon/Icon";

interface RoomUsersTabProps {
  roomId: string;
}

export default function RoomUsersTab({ roomId }: RoomUsersTabProps) {
  const { connection } = useSignalR();
  const [users, setUsers] = useState<BasicUserRoomModel[]>([]);

  useEffect(() => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    const fetchUsers = async () => {
      const basicUsers = await service.getUsersFromRoom(roomId);

      setUsers((prev) => [...basicUsers, ...prev]);
    };

    fetchUsers();
  }, [roomId, connection]);

  return (
    <div>
      <ul>
        {users.map((user, index) => (
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
