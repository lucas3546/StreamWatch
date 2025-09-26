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

interface UploadVideoModalProps {
  onUploaded?: () => void; // callback opcional
}

export default function UploadVideoModal({
  onUploaded,
}: UploadVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-neutral-600 rounded-md p-2"
              >
                Cancel
              </button>
              {isLoading ? (
                <p>Uplading..</p>
              ) : (
                <button
                  onClick={handleUpload}
                  className="bg-blue-700
                -600 rounded-md p-2"
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
