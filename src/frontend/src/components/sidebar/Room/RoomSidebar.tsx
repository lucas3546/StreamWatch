import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import RoomChat from "./RoomChat";
import { type RoomChatMessage } from "./RoomChat";
import { useSignalR } from "../../../hooks/useSignalR";
import { roomRealtimeService } from "../../../services/roomRealtimeService";
import { useUser } from "../../../contexts/UserContext";
import { FaRegImage } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import Icon from "../../icon/Icon";

export default function RoomSidebar() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat");
  const [isOpen, setIsOpen] = useState(isMobile);
  const { user } = useUser();
  const { connection } = useSignalR();
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<RoomChatMessage[]>([
    { id: "1", userName: "test", text: "Hola!", fromMe: false },
    {
      id: "2",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: true,
    },
    {
      id: "3",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "4",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "5",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "6",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "7",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "8",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "9",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: false,
    },
    {
      id: "10",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: true,
    },
    {
      id: "11",
      userName: "test",
      text: "¡Hola! ¿Cómo estás? yo bien",
      fromMe: true,
    },
  ]);

  //TO DO: Refactorize the entire responsive functionality in this component
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!connection) return;

    const service = roomRealtimeService(connection);

    service.onReceiveMessage((msg) => {
      console.log(msg);
      if (user?.name == msg.userName) {
        msg.fromMe = true;
      }
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, [connection]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const clearPreview = () => setFile(null);

  return (
    <div
      className={`flex-1 h-full md:flex-none md:h-[calc(100vh-56px)] flex flex-col bg-black border-defaultbordercolor border-l transition-all duration-300 overflow-hidden z-10
        ${isOpen ? "w-full md:w-70" : "w-0"}`}
    >
      {/* Contenido del sidebar */}
      {isOpen && (
        <>
          <div className="flex items-center border-b border-gray-700">
            {/* Botón para cerrar al lado de los tabs */}
            <button
              onClick={() => setIsOpen(false)}
              className="hidden md:block px-2 text-gray-400 hover:text-white"
            >
              <AiOutlineClose size={18} />
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === "chat"
                  ? "border-b-2 border-neutral-500 text-neutral-50-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === "users"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Users
            </button>
          </div>

          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 text-white relative overflow-hidden">
              <div className="overflow-y-auto p-4 pb-20 min-h-0">
                {/* pb-20 = espacio para el input */}
                <RoomChat messages={messages} />
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
              <div className="flex items-center gap-1 mt-2 px-1">
                <input
                  className="flex-1 rounded bg-neutral-800 text-white px-2 py-1"
                  placeholder="Escribe un mensaje..."
                />
                <label className="w-12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
                  <Icon icon={FaRegImage} size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button className="w-12 h-8 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
                  <Icon icon={IoMdSend} size={18} />
                </button>
              </div>
            </div>
          )}
          {activeTab === "users" && <div>Aquí va la lista de usuarios</div>}
        </>
      )}

      {/* Botón flotante cuando está cerrado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-15 right-4 z-50 bg-neutral-600 hover:bg-neutral-600 text-white p-2 rounded-md shadow-lg"
        >
          Open Chat
        </button>
      )}
    </div>
  );
}
