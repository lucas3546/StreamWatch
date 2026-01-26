import ProfilePic from "../../avatar/ProfilePic";
import type { BasicUserRoomModel } from "../../types/BasicUserRoomModel";
import { useUser } from "../../../contexts/UserContext";
import { HiUserAdd } from "react-icons/hi";

import Icon from "../../icon/Icon";
import { useState } from "react";
import { sendFriendshipRequest } from "../../../services/friendshipService";
import type { ProblemDetails } from "../../types/ProblemDetails";
import { useRoomStore } from "../../../stores/roomStore";
import { useNavigate } from "react-router";

interface RoomUsertabItemProps {
  userRoom: BasicUserRoomModel;
}

export default function RoomUsertabItem({ userRoom }: RoomUsertabItemProps) {
  const { user } = useUser();
  const room = useRoomStore((state) => state.room);
  const navigate = useNavigate();
  const [result, setResult] = useState<string | undefined>();

  const sendFriendRequest = async () => {
    try {
      await sendFriendshipRequest(userRoom.userId);
      setResult("Sended!");
    } catch (error) {
      const problemdetails = error as ProblemDetails;
      if (problemdetails.detail === undefined) return;

      let status = problemdetails.detail.includes("Status:")
        ? problemdetails.detail.split("Status:")[1].trim()
        : undefined;

      if (status === "Accepted") {
        status = "Already friends";
      }

      setResult(status);
    }
  };

  return (
    <li className="flex flex-row p-2 text-xl gap-3 bg-neutral-800 items-center">
      <div className="relative inline-block">
        {userRoom.userId === room?.leaderAccountId && (
          <div>
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30 animate-pulse"></div>
            <div className="absolute -inset-1 border border-yellow-300 rounded-full"></div>
          </div>
        )}
        <div className="relative">
          <ProfilePic
            userName={userRoom.userName}
            fileUrl={userRoom.profilePic}
          />
        </div>
      </div>
      <p title={userRoom.userName} className="truncate cursor-pointer" onClick={() => navigate(`/profile/${userRoom.userId}`)}>
        {userRoom.userName}
      </p>

      {userRoom.userId === user?.nameid ? (
        <p className="ml-auto text-xs mr-2">You</p>
      ) : (
        <>
          {result === undefined ? (
            <button
              onClick={sendFriendRequest}
              className="ml-auto border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer"
            >
              <Icon icon={HiUserAdd}></Icon>
            </button>
          ) : (
            <p className="ml-auto text-right text-xs">{result}</p>
          )}
        </>
      )}
    </li>
  );
}
