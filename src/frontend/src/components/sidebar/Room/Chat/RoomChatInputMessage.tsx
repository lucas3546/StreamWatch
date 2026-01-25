import Icon from "../../../icon/Icon";
import {
  sendMessage,
  type SendMessageRequest,
} from "../../../../services/roomService";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRoomStore } from "../../../../stores/roomStore";
import { FaRegImage } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { CgSpinnerTwo } from "react-icons/cg";

import type { SelectedMessageType } from "../../../types/SelectedMessageType";
import { LiaReplySolid } from "react-icons/lia";
import { sendRoomMessageSchema } from "../../../schemas/sendRoomMessageSchema";
import ProfilePic from "../../../avatar/ProfilePic";
import type { BasicUserRoomModel } from "../../../types/BasicUserRoomModel";
import { useUser } from "../../../../contexts/UserContext";
import type { RoomChatMessageType } from "../../../types/RoomMessageType";
import type { ProblemDetails } from "../../../types/ProblemDetails";

interface RoomChatInputMessageProps {
  selectedMessage: SelectedMessageType | undefined;
  setSelectedMessage: Dispatch<SetStateAction<SelectedMessageType | undefined>>;
}

export default function RoomChatInputMessage({
  selectedMessage,
  setSelectedMessage,
}: RoomChatInputMessageProps) {
  const room = useRoomStore((state) => state.room);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [errors, setErrors] = useState<string | undefined>();
  const connectedUsers = useRoomStore((state) => state.roomUsers);
  const addChatMessage = useRoomStore((state) => state.addChatMessage);
  const [whisperSuggestions, setWhisperSuggestions] = useState<
    BasicUserRoomModel[]
  >([]);

  const onSendMessageClicked = async () => {
    setIsLoading(true);
    setErrors(undefined);
    if (!room?.id) return;
    const result = sendRoomMessageSchema.safeParse({
      roomId: room?.id,
      message: inputMessage,
      replyToMessageId: selectedMessage?.id,
    });
    if (!result.success) {
      console.log(result.error.issues);
      const flattened = result.error.issues
        .map((e) => "- " + e.message)
        .join("\n");
      setErrors(flattened);
      setIsLoading(false);
      return;
    }

    const request: SendMessageRequest = {
      roomId: room.id ?? "",
      message: inputMessage,
      image: file,
      replyToMessageId: selectedMessage?.id ?? "",
    };

    try {
      await sendMessage(request);

      if (inputMessage.startsWith("/wh")) {
        const parts = inputMessage.split(" ");

        const message: RoomChatMessageType = {
          id: Date.now().toString(),
          userName: user?.name ?? "",
          userId: user?.nameid ?? "",
          text: parts[2],
          fromMe: true,
          isWhisper: true,
          countryCode: "",
          countryName: "",
          isNotification: false,
        };
        addChatMessage(message);
      }
    } catch (e) {
      const problemDetails = e as ProblemDetails;
      if(problemDetails){
        setErrors(problemDetails.detail);
      }
      else{
        setErrors(
        "An error occurred while sending the message, please try again!",
      );
      }
      
    } finally {
      setIsLoading(false);
      setInputMessage("");
      setSelectedMessage(undefined);
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && inputMessage.trim()) {
      e.preventDefault();
      onSendMessageClicked();
    }
  };

  useEffect(() => {
    if (!inputMessage.startsWith("/wh ")) {
      setWhisperSuggestions([]);
      return;
    }

    const query = inputMessage.replace("/wh ", "").split(" ")[0].toLowerCase();

    const filtered = connectedUsers.filter((u) => {
      if (u.userName === user?.name) return false;

      if (!query) return true;

      return u.userName.toLowerCase().startsWith(query);
    });

    setWhisperSuggestions(filtered.slice(0, 5));
  }, [inputMessage, connectedUsers, user?.name]);

  const onWhisperUserSelected = (userName: string) => {
    setInputMessage((prev) => {
      if (!prev.startsWith("/wh ")) return prev;

      const parts = prev.split(" ");

      if (parts.length === 1) {
        return `/wh ${userName} `;
      }

      const rest = parts.slice(2).join(" ");

      return rest ? `/wh ${userName} ${rest}` : `/wh ${userName} `;
    });

    setWhisperSuggestions([]);
  };

  const clearPreview = () => setFile(null);

  return (
    <>
      {file && (
        <div className="mb-2 mx-2 flex items-center gap-2 p-1 rounded-lg bg-neutral-800 border border-defaultbordercolor">
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
            className="p-1 rounded bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            <Icon icon={IoIosCloseCircle}></Icon>
          </button>
        </div>
      )}

      {errors && (
        <div className="mb-2 mx-2 flex items-center gap-2 p-1 rounded-lg bg-neutral-800 border border-defaultbordercolor  whitespace-pre-line">
          <span className="text-red-500">{errors}</span>
          <button
            onClick={() => setErrors(undefined)}
            className="p-1 rounded bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            <Icon icon={IoIosCloseCircle} />
          </button>
        </div>
      )}

      {selectedMessage && (
        <div className="mx-2 p-1 rounded-lg bg-neutral-800 border border-defaultbordercolor">
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="">
                <Icon icon={LiaReplySolid} size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-gray-400 font-medium">
                  Reply to
                </div>
                <div className="text-sm text-white truncate max-w-[180px]">
                  <span className="font-semibold">
                    {selectedMessage.userName}:
                  </span>
                  <span className="text-gray-300 truncate">
                    {selectedMessage.content}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedMessage(undefined)}
              className="p-1 rounded bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Icon icon={IoIosCloseCircle} />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-1 mt-2 py-2 px-1 relative">
        <div className="relative flex-1 max-w-[65%]">
          {whisperSuggestions.length > 0 && (
            <div className="absolute bottom-full mb-1 w-full bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50">
              {whisperSuggestions.map((usr) => (
                <div
                  key={usr.userId}
                  onClick={() => onWhisperUserSelected(usr.userName)}
                  className="px-2 py-1 text-sm text-white hover:bg-neutral-700 cursor-pointer flex items-center gap-2"
                >
                  <ProfilePic
                    userName={usr.userName}
                    fileUrl={usr.profilePic}
                  ></ProfilePic>
                  <span className="truncate">{usr.userName}</span>
                </div>
              ))}
            </div>
          )}

          <input
            className="w-full rounded bg-neutral-800 text-white px-2 py-1"
            minLength={1}
            maxLength={500}
            placeholder="Send a message.."
            onKeyDown={handleKeyEnter}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
        </div>

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
