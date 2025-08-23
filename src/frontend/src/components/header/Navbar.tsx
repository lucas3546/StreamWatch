import { IoIosRadio } from "react-icons/io";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import SearchBar from "./searchbar/SearchBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdNotifications } from "react-icons/md";
import type { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  return (
    <div className="bg-black min-h-14 w-full flex justify-between items-center border-defaultbordercolor border-b-1">
      <div className="ml-4 gap-2 w-full flex flex-row items-center">
        <button onClick={() => setSidebarOpen((prev) => !prev)}>
          <Icon icon={GiHamburgerMenu} />
        </button>
        <h1 className="text-2xl">StreamWatch</h1>
      </div>
      <div className="w-2/3">
        <SearchBar></SearchBar>
      </div>
      <div className="mr-2 gap-2 w-full flex flex-row items-center justify-end">
        <Icon icon={MdNotifications} />
        <Button className="bg-semibackground flex flex-row gap-1 text-shadow-md hover:bg-gray-700">
          <Icon icon={IoIosRadio}></Icon>Create
        </Button>
      </div>
    </div>
  );
}
