import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import RoomChat from "./RoomChat";

export interface RoomSidebarProps {
  roomId: string;
}

export default function RoomSidebar({ roomId }: RoomSidebarProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat");
  const [isOpen, setIsOpen] = useState(isMobile);

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

  return (
    <div
      className={`flex-1 h-full md:flex-none md:h-[calc(100vh-56px)] flex flex-col bg-black border-defaultbordercolor border-l transition-all duration-300 overflow-hidden z-10
        ${isOpen ? " md:w-70" : "w-0"}`}
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
              <RoomChat roomId={roomId} />
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
