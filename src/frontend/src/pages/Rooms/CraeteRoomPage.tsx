import { useEffect, useState } from "react";
import FormContainer from "../../components/forms/FormContainer";
import { createRoom, type CreateRoomRequest } from "../../services/roomService";
import {
  getOverview,
  type StorageResponse,
} from "../../services/storageService";
import { PUBLIC_BUCKET_URL } from "../../utils/config";
import type { ProblemDetails } from "../../components/types/ProblemDetails";
import { FieldError } from "../../components/errors/FieldError";

export default function CreateRoomPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("youtube");
  const [media, setMedia] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [medias, setMedias] = useState<StorageResponse | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let providerPosition = 0;

    if (provider === "youtube") {
      providerPosition = 0;
    } else if (provider === "local") {
      providerPosition = 1;
    }

    const request: CreateRoomRequest = {
      title: title,
      category: category,
      provider: providerPosition,
      videoUrl: provider === "youtube" ? youtubeUrl : null,
      mediaId: media,
      isPublic: visibility,
    };

    try {
      const response = await createRoom(request);
      window.location.href = "/room/" + response.roomId;
    } catch (err) {
      const problem = err as ProblemDetails;
      if (problem.errors) {
        setFieldErrors(null);
        setFieldErrors(problem.errors);
        return;
      }

      if (problem.detail) {
        setGeneralError(problem.detail);
        return;
      }
    }
  };

  useEffect(() => {
    if (provider === "local") {
      const fetchMedia = async () => {
        const medias = await getOverview();
        setMedias(medias);
      };
      fetchMedia();
    }
  }, [provider]);

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4 text-white"
      >
        <h2 className="text-3xl mb-4">Create Room</h2>

        {/* Title */}
        <label className="w-full">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        />
        <FieldError errors={fieldErrors} name="title" />

        {/* Category */}
        <label className="w-full">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        >
          <option value="Movies">Movies</option>
          <option value="Series">Series</option>
          <option value="Music">Music</option>
          <option value="Anime">Anime</option>
          <option value="Videos">Videos</option>
          <option value="Sports">Sports</option>
        </select>
        <FieldError errors={fieldErrors} name="category" />

        {/* Provider */}
        <label className="w-full">Provider</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        >
          <option value="youtube">YouTube</option>
          <option value="local">Local</option>
        </select>

        {/* Conditional: YouTube link o Local */}
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
          </>
        ) : (
          <>
            <p className="text-gray-400 w-full">Choose Local Media</p>
            <div className="max-h-48 overflow-y-auto border border-white rounded-md bg-neutral-800">
              {medias?.medias.map((item) => (
                <div
                  key={item.mediaId}
                  onClick={() => setMedia(item.mediaId)}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer
                          hover:bg-neutral-700
                          ${media === item.mediaId ? "bg-violet-700 border-2 border-white" : ""}`}
                >
                  {media === item.mediaId ? <p className="">•</p> : <></>}

                  <img
                    src={PUBLIC_BUCKET_URL + item.thumbnailFileName}
                    alt={item.thumbnailFileName}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span>{item.fileName}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <FieldError errors={fieldErrors} name="provider" />

        {/* Visibility */}
        <label className="w-full">Visibility</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="true"
              checked={visibility === false}
              onChange={() => setVisibility(false)}
            />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="true"
              checked={visibility === true}
              onChange={() => setVisibility(true)}
            />
            Private
          </label>
        </div>
        <FieldError errors={fieldErrors} name="isPublic" />
        {generalError && (
          <p className="text-red-600 text-center mb-2">{generalError}</p>
        )}
        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 rounded-md font-semibold mt-4"
        >
          Create Room
        </button>
      </form>
    </FormContainer>
  );
}
