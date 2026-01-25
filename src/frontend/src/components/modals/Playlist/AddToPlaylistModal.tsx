import { useState } from "react";
import MediaSelector from "../../media/MediaSelector";
import { type AddVideoToPlaylistType } from "../../../services/roomRealtimeService";
import { useSignalR } from "../../../hooks/useSignalR";
import { addVideoToPlaylist } from "../../../services/roomService";
import { useRoomStore } from "../../../stores/roomStore";
import Icon from "../../icon/Icon";
import { CgSpinnerTwo } from "react-icons/cg";
import { FieldError } from "../../errors/FieldError";
import type { ProblemDetails } from "../../types/ProblemDetails";
import BaseModal from "../BaseModal";

export default function AddToPlaylist() {
  const { connection } = useSignalR();
  const room = useRoomStore((state) => state.room);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [provider, setProvider] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [media, setMedia] = useState<string | null>(null);

  const AddToPlaylist = async () => {
    if (!connection) return;

    setIsLoading(true);

    const request: AddVideoToPlaylistType = {
      roomId: room?.id ?? "",
      provider: provider,
      videoUrl: youtubeUrl,
      mediaId: media,
    };

    try {
      await addVideoToPlaylist(request);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      const problem = error as ProblemDetails;
      if (problem.errors) {
        setFieldErrors(problem.errors);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const footerButtons = (
    <>
      {isLoading ? (
        <button
          disabled
          className="ml-auto cursor-pointer bg-neutral-800 py-2 px-3 rounded-2xl hover:bg-neutral-700 "
        >
          <div className="animate-spin">
            <Icon icon={CgSpinnerTwo} />
          </div>
        </button>
      ) : (
        <button
          className="ml-auto bg-neutral-600 py-2 px-3 rounded-2xl hover:bg-neutral-500 cursor-pointer"
          onClick={AddToPlaylist}
        >
          Add to playlist
        </button>
      )}
    </>
  );
  return (
    <BaseModal
      title="Add to playlist"
      openButtonClassname="bg-neutral-700 text-sm rounded-sm flex items-center p-2 ml-2 mt-1 hover:bg-sky-600 cursor-pointer"
      openButtonContent={<span>+ Add to playlist</span>}
      blurBackground={true}
      footerButtons={footerButtons}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <div
        className="bg-neutral-800/60 backdrop-blur-sm
                          rounded-xl p-4 shadow-lg space-y-4"
      >
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
            <FieldError errors={fieldErrors} name="videoUrl"></FieldError>
          </>
        ) : (
          <>
            <p className="text-gray-400 w-full">Choose Local Media</p>
            <div className="max-h-60 overflow-y-auto border border-white rounded-md bg-neutral-800">
              <MediaSelector media={media} setMedia={setMedia}></MediaSelector>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}
