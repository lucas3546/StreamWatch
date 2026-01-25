import FormContainer from "../../components/forms/FormContainer";
import { useUser } from "../../contexts/UserContext";
import ProfilePic from "../../components/avatar/ProfilePic";
import ChangeUsernameForm from "../../components/forms/ChangeUsernameForm";
import ChangeProfilePicture from "../../components/modals/ChangeProfilePictureModal";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm";
import LogoutModal from "../../components/modals/LogoutModal";
import DeleteAccountModal from "../../components/modals/DeleteAccountModal";

export default function AccountPage() {
  const { user } = useUser();
  return (
    <FormContainer className="">
      <div className="flex flex-col mx-auto p-3 gap-4 w-full">
        <div className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full">
          <ProfilePic userName={user?.name} fileUrl={user?.picture} size={55} />
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-neutral-400">{user?.email}</p>
          </div>
        </div>
        <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full">
          <ChangeProfilePicture />
        </div>
        <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full">
          <ChangeUsernameForm />
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full">
          <ChangePasswordForm />
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl w-full flex flex-col gap-3">
          <LogoutModal />
          <DeleteAccountModal></DeleteAccountModal>
        
        </div>
      </div>
    </FormContainer>
  );
}
