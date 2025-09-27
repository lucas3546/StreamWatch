import { useRoomStore } from "../../stores/roomStore";
import PlaylistModal from "../modals/Playlist/PlaylistModal";

export default function RoomBottomBar() {
  const isLeader = useRoomStore((state) => state.isLeader);
  return (
    <div className="flex flex-row  bg-black border-defaultbordercolor h-full w-full ">
      <PlaylistModal></PlaylistModal>
      <p className="bg-blue-700">{isLeader}</p>
    </div>
  );
}
