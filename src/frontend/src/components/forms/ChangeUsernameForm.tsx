import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";
import Icon from "../icon/Icon";
import { z } from "zod";
import {
  changeUsername,
  refreshToken,
  type ChangeUsernameRequest,
} from "../../services/accountService";
import {
  generatePromiseToast,
  generateZodErrorsToast,
} from "../../utils/toastGenerator";

export default function ChangeUsernameForm() {
  const { user, setAccountUser } = useUser();
  const [value, setValue] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const UsernameSchema = z
    .string()
    .min(5, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleReset = () => {
    setValue(user?.name ?? "");
    setShowButtons(false);
  };

  useEffect(() => {
    if (user) {
      setValue(user.name);
      setShowButtons(false);
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const result = UsernameSchema.safeParse(value);
      if (!result.success) {
        generateZodErrorsToast(result.error);
        return;
      }

      const request: ChangeUsernameRequest = { newUsername: value };

      await generatePromiseToast(
        changeUsername(request),
        "Success, the update may take a little while to appear.",
      );

      const tokenResponse = await refreshToken();
      setAccountUser(tokenResponse.token);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setShowButtons(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-neutral-300">Change Username</label>

      <div className="w-full flex flex-row items-center gap-2">
        <input
          type="text"
          placeholder={user?.name}
          value={value}
          onChange={handleChange}
          disabled={!showButtons}
          className={`
            bg-neutral-800 text-neutral-100
            border border-neutral-700
            rounded-xl px-3 py-2 transition
            focus:ring-2 focus:ring-neutral-500 focus:outline-none w-full
            ${!showButtons ? "opacity-30 cursor-default" : ""}
          `}
        />

        {showButtons ? (
          <>
            {/* RESET BUTTON */}
            <button
              onClick={handleReset}
              className="
                w-10 h-10 flex items-center justify-center
                bg-neutral-800 border border-neutral-700
                rounded-xl hover:bg-neutral-700 transition
                text-neutral-200
                cursor-pointer
              "
            >
              <Icon icon={IoMdClose} />
            </button>

            {/* SAVE / LOADING */}
            {isLoading ? (
              <button
                disabled
                className="
                  w-10 h-10 flex items-center justify-center
                  bg-neutral-800 border border-neutral-700
                  rounded-xl opacity-70

                "
              >
                <div className="animate-spin">
                  <Icon icon={CgSpinnerTwo} />
                </div>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="
                  w-10 h-10 flex items-center justify-center
                  bg-neutral-800 border border-neutral-700
                  rounded-xl hover:bg-neutral-700 transition
                  text-neutral-200
                  cursor-pointer
                "
              >
                <Icon icon={FaSave} />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="
              w-10 h-10 flex items-center justify-center
              bg-neutral-800 border border-neutral-700
              rounded-xl hover:bg-neutral-700 transition
              text-neutral-200
              cursor-pointer
            "
          >
            <Icon icon={MdEdit} />
          </button>
        )}
      </div>
    </div>
  );
}
