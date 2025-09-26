import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import MediaSelector from "../../media/MediaSelector";
import {
  roomRealtimeService,
  type AddVideoToPlaylistType,
} from "../../../services/roomRealtimeService";
import { useSignalR } from "../../../hooks/useSignalR";
import { addVideoToPlaylist } from "../../../services/roomService";

interface AddToPlaylistProps {
  roomId: string;
}

export default function AddToPlaylist({ roomId }: AddToPlaylistProps) {
  const { connection } = useSignalR();
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [media, setMedia] = useState<string | null>(null);

  const AddToPlaylist = async () => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    const request: AddVideoToPlaylistType = {
      roomId: roomId,
      provider: provider,
      videoUrl: youtubeUrl,
      mediaId: media,
    };

    await addVideoToPlaylist(request);
  };

  return (
    <>
      <button
        className="bg-neutral-700 text-sm rounded-sm flex items-center p-2 ml-2 mt-1 hover:bg-sky-600"
        onClick={() => setIsOpen(true)}
      >
        + Add to playlist
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border-1 border-defaultbordercolor bg-basecolor p-5 text-center">
            <DialogTitle className="font-bold">Add to playlist</DialogTitle>
            <Description>
              <label className="w-full">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
              >
                <option value="youtube">YouTube</option>
                <option value="local">Local</option>
              </select>
              {provider === "youtube" ? (
                <>
                  <label className="w-full">YouTube Link</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-400 w-full">Choose Local Media</p>
                  <div className="max-h-60 overflow-y-auto border border-white rounded-md bg-neutral-800">
                    <MediaSelector
                      media={media}
                      setMedia={setMedia}
                    ></MediaSelector>
                  </div>
                </>
              )}
            </Description>
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={AddToPlaylist}>Add to playlist</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
