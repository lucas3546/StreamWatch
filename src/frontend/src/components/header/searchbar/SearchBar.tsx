import Icon from "../../icon/Icon";
import { TbZoom } from "react-icons/tb";

export default function SearchBar() {
  return (
    <div className="hidden md:flex min-h-7 w-full border border-neutral-700 rounded-lg overflow-hidden">
      <input
        type="text"
        className="pl-3 w-full bg-neutral-900 text-white placeholder-gray-400 focus:outline-none"
        placeholder="Search..."
      />
      <button className="p-2 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer">
        <Icon icon={TbZoom} size={18} />
      </button>
    </div>
  );
}
