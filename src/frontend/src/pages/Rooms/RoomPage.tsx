import { useParams } from "react-router";
import RoomSidebar from "../../components/sidebar/Room/RoomSidebar";
import VideoPlayer from "../../components/player/VideoPlayer";
import { useEffect, useRef } from "react";
import { roomRealtimeService } from "../../services/roomRealtimeService";
import { useSignalR } from "../../hooks/useSignalR";
import type { MediaPlayerInstance } from "@vidstack/react";
import { useConfirmNavigation } from "../../hooks/useConfirmNavegation";
import { useUser } from "../../contexts/UserContext";
import { useVideoSync } from "../../hooks/useVideoSync";
import { useRoomStore } from "../../stores/roomStore";
import RoomBottomBar from "../../components/bottombar/RoomBottomBar";
import { RoomHubUsersHandlers } from "../../signalr/RoomHubUsersHandlers";
import { RoomHubChatHandlers } from "../../signalr/RoomHubMessagesHandlers";
import { RoomHubPlaylistHandlers } from "../../signalr/RoomHubPlaylistHandlers";
import { RoomHubGeneralHandlers } from "../../signalr/RoomHubGeneralHandlers";

export default function RoomPage() {
  const setRoom = useRoomStore((state) => state.setRoom);
  const room = useRoomStore((state) => state.room);
  const resetRoomValues = useRoomStore((state) => state.reset);
  const setRoomUsers = useRoomStore((state) => state.setRoomUsers);
  const setIsLeader = useRoomStore((state) => state.setIsLeader);
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const { connection, reloadConnection } = useSignalR();
  const player = useRef<MediaPlayerInstance>(null);
  const { onSeeked, onPlay, onPause, onError, onEnded } = useVideoSync(player);

  useConfirmNavigation(
    true,
    "Estas seguro que deseas salir de la sala?",
    () => {
      if (connection) reloadConnection();
      resetRoomValues();
    },
  );

  useEffect(() => {
    if (!connection || !roomId || !user) return;

    const service = roomRealtimeService(connection);

    const generalHandlers = new RoomHubGeneralHandlers(connection, user);
    const userHandlers = new RoomHubUsersHandlers(connection);
    const chatHandlers = new RoomHubChatHandlers(connection, user);
    const playlisHandlers = new RoomHubPlaylistHandlers(connection, user);

    //Register all
    generalHandlers.registerAll();
    userHandlers.registerAll();
    chatHandlers.registerAll();
    playlisHandlers.registerAll();

    (async () => {
      try {
        const roomData = await service.connectToRoom(roomId);

        const users = await service.getUsersFromRoom(roomId);
        setRoomUsers(users);

        if (roomData.leaderAccountId == user?.nameid) {
          setIsLeader(true);
        }

        setRoom(roomData);

        service.onReconnected((id) => console.log("Reconectado con id:", id));
        service.onReconnecting((err) =>
          console.warn("Intentando reconectar...", err),
        );
      } catch (err) {
        const eObject = err as object;
        const message = eObject.toString().split(":")[2].trim();

        if (message === "USER_ALREADY_IN_ROOM")
          alert("You are already in this room");
        else {
          alert(eObject);
        }
        window.location.href = "/";
      }
    })();

    return () => {
      generalHandlers.unregisterAll();
      userHandlers.unregisterAll();
      chatHandlers.unregisterAll();
      playlisHandlers.unregisterAll();
    };
  }, [connection, roomId, user]);
  return (
    <>
      <div className="flex w-full flex-col sm:flex-row md:flex-row h-[calc(100vh-56px)] min-h-0  overflow-hidden">
        <div className="flex-1 flex flex-col ">
          <div className="flex-1 min-h-0  overflow-hidden flex justify-center ">
            <div className="aspect-video w-full max-h-full ">
              {room && (
                <VideoPlayer
                  roomState={room}
                  player={player}
                  onSeeked={onSeeked}
                  onPlay={onPlay}
                  onPause={onPause}
                  onError={onError}
                  onEnded={onEnded}
                />
              )}
            </div>
          </div>
          {room ? (
            <div className="h-auto w-full  md:h-16 mt-auto">
              <RoomBottomBar />
            </div>
          ) : (
            <div className="h-auto md:h-16 flex items-center justify-center">
              <p>Loading room...</p>
            </div>
          )}
        </div>

        {roomId && <RoomSidebar />}
      </div>
    </>
  );
}
