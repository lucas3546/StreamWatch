import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
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
}

export default function VideoPlayer({
  roomState,
  player,
  onSeeked,
  onPlay,
  onPause,
}: VideoPlayerProps) {
  return (
    <MediaPlayer
      key={`${roomState?.videoProvider}-${roomState?.videoUrl}`}
      src={roomState.videoUrl}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      className="w-full h-full"
    >
      <MediaProvider className="items-center justify-center" />

      <DefaultAudioLayout icons={defaultLayoutIcons} />

      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
