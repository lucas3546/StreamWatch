import { useRoomStore } from "../../stores/roomStore";

export default function RoomHeaderBar() {
  const room = useRoomStore((state) => state.room);

  return (
    <div className="flex flex-row  items-center  gap-2  bg-black border-defaultbordercolor h-full w-full">
      {room?.title}
      {/*
      <div className="flex flex-col gap-1">
        <p className="hidden md:flex truncate font-mono">
          Room title: {room?.title}
        </p>
        <p className="hidden md:flex truncate font-mono">
          Playing: {room?.playlistVideoItems[0].videoTitle}
        </p>
      </div>
      */}
    </div>
  );
}
