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

import z from "zod";
import {
  generatePromiseToast,
  generateZodErrorsToast,
} from "../../utils/toastGenerator";

export const PasswordChangeSchema = z
  .object({
    password: z
      .string()
      .min(6, "Current password must be at least 6 characters")
      .max(40, "Current password is very long, max 40 characters "),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(40, "New password is very long, max 40 characters "),
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

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

    try {
      const result = PasswordChangeSchema.safeParse({
        password,
        newPassword,
      });

      if (!result.success) {
        generateZodErrorsToast(result.error);
        return;
      }

      const request: ChangePasswordRequest = {
        currentPassword: password,
        newPassword: newPassword,
      };

      await generatePromiseToast(
        changePassword(request),
        "Success, password changed.",
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setIsLoading(false);
      handleReset();
    }
  };

  const handleEdit = () => {
    setShowButtons(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-neutral-300">Change Password</label>

      <div className="w-full flex flex-row items-start gap-2">
        {/* Inputs en columna */}
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="password"
            placeholder="Current password"
            value={password}
            onChange={handlePasswordChange}
            disabled={!showButtons}
            className={`
              bg-neutral-800 text-neutral-100
              border border-neutral-700
              rounded-xl px-3 py-2 transition
              focus:ring-2 focus:ring-neutral-500 focus:outline-none
              ${!showButtons ? "opacity-30 cursor-default" : ""}
            `}
          />

          {showButtons && (
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="
                bg-neutral-800 text-neutral-100
                border border-neutral-700
                rounded-xl px-3 py-2 transition
                focus:ring-2 focus:ring-neutral-500 focus:outline-none
              "
            />
          )}
        </div>

        {/* Botones al costado */}
        <div className="flex flex-col gap-2">
          {showButtons ? (
            <>
              {/* RESET */}
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
    </div>
  );
}
