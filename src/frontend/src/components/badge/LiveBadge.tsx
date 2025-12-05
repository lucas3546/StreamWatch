export default function LiveBadge() {
  return (
    <div
      className="flex items-center gap-1.5
                    bg-red-500/10 text-red-400
                    border border-red-500/30
                    px-2 py-0.5
                    rounded-full text-xs font-medium
                    backdrop-blur-sm select-none"
    >
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      Live
    </div>
  );
}
