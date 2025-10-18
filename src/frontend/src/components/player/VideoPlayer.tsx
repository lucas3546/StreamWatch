import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  type MediaErrorDetail,
  type MediaPauseEvent,
  type MediaSeekedEvent,
} from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "./player.css";
import { VideoLayout } from "./video-layout";
import type { RoomState } from "../types/RoomState";
import { useEffect, type RefObject } from "react";

interface VideoPlayerProps {
  roomState: RoomState;
  player: RefObject<MediaPlayerInstance | null>;
  onSeeked: (detail: number, event: MediaSeekedEvent) => void;
  onPlay: (nativeEvent: MediaPauseEvent) => void;
  onPause: (nativeEvent: MediaPauseEvent) => void;
  onError: (nativeEvent: MediaErrorDetail) => void;
}

export default function VideoPlayer({
  roomState,
  player,
  onSeeked,
  onPlay,
  onPause,
  onError,
}: VideoPlayerProps) {
  useEffect(() => {
    const mediaElement = player.current?.el; // acceso al MediaPlayer real

    if (!mediaElement) return;

    const videoOrIframe = mediaElement.querySelector(
      "video, iframe",
    ) as HTMLElement | null;
    if (videoOrIframe) {
      // Aplica estilos directamente
      Object.assign(videoOrIframe.style, {
        maxWidth: "100%",
        maxHeight: "100%",
        width: "100%",
        height: "120%",
        objectFit: "contain",
        margin: "0 auto",
        display: "block",
        padding: "50px",
        backgroundColor: "black",
      });
    }
  }, [player, roomState.videoUrl]);

  const getSanitizedUrl = (url: string) => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) return url;

    const hasQuery = url.includes("?");
    const params =
      "modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3";
    return `${url}${hasQuery ? "&" : "?"}${params}`;
  };

  return (
    <MediaPlayer
      key={`${roomState?.videoProvider}-${roomState?.videoUrl}`}
      src={getSanitizedUrl(roomState.videoUrl)}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      onError={onError}
      className="h-full w-full object-contain"
    >
      <MediaProvider className=" w-full h-full object-contain" />

      <DefaultAudioLayout icons={defaultLayoutIcons} />

      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
