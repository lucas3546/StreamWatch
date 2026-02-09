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
import { useEffect, useState, type RefObject } from "react";
import { useRoomStore } from "../../stores/roomStore";
import randomInteger from "../../utils/mathExtensions";

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
  const playerKey = useRoomStore((state) => state.playerKey);
  const setPlayerKey = useRoomStore((state) => state.setPlayerKey);
  const setLiveButtonStatus = useRoomStore((state) => state.setLiveButton);
  const isLeader = useRoomStore((state) => state.isLeader);

  useEffect(() => {
    const mediaElement = player.current?.el; 

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
  }, [playerKey, roomState.videoUrl]);

useEffect(() => {
  if (!player.current) return;

  let stallTimeout: NodeJS.Timeout | null = null;

  const dispose = player.current.subscribe(() => {
    const { waiting, currentTime } = player.current!.state;
    
    if (waiting && currentTime > 0 && !stallTimeout) {
      stallTimeout = setTimeout(() => {
        setLiveButtonStatus("sync");
        const random = randomInteger(1, 200);
        setPlayerKey(playerKey + random.toString());
        
        
        
      }, 4000); 
    }

    if (!waiting && stallTimeout) {
      clearTimeout(stallTimeout);
      stallTimeout = null;

    }
  });

  return () => {
    dispose?.();
    if (stallTimeout) clearTimeout(stallTimeout);
  };
}, []);





  {
    /*
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
  */
  }
  const hideControls = () => {
    player.current?.controls.hide();
  };

  const onCanPlay = () => {
    if(roomState.isPaused){
      player.current?.pause();
      return;
    }
    player.current?.play();

  }

  return (
    <MediaPlayer
      muted
      key={playerKey}
      src={roomState.videoUrl}
      ref={player}
      onSeeked={onSeeked}
      onPlay={onPlay}
      onPause={onPause}
      onError={onError}
      onEnded={onEnded}
      onMouseLeave={hideControls}
      onTextTrackChange={() => console.log(player.current?.state.textTrack)}
      className="h-full w-full object-contain"
      onCanPlay={onCanPlay}
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
      {/*
      <Track
        src="https://pub-3d64bc11ad674a4e92d65803df99fd7e.r2.dev/alteredstatesubtitles.srt"
        kind="subtitles"
        label="English"
        lang="en-US"
        type="srt"
        default
      />
      */}
      <DefaultAudioLayout icons={defaultLayoutIcons} />
      <VideoLayout playerRef={player}></VideoLayout>
      
    </MediaPlayer>
  );
}
