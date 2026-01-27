import PlaylistModal from "../modals/Playlist/PlaylistModal";

import { useRoomStore } from "../../stores/roomStore";
import RoomSettingsModal from "../modals/RoomSettingsModal";
import RoomInviteModal from "../modals/RoomInviteModal";
import RoomInfoModal from "../modals/RoomInfoModal";
import ReportModal from "../modals/ReportModal";
import Icon from "../icon/Icon";
import { IoFlagOutline } from "react-icons/io5";
import CloseRoomModal from "../modals/CloseRoomModal";
import { useUser } from "../../contexts/UserContext";

export default function RoomBottomBar() {
  const room = useRoomStore((state) => state.room);
  const isLeader = useRoomStore((state) => state.isLeader);
  const { user } = useUser();

  return (
    <div className="flex w-full flex-row items-center gap-2 bg-black border-t border-defaultbordercolor h-full p-1 overflow-hidden overflow-x-auto">
      <div className="flex items-center gap-2 flex-shrink-0">
        <PlaylistModal />
        {isLeader && <RoomSettingsModal />}
        <RoomInviteModal />
        <RoomInfoModal />
        <ReportModal
          reportType="Room"
          reportTargetId={room?.id ?? ""}
          openButtonClassname="bg-neutral-700 text-sm py-1 px-3 gap-1 rounded-2xl flex items-center cursor-pointer hover:bg-neutral-600 transition-colors"
          openButtonContent={
            <>
              <Icon icon={IoFlagOutline}></Icon>
              Report
            </>
          }
        />
        {user && (user.role == "Admin" || user.role == "Mod") && <CloseRoomModal></CloseRoomModal>}
        
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-3 text-sm flex-shrink-0 overflow-hidden">
        <div
          title={room?.category ?? "—"}
          className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-md border border-neutral-700 whitespace-nowrap"
        >
          <span className="text-neutral-400">Category:</span>
          <span className="font-medium text-white">
            {room?.category ?? "—"}
          </span>
        </div>

        <div
          title={room?.title ?? "—"}
          className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-md border border-neutral-700 max-w-[250px] overflow-hidden"
        >
          <span className="text-neutral-400">Title:</span>
          <span className="font-semibold text-white truncate">
            {room?.title ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
