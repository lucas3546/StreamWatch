import { useParams } from "react-router";
import RoomSidebar from "../../components/sidebar/Room/RoomSidebar";
import VideoPlayer from "../../components/player/VideoPlayer";
import RoomBottomBar from "../../components/bottombar/RoomBottomBar";
import { useEffect, useRef } from "react";
import { roomRealtimeService } from "../../services/roomRealtimeService";
import { useSignalR } from "../../hooks/useSignalR";
import type { MediaPlayerInstance } from "@vidstack/react";
import { useConfirmNavigation } from "../../hooks/useConfirmNavegation";
import { useUser } from "../../contexts/UserContext";
import { useVideoSync } from "../../hooks/useVideoSync";
import { useRoomStore } from "../../stores/roomStore";

export default function RoomPage() {
  const setRoom = useRoomStore((state) => state.setRoom);
  const room = useRoomStore((state) => state.room);
  const resetRoomValues = useRoomStore((state) => state.reset);
  const isLeader = useRoomStore((state) => state.isLeader);
  const setIsLeader = useRoomStore((state) => state.setIsLeader);
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const { connection, reloadConnection } = useSignalR();
  const player = useRef<MediaPlayerInstance>(null);
  const { onSeeked, onPlay, onPause } = useVideoSync(player);

  useConfirmNavigation(
    true,
    "Estas seguro que deseas salir de la sala?",
    () => {
      if (connection) reloadConnection();
      resetRoomValues();
    },
  );

  useEffect(() => {
    if (!connection || !roomId) return;

    const service = roomRealtimeService(connection);

    (async () => {
      try {
        const roomData = await service.connectToRoom(roomId);

        if (roomData.leaderAccountId == user?.nameid) {
          setIsLeader(true);
        }

        console.log("IS LEADER", isLeader);

        setRoom(roomData);
        console.log("_-______ASD_ASD_AD_SASD_", isLeader);

        service.onReconnected((id) => console.log("Reconectado con id:", id));

        service.onReconnecting((err) =>
          console.warn("Intentando reconectar...", err),
        );
      } catch (err) {
        console.error("❌ Error al conectar con el room:", err);
      }
    })();
  }, [connection, roomId, isLeader]);

  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] min-h-0  overflow-hidden">
        <div className="flex-1 flex flex-col ">
          <div className="flex-1 min-h-0  overflow-hidden flex justify-center ">
            <div className="w-full max-w-5xl max-h-full ">
              {room && (
                <VideoPlayer
                  roomState={room}
                  player={player}
                  onSeeked={onSeeked}
                  onPlay={onPlay}
                  onPause={onPause}
                />
              )}
            </div>
          </div>
          <div className="h-auto md:h-16">{room && <RoomBottomBar />}</div>
        </div>

        {roomId && <RoomSidebar />}
      </div>
    </>
  );
}
