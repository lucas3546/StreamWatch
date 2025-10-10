import { useParams } from "react-router";
import ProfilePic from "../components/avatar/ProfilePic";
import { useEffect, useState } from "react";
import { BiSolidUserCheck, BiSolidUserX } from "react-icons/bi";

import {
  getStatusFromFriendship,
  sendFriendshipRequest,
  type GetStatusFromFriendshipResponse,
} from "../services/friendshipService";
import {
  getAccountProfile,
  type GetAccountProfileResponse,
} from "../services/accountService";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import { useUser } from "../contexts/UserContext";
import Icon from "../components/icon/Icon";
import { formatDate, formatShort } from "../utils/dateFormat";
import { HiUserAdd } from "react-icons/hi";

export default function ProfilePage() {
  const { accountId } = useParams<{ accountId: string }>();
  const { user } = useUser();
  const [profileData, setProfileData] = useState<GetAccountProfileResponse>();
  const [statusData, setStatusData] =
    useState<GetStatusFromFriendshipResponse>();

  useEffect(() => {
    if (accountId === undefined) return;

    const fetchData = async () => {
      const profile = await getAccountProfile(accountId);

      setProfileData(profile);

      try {
        const status = await getStatusFromFriendship(accountId);
        setStatusData(status);
      } catch (error) {
        const e = error as ProblemDetails;
      }
    };

    fetchData();
  }, [accountId]);

  const sendFriendRequest = async () => {
    if (accountId === undefined) return;
    await sendFriendshipRequest(accountId);
  };

  return (
    <div className="bg-basecolor border-1 border-defaultbordercolor rounded-sm p-4 max-w-max mx-auto mt-5 flex  items-center">
      <div className="flex flex-col gap-3">
        {profileData && (
          <div className="flex flex-row justify-start gap-3">
            <ProfilePic
              userName={profileData?.userName}
              fileUrl={profileData?.profilePicThumbnailUrl}
              size={40}
            ></ProfilePic>
            <div className="flex flex-col">
              <p className="text-xl text-white">{profileData?.userName}</p>
              <p>
                Status: {statusData?.status ? statusData.status : "Not friends"}
              </p>
            </div>
          </div>
        )}
        {statusData?.status.toLocaleLowerCase() === "pending" ? (
          <>
            Requested {formatShort(statusData.requestDate)}
            {user?.nameid === statusData.requestedByUserId ? (
              <>
                <button className="w-full border flex items-center gap-1 border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
                  <Icon icon={BiSolidUserX} />
                  Cancel request
                </button>
              </>
            ) : (
              <>
                <button className="w-full border flex items-center gap-1 border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
                  <Icon icon={BiSolidUserCheck} />
                </button>
                <button className="w-full border flex items-center gap-1 border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
                  <Icon icon={BiSolidUserX} />
                </button>
              </>
            )}
          </>
        ) : (
          <></>
        )}

        {statusData?.status.toLocaleLowerCase() === "accepted" && (
          <div>
            <p>Friends since {formatDate(statusData.requestResponse)}</p>
            <button className="w-full border flex items-center justify-center gap-1 border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
              <Icon icon={BiSolidUserCheck} />
              Remove friend
            </button>
          </div>
        )}

        {statusData === undefined && (
          <button className="flex items-center gap-1 border border-defaultbordercolor hover:bg-neutral-700 rounded-md p-1 cursor-pointer">
            <Icon icon={HiUserAdd} />
            Send request
          </button>
        )}
      </div>
    </div>
  );
}
