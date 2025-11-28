import type { IconType } from "react-icons";
import { useNavigate } from "react-router";
import Icon from "../icon/Icon";
import { useLocation } from "react-router";
import ProfilePic from "../avatar/ProfilePic";

interface SidebarItemLinkProps {
  icon: IconType;
  thumbnailUrl?: string;
  userName?: string;
  label: string;
  iconSize?: number;
  href?: string;
}

export default function SidebarItemLink({
  icon,
  thumbnailUrl,
  userName,
  label,
  iconSize = 24,
  href,
}: SidebarItemLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = href && location.pathname === href;

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
      className={`w-full text-left px-2 py-2 flex flex-row gap-2 items-center cursor-pointer select-none
              hover:bg-gray-600
              ${isActive ? "bg-neutral-800" : ""}`}
    >
      {thumbnailUrl || userName ? (
        <ProfilePic
          userName={userName}
          fileUrl={thumbnailUrl}
          size={iconSize}
        ></ProfilePic>
      ) : (
        <Icon icon={icon} size={iconSize} />
      )}

      <span className="text-xl">{label}</span>
    </button>
  );
}
