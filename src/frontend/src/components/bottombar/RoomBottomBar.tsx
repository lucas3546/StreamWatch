import * as React from "react";
import PlaylistModal from "../modals/Playlist/PlaylistModal";
import type { PlaylistVideoItemModel } from "../types/PlaylistVideoItemModel";

interface RoomBottomBarProps {
  playlistVideos: PlaylistVideoItemModel[];
}

export default function RoomBottomBar({ playlistVideos }: RoomBottomBarProps) {
  return (
    <div className="flex flex-row  bg-black border-defaultbordercolor h-full w-full ">
      <PlaylistModal items={playlistVideos}></PlaylistModal>
    </div>
  );
}
