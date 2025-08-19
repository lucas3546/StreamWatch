import { IoIosRadio } from "react-icons/io";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import SearchBar from "./searchbar/SearchBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdNotifications } from "react-icons/md";
export default function Navbar() {
  return (
    <div className="bg-black min-h-12 w-full flex justify-between items-center">
      <div className="ml-4 gap-2 w-full flex flex-row items-center">
        <Icon icon={GiHamburgerMenu} />
        <p className="text-2xl">StreamWatch</p>
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
