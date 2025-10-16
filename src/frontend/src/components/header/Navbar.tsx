import { IoIosRadio } from "react-icons/io";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import SearchBar from "./searchbar/SearchBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import NotificationMenu from "./notifications/NotificationMenu";
import { useUser } from "../../contexts/UserContext";

interface NavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const navigate = useNavigate();
  const { user } = useUser();

  const createRoomButtonClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (user) {
      navigate("rooms/create");
    } else {
      navigate("login");
    }
  };

  return (
    <div className="bg-basecolor min-h-14 w-full flex justify-between items-center border-defaultbordercolor border-b-1 shadow-md">
      <div className="ml-4 gap-2 w-full flex flex-row items-center">
        <button onClick={() => setSidebarOpen((prev) => !prev)}>
          <Icon icon={GiHamburgerMenu} />
        </button>
        <Link to="/home" className="text-2xl">
          StreamWatch
        </Link>
      </div>
      <div className="w-2/3">
        <SearchBar></SearchBar>
      </div>
      <div className=" w-full flex flex-row items-center justify-end">
        {user && <NotificationMenu></NotificationMenu>}

        <Button
          onClick={createRoomButtonClicked}
          className="bg-semibackground flex flex-row gap-1 text-shadow-md hover:bg-gray-700 cursor-pointer mr-1"
        >
          <Icon icon={IoIosRadio}></Icon>Create
        </Button>
      </div>
    </div>
  );
}
