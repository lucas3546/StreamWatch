import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import RoomChat from "./RoomChat";
import { type RoomChatMessage } from "./RoomChat";

export default function RoomSidebar() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat");
  const [isOpen, setIsOpen] = useState(isMobile);
  const [messages, setMessages] = useState<RoomChatMessage[]>([
    { id: "1", text: "Hola!", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: true },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
    { id: "2", text: "¡Hola! ¿Cómo estás? yo bien", fromMe: false },
  ]);
  return (
    <div
      className={`h-[70%] md:h-[calc(100vh-56px)] flex flex-col bg-black border-defaultbordercolor border-l transition-all duration-300 overflow-hidden z-10
        ${isOpen ? "w-full md:w-56" : "w-0"}`}
    >
      {/* Contenido del sidebar */}
      {isOpen && (
        <>
          <div className="flex items-center border-b border-gray-700">
            {/* Botón para cerrar al lado de los tabs */}
            <button
              onClick={() => setIsOpen(false)}
              className="px-2 text-gray-400 hover:text-white"
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

          <div className="flex-1 overflow-y-auto  p-4 bg-neutral-900 text-white ">
            {activeTab === "chat" && <RoomChat messages={messages}></RoomChat>}
            {activeTab === "users" && <div>Aquí va la lista de usuarios</div>}
          </div>
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
