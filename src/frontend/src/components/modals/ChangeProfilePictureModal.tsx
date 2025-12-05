import { useState } from "react";
import { ImageUpload } from "../upload/ImageUpload";
import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { CgSpinnerTwo } from "react-icons/cg";
import { generatePromiseToast } from "../../utils/toastGenerator";
import { refreshToken, setProfilePicture } from "../../services/accountService";
import { useUser } from "../../contexts/UserContext";

export default function ChangeProfilePicture() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setAccountUser } = useUser();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleFileSelect = (file: File) => {
    console.log("New selected file", file);
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      await generatePromiseToast(
        setProfilePicture(selectedFile),
        "Success, the update may take a little while to appear.",
      );

      const resp = await refreshToken();
      setAccountUser(resp.token);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const footerButtons = (
    <>
      {isLoading ? (
        <button className="py-2 px-3 disabled rounded-2xl bg-neutral-800 flex gap-1">
          Loading
          <div className="animate-spin">
            <Icon icon={CgSpinnerTwo}></Icon>
          </div>
        </button>
      ) : (
        <button
          onClick={uploadFile}
          className="py-2 px-3 rounded-2xl bg-neutral-600 hover:bg-neutral-400  transition-colors cursor-pointer"
        >
          Upload
        </button>
      )}
    </>
  );
  return (
    <BaseModal
      blurBackground={true}
      openButtonClassname="
        w-full
        p-2
        bg-defaultbordercolor
        hover:bg-neutral-400/80
        rounded-xl
        cursor-pointer
        transition-all
        shadow-sm
        hover:shadow
      "
      openButtonContent={<span>Change Profile Pic</span>}
      title="Change Avatar"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      footerButtons={footerButtons}
    >
      <>
        <ImageUpload onFileSelect={handleFileSelect}></ImageUpload>
      </>
    </BaseModal>
  );
}
