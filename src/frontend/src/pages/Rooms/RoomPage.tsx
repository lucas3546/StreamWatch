import { useBlocker, useParams } from "react-router";
import RoomSidebar from "../../components/sidebar/Room/RoomSidebar";
import VideoPlayer from "../../components/player/VideoPlayer";
import RoomBottomBar from "../../components/bottombar/RoomBottomBar";
import { useEffect, useState } from "react";
import { roomRealtimeService } from "../../services/roomRealtimeService";
import type { RoomState } from "../../components/types/RoomState";
import { useSignalR } from "../../hooks/useSignalR";

export default function RoomPage() {
  const blocker = useBlocker(true);

  const { connection, reloadConnection } = useSignalR();
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomState>();
  console.log(roomId);

  useEffect(() => {
    if (!connection || !roomId) return;

    const service = roomRealtimeService(connection);

    (async () => {
      try {
        const roomData = await service.connectToRoom(roomId);

        setRoom(roomData);

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

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(
        `¿Estas seguro de que quieres salir de la sala?`,
      );
      if (confirmLeave) {
        if (connection) {
          reloadConnection();
        }
        blocker.proceed();
      } else blocker.reset();
    }
  }, [blocker.state, blocker.location]);

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
