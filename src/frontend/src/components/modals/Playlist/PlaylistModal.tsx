import { useState } from "react";
import PlaylistVideoItem from "./PlaylistVideoItem";
import Icon from "../../icon/Icon";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import AddToPlaylist from "./AddToPlaylistModal";
import { useSignalR } from "../../../hooks/useSignalR";
import {
  roomRealtimeService,
  type ChangeVideoFromPlaylistItemType,
} from "../../../services/roomRealtimeService";
import { useRoomStore } from "../../../stores/roomStore";
import BaseModal from "../BaseModal";

export default function PlaylistModal() {
  const { connection } = useSignalR();
  const room = useRoomStore((state) => state.room);
  const playlistItems = useRoomStore((state) => state.playlistItems);

  const [isOpen, setIsOpen] = useState(false);

  const onClickVideoItem = (itemId: string) => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    console.log(itemId);
    const request: ChangeVideoFromPlaylistItemType = {
      roomId: room?.id ?? "",
      playlistItemId: itemId,
    };

    service.changeVideoFromPlaylist(request);
  };

  const openButtonContent = (
    <>
      <Icon icon={MdOutlinePlaylistPlay} />
      <span className="ml-1">Playlist</span>
    </>
  );

  return (
    <BaseModal
      title="Playlist"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      openButtonClassname="bg-neutral-700 text-sm py-1 px-3 rounded-2xl flex items-center ml-2 cursor-pointer hover:bg-neutral-600 transition-colors"
      openButtonContent={openButtonContent}
      blurBackground={true}
    >
      <div
        className="bg-neutral-800/60 backdrop-blur-sm
                          rounded-xl p-4 shadow-lg space-y-4"
      >
        <AddToPlaylist />

        <div className="overflow-y-auto max-h-64 flex flex-col gap-2 rounded-md p-1">
          {playlistItems?.map((item) => (
            <PlaylistVideoItem
              key={item.id}
              item={item}
              onClick={onClickVideoItem}
              currentPlayingVideoUrl={room?.videoUrl || ""}
            />
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
