import * as React from "react";
import PlaylistModal from "../modals/Playlist/PlaylistModal";
import Icon from "../icon/Icon";
import { HiUsers } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";

import { useRoomStore } from "../../stores/roomStore";

export default function RoomBottomBar() {
  const room = useRoomStore((state) => state.room);
  return (
    <div className="flex w-full flex-row flex-wrap items-center gap-2 bg-black border-defaultbordercolor h-full p-1">
      <PlaylistModal />

      <button className="flex items-center gap-1 bg-defaultbordercolor p-1 rounded-sm cursor-pointer flex-shrink-0">
        <Icon icon={CiSettings} />
        Settings
      </button>

      <button className="flex items-center gap-1 bg-defaultbordercolor p-1 rounded-sm cursor-pointer flex-shrink-0">
        <Icon icon={HiUsers} size={20} />
        Invite
      </button>

      <p className="hidden md:flex truncate">{room?.title}</p>
    </div>
  );
}
