import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  TextTrack,
  Track,
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
  onEnded: () => void;
}

export default function VideoPlayer({
  roomState,
  player,
  onSeeked,
  onPlay,
  onPause,
  onError,
  onEnded,
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
        padding: "5px",
        backgroundColor: "black",
      });
    }
  }, [player, roomState.videoUrl]);

  const putTrack = () => {
    player.current?.textTracks.add({
      src: "https://pub-3d64bc11ad674a4e92d65803df99fd7e.r2.dev/alteredstatesubtitles.vtt",
      kind: "subtitles",
      label: "Spanish",
      language: "es",
      type: "vtt",
      default: true,
    });
  };

  return (
    <MediaPlayer
      key={`${roomState?.videoProvider}-${roomState?.videoUrl}`}
      src={roomState.videoUrl}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      onError={onError}
      onEnded={onEnded}
      onTextTrackChange={() => console.log(player.current?.state.textTrack)}
      className="h-full w-full object-contain"
    >
      <MediaProvider className=" w-full h-full object-contain">
        {/*
        <div
          slot="ui"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-neutral-900/80 p-3 rounded-md">
            <input
              type="text"
              placeholder="Chat..."
              className="w-40 p-1 rounded bg-neutral-800"
            />
          </div>
          </div>*/}
      </MediaProvider>
      <Track
        src="https://pub-3d64bc11ad674a4e92d65803df99fd7e.r2.dev/alteredstatesubtitles.srt"
        kind="subtitles"
        label="English"
        lang="en-US"
        type="srt"
        default
      />
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
