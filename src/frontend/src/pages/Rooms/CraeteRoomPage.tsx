import { useState } from "react";
import FormContainer from "../../components/forms/FormContainer";
import { createRoom, type CreateRoomRequest } from "../../services/roomService";
import type { ProblemDetails } from "../../components/types/ProblemDetails";
import { FieldError } from "../../components/errors/FieldError";
import MediaSelector from "../../components/media/MediaSelector";
import Icon from "../../components/icon/Icon";
import { CgSpinnerTwo } from "react-icons/cg";
import { createRoomSchema } from "../../components/schemas/createRoomSchema";
import { mapZodErrors } from "../../utils/zodExtensions";

export default function CreateRoomPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Movies");
  const [provider, setProvider] = useState("youtube");
  const [media, setMedia] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = createRoomSchema.safeParse({
      title,
      category,
      provider,
      media,
      videoUrl,
      visibility,
    });
    if (!result.success) {
      console.log(result.error.issues);
      setFieldErrors(mapZodErrors(result.error));
      setIsLoading(false);
      return;
    }
    console.log("3");
    setFieldErrors(null);
    const request: CreateRoomRequest = {
      title: title,
      category: category,
      provider: provider,
      videoUrl: provider === "youtube" ? videoUrl : null,
      mediaId: provider === "youtube" ? null : media,
      isPublic: visibility,
    };

    try {
      const response = await createRoom(request);
      setIsLoading(false);
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

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4 text-white p-4"
      >
        <h2 className="text-3xl font-bold text-center">Create Room</h2>

        <label className="w-full text-neutral-300 text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700
                     rounded-xl px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-neutral-500"
        />
        <FieldError errors={fieldErrors} name="title" />

        <label className="w-full text-neutral-300 text-sm">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700
                     rounded-xl px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-neutral-500"
        >
          <option value="Movies">Movies</option>
          <option value="Series">Series</option>
          <option value="Music">Music</option>
          <option value="Anime">Anime</option>
          <option value="Videos">Videos</option>
          <option value="Sports">Sports</option>
        </select>
        <FieldError errors={fieldErrors} name="category" />

        <label className="w-full text-neutral-300 text-sm">Provider</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700
                     rounded-xl px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-neutral-500"
        >
          <option value="youtube">YouTube</option>
          <option value="local">Local</option>
        </select>

        {provider === "youtube" ? (
          <>
            <label className="w-full text-neutral-300 text-sm">
              YouTube Link
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-neutral-800 border border-neutral-700
                         rounded-xl px-4 py-2 focus:outline-none
                         focus:ring-2 focus:ring-neutral-500"
            />
            <FieldError errors={fieldErrors} name="videoUrl" />
          </>
        ) : (
          <>
            <p className="text-neutral-400 text-sm w-full">
              Choose Local Media
            </p>
            <div
              className="max-h-60 overflow-y-auto bg-neutral-800
                            border border-neutral-700 rounded-xl p-2 w-full"
            >
              <MediaSelector media={media} setMedia={setMedia} />
            </div>
          </>
        )}
        <FieldError errors={fieldErrors} name="provider" />
        <FieldError errors={fieldErrors} name="media" />

        <label className="w-full text-neutral-300 text-sm">Visibility</label>

        <div className="flex gap-8 mt-1 w-full justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="true"
              checked={visibility === true}
              onChange={() => setVisibility(true)}
              className="cursor-pointer"
            />
            Public
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="false"
              checked={visibility === false}
              onChange={() => setVisibility(false)}
              className="cursor-pointer"
            />
            Private
          </label>
        </div>

        <FieldError errors={fieldErrors} name="isPublic" />

        {generalError && (
          <p className="text-red-500 text-center font-semibold">
            {generalError}
          </p>
        )}

        {isLoading ? (
          <button
            disabled
            className="w-full mt-2 py-2 flex justify-center items-center gap-2
                       rounded-xl bg-neutral-700 hover:bg-neutral-600
                       transition-all font-semibold cursor-pointer"
          >
            Loading
            <div className="animate-spin">
              <Icon icon={CgSpinnerTwo} />
            </div>
          </button>
        ) : (
          <button
            type="submit"
            className="w-full mt-2 py-2 rounded-xl bg-neutral-700
                       hover:bg-neutral-600 transition-all font-semibold
                       cursor-pointer"
          >
            Create Room
          </button>
        )}
      </form>
    </FormContainer>
  );
}
