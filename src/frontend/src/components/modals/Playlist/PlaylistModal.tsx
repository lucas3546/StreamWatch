import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import type { PlaylistVideoItemModel } from "../../types/PlaylistVideoItemModel";
import PlaylistVideoItem from "./PlaylistVideoItem";
import Icon from "../../icon/Icon";
import { MdOutlinePlaylistPlay } from "react-icons/md";

interface PlaylistModalProps {
  items: PlaylistVideoItemModel[];
}

export default function PlaylistModal({ items }: PlaylistModalProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          <DialogPanel className="max-w-lg space-y-4 border-1 border-defaultbordercolor bg-basecolor p-5 text-center">
            <DialogTitle className="font-bold">Playlist</DialogTitle>
            <Description>
              {items?.map((item) => (
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
