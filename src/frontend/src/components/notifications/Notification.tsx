import * as React from "react";
import type { ToastContentProps } from "react-toastify";
import { IoIosRadio } from "react-icons/io";
import { useNavigate } from "react-router";
import ProfilePic from "../avatar/ProfilePic";
import { FaUserFriends } from "react-icons/fa";
import type { NotificationType } from "../types/NotificationTypeModel";
import { FaUserCheck } from "react-icons/fa6";
interface NotificationProps extends ToastContentProps {
  accountId: string;
  userName: string;
  type: NotificationType;
  pictureUrl: string;
  payload: string;
}
export default function Notification({
  closeToast,
  accountId,
  userName,
  type,
  pictureUrl,
  payload,
}: NotificationProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "FriendInvitation" || type === "FriendRequestAccepted") {
      navigate(`/profile/${accountId}`);
    } else {
      navigate(`/room/${payload}`);
    }

    closeToast?.();
  };

  const title =
    type === "FriendInvitation"
      ? "New Friend Request"
      : type === "FriendRequestAccepted"
        ? "Friend Request Accepted"
        : "Room Invitation";

  let icon = undefined;
  switch (type) {
    case "FriendInvitation":
      icon = <FaUserFriends size={12} />;
      break;
    case "FriendRequestAccepted":
      icon = <FaUserCheck size={12} />;
      break;
    case "RoomInvitation":
      icon = <IoIosRadio size={12} />;
      break;
  }

  return (
    <div
      onClick={handleClick}
      className="
        cursor-pointer
        w-[340px]
        bg-zinc-900/90
        backdrop-blur
        text-white
        border border-zinc-800/70
        rounded-2xl
        p-4
        flex items-center gap-4
        hover:bg-zinc-800
        transition-all
        shadow-[0_0_20px_rgba(0,0,0,0.3)]
      "
    >
      {/* Icon / Profile pic */}
      <div className="flex-shrink-0">
        <div className="relative inline-block">
          <ProfilePic userName={userName} fileUrl={pictureUrl} />

          <div className="absolute bottom-0 left-2 bg-neutral-800/95 rounded-full p-1 translate-x-1/4 translate-y-[40%]">
            {icon}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-zinc-400">{userName}</span>
      </div>
    </div>
  );
}
