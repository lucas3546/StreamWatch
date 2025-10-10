import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
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
  const addPlaylistItem = useRoomStore((state) => state.addPlaylistItem);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    service.onReceiveNewVideoToPlaylist((item: PlaylistVideoItemModel) => {
      console.log("New playlist item received:", item);
      addPlaylistItem(item);
    });

    return () => {
      console.log("[PlaylistModal] Cleaning up NewPlaylistVideo handler");
      connection.off("NewPlaylistVideo");
    };
  }, [connection]);

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
        className="bg-neutral-700 text-sm rounded-sm flex items-center px-2 ml-2 mt-1 cursor-pointer hover:bg-sky-600"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon={MdOutlinePlaylistPlay} />
        Playlist
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-full space-y-4 border-1 border-defaultbordercolor bg-basecolor p-5 text-center">
            <DialogTitle className="font-bold">Playlist</DialogTitle>
            <AddToPlaylist></AddToPlaylist>
            <div className="overflow-y-auto max-h-64 flex flex-col gap-2">
              {playlistItems?.map((item) => (
                <PlaylistVideoItem
                  key={item.id}
                  item={item}
                  onClick={onClickVideoItem}
                  currentPlayingVideoUrl={room?.videoUrl ? room.videoUrl : ""}
                ></PlaylistVideoItem>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-neutral-700 p-1 rounded-sm hover:bg-neutral-600 cursor-pointer"
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
