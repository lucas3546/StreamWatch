import { useState } from "react";
import Icon from "../icon/Icon";
import type { IconType } from "react-icons";

interface SidebarDropdownProps {
  icon: IconType;
  label: string;
  children?: React.ReactNode;
}

export default function SidebarDropdown({
  icon,
  label,
  children,
}: SidebarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="w-full">
      <button
        onClick={toggleMenu}
        className="w-full text-left px-2 py-2 flex flex-row gap-2 items-center
                   cursor-pointer hover:bg-gray-600 select-none"
      >
        <Icon icon={icon} />
        <span className="text-xl flex-1">{label}</span>
        <span className="text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Contenedor animado */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
                   ${isOpen ? "bg-neutral-900 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
