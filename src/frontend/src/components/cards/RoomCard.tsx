import { AiFillYoutube } from "react-icons/ai";
import Icon from "../icon/Icon";
import { BsPlayFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { Link } from "react-router";

interface RoomCardProps {
  roomId: string;
  thumbnail: string;
  title: string;
  category: string;
  connectedUsers: number;
  provider: string;
}
export default function RoomCard({
  roomId,
  thumbnail,
  title,
  category,
  connectedUsers,
  provider,
}: RoomCardProps) {
  let categoryColor;
  switch (category) {
    case "music":
      categoryColor = "bg-rose-800";
      break;
    case "movies":
      categoryColor = "bg-violet-950";
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

  return (
    <Link
      to={"/room/" + roomId}
      className="bg-semibackground border border-defaultbordercolor rounded-sm shadow-md overflow-hidden p-2 hover:scale-105 active:scale-105"
    >
      {/* Imagen con aspect ratio 16:9 */}
      <div className="w-full aspect-[4/3] relative">
        <img
          className="w-full h-full object-cover rounded-md"
          src={thumbnail}
          alt={title}
        />
        <span
          className={`absolute top-2 left-2 ${categoryColor}  text-white text-xs font-semibold px-2 py-1 rounded`}
        >
          /{category}/
        </span>
        <span
          className={`absolute top-2 right-2 bg-neutral-800 text-white text-xs font-semibold px-2 py-1 rounded flex flex-row items-center gap-0.5`}
        >
          <Icon icon={BiSolidUser} size={16}></Icon>
          {connectedUsers}
        </span>
        <span
          className={`absolute bottom-1 right-2 text-white text-lg opacity-85 font-semibold px-2 py-1 rounded flex flex-row items-center gap-0.5`}
        >
          <Icon icon={providerIcon} size={30}></Icon>
          {providerLabel}
        </span>
      </div>

      {/* Texto */}
      <div className="p-2">
        <p className="font-semibold text-sm truncate">{title}</p>
      </div>
    </Link>
  );
}
