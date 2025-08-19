import Button from "../../buttons/Button";
import Icon from "../../icon/Icon";
import { TbZoom } from "react-icons/tb";

export default function SearchBar() {
  return (
    <div className="min-h-7 w-full border-white border-1 rounded-lg flex flex-row">
      <input type="text" className="pl-2 w-full"></input>
      <button className="hover:bg-gray-800 rounded-r-lg ">
        <Icon icon={TbZoom}></Icon>
      </button>
    </div>
  );
}
