import Icon from "../../../icon/Icon";
import {
  sendMessage,
  type SendMessageRequest,
} from "../../../../services/roomService";
import { useState } from "react";
import { useRoomStore } from "../../../../stores/roomStore";
import { FaRegImage } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { CgSpinnerTwo } from "react-icons/cg";

export default function RoomChatInputMessage() {
  const room = useRoomStore((state) => state.room);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const onSendMessageClicked = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const request: SendMessageRequest = {
      roomId: room?.id ?? "",
      message: inputMessage,
      image: file,
      replyToMessageId: "",
    };

    try {
      await sendMessage(request);
    } catch (e) {
      console.log(e);
      alert("An error occurred while sending the message, please try again!");
    } finally {
      setIsLoading(false);
      setInputMessage("");
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const clearPreview = () => setFile(null);

  return (
    <>
      {file && (
        <div className="mb-2 flex items-center gap-2 p-2 rounded bg-neutral-800">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-12 h-12 object-cover rounded"
          />
          <span className="text-white text-sm flex-1 truncate">
            {file.name}
          </span>
          <button
            onClick={clearPreview}
            className="p-1 rounded bg-red-600 hover:bg-red-700"
          >
            <Icon icon={IoIosCloseCircle}></Icon>
          </button>
        </div>
      )}
      <div className="flex items-center gap-1 mt-2 py-2 px-1">
        <input
          className="flex-1 rounded bg-neutral-800 text-white px-2 py-1 max-w-[65%]"
          minLength={1}
          maxLength={500}
          placeholder="Send a message.."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <label className="w-3/12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
          <Icon icon={FaRegImage} size={18} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {isLoading ? (
          <button
            disabled
            className="w-12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
          >
            <span className="animate-spin">
              <Icon icon={CgSpinnerTwo}></Icon>
            </span>
          </button>
        ) : (
          <button
            onClick={onSendMessageClicked}
            className="w-12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
          >
            <Icon icon={IoMdSend} size={18} />
          </button>
        )}
      </div>
    </>
  );
}
