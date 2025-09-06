import { useEffect, useRef } from "react";

export interface RoomChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
}

interface RoomChatProps {
  messages: RoomChatMessage[];
}

export default function RoomChat({ messages }: RoomChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia el último mensaje
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto  flex flex-col gap-2"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[70%] px-3 py-1 rounded-lg ${
            msg.fromMe
              ? "bg-neutral-600 text-white self-end"
              : "bg-neutral-700 text-white self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
