import * as React from "react";
import formatBytes from "../../utils/byteFormatter";
import { DateTime } from "luxon";
import Countdown from "./Countdown";
import { IoIosPlay } from "react-icons/io";
import Icon from "../icon/Icon";
import { getFilename } from "../../utils/fileExtensions";
interface VideoItemCardProps {
  fileUrl: string;
  thumbnailUrl: string;
  provider: string;
  size: number;
  expirestAt: DateTime;
}

export default function VideoItemCard({
  fileUrl,
  thumbnailUrl,
  size,
  expirestAt,
}: VideoItemCardProps) {
  console.log(thumbnailUrl);
  const handleVideoClick = (event) => {
    event.preventDefault();

    window.location.href = fileUrl;
  };

  return (
    <div
      className="bg-neutral-950 border border-defaultbordercolor rounded-sm shadow-md overflow-hidden p-2 hover:scale-105 active:scale-105"
      onClick={handleVideoClick}
    >
      <div className="w-full aspect-[4/3] relative">
        <img
          className="w-full h-full object-cover rounded-md opacity-50"
          src={thumbnailUrl}
        />
        <span
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-semibold px-2 py-1 rounded`}
        >
          <Icon icon={IoIosPlay} size={40}></Icon>
        </span>
      </div>
      {/* Texto */}
      <div className="p-2">
        <p className="font-semibold text-sm md:truncate" title={fileUrl}>
          {getFilename(fileUrl)}
        </p>
        <p className="text-sm truncate">{formatBytes(size)}</p>
        <Countdown expirestAt={expirestAt}></Countdown>
      </div>
    </div>
  );
}
