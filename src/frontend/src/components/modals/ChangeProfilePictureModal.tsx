import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { ImageUpload } from "../upload/ImageUpload";

export default function ChangeProfilePicture() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 bg-defaultbordercolor hover:bg-neutral-400 rounded-sm cursor-pointer"
      >
        Change Profile Picture
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full border-1 border-defaultbordercolor bg-basecolor p-5 text-center">
            <DialogTitle className="font-bold">
              Change Profile Picture
            </DialogTitle>
            <ImageUpload></ImageUpload>
            <div className="flex gap-2 mt-2 ">
              <button
                className="p-2 bg-neutral-600 hover:bg-neutral-400 rounded-sm cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className="p-2 bg-blue-600 hover:bg-blue-400  rounded-sm cursor-pointer">
                Upload
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
