import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  getOverview,
  type StorageResponse,
} from "../../services/storageService";
import UploadVideoModal from "../modals/UploadVideoModal";
import { getFilename } from "../../utils/fileExtensions";
import Icon from "../icon/Icon";
import { IoMdCloudUpload } from "react-icons/io";
interface MediaSelectorProps {
  media: string | null;
  setMedia: Dispatch<SetStateAction<string | null>>;
}
export default function MediaSelector({ media, setMedia }: MediaSelectorProps) {
  const [medias, setMedias] = useState<StorageResponse | null>(null);
  const [modalKey, setModalKey] = useState<number>(1);
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
    setNewVideoUploaded(!newVideo);
    setModalKey(modalKey + 1);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <UploadVideoModal
        key={modalKey}
        openButtonClassname="w-full flex items-center p-2 bg-neutral-600 hover:bg-neutral-700 cursor-pointer justify-center"
        openButtonContent={
          <span className="flex items-center gap-1">
            <Icon icon={IoMdCloudUpload}></Icon>Upload video
          </span>
        }
        onUploaded={onUploadedNewVideo}
      />
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
              src={item.fileUrl}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/nopreview.jpg";
              }}
              className="w-8 h-8 object-cover rounded"
            />
            <span>{getFilename(item.fileUrl)}</span>
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
