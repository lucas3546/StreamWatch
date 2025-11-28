import ProfilePic from "../avatar/ProfilePic";
import Icon from "../icon/Icon";
import { BiSolidUserX } from "react-icons/bi";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  acceptFriendshipRequest,
  removeFriendship,
} from "../../services/friendshipService";
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router";

interface UserFriendItemProps {
  userId: string;
  userName: string;
  profilePic?: string;
  status?: string | undefined;
  requestedByAccountId?: string;
  onFriendAction: (userId: string, newStatus: string) => void;
}

export default function UserFriendItem({
  userId,
  userName,
  profilePic,
  status,
  requestedByAccountId,
  onFriendAction,
}: UserFriendItemProps) {
  const { user } = useUser();

  const acceptFriendRequest = async () => {
    await acceptFriendshipRequest(userId);
    onFriendAction(userId, "Accepted");
  };

  const declineFriendRequest = async () => {
    await removeFriendship(userId);
    onFriendAction(userId, "Declined");
  };

  const cancelFriendRequest = async () => {
    await removeFriendship(userId);
    onFriendAction(userId, "Declined");
  };

  const removeFriendRequest = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${userName}?`);
    if (confirmed) {
      await removeFriendship(userId);
      onFriendAction(userId, "Declined");
    }
  };

  return (
    <li
      key={userId}
      className="flex items-center justify-between gap-3 p-2 rounded-xl border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 transition-all shadow-sm w-full md:w-[48%]"
    >
      {/* Perfil */}
      <div className="flex items-center gap-1">
        <ProfilePic userName={userName} fileUrl={profilePic} />
        <Link
          to={`/profile/${userId}`}
          className="font-medium text-gray-100 hover:underline hover:text-white transition-colors flex-shrink truncate max-w-[80%]"
          title={userName}
        >
          {userName}
        </Link>
      </div>

      {/* Estado */}
      {status === "Accepted" && (
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-sm font-medium">Friends</span>
          <button
            onClick={removeFriendRequest}
            className="cursor-pointer flex items-center gap-1 bg-neutral-800 hover:bg-red-700 text-gray-200 hover:text-white rounded-lg px-2 py-1 text-xs transition-colors"
          >
            <Icon icon={BiSolidUserX} />
            Remove
          </button>
        </div>
      )}

      {status === "Pending" && requestedByAccountId === user?.nameid && (
        <div className="flex items-center gap-2">
          <button
            onClick={cancelFriendRequest}
            className="cursor-pointer flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-gray-200 hover:text-white rounded-lg px-2 py-1 text-xs transition-colors"
          >
            <Icon icon={BiSolidUserX} />
            Cancel request
          </button>
        </div>
      )}

      {status === "Pending" && requestedByAccountId !== user?.nameid && (
        <div className="flex items-center gap-2">
          <button
            onClick={acceptFriendRequest}
            className="cursor-pointer flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg p-1 transition-colors"
            title="Aceptar solicitud"
          >
            <Icon icon={BiSolidUserCheck} />
          </button>
          <button
            onClick={declineFriendRequest}
            className="cursor-pointer flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg p-1 transition-colors"
            title="Rechazar solicitud"
          >
            <Icon icon={BiSolidUserX} />
          </button>
        </div>
      )}
    </li>
  );
}
