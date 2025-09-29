import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";
import Icon from "../icon/Icon";
import {
  changeUsername,
  type ChangeUsernameRequest,
} from "../../services/accountService";
import { toast } from "react-toastify";
export default function ChangeUsernameForm() {
  const { user } = useUser();
  const [value, setValue] = useState(user?.name);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleReset = () => {
    setValue(user?.name);
    setShowButtons(false);
  };

  const handleSave = async () => {
    if (!value) return;
    setIsLoading(true);
    const request: ChangeUsernameRequest = {
      newUsername: value,
    };

    const response = await toast.promise(changeUsername(request), {
      pending: "Promise is pending",
      success: "Promise resolved ",
      error: "Promise rejected ",
    });
    console.log("a", response);
    setIsLoading(false);
  };

  const handleEdit = () => {
    setShowButtons(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>Change Username</label>
      <div className="w-full flex flex-row items-center gap-2">
        <input
          type="text"
          placeholder={user?.name}
          value={value}
          onChange={handleChange}
          className={`bg-defaultbordercolor ${!showButtons ? "opacity-20" : ""} border-1 rounded-sm p-1`}
          disabled={!showButtons}
        ></input>
        {showButtons ? (
          <>
            <button
              onClick={handleReset}
              className="cursor-pointer bg-semibackground border-defaultbordercolor  hover:bg-neutral-700 border-1 p-1 rounded-sm"
            >
              <Icon icon={IoMdClose}></Icon>
            </button>
            {isLoading ? (
              <button
                disabled
                className="cursor-pointer  bg-semibackground border-defaultbordercolor hover:bg-neutral-700  border-1 p-1 rounded-sm"
              >
                <div className="animate-spin">
                  <Icon icon={CgSpinnerTwo}></Icon>
                </div>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700  border-1 p-1 rounded-sm"
              >
                <Icon icon={FaSave}></Icon>
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700  border-1 p-1 rounded-sm"
          >
            <Icon icon={MdEdit}></Icon>
          </button>
        )}
      </div>
    </div>
  );
}
