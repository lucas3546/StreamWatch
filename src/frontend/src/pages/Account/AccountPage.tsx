import FormContainer from "../../components/forms/FormContainer";
import Avatar from "boring-avatars";
import { Link } from "react-router";

export default function AccountPage() {
  return (
    <FormContainer>
      <div className="flex flex-col mx-auto overflow-hidden px-2 items-center">
        <div className="flex flex-row gap-3">
          <Avatar
            size={80}
            name="Outgen"
            colors={["#696358ff", "#b3a79fff", "#ff5252", "#c91e5a", "#3d2922"]}
            variant="bauhaus"
          />
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-2xl">@UserName</p>
            <p className="text-lg">testenadoemail@gmail.com</p>
          </div>
        </div>

        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <Link className="" to="/account/change-avatar">
          Change Username
        </Link>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <Link className="" to="/account/change-avatar">
          Change Avatar
        </Link>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <Link className="" to="/account/change-avatar">
          Change Password
        </Link>
        <div className="border-t-1 m-2 border-defaultbordercolor w-full"></div>
        <div className="flex items-center gap-2">
          <button className="bg-neutral-800 p-2 rounded-md hover:bg-neutral-600">
            Logout
          </button>
          <button className="bg-red-900 p-2 rounded-md hover:bg-red-600">
            Delete my account
          </button>
        </div>

        {/*
        <div>
          <p className="text-lg"> Change Password</p>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <input
                type="text"
                className="border-white border-1 rounded-sm px-1"
                placeholder="Your current password"
              ></input>
              <input
                type="text"
                className=""
                placeholder="Your new password"
              ></input>
            </div>
            <button className="bg-sky-700 text-lg rounded-sm px-2 mt-1 hover:bg-sky-600 ml-auto">
              Upload
            </button>
          </div>
        </div>
        */}
      </div>
    </FormContainer>
  );
}
