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
import type { RefObject } from "react";

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
      src={roomState.videoUrl}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      className="h-full w-full"
    >
      <MediaProvider />
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
