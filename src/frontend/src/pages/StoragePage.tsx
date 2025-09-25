import { useEffect, useState } from "react";
import VideoItemCard from "../components/cards/VideoItemCard";
import { DateTime } from "luxon";
import { getOverview, type StorageResponse } from "../services/storageService";
import UploadVideoModal from "../components/modals/UploadVideoModal";

export default function StoragePage() {
  const [videos, setVideos] = useState<StorageResponse | null>();

  useEffect(() => {
    const fetchData = async () => {
      const items = await getOverview();
      setVideos(items);
    };

    fetchData();
  }, []);

  const onUploadedVideo = () => {
    window.location.href = "/storage";
  };

  return (
    <>
      <div className="flex-col">
        <h2 className="text text-3xl text-center p-2">Storage</h2>
        <p className="text text-md text-center p-2 border-b-defaultbordercolor border-b-1">
          This is your temporal storage, you can upload videos up to 2gb, and
          will be deleted in 24 hours
        </p>
        <button className="bg-blue-600 m-2 p-0.5 rounded-sm cursor-pointer">
          <UploadVideoModal onUploaded={onUploadedVideo}></UploadVideoModal>
        </button>
      </div>

      <div className="grid gap-2 p-2 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {videos?.medias.map((x) => (
          <VideoItemCard
            key={x.mediaId}
            fileName={x.fileName}
            thumbnailName={x.thumbnailFileName}
            provider={x.mediaProvider}
            size={x.size}
            expirestAt={DateTime.fromISO(x.expiresAt).toUTC()}
          ></VideoItemCard>
        ))}
      </div>
    </>
  );
}
