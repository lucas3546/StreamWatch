import { IoIosRadio } from "react-icons/io";
import Icon from "../icon/Icon";
import SearchBar from "./searchbar/SearchBar";
import { GiHamburgerMenu } from "react-icons/gi";
import { type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import NotificationMenu from "./notifications/NotificationMenu";
import { useUser } from "../../contexts/UserContext";
import ReportsMenu from "./notifications/ReportsMenu";

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

    navigate("rooms/create");
  };

  return (
    <div className="bg-basecolor px-2 min-h-14 w-full flex justify-between items-center border-b border-defaultbordercolor shadow-md md:px-4">
      {/* Izquierda: menú y logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-md hover:bg-neutral-700/50 transition-colors cursor-pointer"
        >
          <Icon icon={GiHamburgerMenu} size={20} />
        </button>

        <Link
          to="/home"
          className="text-xl md:text-2xl font-semibold text-white hover:text-gray-200 transition-colors"
        >
          StreamWatch
        </Link>
      </div>

      {/* Centro: barra de búsqueda */}
      <div className="hidden md:flex md:w-2/3 md:px-3">
        <SearchBar />
      </div>

      {/* Derecha: notificaciones y crear room */}
      <div className="flex items-center gap-3">
        {(user?.role === "Admin" || user?.role === "Mod") && <ReportsMenu />}
        {user && <NotificationMenu />}

        <button
          onClick={createRoomButtonClicked}
          className="flex items-center gap-2 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-shadow shadow-sm hover:shadow-md cursor-pointer text-white font-medium"
        >
          <Icon icon={IoIosRadio} size={20} />
          <span className="text-sm">Create</span>
        </button>
      </div>
    </div>
  );
}
