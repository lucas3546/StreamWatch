import { useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useSignalR } from "../../../hooks/useSignalR";
import ProfilePic from "../../avatar/ProfilePic";
import { getUsernameColor } from "../../../utils/userColors";
import { useRoomStore } from "../../../stores/roomStore";
import RoomChatInputMessage from "./Chat/RoomChatInputMessage";

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
  const chatMessages = useRoomStore((state) => state.chatMessages);

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
      <RoomChatInputMessage></RoomChatInputMessage>
    </>
  );
}
