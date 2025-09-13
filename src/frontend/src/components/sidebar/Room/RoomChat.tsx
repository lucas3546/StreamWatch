import { PUBLIC_BUCKET_URL } from "../../../utils/config";
import ProfilePic from "../../avatar/ProfilePic";

export interface RoomChatMessage {
  id: string;
  userName: string;
  text: string;
  fromMe: boolean;
  image?: string | null;
  replyToMessageId?: string | null;
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
            className={`max-w-[70%] px-3 py-1 rounded-lg break-words  ${
              msg.fromMe
                ? "bg-neutral-600 text-white"
                : "bg-neutral-700 text-white"
            }`}
          >
            <span className="text-blue-400">{msg.userName}</span>
            {msg.image && (
              <img
                src={PUBLIC_BUCKET_URL + msg.image}
                className="rounded-md"
              ></img>
            )}

            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
