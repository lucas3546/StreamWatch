import type { NotificationModel } from "../../types/NotificationModel";
import { FaUserFriends } from "react-icons/fa";
import { formatShort } from "../../../utils/dateFormat";
import { FaUserCheck } from "react-icons/fa";
import ProfilePic from "../../avatar/ProfilePic";
import type { IconType } from "react-icons";
import { IoIosRadio } from "react-icons/io";
import Icon from "../../icon/Icon";

interface NotificationMenuItemProps {
  notificationModel: NotificationModel;
  onNotificationClick: (notificationId: string, route: string) => void;
}

export default function NotificationMenuItem({
  notificationModel,
  onNotificationClick,
}: NotificationMenuItemProps) {
  let imageUrl: string | undefined;
  let icon: IconType;
  let message: React.ReactNode;
  let route: string;

  switch (notificationModel.type) {
    case "FriendInvitation":
      imageUrl = notificationModel.pictureUrl;
      icon = FaUserFriends;
      message = (
        <>
          New friend request from
          <span className="font-bold break-all">
            {" "}
            @{notificationModel.fromUserName}
          </span>
        </>
      );
      route = `profile/${notificationModel.fromUserId}`;
      break;
    case "FriendRequestAccepted":
      imageUrl = notificationModel.pictureUrl;
      icon = FaUserCheck;
      message = (
        <>
          <span className="text-white text-sm">
            <span className="font-bold break-all">
              @{notificationModel.fromUserName}{" "}
            </span>
            has accepted your friend request
          </span>
        </>
      );
      route = `profile/${notificationModel.fromUserId}`;
      break;
    case "RoomInvitation":
      imageUrl = notificationModel.pictureUrl;
      icon = IoIosRadio;
      message = (
        <>
          <span className="text-white text-sm">
            <span className="font-bold break-all">
              @{notificationModel.fromUserName}{" "}
            </span>
            has invited you to the room
          </span>
        </>
      );
      route = "friends" + notificationModel.payload;
      break;
  }

  return (
    <li
      className="px-4 py-2 hover:bg-neutral-600 border-b border-b-defaultbordercolor cursor-pointer flex flex-row items-center gap-2"
      onClick={() => onNotificationClick(notificationModel.id, route)}
    >
      <div className="mb-auto">
        {imageUrl || notificationModel.fromUserName ? (
          <div className="relative inline-block">
            <ProfilePic
              userName={notificationModel.fromUserName}
              fileUrl={notificationModel.pictureUrl}
              size={40}
            />
            <div className="absolute bottom-0 left-2 bg-neutral-800/95 rounded-full p-1 translate-x-1/4 translate-y-[40%]">
              <Icon icon={icon} size={15}></Icon>
            </div>
          </div>
        ) : (
          <Icon icon={icon} size={28}></Icon>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm ">{message}</span>
        <span className="text-sm ml-auto">
          {formatShort(notificationModel.sentAt)}
        </span>
      </div>
    </li>
  );
}
