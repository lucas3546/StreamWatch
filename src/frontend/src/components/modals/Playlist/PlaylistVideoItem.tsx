import * as React from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
import { PUBLIC_BUCKET_URL } from "../../../utils/config";
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
  let thumbUrl = "";
  let videoUrl = "";
  if (item.provider.toLowerCase() == "youtube") {
    thumbUrl = item.thumbnailUrl;
    videoUrl = item.videoUrl;
  } else {
    thumbUrl = PUBLIC_BUCKET_URL + item.thumbnailUrl;
    videoUrl = PUBLIC_BUCKET_URL + item.videoUrl;
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-defaultbordercolor border-1 rounded-sm
              hover:bg-neutral-700`}
      onClick={() => onClick(item.id)}
      title={item.videoTitle}
    >
      {videoUrl === currentPlayingVideoUrl ? (
        <Icon icon={FaPause} size={15}></Icon>
      ) : (
        <Icon icon={FaPlay} size={15}></Icon>
      )}

      <img
        src={thumbUrl}
        alt={item.thumbnailUrl}
        className="w-8 h-8 object-cover rounded"
      />
      <span className="truncate">{item.videoTitle}</span>
      <span className="ml-auto not-only-of-type:text-xs">{item.userName}</span>
    </div>
  );
}
