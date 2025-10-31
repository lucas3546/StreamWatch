import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface BaseModalProps {
  blurBackground: boolean;
  title?: string;
  openButtonContent: React.ReactNode;
  openButtonClassname: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BaseModal({
  blurBackground = false,
  title,
  openButtonClassname = "",
  openButtonContent,
  children,
  footerButtons,
  isOpen,
  setIsOpen,
}: BaseModalProps) {
  return (
    <>
      <button
        type="button"
        className={` ${openButtonClassname}`}
        onClick={() => setIsOpen(true)}
      >
        {openButtonContent}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className={`fixed inset-0 flex w-screen items-center justify-center p-4 ${blurBackground && "bg-black/50 backdrop-blur-sm"}`}
        >
          <DialogPanel className="max-w-md w-full bg-neutral-900 rounded-xl shadow-xl border border-neutral-700 p-6 text-center space-y-4">
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-sm">
              {title}
            </DialogTitle>

            {children}

            <div className="flex justify-center gap-4">
              <button
                className="bg-neutral-700 text-white py-2 px-3 rounded-2xl hover:bg-neutral-600 transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
              {footerButtons}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
