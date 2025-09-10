import { useRef, useState } from "react";

interface VideoUploadProps {
  onFileSelect?: (file: File) => void;
}

export function VideoUpload({ onFileSelect }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

      const url = URL.createObjectURL(file);

      // Creamos un elemento <video> oculto para capturar el primer frame
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageUrl = canvas.toDataURL("image/png");
          setPreviewImage(imageUrl);
        }
        URL.revokeObjectURL(url); // liberar memoria
      });

      onFileSelect?.(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="cursor-pointer border-2 border-dashed border-gray-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition"
      >
        {previewImage ? (
          <div className="w-full">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full rounded-xl shadow-md"
            />
            <p className="mt-2 text-sm text-gray-600 truncate">{fileName}</p>
          </div>
        ) : (
          <>
            {/* Ícono simple con SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8h4M3 12h18m-6 8V12"
              />
            </svg>

            <p className="mt-2 text-gray-600">Click here to upload the video</p>
            <p className="text-xs text-gray-400">
              (Accepted formats: .mp4, .avi, .mkv)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
