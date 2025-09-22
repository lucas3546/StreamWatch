import * as React from "react";
import type { NotificationModel } from "../../types/NotificationModel";
import { MdMeetingRoom } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Icon from "../../icon/Icon";
import { formatShort } from "../../../utils/dateFormat";

interface NotificationMenuItemProps {
  notificationModel: NotificationModel;
  onNotificationClick: (notificationId: string, route: string) => void;
}

export default function NotificationMenuItem({
  notificationModel,
  onNotificationClick,
}: NotificationMenuItemProps) {
  const type = notificationModel.type.toLowerCase();

  let icon;
  let message;
  let route;

  if (type === "friendinvitation") {
    icon = <Icon icon={FaUserFriends} size={40} />;
    route = "friends";
    message = (
      <>
        New friend request from
        <span className="font-bold break-all">
          {" "}
          @{notificationModel.fromUserName}
        </span>
      </>
    );
  } else if (type === "roominvitation") {
    icon = <MdMeetingRoom size={30} />;
    route = "friends" + notificationModel.payload;
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
  } else if (type == "friendrequestaccepted") {
    icon = <MdMeetingRoom size={30} />;
    route = "friends";
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
  } else {
    icon = <FaUserFriends size={24} className="text-white" />;
    route = "";
    message = <span>Unknow</span>;
  }

  return (
    <li
      className="px-4 py-2 hover:bg-neutral-600 border-b border-b-defaultbordercolor cursor-pointer flex flex-row items-center gap-2"
      onClick={() => onNotificationClick(notificationModel.id, route)}
    >
      <div className="mb-auto">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm ">{message}</span>
        <span className="text-sm ml-auto">
          {formatShort(notificationModel.sentAt)}
        </span>
      </div>
    </li>
  );
}
