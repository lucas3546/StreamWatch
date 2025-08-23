import SidebarItemLink from "./SidebarItemlink";
import { LuCircle } from "react-icons/lu";

export default function SidebarCategoriesItems() {
  return (
    <>
      <SidebarItemLink
        icon={LuCircle}
        label="Movies"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Series"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Music"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Anime"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Videos"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Podcasts"
        href="trends"
        iconSize={18}
      ></SidebarItemLink>
    </>
  );
}
