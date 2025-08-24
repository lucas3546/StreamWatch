import type { Dispatch, SetStateAction } from "react";
import { BiSolidCategory, BiSolidHome, BiTrendingUp } from "react-icons/bi";
import SidebarItemLink from "./SidebarItemlink";
import { TfiReload } from "react-icons/tfi";
import SidebarDropdown from "./SidebarDropdown";
import SidebarCategoriesItems from "./SidebarCategoriesItems";
import { AiFillSetting } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";

interface SidebarProps {
  sidebarIsOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  sidebarIsOpen,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {sidebarIsOpen && (
        <div
          className="fixed inset-0 bg-black opacity-45 z-40 md:hidden"
          onClick={() => setSidebarOpen((prev) => !prev)}
        />
      )}
      <aside
        className={`h-screen md:h-[calc(100vh-56px)] flex flex-col bg-black border-defaultbordercolor border-r-1
              transition-normal duration-50 overflow-hidden z-50
              fixed top-0 left-0 md:static md:top-auto md:left-auto items-center
              ${sidebarIsOpen ? "w-56" : "w-0"}
            `}
      >
        <h1 className="text-3xl md:hidden m-4">StreamWatch</h1>
        <div className="w-full">
          <SidebarItemLink
            icon={BiSolidHome}
            label="Home"
            href="/home"
          ></SidebarItemLink>
          <SidebarItemLink
            icon={TfiReload}
            label="Latest"
            href="/latest"
          ></SidebarItemLink>
          <SidebarItemLink
            icon={BiTrendingUp}
            label="Trending"
            href="trends"
          ></SidebarItemLink>
          <div className="border-t-1 border-defaultbordercolor"></div>
          <SidebarDropdown icon={BiSolidCategory} label="Categories">
            <SidebarCategoriesItems></SidebarCategoriesItems>
          </SidebarDropdown>
        </div>
        <div className="mt-auto w-full">
          <div className="border-t-1 border-defaultbordercolor"></div>
          <SidebarItemLink
            icon={AiFillSetting}
            label="Settings"
            href="/settings"
          ></SidebarItemLink>
          <SidebarItemLink
            icon={RxAvatar}
            label="Account"
            href="/account"
          ></SidebarItemLink>
        </div>
      </aside>
    </>
  );
}
