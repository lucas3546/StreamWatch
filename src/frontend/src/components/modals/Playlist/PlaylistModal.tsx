import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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

  return (
    <>
      <button
        className="bg-neutral-700 text-sm py-1 px-3 rounded-2xl flex items-center ml-2 cursor-pointer hover:bg-neutral-600 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon={MdOutlinePlaylistPlay} />
        <span className="ml-1">Playlist</span>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <DialogPanel className="max-w-md w-full bg-neutral-900 rounded-xl shadow-xl border border-neutral-700 p-6 text-center space-y-4">
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-sm">
              Playlist
            </DialogTitle>

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

            <div className="flex justify-center gap-4">
              <button
                className="bg-neutral-700 text-white p-2 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
