import { useEffect, type RefObject } from "react";
import { useSignalR } from "./useSignalR";
import type {
  MediaPauseEvent,
  MediaPlayerInstance,
  MediaSeekedEvent,
} from "@vidstack/react";
import { useRoomStore } from "../stores/roomStore";

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
  const isLeader = useRoomStore((state) => state.isLeader);

  useEffect(() => {
    if (!connection) return;
    if (isLeader === true) return;

    connection.on(
      "RoomVideoStateUpdated",
      (videoTimestamp: number, sentAt: number, isPaused: boolean) => {
        console.log(
          "RoomVideoStateUpdated obtained",
          "videoTimestamp:" + videoTimestamp,
          "SentFromLeaderAt:",
          sentAt,
          "IsPaused:",
          isPaused,
        );
        console.log(isLeader);
        if (playerRef.current === null) return;

        const now = Date.now();
        const latency = (now - sentAt) / 1000;

        const estimatedTime = isPaused
          ? videoTimestamp
          : videoTimestamp + latency;

        const drift = estimatedTime - playerRef.current?.currentTime;
        if (Math.abs(drift) > 0.5) {
          playerRef.current.currentTime = estimatedTime;
        }

        if (playerRef.current.paused !== isPaused) {
          if (isPaused) {
            playerRef.current.pause();
          } else {
            playerRef.current.play();
          }
        }

        playerRef.current.currentTime = videoTimestamp;
      },
    );
  }, [connection, isLeader, playerRef]);

  useEffect(() => {
    if (!connection) return;

    const handler = (playlistItemId: string) => {
      const item = playlistItems.find((x) => x.id === playlistItemId);
      if (!item) return;

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
    if (!connection || !isLeader) return;

    const handler = async () => {
      try {
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
  }, [connection, isLeader, sendUpdateVideoState]);

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
    }
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

  return { onSeeked, onPlay, onPause };
}
