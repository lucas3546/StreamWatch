import * as React from "react";
import PlaylistModal from "../modals/Playlist/PlaylistModal";
import type { PlaylistVideoItemModel } from "../types/PlaylistVideoItemModel";

interface RoomBottomBarProps {
  playlistVideos: PlaylistVideoItemModel[];
  roomId: string;
}

export default function RoomBottomBar({
  playlistVideos,
  roomId,
}: RoomBottomBarProps) {
  return (
    <div className="flex flex-row  bg-black border-defaultbordercolor h-full w-full ">
      <PlaylistModal roomId={roomId} items={playlistVideos}></PlaylistModal>
    </div>
  );
}
