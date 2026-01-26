import { useState } from "react";
import { useRoomStore } from "../../../stores/roomStore";
import RoomChatInputMessage from "./Chat/RoomChatInputMessage";
import type { SelectedMessageType } from "../../types/SelectedMessageType";
import RoomChatMessage from "./Chat/RoomChatMessage";

export default function RoomChat() {
  const chatMessages = useRoomStore((state) => state.chatMessages);
  const isLeader = useRoomStore((state) => state.isLeader);
  const liveStatus = useRoomStore((state) => state.liveButtonAlive);
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
      <p className="text-[10px] text-gray-400 text-center">
        Type{" "}
        <span className="font-mono">/wh &lt;username&gt; &lt;message&gt;</span>{" "}
        to send a whisper.
      </p>
        {isLeader && (
          <p className=" md:hidden text-[10px] text-yellow-400/80 mt-1 text-center select-none">
              ★ You are the leader of this room ★
          </p>
        )}
        {(!isLeader && liveStatus === "offline") && <p className="md:hidden text-[10px] text-gray-300 mt-1 text-center select-none">
            Click the
            <span className="font-mono text-red-500 animate-pulse">{" <offline> "}</span>{" "}
            button to sync with the room leader.
          </p>}
      <RoomChatInputMessage
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
      ></RoomChatInputMessage>
    </>
  );
}
