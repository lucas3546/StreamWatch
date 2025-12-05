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
import type { ProblemDetails } from "../types/ProblemDetails";
import BaseModal from "./BaseModal";
import { FieldErrorList } from "../errors/FieldErrorList";

interface UploadVideoModalProps {
  onUploaded?: () => void; // callback opcional
  openButtonClassname: string;
  openButtonContent: React.ReactNode;
}

export default function UploadVideoModal({
  onUploaded,
  openButtonClassname,
  openButtonContent,
}: UploadVideoModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>();
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

    let presignedResponse;

    try {
      presignedResponse = await generatePresigned(generatePresignedRequest);
    } catch (err) {
      const problem = err as ProblemDetails;
      if (problem.errors) {
        setFieldErrors(problem.errors);
        return;
      }
    } finally {
      setIsLoading(false);
    }

    try {
      if (!presignedResponse) return;
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
      setIsOpen(false);
      if (onUploaded !== undefined) onUploaded();
    } catch (err) {
      console.error("Error subiendo video:", err);
      setGeneralError(
        "Some error has ocurred with the storage provider when trying to upload the file",
      );
    }
  };

  const footerButtons = (
    <>
      {isLoading ? (
        <button
          onClick={handleUpload}
          disabled
          className="flex flex-row items-center gap-1 bg-gray-700 hover:bg-gray-500 cursor-pointer py-2 px-3 rounded-2xl"
        >
          <div className="animate-spin">
            <Icon icon={CgSpinnerTwo}></Icon>
          </div>
          Uploading
        </button>
      ) : (
        <button
          onClick={handleUpload}
          className="bg-gray-700 hover:bg-gray-500 cursor-pointer py-2 px-3 rounded-2xl"
        >
          Upload
        </button>
      )}
    </>
  );

  return (
    <BaseModal
      title="Upload Video"
      blurBackground={true}
      openButtonClassname={openButtonClassname}
      openButtonContent={openButtonContent}
      footerButtons={footerButtons}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <>
        <h2 className="text-xl">
          Upload video to our servers for display in your rooms
        </h2>
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
        <FieldErrorList errors={fieldErrors}></FieldErrorList>
        {generalError && (
          <p className="text-red-600 text-center mb-2">{generalError}</p>
        )}
      </>
    </BaseModal>
  );
}
