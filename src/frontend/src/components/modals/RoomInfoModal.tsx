import { useState } from "react";
import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useRoomStore } from "../../stores/roomStore";
export default function RoomInfoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const room = useRoomStore((state) => state.room);
  const openButtonContent = (
    <>
      <Icon icon={IoMdInformationCircleOutline} />
      Info
    </>
  );

  return (
    <BaseModal
      blurBackground={true}
      title="Room Info"
      openButtonClassname="bg-neutral-700 text-sm py-1 px-3 gap-1 rounded-2xl flex items-center cursor-pointer hover:bg-neutral-600 transition-colors"
      openButtonContent={openButtonContent}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div
        className="bg-neutral-800/60 backdrop-blur-sm
                            rounded-xl p-4 shadow-lg space-y-4"
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            Room ID
          </span>
          <span className="text-sm font-semibold text-neutral-200">
            {room?.id}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            Title
          </span>
          <span className="text-sm font-semibold text-neutral-200">
            {room?.title}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            Category
          </span>
          <span className="text-sm font-semibold text-neutral-200">
            {room?.category}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            Created At
          </span>
          <span className="text-sm font-semibold text-neutral-200">
            {room?.createdAt ? new Date(room.createdAt).toLocaleString() : "—"}
          </span>
        </div>
      </div>
    </BaseModal>
  );
}
