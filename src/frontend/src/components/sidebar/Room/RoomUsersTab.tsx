import ProfilePic from "../../avatar/ProfilePic";
import { HiUserAdd } from "react-icons/hi";
import Icon from "../../icon/Icon";
import { useRoomStore } from "../../../stores/roomStore";
import { useUser } from "../../../contexts/UserContext";

export default function RoomUsersTab() {
  const { user } = useUser();
  const roomUsers = useRoomStore((state) => state.roomUsers);
  const nameid = user?.nameid;

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
              fileUrl={user.profilePic}
            ></ProfilePic>
            <p>{user.userName}</p>
            {user.userId === nameid ? (
              <></>
            ) : (
              <button className="ml-auto border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
                <Icon icon={HiUserAdd}></Icon>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
