import ProfilePic from "../avatar/ProfilePic";
import Icon from "../icon/Icon";
import { HiUserAdd } from "react-icons/hi";
import { BiSolidUserX } from "react-icons/bi";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  acceptFriendshipRequest,
  declineFriendshipRequest,
  removeFriendship,
  sendFriendshipRequest,
} from "../../services/friendshipService";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router";

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
    await sendFriendshipRequest(userId);
  };

  const acceptFriendRequest = async () => {
    await acceptFriendshipRequest(userId);
    onFriendAction(userId, "Accepted");
  };

  const declineFriendRequest = async () => {
    await removeFriendship(userId);
    onFriendAction(userId, "Declined");
  };

  const cancelFriendRequest = async () => {
    await removeFriendship(userId);
    onFriendAction(userId, "Declined");
  };

  const removeFriendRequest = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${userName}`);
    if (confirmed) {
      await removeFriendship(userId);
      onFriendAction(userId, "Declined");
    }
  };

  return (
    <li
      key={userId}
      className="flex items-center justify-between gap-2 p-2 rounded-sm border border-defaultbordercolor w-full md:w-[50%]"
    >
      <div className="flex items-center gap-2">
        <ProfilePic userName={userName} fileUrl={profilePic} />
        <Link to={"/profile/" + userId}>{userName}</Link>
      </div>

      {status === "Accepted" && (
        <div className="flex flex-row items-center gap-1">
          <span className="text-green-700">Friends</span>
          <button
            onClick={removeFriendRequest}
            className="flex items-center gap-1 border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer text-xs"
          >
            <Icon icon={BiSolidUserX} />
            Remove
          </button>
        </div>
      )}

      {status === "Pending" && requestedByAccountId === user?.nameid && (
        <div className="flex flex-row items-center gap-1">
          <span className="text-gray-500">Pending</span>
          <button
            onClick={cancelFriendRequest}
            className="flex items-center gap-1 border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer text-xs"
          >
            <Icon icon={BiSolidUserX} />
            Cancel request
          </button>
        </div>
      )}

      {status === "Pending" && requestedByAccountId !== user?.nameid && (
        <div className="ml-auto flex gap-1">
          <span className="text-gray-500">Pending</span>
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
