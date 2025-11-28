import formatBytes from "../../utils/byteFormatter";
import { DateTime } from "luxon";
import Countdown from "./Countdown";
import { IoIosPlay } from "react-icons/io";
import Icon from "../icon/Icon";
import { getFilename } from "../../utils/fileExtensions";
import { deleteMedia } from "../../services/storageService";
interface VideoItemCardProps {
  id: string;
  fileUrl: string;
  thumbnailUrl: string;
  provider: string;
  size: number;
  expirestAt: DateTime;
}

export default function VideoItemCard({
  id,
  fileUrl,
  thumbnailUrl,
  size,
  expirestAt,
}: VideoItemCardProps) {
  console.log(thumbnailUrl);
  const handleVideoClick = () => {
    window.location.href = fileUrl;
  };

  const handleDeleteVideoClick = async () => {
    const isConfirmed = confirm("Are you sure do you wan't delete this video?");

    if (!isConfirmed) return;

    try {
      await deleteMedia(id);
      location.reload();
    } catch {
      alert("Some error has ocurred, please try again!");
    }
  };

  return (
    <div
      className="
        bg-neutral-900/60 border border-neutral-800
        rounded-xl shadow-lg overflow-hidden
        p-3 transition-all duration-300
        hover:scale-[1.03] hover:shadow-xl
        backdrop-blur-sm
      "
    >
      <div
        className="w-full aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer"
        onClick={handleVideoClick}
      >
        <img
          className="w-full h-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/nopreview.jpg";
          }}
          src={thumbnailUrl}
        />

        {/* overlay play button */}
        <div
          className="
            absolute inset-0 flex items-center justify-center
            bg-black/30 opacity-0 hover:opacity-100
            transition-all duration-300
          "
        >
          <Icon icon={IoIosPlay} size={46} />
        </div>
      </div>

      {/* Texto */}
      <div className="p-2 space-y-1">
        <p
          className="font-semibold text-sm md:truncate text-neutral-200"
          title={fileUrl}
        >
          {getFilename(fileUrl)}
        </p>

        <p className="text-xs text-neutral-400 truncate">{formatBytes(size)}</p>

        <div className="text-xs text-neutral-300">
          <Countdown expirestAt={expirestAt} />
        </div>
      </div>

      <button
        className="
          w-full mt-2 py-1.5 text-sm
          rounded-lg font-medium
          bg-red-600/80 hover:bg-red-700
          active:scale-95 transition-all
          cursor-pointer
        "
        onClick={handleDeleteVideoClick}
      >
        Delete
      </button>
    </div>
  );
}
