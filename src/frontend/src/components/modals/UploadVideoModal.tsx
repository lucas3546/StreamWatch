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

export default function UploadVideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedVideo(file);
  };

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    console.log(selectedVideo);
    if (selectedVideo === null) return;

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

      window.location.href = "/storage";
    } catch (err) {
      console.error("Error subiendo video:", err);
    }
  };

  return (
    <>
      <button
        className="bg-sky-700 text-lg rounded-sm px-2 ml-2 mt-1 hover:bg-sky-600"
        onClick={() => setIsOpen(true)}
      >
        + Upload
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border-1 border-white bg-neutral-700 p-12 text-center">
            <DialogTitle className="font-bold">Upload Video</DialogTitle>
            <Description>
              Upload video to our servers for display in your rooms
            </Description>
            <VideoUpload onFileSelect={handleFileSelect} />
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Deactivate</button>
              <button onClick={handleUpload}>Upload</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
