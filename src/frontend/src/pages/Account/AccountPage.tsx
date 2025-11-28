import FormContainer from "../../components/forms/FormContainer";
import { useUser } from "../../contexts/UserContext";
import ProfilePic from "../../components/avatar/ProfilePic";
import ChangeUsernameForm from "../../components/forms/ChangeUsernameForm";
import ChangeProfilePicture from "../../components/modals/ChangeProfilePictureModal";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm";
import LogoutModal from "../../components/modals/LogoutModal";

export default function AccountPage() {
  const { user } = useUser();
  return (
    <FormContainer>
      <div className="flex flex-col mx-auto overflow-hidden p-2 items-center">
        <div className="flex flex-row gap-3 items-center">
          <ProfilePic
            userName={user?.name}
            fileUrl={user?.picture}
            size={50}
          ></ProfilePic>
          <div className="flex flex-col">
            <p className="text-xl">{user?.name}</p>
            <p className="text-lg text-neutral-300">{user?.email}</p>
          </div>
        </div>

        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <ChangeUsernameForm></ChangeUsernameForm>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <ChangePasswordForm></ChangePasswordForm>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <div className="flex flex-row gap-2 items-center">
          <ProfilePic
            userName={user?.name}
            fileUrl={user?.picture}
            size={30}
          ></ProfilePic>
          <ChangeProfilePicture></ChangeProfilePicture>
        </div>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <div className="flex items-center gap-2">
          <LogoutModal></LogoutModal>
          <button className="bg-red-900 p-2 rounded-md hover:bg-red-600">
            Delete my account
          </button>
        </div>
      </div>
    </FormContainer>
  );
}
