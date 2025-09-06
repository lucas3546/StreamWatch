import { useParams } from "react-router";
import RoomSidebar from "../../components/sidebar/Room/RoomSidebar";
import VideoPlayer from "../../components/player/VideoPlayer";
import RoomBottomBar from "../../components/bottombar/RoomBottomBar";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  console.log(roomId);
  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] overflow-hidden">
        <div className="flex-1 flex flex-col ">
          <div className="flex-1 overflow-hidden">
            <VideoPlayer />
          </div>
          <div className="h-auto md:h-16">
            <RoomBottomBar />
          </div>
        </div>

        <RoomSidebar />
      </div>
    </>
  );
}
