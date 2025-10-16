import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useSignalR } from "../../../hooks/useSignalR";
import ProfilePic from "../../avatar/ProfilePic";
import { FaRegImage } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import Icon from "../../icon/Icon";
import {
  sendMessage,
  type SendMessageRequest,
} from "../../../services/roomService";
import { getUsernameColor } from "../../../utils/userColors";
import { useRoomStore } from "../../../stores/roomStore";

export interface RoomChatMessage {
  id: string;
  userName: string;
  text: string;
  fromMe: boolean;
  countryCode: string;
  countryName: string;
  isNotification: boolean;
  image?: string | null;
  replyToMessageId?: string | null;
}

export default function RoomChat() {
  const { user } = useUser();
  const { connection } = useSignalR();
  const room = useRoomStore((state) => state.room);
  const chatMessages = useRoomStore((state) => state.chatMessages);
  const addChatMessage = useRoomStore((state) => state.addChatMessage);
  const [file, setFile] = useState<File | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!connection || !user?.name) return;

    const handler = (msg: RoomChatMessage) => {
      console.log("Received message:", msg);
      if (user?.name === msg.userName) {
        msg.fromMe = true;
      }
      addChatMessage(msg);
    };

    connection.off("ReceiveMessage");
    connection.on("ReceiveMessage", handler);

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [connection, user?.name]);

  const onSendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const request: SendMessageRequest = {
      roomId: room?.id ?? "",
      message: inputMessage,
      image: file,
      replyToMessageId: "",
    };

    await sendMessage(request);

    setInputMessage("");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const clearPreview = () => setFile(null);

  return (
    <>
      <div className="overflow-y-auto p-4 pb-20 min-h-0 h-full">
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-1 ${!msg.isNotification && msg.fromMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.isNotification ? (
                <div className="text-gray-300 text-center w-full">
                  {msg.text}
                </div>
              ) : (
                <div
                  className={`flex w-full gap-2 ${
                    msg.fromMe
                      ? "justify-end items-start"
                      : "justify-start items-start"
                  }`}
                >
                  {!msg.fromMe && (
                    <ProfilePic
                      userName={msg.userName}
                      fileUrl={undefined}
                      size={25}
                    />
                  )}

                  <div
                    className={`max-w-[80%] px-3 py-1 text-sm rounded-lg break-words whitespace-pre-wrap overflow-hidden ${
                      msg.fromMe
                        ? "bg-gray-600 text-white"
                        : "bg-neutral-700 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <p
                        className={`${getUsernameColor(msg.userName)} truncate max-w-[120px]`}
                        title={msg.userName}
                      >
                        {msg.userName}
                      </p>

                      <img
                        src={`/flags2/${msg.countryCode.toUpperCase()}.svg`}
                        title={msg.countryName}
                        className="flex-shrink-0 w-4 h-3 object-cover"
                      />
                    </div>

                    {msg.image && (
                      <img
                        src={msg.image}
                        className="rounded-md mt-1 max-w-full h-auto object-contain"
                      />
                    )}

                    <p className="break-words whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>

                  {msg.fromMe && (
                    <ProfilePic
                      userName={msg.userName}
                      fileUrl={undefined}
                      size={25}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
          className="flex-1 rounded bg-neutral-800 text-white px-2 py-1"
          placeholder="Escribe un mensaje..."
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
        <button
          onClick={onSendMessage}
          className="w-12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
        >
          <Icon icon={IoMdSend} size={18} />
        </button>
      </div>
    </>
  );
}
