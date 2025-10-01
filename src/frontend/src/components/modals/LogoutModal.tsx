import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router";

export default function LogoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUser();
  const onClickLogout = () => {
    logout();
    navigate("/home");
  };
  return (
    <>
      <button
        className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-600 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Logout
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 ">
          <DialogPanel className="max-w-full space-y-4 border-1 border-defaultbordercolor bg-basecolor p-5 text-center">
            <DialogTitle className="font-bold">Log out</DialogTitle>
            <Description>Are you sure you want to log out?</Description>
            <div className="flex gap-4">
              <button
                className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-600 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-red-800 p-2 rounded-md hover:bg-red-600 cursor-pointer"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
