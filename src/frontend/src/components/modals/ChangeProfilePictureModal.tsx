import { useState } from "react";
import { ImageUpload } from "../upload/ImageUpload";
import BaseModal from "./BaseModal";

export default function ChangeProfilePicture() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const footerButtons = (
    <>
      <button className="py-2 px-3 rounded-2xl bg-neutral-500 hover:bg-neutral-400  transition-colors cursor-pointer">
        Upload
      </button>
    </>
  );
  return (
    <BaseModal
      blurBackground={true}
      openButtonClassname="p-1 bg-defaultbordercolor hover:bg-neutral-400 rounded-md cursor-pointer"
      openButtonContent={<span>Change Profile Picture</span>}
      title="Change Avatar"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      footerButtons={footerButtons}
    >
      <>
        <ImageUpload></ImageUpload>
      </>
    </BaseModal>
  );
}
