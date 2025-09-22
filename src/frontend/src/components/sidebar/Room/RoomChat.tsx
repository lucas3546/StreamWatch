import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useSignalR } from "../../../hooks/useSignalR";
import { PUBLIC_BUCKET_URL } from "../../../utils/config";
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

export interface RoomChatProps {
  roomId: string;
}

export default function RoomChat({ roomId }: RoomChatProps) {
  const { user } = useUser();
  const { connection } = useSignalR();
  const [file, setFile] = useState<File | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<RoomChatMessage[]>([
    {
      id: "1",
      userName: "OtroUsuario",
      text: "Hola!",
      countryCode: "ar",
      countryName: "Argentina",
      isNotification: false,
      fromMe: false,
    },
    {
      id: "2",
      userName: "OtroUsuario2",
      text: "Que tal!",
      countryCode: "mx",
      countryName: "México",
      isNotification: false,
      fromMe: false,
    },
    {
      id: "3",
      userName: "OtroUsuario3",
      text: "Que tal!",
      countryCode: "cl",
      countryName: "Chile",
      isNotification: false,
      fromMe: false,
    },
    {
      id: "4",
      userName: "OtroUsuario2",
      text: "Que tal!",
      countryCode: "mx",
      countryName: "México",
      isNotification: false,
      fromMe: false,
    },
  ]);
  useEffect(() => {
    if (!connection || !user?.name) return;

    const handler = (msg: RoomChatMessage) => {
      console.log("Received message:", msg);
      if (user?.name === msg.userName) {
        msg.fromMe = true;
      }
      setMessages((prev) => [...prev, msg]);
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
      roomId: roomId,
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-1 ${!msg.isNotification && msg.fromMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.isNotification ? (
                <div className="text-gray-300 text-center w-full">
                  {msg.text}
                </div>
              ) : (
                <>
                  <ProfilePic
                    userName={msg.userName}
                    fileName={undefined}
                    size={25}
                  />
                  <div
                    className={`max-w-[70%] px-3 py-1 rounded-lg break-words ${
                      msg.fromMe
                        ? "bg-neutral-600 text-white"
                        : "bg-neutral-700 text-white"
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <p className={getUsernameColor(msg.userName)}>
                        {msg.userName}
                      </p>
                      <img
                        src={`/flags/${msg.countryCode}.png`}
                        title={msg.countryName}
                      ></img>
                    </div>
                    {msg.image && (
                      <img
                        src={PUBLIC_BUCKET_URL + msg.image}
                        className="rounded-md"
                      />
                    )}
                    {msg.text}
                  </div>
                </>
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
