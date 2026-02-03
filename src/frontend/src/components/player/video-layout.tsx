import captionStyles from "./captions.module.css";
import styles from "./video-layout.module.css";

import { Captions, Controls, Gesture, MediaPlayerInstance } from "@vidstack/react";

import * as Buttons from "./buttons";
import * as Menus from "./menus";
import * as Sliders from "./sliders";
import { TimeGroup } from "./time-group";
import { useRoomStore } from "../../stores/roomStore";
import LiveBadge from "../badge/LiveBadge";
import type { RefObject } from "react";

export interface VideoLayoutProps {
  thumbnails?: string;
  playerRef: RefObject<MediaPlayerInstance | null>;
}

export function VideoLayout({ thumbnails, playerRef }: VideoLayoutProps) {
  const isLeader = useRoomStore((state) => state.isLeader);
  return (
    <>
      <Gestures />
      <Captions
        className={`${captionStyles.captions}  media-preview:opacity-0 media-controls:bottom-[85px] opacity-100 absolute inset-0 bottom-4 z-10 select-none break-words  transition-[opacity,bottom] duration-300`}
      />
      <Controls.Root
        className="absolute inset-0 z-10 flex flex-col
          opacity-0 transition-opacity
          data-[visible]:opacity-100"
      >
        <div className="bg-neutral-900 mt-auto">
          {isLeader && (
            <Controls.Group className="md:hidden w-[95%] items-center px-2">
              <Sliders.Time thumbnails={thumbnails} />
            </Controls.Group>
          )}

          <Controls.Group className="flex w-full items-center px-2 ">
            {(isLeader && <Buttons.Play tooltipPlacement="top start" />) || (
              <LiveBadge />
            )}

            <Buttons.Mute tooltipPlacement="top" />
            <Sliders.Volume />
            <TimeGroup />
            {isLeader && (
              <Controls.Group className="hidden md:flex w-full items-center  px-2 ">
                <Sliders.Time thumbnails={thumbnails} />
              </Controls.Group>
            )}
            <div className="flex-1"></div>
            {/*
            <Buttons.Caption tooltipPlacement="top" />
             */}
            <Menus.Settings placement="top end" tooltipPlacement="top" />
            {/* <Buttons.PIP tooltipPlacement="top" /> */}

            <Buttons.Fullscreen tooltipPlacement="top end" />
          </Controls.Group>
        </div>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className="absolute left-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute right-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:10"
      />
    </>
  );
}
