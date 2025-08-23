interface RoomCardProps {
  thumbnail: string;
  title: string;
  provider: string;
}
export default function RoomCard({
  thumbnail,
  title,
  provider,
}: RoomCardProps) {
  return (
    <div className="bg-neutral-950 border border-gray-300 rounded-md shadow-md overflow-hidden p-2">
      {/* Imagen con aspect ratio 16:9 */}
      <div className="w-full aspect-[4/3]">
        <img
          className="w-full h-full object-cover rounded-md"
          src={thumbnail}
          alt={title}
        />
      </div>

      {/* Texto */}
      <div className="p-2">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-xs text-gray-500">{provider}</p>
      </div>
    </div>
  );
}
