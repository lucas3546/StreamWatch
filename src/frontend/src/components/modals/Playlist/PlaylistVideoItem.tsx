import * as React from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
import { PUBLIC_BUCKET_URL } from "../../../utils/config";
import { FaPlay } from "react-icons/fa";
import Icon from "../../icon/Icon";
interface PlaylistVideoItemProps {
  item: PlaylistVideoItemModel;
}

export default function PlaylistVideoItem({ item }: PlaylistVideoItemProps) {
  let thumbUrl = "";
  if (item.provider.toLowerCase() == "youtube") {
    thumbUrl = item.thumbnailUrl;
  } else {
    thumbUrl = PUBLIC_BUCKET_URL + item.thumbnailUrl;
  }
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-defaultbordercolor border-1 rounded-sm
              hover:bg-neutral-700`}
      title={item.videoTitle}
    >
      <Icon icon={FaPlay} size={15}></Icon>
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
