import SidebarItemLink from "./SidebarItemlink";
import { LuCircle } from "react-icons/lu";

export default function SidebarCategoriesItems() {
  return (
    <>
      <SidebarItemLink
        icon={LuCircle}
        label="Movies"
        href="categories/movies"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Series"
        href="categories/series"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Music"
        href="categories/music"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Anime"
        href="categories/anime"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Videos"
        href="categories/videos"
        iconSize={18}
      ></SidebarItemLink>
      <SidebarItemLink
        icon={LuCircle}
        label="Sports"
        href="categories/sports"
        iconSize={18}
      ></SidebarItemLink>
    </>
  );
}
