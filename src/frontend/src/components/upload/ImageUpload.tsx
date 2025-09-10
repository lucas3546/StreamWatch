import { useRef, useState } from "react";

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
}

export function ImageUpload({ onFileSelect }: ImageUploadProps) {
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
      setPreviewImage(url);

      onFileSelect?.(file);
    }
  };

  return (
    <div className="w-full h-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="cursor-pointer border-2 border-dashed border-gray-400 rounded-2xl p-4 flex items-center justify-center hover:bg-gray-50 transition w-full h-full"
      >
        {previewImage ? (
          <div className="w-full h-full flex flex-row items-center gap-4">
            {/* Imagen a la izquierda */}
            <div className="flex-shrink-0 w-16 h-16">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-md shadow-sm"
              />
            </div>

            {/* Nombre a la derecha */}
            <p className="text-sm text-gray-600 truncate">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="mt-2 text-gray-600"> Click here to select an image</p>
          </div>
        )}
      </div>
    </div>
  );
}
