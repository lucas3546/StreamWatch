import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
import PlaylistVideoItem from "./PlaylistVideoItem";
import Icon from "../../icon/Icon";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import AddToPlaylist from "./AddToPlaylistModal";
import { useSignalR } from "../../../hooks/useSignalR";
import { roomRealtimeService } from "../../../services/roomRealtimeService";

interface PlaylistModalProps {
  items: PlaylistVideoItemModel[];
  roomId: string;
}

export default function PlaylistModal({ items, roomId }: PlaylistModalProps) {
  const { connection } = useSignalR();
  const [playlistItems, setPlaylistItems] =
    useState<PlaylistVideoItemModel[]>(items);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    service.onReceiveNewVideoToPlaylist((item: PlaylistVideoItemModel) => {
      console.log("New playlist item received:", item);
      setPlaylistItems((prev) => [...prev, item]);
    });
  }, [connection]);

  return (
    <>
      <button
        className="bg-neutral-700 text-sm rounded-sm flex items-center px-2 ml-2 mt-1 hover:bg-sky-600"
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
            <AddToPlaylist roomId={roomId}></AddToPlaylist>
            <Description>
              {playlistItems?.map((item) => (
                <PlaylistVideoItem
                  key={item.createdAt}
                  item={item}
                ></PlaylistVideoItem>
              ))}
            </Description>
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
