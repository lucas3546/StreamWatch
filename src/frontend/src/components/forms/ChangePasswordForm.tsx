import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";
import Icon from "../icon/Icon";
import {
  changePassword,
  type ChangePasswordRequest,
} from "../../services/accountService";
import { toast } from "react-toastify";
import type { ProblemDetails } from "../types/ProblemDetails";
export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
  };

  const handleReset = () => {
    setPassword("");
    setNewPassword("");
    setShowButtons(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const request: ChangePasswordRequest = {
      currentPassword: password,
      newPassword: newPassword,
    };

    try {
      await toast.promise(
        changePasswordAndRefreshUser(request),
        {
          pending: "Loading",
          success: "Password changed!",
          error: {
            render({ data }) {
              const problem = data as ProblemDetails;
              const formatted = problem.detail
                .split(",")
                .map((err) => `- ${err.trim()}`)
                .join("\n");
              return formatted;
            },
          },
        },
        {
          theme: "dark",
          position: "bottom-right",
          className: "whitespace-pre-line text-sm",
          style: {
            background: "rgb(26, 26, 31)",
            color: "white",
            borderRadius: "0px",
          },
        },
      );
    } finally {
      setIsLoading(false);
      handleReset();
    }
  };

  const changePasswordAndRefreshUser = async (
    request: ChangePasswordRequest,
  ) => {
    await changePassword(request);
  };

  const handleEdit = () => {
    setShowButtons(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>Change Password</label>

      <div className="w-full flex flex-row items-start gap-2">
        {/* Inputs en columna */}
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            placeholder="Current password"
            value={password}
            onChange={handlePasswordChange}
            className={`bg-defaultbordercolor ${
              !showButtons ? "opacity-20" : ""
            } border-1 rounded-sm p-1`}
            disabled={!showButtons}
          />
          {showButtons && (
            <input
              type="text"
              placeholder="New password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="bg-defaultbordercolor border-1 rounded-sm p-1"
            />
          )}
        </div>

        {/* Botones al costado */}
        <div className="flex flex-col gap-2">
          {showButtons ? (
            <>
              <button
                onClick={handleReset}
                className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700 border-1 p-1 rounded-sm"
              >
                <Icon icon={IoMdClose} />
              </button>
              {isLoading ? (
                <button
                  disabled
                  className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700 border-1 p-1 rounded-sm"
                >
                  <div className="animate-spin">
                    <Icon icon={CgSpinnerTwo} />
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700 border-1 p-1 rounded-sm"
                >
                  <Icon icon={FaSave} />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="cursor-pointer bg-semibackground border-defaultbordercolor hover:bg-neutral-700 border-1 p-1 rounded-sm"
            >
              <Icon icon={MdEdit} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
