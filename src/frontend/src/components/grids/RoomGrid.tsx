import { type ReactNode } from "react";

interface RoomGridProps {
  children: ReactNode;
}

export default function RoomGrid({ children }: RoomGridProps) {
  return (
    <div className="grid gap-2 p-2 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {children}
    </div>
  );
}
