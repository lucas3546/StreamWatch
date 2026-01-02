import { AiFillYoutube } from "react-icons/ai";
import Icon from "../icon/Icon";
import { BsPlayFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { Link } from "react-router";
import { useUser } from "../../contexts/UserContext";
import ReportModal from "../modals/ReportModal";
import { IoFlagOutline } from "react-icons/io5";

interface RoomCardProps {
  roomId: string;
  thumbnailUrl: string;
  title: string;
  category: string;
  connectedUsers: number;
  provider: string;
}
export default function RoomCard({
  roomId,
  thumbnailUrl,
  title,
  category,
  connectedUsers,
  provider,
}: RoomCardProps) {
  let categoryColor;
  switch (category.toLowerCase()) {
    case "music":
      categoryColor = "bg-rose-800";
      break;
    case "movies":
      categoryColor = "bg-violet-950/70";
      break;
    case "series":
      categoryColor = "bg-orange-900";
      break;
    case "anime":
      categoryColor = "bg-pink-900";
      break;
    case "podcasts":
      categoryColor = "bg-neutral-950";
      break;
    case "videos":
      categoryColor = "bg-red-950";
      break;
    case "nothing":
      categoryColor = "bg-black";
      break;
  }

  let providerLabel;
  let providerIcon;
  switch (provider?.toLowerCase() ?? "") {
    case "youtube":
      providerLabel = "YouTube";
      providerIcon = AiFillYoutube;
      break;
    case "local":
      providerLabel = "StreamWatch";
      providerIcon = BsPlayFill;
      break;
    case "tokyvideo":
      providerLabel = "TokyVideo";
      providerIcon = BsPlayFill;
      break;
    default:
      providerLabel = "Unknown";
      providerIcon = BsPlayFill;
  }

  return (
    <div
      className="relative group bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg ring-1 ring-white/10
                 hover:ring-white/20 overflow-hidden transition-all duration-300
                 hover:-translate-y-1 hover:shadow-white/20"
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-30">
        <span
          className={`
            backdrop-blur-sm ${categoryColor}
            text-white text-[11px] px-2 py-0.5 rounded-md shadow-md
          `}
        >
          /{category.toLowerCase()}/
        </span>

        <div className="pointer-events-auto">
          <ReportModal
            reportTargetId={roomId}
            reportType="Room"
            openButtonClassname="
              cursor-pointer bg-black/60 backdrop-blur-sm text-white text-[11px]
              px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 h-6
              hover:bg-neutral-800 hover:scale-105 transition
            "
            openButtonContent={
              <span className="text-red-500">
                <Icon icon={IoFlagOutline} size={12} />
              </span>
            }
          />
        </div>
      </div>

      <Link to={`/room/${roomId}`} className="block pointer-events-auto">
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            onError={(e) => (e.currentTarget.src = "/nopreview.jpg")}
            className="w-full h-full object-cover rounded-t-xl transition-transform duration-300
                       group-hover:scale-105"
          />

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white">
            <span className="bg-black/60 backdrop-blur-sm text-[11px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Icon icon={BiSolidUser} size={14} /> {connectedUsers}
            </span>

            <span className="bg-black/60 backdrop-blur-sm text-[11px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Icon icon={providerIcon} size={16} /> {providerLabel}
            </span>
          </div>
        </div>

        <div className="p-3">
          <p className="font-semibold text-gray-100 text-sm group-hover:text-white transition-colors truncate">
            {title}
          </p>
        </div>
      </Link>
    </div>
  );
}
