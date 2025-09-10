import type { SetStateAction } from "react";
import { create } from "zustand";

interface UiStore {
  isSidebarOpen: boolean;
  setSidebarOpen: (value: SetStateAction<boolean>) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen:
    typeof window !== "undefined" && window.innerWidth < 768 ? false : true,

  setSidebarOpen: (value) =>
    set((state) => ({
      isSidebarOpen:
        typeof value === "function"
          ? (value as (prev: boolean) => boolean)(state.isSidebarOpen)
          : value,
    })),
}));
