import * as React from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
import { FaPlay } from "react-icons/fa";
import Icon from "../../icon/Icon";
import { FaPause } from "react-icons/fa";
interface PlaylistVideoItemProps {
  item: PlaylistVideoItemModel;
  currentPlayingVideoUrl: string;
  onClick: (itemId: string) => void;
}

export default function PlaylistVideoItem({
  item,
  currentPlayingVideoUrl,
  onClick,
}: PlaylistVideoItemProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-defaultbordercolor border-1 rounded-sm
              hover:bg-neutral-700`}
      onClick={() => onClick(item.id)}
      title={item.videoTitle}
    >
      {item.videoUrl === currentPlayingVideoUrl ? (
        <Icon icon={FaPause} size={15}></Icon>
      ) : (
        <Icon icon={FaPlay} size={15}></Icon>
      )}

      <img
        src={item.thumbnailUrl}
        alt={item.thumbnailUrl}
        className="w-8 h-8 object-cover rounded"
      />
      <span className="truncate">{item.videoTitle}</span>
      <span className="ml-auto not-only-of-type:text-xs">{item.userName}</span>
    </div>
  );
}
