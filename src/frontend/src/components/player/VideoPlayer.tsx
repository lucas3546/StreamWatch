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
import { PUBLIC_BUCKET_URL } from "../../utils/config";

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
  let videoUrl = roomState.videoUrl;

  if (roomState.videoProvider.toLocaleLowerCase() == "s3") {
    videoUrl = PUBLIC_BUCKET_URL + roomState.videoUrl;
    console.log("URL___" + videoUrl);
  }

  return (
    <MediaPlayer
      src={videoUrl}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      className="w-full h-full "
    >
      <MediaProvider className="items-center justify-center" />

      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
