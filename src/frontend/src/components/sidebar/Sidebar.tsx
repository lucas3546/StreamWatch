import type { Dispatch, SetStateAction } from "react";
import { BiSolidCategory, BiSolidHome, BiTrendingUp } from "react-icons/bi";
import SidebarItemLink from "./SidebarItemlink";
import SidebarDropdown from "./SidebarDropdown";
import SidebarCategoriesItems from "./SidebarCategoriesItems";
import { AiFillSetting } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { VscBlank } from "react-icons/vsc";
import { IoIosFlag } from "react-icons/io";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { GoLaw } from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { MdLock } from "react-icons/md";
interface SidebarProps {
  sidebarIsOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  sidebarIsOpen,
  setSidebarOpen,
}: SidebarProps) {
  const { user } = useUser();
  const navigate = useNavigate();
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
              transition-normal duration-50 overflow-y-auto z-50
              fixed top-0 left-0 md:static md:top-auto md:left-auto items-center
              ${sidebarIsOpen ? "w-56" : "w-0"}
            `}
      >
        <h1
          className="text-3xl md:hidden m-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          StreamWatch
        </h1>
        <div className="w-full">
          <SidebarItemLink
            icon={BiSolidHome}
            label="Home"
            href="/home"
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
        {user && (
          <>
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
          </>
        )}
        {(user?.role == "Admin" || user?.role == "Mod") && (
          <SidebarItemLink
            icon={IoIosFlag}
            label="Reports"
            href="/reports"
          ></SidebarItemLink>
        )}
        <div className="mt-auto w-full border-t-1 border-t-defaultbordercolor">
          
          {user ? (
            <>
            {/* 
              <SidebarItemLink
                icon={AiFillSetting}
                label="Settings"
                href="/settings"
              ></SidebarItemLink>
              */}
              <SidebarItemLink
                icon={RxAvatar}
                thumbnailUrl={user.picture}
                userName={user.name}
                label="Account"
                href="/account"
              ></SidebarItemLink>
              
            </>
          ) : (
            <>
              <SidebarItemLink
                icon={MdLock}
                label="Auth"
                href="/login"
              ></SidebarItemLink>
            </>
          )}
          <SidebarItemLink
                icon={MdOutlinePrivacyTip}
                label="Privacy"
                href="/privacy-policy"
              ></SidebarItemLink>
              <SidebarItemLink
                icon={GoLaw}
                label="Terms (T&C)"
                href="/terms-and-conditions"
              ></SidebarItemLink>
        </div>
      </aside>
    </>
  );
}
