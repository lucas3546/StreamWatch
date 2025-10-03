import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  getOverview,
  type StorageResponse,
} from "../../services/storageService";
import UploadVideoModal from "../modals/UploadVideoModal";
import { getFilename } from "../../utils/fileExtensions";

interface MediaSelectorProps {
  media: string | null;
  setMedia: Dispatch<SetStateAction<string | null>>;
}
export default function MediaSelector({ media, setMedia }: MediaSelectorProps) {
  const [medias, setMedias] = useState<StorageResponse | null>(null);
  const [newVideo, setNewVideoUploaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchMedia = async () => {
      const medias = await getOverview();
      console.log(medias);
      setMedias(medias);
    };
    fetchMedia();
  }, [newVideo]);

  const onUploadedNewVideo = () => {
    setNewVideoUploaded(true);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="w-full flex items-center p-2 bg-neutral-500 cursor-pointer">
        <UploadVideoModal onUploaded={onUploadedNewVideo} />
      </div>
      {medias && medias.medias.length > 0 ? (
        medias.medias.map((item) => (
          <div
            key={item.mediaId}
            onClick={() => setMedia(item.mediaId)}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer
              hover:bg-neutral-700
              ${media === item.mediaId ? "bg-violet-700 border-2 border-white" : ""}`}
          >
            {media === item.mediaId && <p>•</p>}

            <img
              src={item.thumbnailUrl}
              className="w-8 h-8 object-cover rounded"
            />
            <span>{getFilename(item.thumbnailUrl)}</span>
          </div>
        ))
      ) : (
        <>
          <p className="text-neutral-400 italic px-3 py-2">
            You don't have any uploaded file
          </p>
        </>
      )}
    </div>
  );
}
