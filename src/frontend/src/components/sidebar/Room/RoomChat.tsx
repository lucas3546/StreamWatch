import { useState } from "react";
import { useRoomStore } from "../../../stores/roomStore";
import RoomChatInputMessage from "./Chat/RoomChatInputMessage";
import type { SelectedMessageType } from "../../types/SelectedMessageType";
import RoomChatMessage from "./Chat/RoomChatMessage";

export default function RoomChat() {
  const chatMessages = useRoomStore((state) => state.chatMessages);
  const [selectedMessage, setSelectedMessage] = useState<SelectedMessageType>();

  const onSelectMessage = (id: string, userName: string, content: string) => {
    const obj: SelectedMessageType = {
      id: id,
      userName: userName,
      content: content,
    };

    setSelectedMessage(obj);
  };

  return (
    <>
      <div className="overflow-y-auto p-4 pb-20 min-h-0 h-full">
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {chatMessages.map((msg) => (
            <RoomChatMessage
              msg={msg}
              onSelectedMessage={onSelectMessage}
            ></RoomChatMessage>
          ))}
        </div>
      </div>
      <RoomChatInputMessage
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
      ></RoomChatInputMessage>
    </>
  );
}
