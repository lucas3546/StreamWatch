import * as React from "react";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import Icon from "../icon/Icon";

export default function RoomBottomBar() {
  return (
    <div className="flex flex-row  bg-black border-defaultbordercolor h-full w-full ">
      <div
        className="flex flex-row items-center gap-1 px-3 py-1
                          bg-neutral-800 bg-gradient-to-r from-white/5 via-neutral-700 to-white/5
                         text-xs text-gray-200
                         hover:bg-white/10 hover:scale-105 transition-all duration-200"
      >
        <Icon icon={MdOutlinePlaylistPlay} />
        <span>Playlist</span>
        <span className="text-red-500 font-semibold">(+2)</span>
      </div>
    </div>
  );
}
