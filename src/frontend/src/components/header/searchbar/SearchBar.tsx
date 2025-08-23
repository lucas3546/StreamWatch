import Icon from "../../icon/Icon";
import { TbZoom } from "react-icons/tb";

export default function SearchBar() {
  return (
    <div className="hidden md:flex min-h-7 w-full border border-white rounded-lg flex-row">
      <input type="text" className="pl-2 w-full"></input>
      <button className="hover:bg-gray-800 rounded-r-lg ">
        <Icon icon={TbZoom}></Icon>
      </button>
    </div>
  );
}
