import * as React from "react";
import FormContainer from "../../components/forms/FormContainer";
import { ImageUpload } from "../../components/upload/ImageUpload";
import Icon from "../../components/icon/Icon";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiUpload2Fill } from "react-icons/ri";
import { useNavigate } from "react-router";
export default function ChangeAvatarPage() {
  const navigate = useNavigate();

  function onReturnButtonClicked(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();

    navigate("/account");
  }

  return (
    <FormContainer>
      <p className="hidden md:block md:mr-auto md:absolute">
        /account/change-avatar
      </p>
      <div className="flex flex-col mx-auto overflow-hidden px-2 mt-4 items-center gap-2">
        <h2 className="text-2xl"> Change Avatar</h2>
        {/* <input type="file" className=""></input>*/}
        <p className="text-center">
          Upload your avatar in png, jpeg, webp format. MAX SIZE: 5MB
        </p>
        <div className="max-w-[60%]  h-20 ">
          <ImageUpload></ImageUpload>
        </div>

        <div className="flex flex-row gap-2">
          <button
            onClick={onReturnButtonClicked}
            className="bg-neutral-700 text-lg rounded-sm px-2 mt-1 hover:bg-gray-500 flex items-center gap-2"
          >
            <Icon icon={FaArrowLeftLong}></Icon>
            Return
          </button>
          <button className="bg-sky-700 text-lg rounded-sm px-2 mt-1 hover:bg-sky-600 flex items-center gap-2">
            <Icon icon={RiUpload2Fill}></Icon>
            Upload
          </button>
        </div>
      </div>
    </FormContainer>
  );
}
