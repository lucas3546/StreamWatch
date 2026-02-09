import { useEffect, useRef, type RefObject } from "react";
import { useSignalR } from "./useSignalR";
import type {
  MediaErrorDetail,
  MediaPauseEvent,
  MediaPlayerInstance,
  MediaSeekedEvent,
} from "@vidstack/react";
import { useRoomStore } from "../stores/roomStore";
import {
  roomRealtimeService,
  type ChangeVideoFromPlaylistItemType,
} from "../services/roomRealtimeService";
import randomInteger from "../utils/mathExtensions";

interface UpdateVideoStateRequest {
  roomId: string;
  currentTimestamp: number;
  sentAt: number;
  isPaused: boolean;
}

export function useVideoSync(playerRef: RefObject<MediaPlayerInstance | null>) {
  const { connection } = useSignalR();
  const playlistItems = useRoomStore((state) => state.playlistItems);
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const setPlayerKey = useRoomStore((state) => state.setPlayerKey);
  const isLeader = useRoomStore((state) => state.isLeader);
  const setLiveButtonAlive = useRoomStore((state) => state.setLiveButton);
  const liveButtonAlive = useRoomStore((state) => state.liveButtonAlive);
  const firstTime = useRef<boolean>(true);

    useEffect(() => {
      if (!firstTime || !playerRef.current) return;

      if(isLeader){
        playerRef.current.currentTime = room?.currentVideoTime ?? 0;
        return;
      }


      if (!connection || !room || isLeader) return;

      setLiveButtonAlive("sync");

      const service = roomRealtimeService(connection);

      service.requestTimestampToOwner(room.id);

      firstTime.current = false;
    }, [room, playerRef, connection, isLeader]);

    


  useEffect(() => {
    if (!connection) return;

    const handler = (
      videoTimestamp: number,
      sentAt: number,
      isPaused: boolean,
    ) => {
      console.log("RoomVideoStateUpdated", {
        videoTimestamp,
        sentAt,
        isPaused,
      });
      console.log("isLeader at event time:", isLeader);

      if (isLeader) {
        return;
      }

      if (playerRef.current === null) return;

      setLiveButtonAlive("live");

      playerRef.current.currentTime = videoTimestamp;

      if (playerRef.current.paused !== isPaused) {
        if (isPaused) {
          playerRef.current.pause();
        } else {
          playerRef.current.play();
        }
      }
    };

    connection.on("RoomVideoStateUpdated", handler);

    return () => {
      connection.off("RoomVideoStateUpdated", handler);
    };
  }, [connection, isLeader, playerRef]);

  useEffect(() => {
    if (!connection) return;

    const handler = (playlistItemId: string) => {
      const item = playlistItems.find((x) => x.id === playlistItemId);
      if (!item) return;
      console.log("videochanged from playlist");
      setRoom({
        ...room!,
        videoUrl: item.videoUrl,
        thumbnailUrl: item.thumbnailUrl,
        videoProvider: item.provider,
        playlistVideoItems: playlistItems,
      });
    };

    connection.on("OnVideoChangedFromPlaylistItem", handler);

    return () => {
      connection.off("OnVideoChangedFromPlaylistItem", handler);
    };
  }, [connection, isLeader, playlistItems, room]);

  useEffect(() => {
    if (!connection) return;

    const handler = async () => {
      try {
        if (!isLeader) return;
        console.log("Sending refresh video state");
        
        await sendUpdateVideoState();
      } catch (err) {
        console.error("Error al actualizar estado de video:", err);
      }
    };

    connection.on("RefreshVideoState", handler);

    return () => {
      connection.off("RefreshVideoState", handler);
    };
  }, [connection, isLeader]);

  useEffect(() => {
    if (!connection || !room?.id) return;

    if(room.isPaused){
      playerRef.current?.pause();
    }
    else{
      playerRef.current?.play();
    }

    const service = roomRealtimeService(connection);
    if (liveButtonAlive === "sync") {
      service.requestTimestampToOwner(room?.id);
    }
  }, [liveButtonAlive]);

  async function onSeeked(detail: number, event: MediaSeekedEvent) {
    console.log(event, "[useVideoSync:onSeeked] Seeked to", detail);
    if (isLeader) {
      await sendUpdateVideoState();
    }
  }

  async function onPlay(nativeEvent: MediaPauseEvent) {
    console.log("[useVideoSync:onPlay] Play", nativeEvent);
    if (isLeader) {
      await sendUpdateVideoState();
    }
  }

  async function onPause(nativeEvent: MediaPauseEvent) {
    console.log("[useVideoSync:onPause] Paused", nativeEvent);
    if (isLeader) {
      await sendUpdateVideoState();
    } else {
      setLiveButtonAlive("offline");
    }
  }

  async function onError(nativeEvent: MediaErrorDetail) {
    console.log("[useVideoSync:onError] Error", nativeEvent);
    alert(nativeEvent.message + ". Please change the video.");
  }

  async function onEnded() {
    console.log("Video ended");
    if (!connection || !room?.id || !isLeader || !playerRef.current) return;
    const { changeVideoFromPlaylist } = roomRealtimeService(connection);

    const mostRecentPlaylistItem = playlistItems.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
    });


    if(room.videoUrl === mostRecentPlaylistItem.videoUrl){
      const random = randomInteger(1, 200)
      setPlayerKey(room.id + random.toString());
    }


    const request: ChangeVideoFromPlaylistItemType = {
      roomId: room?.id,
      playlistItemId: mostRecentPlaylistItem.id,
    };

    console.log(request);
    await changeVideoFromPlaylist(request);
  }

  async function sendUpdateVideoState() {
    const current = playerRef.current;
    if (!current || !room?.id || !connection) return;

    const request: UpdateVideoStateRequest = {
      roomId: room?.id,
      currentTimestamp: current.currentTime,
      sentAt: Date.now(),
      isPaused: current.paused,
    };

    await connection.invoke("UpdateVideoState", request);
  }

  return { onSeeked, onPlay, onPause, onError, onEnded };
}
