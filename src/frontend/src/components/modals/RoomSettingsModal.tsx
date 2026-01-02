import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { CiSettings } from "react-icons/ci";
import { useEffect, useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaSave } from "react-icons/fa";
import { updateRoom, type UpdateRoomRequest } from "../../services/roomService";
import { useRoomStore } from "../../stores/roomStore";
import { categories } from "../types/CategoryType";
import { updateRoomSchema } from "../schemas/updateRoomSchema";
import { FieldError } from "../errors/FieldError";
import { mapZodErrors } from "../../utils/zodExtensions";
import type { ProblemDetails } from "../types/ProblemDetails";
import { generateSuccessToast } from "../../utils/toastGenerator";

export default function RoomSettingsModal() {
  const room = useRoomStore((state) => state.room);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Movies");
  const [isPublic, setIsPublic] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      console.log("cat", room.category);
      setTitle(room.title ?? "");
      setCategory(room.category ?? "Movies");
      setIsPublic(room.isPublic ?? true);
    }
  }, [room]);

  const handleSave = async () => {
    console.log("asdasd");
    if (!room?.id) return;
    const id = room.id;
    setIsLoading(true);
    setGeneralError(null);
    setFieldErrors(null);

    const result = updateRoomSchema.safeParse({
      id,
      title,
      category,
      isPublic,
    });

    console.log(result);

    if (!result.success) {
      console.log(result.error.issues);
      setFieldErrors(mapZodErrors(result.error));
      setIsLoading(false);
      return;
    }

    try {
      const request: UpdateRoomRequest = {
        id: room.id,
        title,
        category,
        isPublic,
      };

      await updateRoom(request);
      generateSuccessToast("Successful modification!");
      setIsOpen(false);
    } catch (err) {
      console.error("An error has occurred:", err);
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
    } finally {
      setIsLoading(false);
    }
  };

  const openButtonContent = (
    <>
      <Icon icon={CiSettings} />
      Settings
    </>
  );

  const footerButtons = (
    <>
      {isLoading ? (
        <button
          disabled
          className="bg-neutral-700 text-white py-2 px-3 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="animate-spin">
            <Icon icon={CgSpinnerTwo} />
          </div>
        </button>
      ) : (
        <button
          onClick={handleSave}
          className="bg-neutral-600 text-white py-2 px-3 rounded-2xl flex items-center gap-1 hover:bg-neutral-500 transition-colors cursor-pointer"
        >
          <FaSave size={18} />
          Save
        </button>
      )}
    </>
  );

  return (
    <BaseModal
      blurBackground={true}
      title="Room Settings"
      openButtonClassname="bg-neutral-700 text-sm py-1 px-3 rounded-2xl flex items-center cursor-pointer hover:bg-neutral-600 transition-colors"
      openButtonContent={openButtonContent}
      footerButtons={footerButtons}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="w-full flex flex-col text-left gap-3">
        <label className="text-gray-300 text-sm">Room title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-neutral-800 text-gray-200 hover:text-white rounded-lg px-2 py-1 transition-colors outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <FieldError errors={fieldErrors} name="title" />

        <label className="text-gray-300 text-sm">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-neutral-800 text-gray-200 hover:text-white rounded-lg px-2 py-1 transition-colors outline-none focus:ring-1 focus:ring-neutral-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <FieldError errors={fieldErrors} name="category" />

        <div className="flex flex-row gap-4 justify-center mt-2">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={isPublic === true}
              onChange={() => setIsPublic(true)}
            />
            Public
          </label>

          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={isPublic === false}
              onChange={() => setIsPublic(false)}
            />
            Private
          </label>
          <FieldError errors={fieldErrors} name="isPublic" />
        </div>
      </div>
    </BaseModal>
  );
}
