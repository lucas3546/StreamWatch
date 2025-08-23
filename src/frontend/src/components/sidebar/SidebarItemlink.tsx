import type { IconType } from "react-icons";
import { useNavigate } from "react-router";
import Icon from "../icon/Icon";

interface SidebarItemLinkProps {
  icon: IconType;
  label: string;
  iconSize?: number;
  href?: string;
}

export default function SidebarItemLink({
  icon,
  label,
  iconSize = 24,
  href,
}: SidebarItemLinkProps) {
  const navigate = useNavigate();

  const onClickLink = (e: React.MouseEvent) => {
    e.preventDefault();

    if (href) {
      navigate(href);
    } else {
      console.log("si");
    }
  };

  return (
    <button
      onClick={onClickLink}
      className="w-full text-left px-2 py-2 flex flex-row gap-2 items-center
                 cursor-pointer hover:bg-gray-600 select-none"
    >
      <Icon icon={icon} size={iconSize} />
      <span className="text-xl">{label}</span>
    </button>
  );
}
