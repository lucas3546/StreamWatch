import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import BaseModal from "./BaseModal";
import { useState } from "react";

export default function LogoutModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { logout } = useUser();
  const onClickLogout = () => {
    logout();
    navigate("/home");
  };

  const footerButtons = (
    <button
      className="bg-red-800 py-2 px-3 rounded-2xl  hover:bg-red-600 cursor-pointer"
      onClick={onClickLogout}
    >
      Logout
    </button>
  );

  return (
    <BaseModal
      title="Logout"
      blurBackground={true}
      openButtonClassname="bg-neutral-800 p-2 rounded-md hover:bg-neutral-600 cursor-pointer"
      openButtonContent={<span>Logout</span>}
      footerButtons={footerButtons}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <>
        <h2 className="text-lg">Are you sure you want to log out?</h2>
      </>
    </BaseModal>
  );
}
