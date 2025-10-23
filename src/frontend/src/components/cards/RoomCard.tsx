import { AiFillYoutube } from "react-icons/ai";
import Icon from "../icon/Icon";
import { BsPlayFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { Link } from "react-router";
import { useUser } from "../../contexts/UserContext";

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
  const { user } = useUser();

  let categoryColor;
  switch (category) {
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
  }

  let providerLabel;
  let providerIcon;
  switch (provider.toLocaleLowerCase()) {
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

  const linkUrl = user ? `/room/${roomId}` : "/login";

  return (
    <Link
      to={linkUrl}
      className="group bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg ring-1 ring-white/10 hover:ring-white/20 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-white/20"
    >
      {/* Imagen con efecto hover */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/nopreview.jpg";
          }}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Cinta de categoría */}
        <span
          className={`absolute top-2 left-2 backdrop-blur-sm ${categoryColor} text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm bg-opacity-80`}
        >
          /{category}/
        </span>

        {/* Usuarios conectados */}
        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[12px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <Icon icon={BiSolidUser} size={14} />
          {connectedUsers}
        </span>

        {/* Proveedor (YouTube, etc.) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white/90 text-sm bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
          <Icon icon={providerIcon} size={18} />
          <span className="font-medium">{providerLabel}</span>
        </div>
      </div>

      {/* Título */}
      <div className="p-3">
        <p className="font-semibold text-gray-100 text-sm group-hover:text-white transition-colors duration-200 truncate">
          {title}
        </p>
      </div>
    </Link>
  );
}
