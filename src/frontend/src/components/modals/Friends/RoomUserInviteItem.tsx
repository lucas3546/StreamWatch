import ProfilePic from "../../avatar/ProfilePic";
import type { GetFriendsResponse } from "../../../services/friendshipService";
import { useState } from "react";
import {
  inviteToRoom,
  type InviteToRoomRequest,
} from "../../../services/roomService";
import { useRoomStore } from "../../../stores/roomStore";

interface RoomUserInviteItemProps {
  friend: GetFriendsResponse;
}

export default function RoomUserInviteItem({
  friend,
}: RoomUserInviteItemProps) {
  const roomId = useRoomStore((state) => state.room?.id);
  const [isInvited, setIsInvited] = useState<boolean>(false);

  const onInviteButtonClicked = async () => {
    if (roomId === undefined) return;

    const request: InviteToRoomRequest = {
      roomId: roomId,
      targetAccountId: friend.userId,
    };
    await inviteToRoom(request);

    setIsInvited(true);
  };

  return (
    <div
      key={friend.userId}
      className="flex items-center gap-3 p-2 rounded-xl border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 transition-all shadow-sm w-full"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <ProfilePic userName={friend.userName} fileUrl={friend.thumbnailUrl} />
        <p
          className="truncate text-sm text-neutral-200"
          title={friend.userName}
        >
          {friend.userName}
        </p>
      </div>

      {isInvited ? (
        <button
          disabled
          className="cursor-pinter  bg-neutral-800 hover:bg-neutral-500 rounded-xl px-3 py-1 text-sm font-medium text-white transition-colors"
        >
          Invited
        </button>
      ) : (
        <button
          onClick={onInviteButtonClicked}
          className="cursor-pinter bg-neutral-600 hover:bg-neutral-500 rounded-xl px-3 py-1 text-sm font-medium text-white transition-colors"
        >
          Invite
        </button>
      )}
    </div>
  );
}
