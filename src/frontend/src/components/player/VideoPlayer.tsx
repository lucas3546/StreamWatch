import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "./player.css";
import { VideoLayout } from "./video-layout";

export default function VideoPlayer() {
  return (
    <MediaPlayer
      src="https://youtu.be/gkv65PUD0fI?si=ZiXKq56pDvBfYVKX"
      className="h-full w-full"
    >
      <MediaProvider />
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <VideoLayout></VideoLayout>
    </MediaPlayer>
  );
}
