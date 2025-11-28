import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { CiSettings } from "react-icons/ci";
import { useEffect, useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaSave } from "react-icons/fa";
import { updateRoom, type UpdateRoomRequest } from "../../services/roomService";
import { useRoomStore } from "../../stores/roomStore";

export default function RoomSettingsModal() {
  const room = useRoomStore((state) => state.room);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Movies");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (room) {
      console.log("cat", room.category);
      setTitle(room.title ?? "");
      setCategory(room.category ?? "Movies");
      setIsPublic(room.isPublic ?? true);
    }
  }, [room]);

  const handleSave = async () => {
    if (!room?.id) return;
    setIsLoading(true);

    try {
      const request: UpdateRoomRequest = {
        id: room.id,
        title,
        category,
        isPublic,
      };

      await updateRoom(request);
    } catch (err) {
      console.error("An error has occurred:", err);
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

        <label className="text-gray-300 text-sm">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-neutral-800 text-gray-200 hover:text-white rounded-lg px-2 py-1 transition-colors outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="Movies">Movies</option>
          <option value="Series">Series</option>
          <option value="Music">Music</option>
          <option value="Anime">Anime</option>
          <option value="Sports">Sports</option>
          <option value="Nsfw">Nsfw</option>
        </select>

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
        </div>
      </div>
    </BaseModal>
  );
}
