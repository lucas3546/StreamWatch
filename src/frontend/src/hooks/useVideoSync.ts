import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { useSignalR } from "./useSignalR";
import type {
  MediaPauseEvent,
  MediaPlayerInstance,
  MediaSeekedEvent,
} from "@vidstack/react";
import type { RoomState } from "../components/types/RoomState";

interface UpdateVideoStateRequest {
  roomId: string;
  currentTimestamp: number;
  sentAt: number;
  isPaused: boolean;
}

export function useVideoSync(
  playerRef: RefObject<MediaPlayerInstance | null>,
  isOwner: boolean,
  room: RoomState | undefined,
  setRoom: Dispatch<SetStateAction<RoomState | undefined>>,
) {
  const { connection } = useSignalR();

  useEffect(() => {
    if (!connection || isOwner) return;

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
  }, [connection, isOwner]);

  useEffect(() => {
    if (!connection || !isOwner) return;

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
  }, [connection, isOwner, sendUpdateVideoState]);

  async function onSeeked(detail: number, event: MediaSeekedEvent) {
    console.log(event, "[useVideoSync:onSeeked] Seeked to", detail);
    if (isOwner) {
      await sendUpdateVideoState();
    }
  }

  async function onPlay(nativeEvent: MediaPauseEvent) {
    console.log("[useVideoSync:onPlay] Play", nativeEvent);
    if (isOwner) {
      await sendUpdateVideoState();
    }
  }

  async function onPause(nativeEvent: MediaPauseEvent) {
    console.log("[useVideoSync:onPause] Paused", nativeEvent);
    if (isOwner) {
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
