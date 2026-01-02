import { useRoomStore } from "../../stores/roomStore";

export default function LiveBadge() {
  const liveStatus = useRoomStore((state) => state.liveButtonAlive);
  const setLiveButtonStatus = useRoomStore((state) => state.setLiveButton);

  const styles = {
    live: {
      container: "bg-red-500/10 text-red-400 border-red-500/30",
      dot: "bg-red-500 animate-pulse",
      label: "Live",
    },
    sync: {
      container: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      dot: "bg-yellow-400 animate-ping",
      label: "Syncing",
    },
    offline: {
      container: "bg-gray-700/20 text-gray-400 border-gray-500/30",
      dot: "bg-gray-500",
      label: "Offline",
    },
  }[liveStatus];

  return (
    <div
      onClick={() => setLiveButtonStatus("sync")}
      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
        backdrop-blur-sm select-none border cursor-pointer ${styles.container}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {styles.label}
    </div>
  );
}
