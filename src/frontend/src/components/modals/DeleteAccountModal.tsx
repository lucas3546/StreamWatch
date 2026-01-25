import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import BaseModal from "./BaseModal";
import { deleteAccount } from "../../services/accountService";

export default function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { logout } = useUser();
  const onClickDeleteAccountButton = async() => {
    await deleteAccount();
    logout();
    window.location.href = "/";
  };

  const footerButtons = (
    <button
      className="bg-red-800 py-2 px-3 rounded-2xl  hover:bg-red-600 cursor-pointer"
      onClick={onClickDeleteAccountButton}
    >
      Delete Account
    </button>
  );

  return (
    <BaseModal
      title="Delete Account"
      blurBackground={true}
      openButtonClassname="w-full py-2 rounded-lg
              bg-red-900 hover:bg-red-800
              hover:text-red-400
              transition font-semibold
              text-white
              cursor-pointer"
      openButtonContent={<span>Delete Account</span>}
      footerButtons={footerButtons}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <>
        <h2 className="text-lg">Are you sure you want to delete your account? This action is irreversible</h2>
      </>
    </BaseModal>
  );
}
