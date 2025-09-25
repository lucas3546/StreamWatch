import { useParams } from "react-router";
import RoomSidebar from "../../components/sidebar/Room/RoomSidebar";
import VideoPlayer from "../../components/player/VideoPlayer";
import RoomBottomBar from "../../components/bottombar/RoomBottomBar";
import { useEffect, useRef, useState } from "react";
import { roomRealtimeService } from "../../services/roomRealtimeService";
import type { RoomState } from "../../components/types/RoomState";
import { useSignalR } from "../../hooks/useSignalR";
import type { MediaPlayerInstance } from "@vidstack/react";
import { useConfirmNavigation } from "../../hooks/useConfirmNavegation";
import { useUser } from "../../contexts/UserContext";
import { useVideoSync } from "../../hooks/useVideoSync";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomState>();
  const { user } = useUser();
  const { connection, reloadConnection } = useSignalR();
  const player = useRef<MediaPlayerInstance>(null);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const { onSeeked, onPlay, onPause } = useVideoSync(
    player,
    isLeader,
    room,
    setRoom,
  );

  useConfirmNavigation(
    true,
    "Estas seguro que deseas salir de la sala?",
    () => {
      if (connection) reloadConnection();
    },
  );

  useEffect(() => {
    if (!connection || !roomId) return;

    const service = roomRealtimeService(connection);

    (async () => {
      try {
        const roomData = await service.connectToRoom(roomId);
        setRoom(roomData);

        if (roomData.leaderAccountId == user?.nameid) {
          setIsLeader(true);
        }

        console.log("IsLeader", isLeader);
        console.log(room);

        service.onReconnected((id) => console.log("Reconectado con id:", id));

        service.onReconnecting((err) =>
          console.warn("Intentando reconectar...", err),
        );
      } catch (err) {
        console.error("❌ Error al conectar con el room:", err);
      }
    })();
  }, [connection, roomId]);

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
          <div className="h-auto md:h-16">
            <RoomBottomBar />
          </div>
        </div>

        {roomId && <RoomSidebar roomId={roomId} />}
      </div>
    </>
  );
}
