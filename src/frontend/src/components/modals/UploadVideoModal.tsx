import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { VideoUpload } from "../upload/VideoUpload";
import {
  generatePresigned,
  setUploaded,
  type GeneratePresigned,
  type SetUploadedRequest,
} from "../../services/storageService";
import axios from "axios";
import Icon from "../icon/Icon";
import { CgSpinnerTwo } from "react-icons/cg";

interface UploadVideoModalProps {
  onUploaded?: () => void; // callback opcional
}

export default function UploadVideoModal({
  onUploaded,
}: UploadVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileSelect = (file: File) => {
    setSelectedVideo(file);
  };

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    console.log(selectedVideo);
    if (selectedVideo === null) return;

    setIsLoading(true);

    const generatePresignedRequest: GeneratePresigned = {
      fileName: selectedVideo.name,
      size: selectedVideo.size,
    };
    const presignedResponse = await generatePresigned(generatePresignedRequest);

    try {
      const response = await axios.put(presignedResponse.url, selectedVideo, {
        headers: {
          "Content-Type": "video/mp4",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          );
          setUploadProgress(percent);
        },
      });

      console.log("Upload de video a S3 completo:", response.status);

      const request: SetUploadedRequest = {
        mediaId: presignedResponse.mediaId,
      };

      await setUploaded(request);

      setIsLoading(false);
      if (onUploaded !== undefined) onUploaded();

      setIsOpen(false);
    } catch (err) {
      console.error("Error subiendo video:", err);
    }
  };

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="w-full h-full flex justify-center"
      >
        + Upload to Storage
      </span>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border-1 border-defaultbordercolor bg-neutral-900 rounded-md p-12 text-center">
            <DialogTitle className="font-bold">Upload Video</DialogTitle>
            <Description>
              Upload video to our servers for display in your rooms
            </Description>
            <VideoUpload onFileSelect={handleFileSelect} />
            {isLoading && (
              <div className="w-full bg-neutral-700 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {isLoading && (
              <p className="text-sm mt-1 text-neutral-300">
                {uploadProgress < 100
                  ? `Uploading... ${uploadProgress}%`
                  : "Finalizing upload..."}
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-neutral-700 hover:bg-neutral-500 rounded-md p-2"
              >
                Cancel
              </button>
              {isLoading ? (
                <button
                  onClick={handleUpload}
                  disabled
                  className="flex flex-row items-center gap-1 bg-gray-700 hover:bg-gray-500 cursor-pointer rounded-md p-2"
                >
                  <div className="animate-spin">
                    <Icon icon={CgSpinnerTwo}></Icon>
                  </div>
                  Uploading
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  className="bg-gray-700 hover:bg-gray-500 cursor-pointer rounded-md p-2"
                >
                  Upload
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
