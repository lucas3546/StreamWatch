import ProfilePic from "../../avatar/ProfilePic";

export interface RoomChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
}

interface RoomChatProps {
  messages: RoomChatMessage[];
}

export default function RoomChat({ messages }: RoomChatProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-1 ${msg.fromMe ? "flex-row-reverse" : "flex-row"}`}
        >
          <ProfilePic userName="Test" fileName={undefined} size={25} />
          <div
            className={`max-w-[70%] px-3 py-1 rounded-lg ${
              msg.fromMe
                ? "bg-neutral-600 text-white"
                : "bg-neutral-700 text-white"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
