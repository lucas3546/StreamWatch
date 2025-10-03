import ProfilePic from "../avatar/ProfilePic";
import Icon from "../icon/Icon";
import { HiUserAdd } from "react-icons/hi";
import { BiSolidUserX } from "react-icons/bi";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  acceptFriendshipRequest,
  declineFriendshipRequest,
  sendFriendshipRequest,
} from "../../services/friendshipService";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

interface UserFriendItemProps {
  userId: string;
  userName: string;
  profilePic?: string;
  status: string;
  requestedByAccountId?: string;
  friendsSince?: string;
  friendsRequest?: string;
  onFriendAction: (userId: string, newStatus: string) => void;
}

export default function UserFriendItem({
  userId,
  userName,
  profilePic,
  status,
  requestedByAccountId,
  friendsSince,
  friendsRequest,
  onFriendAction,
}: UserFriendItemProps) {
  const { user } = useUser();

  console.log(status);

  const sendFriendRequest = async () => {
    await sendFriendshipRequest(userName);
  };

  const acceptFriendRequest = async () => {
    await acceptFriendshipRequest(userName);
    onFriendAction(userId, "Accepted");
  };

  const declineFriendRequest = async () => {
    await declineFriendshipRequest(userName);
    onFriendAction(userId, "Declined");
  };

  return (
    <li
      key={userId}
      className="flex items-center justify-between gap-2 p-2 rounded-sm border border-defaultbordercolor w-full md:w-[50%]"
    >
      <div className="flex items-center gap-2">
        <ProfilePic userName={userName} fileUrl={profilePic} />
        <span>{userName}</span>
      </div>

      {status === "Accepted" && <span className="text-green-600">Friends</span>}

      {status === "Pending" && requestedByAccountId === user?.nameid && (
        <span className="text-yellow-600">Solicitud enviada</span>
      )}

      {status === "Pending" && requestedByAccountId !== user?.nameid && (
        <div className="ml-auto flex gap-1">
          <button
            onClick={acceptFriendRequest}
            className="border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer"
          >
            <Icon icon={BiSolidUserCheck} />
          </button>
          <button
            onClick={declineFriendRequest}
            className="border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer"
          >
            <Icon icon={BiSolidUserX} />
          </button>
        </div>
      )}

      {!status && (
        <button
          onClick={sendFriendRequest}
          className="ml-auto border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer"
        >
          <Icon icon={HiUserAdd} />
        </button>
      )}
    </li>
  );
}
