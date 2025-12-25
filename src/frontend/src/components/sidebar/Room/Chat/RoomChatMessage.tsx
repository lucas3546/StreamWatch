import type { RoomChatMessageType } from "../../../types/RoomMessageType";
import ProfilePic from "../../../avatar/ProfilePic";
import { getUsernameColor } from "../../../../utils/userColors";
import { useNavigate } from "react-router";
import { LiaReplySolid } from "react-icons/lia";

interface RoomChatMessageProps {
  msg: RoomChatMessageType;
  onSelectedMessage: (id: string, userName: string, text: string) => void;
}

export default function RoomChatMessage({
  msg,
  onSelectedMessage,
}: RoomChatMessageProps) {
  const navigate = useNavigate();

  const replyEl = msg.replyToMessageId
    ? document.getElementById(`msg-${msg.replyToMessageId}`)
    : null;

  const replyUser = replyEl?.getAttribute("data-user");
  const replyText = replyEl?.getAttribute("data-text");

  const onReplyClicked = () => {
    {
      const el = document.getElementById(`msg-${msg.replyToMessageId}`);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-neutral-500");

      setTimeout(() => {
        el.classList.remove("ring-2", "ring-neutral-500");
      }, 1000);
    }
  };

  return (
    <div
      id={`msg-${msg.id}`}
      key={msg.id}
      data-user={msg.userName ?? "Unknown"}
      data-text={msg.text ? msg.text.slice(0, 50) : "Message"}
      className={`flex gap-1 ${!msg.isNotification && msg.fromMe ? "flex-row-reverse" : "flex-row"}`}
    >
      {msg.isNotification ? (
        <div className="text-gray-300 text-center w-full">{msg.text}</div>
      ) : (
        <div
          className={`flex w-full gap-2 ${
            msg.fromMe ? "justify-end items-start" : "justify-start items-start"
          }`}
        >
          {!msg.fromMe && (
            <div className="flex-shrink-0">
              <ProfilePic
                userName={msg.userName}
                fileUrl={undefined}
                size={25}
              />
            </div>
          )}

          <div
            className={`max-w-[80%] px-3 py-1 text-sm rounded-lg break-words whitespace-pre-wrap overflow-hidden ${
              msg.fromMe
                ? "bg-zinc-700 text-white"
                : msg.isWhisper
                  ? "bg-neutral-800 text-white border-1 border-yellow-400 "
                  : "bg-neutral-800 text-white"
            }`}
          >
            {msg.replyToMessageId && (
              <div
                className="
                  mb-1 cursor-pointer
                  rounded-md
                  bg-neutral-900/70
                  border-l-2 border-neutral-500
                  px-2 py-1
                  text-xs
                  hover:bg-neutral-900
                  transition-colors
                "
                onClick={() => onReplyClicked()}
              >
                <p className="text-neutral-200 font-medium truncate leading-tight">
                  {replyUser ?? "Unknown"}
                </p>
                <p className="text-neutral-400 truncate leading-tight">
                  {replyText ?? "Message"}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p
                    className={`${getUsernameColor(msg.userName)} truncate max-w-[120px] ${!msg.fromMe && "cursor-pointer hover:underline"}`}
                    title={msg.userName}
                    onClick={() =>
                      !msg.fromMe && navigate(`/profile/${msg.userId}`)
                    }
                  >
                    {msg.userName}
                  </p>

                  {msg.countryCode && (
                    <img
                      src={`/flags2/${msg.countryCode.toUpperCase()}.svg`}
                      title={msg.countryName}
                      className="flex-shrink-0 w-4 h-3 object-cover"
                    />
                  )}
                </div>

                {msg.isWhisper && (
                  <p className="text-[10px] text-gray-400">whisper to you</p>
                )}
              </div>
            </div>

            {msg.image && (
              <img
                src={msg.image}
                className="rounded-md mt-1 max-w-full h-auto object-contain"
              />
            )}

            <p className="break-words whitespace-pre-wrap">{msg.text}</p>
          </div>

          {msg.fromMe && (
            <div className="flex-shrink-0">
              <ProfilePic
                userName={msg.userName}
                fileUrl={undefined}
                size={25}
              />
            </div>
          )}
          {!msg.fromMe && (
            <div
              className="self-center hover:bg-neutral-600 rounded-full p-1 cursor-pointer"
              onClick={() => onSelectedMessage(msg.id, msg.userName, msg.text)}
            >
              <LiaReplySolid size={18}></LiaReplySolid>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
