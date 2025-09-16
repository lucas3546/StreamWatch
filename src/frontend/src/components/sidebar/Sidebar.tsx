import type { Dispatch, SetStateAction } from "react";
import { BiSolidCategory, BiSolidHome, BiTrendingUp } from "react-icons/bi";
import SidebarItemLink from "./SidebarItemlink";
import { TfiReload } from "react-icons/tfi";
import SidebarDropdown from "./SidebarDropdown";
import SidebarCategoriesItems from "./SidebarCategoriesItems";
import { AiFillSetting } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { VscBlank } from "react-icons/vsc";
import { useUser } from "../../contexts/UserContext";

interface SidebarProps {
  sidebarIsOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  sidebarIsOpen,
  setSidebarOpen,
}: SidebarProps) {
  const { user } = useUser();

  return (
    <>
      {sidebarIsOpen && (
        <div
          className="fixed inset-0 bg-basecolor opacity-45 z-40 md:hidden"
          onClick={() => setSidebarOpen((prev) => !prev)}
        />
      )}
      <aside
        className={`h-screen md:h-[calc(100vh-56px)] flex flex-col bg-basecolor border-defaultbordercolor border-r-1
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
            href="/trending"
          ></SidebarItemLink>
          <div className="border-t-1 border-defaultbordercolor"></div>{" "}
          {/* Divider */}
          <SidebarDropdown icon={BiSolidCategory} label="Categories">
            <SidebarCategoriesItems></SidebarCategoriesItems>
          </SidebarDropdown>
        </div>
        {/* Divider */}
        <div className="border-t-1 border-defaultbordercolor w-full"></div>
        <SidebarItemLink
          icon={FaUserFriends}
          label="Friends"
          href="/friends"
        ></SidebarItemLink>
        <SidebarItemLink
          icon={BiSolidVideos}
          label="Storage"
          href="/storage"
        ></SidebarItemLink>
        <div className="mt-auto w-full">
          <div className="border-1 border-defaultbordercolor"></div>
          {user ? (
            <>
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
            </>
          ) : (
            <>
              <SidebarItemLink
                icon={VscBlank}
                label="Register"
                href="/register"
              ></SidebarItemLink>
              <SidebarItemLink
                icon={VscBlank}
                label="Login"
                href="/login"
              ></SidebarItemLink>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
