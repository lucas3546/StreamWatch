import { useNavigate, useParams } from "react-router";
import ProfilePic from "../components/avatar/ProfilePic";
import { useEffect, useState } from "react";
import { BiSolidUserCheck, BiSolidUserX } from "react-icons/bi";
import { IoIosFlag } from "react-icons/io";
import {
  acceptFriendshipRequest,
  getStatusFromFriendship,
  removeFriendship,
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
import { formatDate } from "../utils/dateFormat";
import { HiUserAdd } from "react-icons/hi";
import BanUserModal from "../components/modals/BanUserModal";
import StorageFromUserModal from "../components/modals/StorageFromUserModal";
import BanHistoryModal from "../components/modals/BanHistoryModal";
import { useSignalR } from "../hooks/useSignalR";
import type { UpdateFriendshipStatusModel } from "../components/types/UpdatedFriendshipStatusModel";
import { generateProblemDetailsErrorToast } from "../utils/toastGenerator";
import ReportModal from "../components/modals/ReportModal";

export default function ProfilePage() {
  const { accountId } = useParams<{ accountId: string }>();
  const { user } = useUser();
  const { connection } = useSignalR();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<GetAccountProfileResponse>();
  const [statusData, setStatusData] =
    useState<GetStatusFromFriendshipResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.nameid === accountId) {
      alert(
        "You can't access the profile page for your own account; you wouldn't be able to do anything anyway",
      );
      navigate("/");
    }
  }, [user, accountId]);

  useEffect(() => {
    if (accountId === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profile = await getAccountProfile(accountId);

        setProfileData(profile);
      } catch (error) {
        const p = error as ProblemDetails;
        if (p.status !== 404) {
          generateProblemDetailsErrorToast(p);
          return;
        }
      }

      try {
        const status = await getStatusFromFriendship(accountId);
        setStatusData(status);
        console.log("initial state", status);

        setIsLoading(false);
      } catch (error) {
        const e = error as ProblemDetails;
        console.log(e);
        if (e.status !== 404) {
          generateProblemDetailsErrorToast(e);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  useEffect(() => {
    if (!connection) return;

    const handler = (state: UpdateFriendshipStatusModel) => {
      console.log("New friendship state received:", state);

      if (state.friendshipStatus === "Declined") {
        setStatusData(undefined);
        return;
      }
      const obj: GetStatusFromFriendshipResponse = {
        requestDate: state.requestedDate,
        requestResponse: state.responseDate ?? null,
        requestedByUserId: state.requesterId,
        status: state.friendshipStatus,
      };
      setStatusData(obj);
      console.log(statusData);
    };

    connection.on("UpdateFriendState", handler);

    return () => {
      connection.off("UpdateFriendState", handler);
    };
  }, [connection]);

  const sendFriendRequest = async () => {
    if (accountId === undefined || user?.nameid == undefined) return;
    await sendFriendshipRequest(accountId);
  };

  const acceptFriendRequest = async () => {
    if (accountId === undefined || user?.nameid == undefined) return;
    await acceptFriendshipRequest(accountId);
    setStatusData((prev) => ({
      ...prev!,
      requestResponse: new Date().toISOString(),
      status: "Accepted",
    }));
  };

  const declineFriendRequest = async () => {
    if (accountId === undefined || user?.nameid == undefined) return;
    await removeFriendship(accountId);
    setStatusData(undefined);
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      {isLoading ? (
        <>
          <p>Loading..</p>
        </>
      ) : (
        <div className="bg-neutral-900 border border-defaultbordercolor rounded-2xl shadow-lg p-6 w-full max-w-md transition-all duration-300 hover:shadow-xl">
          {profileData && (
            <div className="flex flex-col items-center text-center gap-3">
              <ProfilePic
                userName={profileData.userName}
                fileUrl={profileData.profilePicThumbnailUrl}
                size={80}
              />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {profileData.userName}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {statusData?.status
                    ? `Status: ${statusData.status}`
                    : "Not friends"}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {/* PENDING STATUS */}
            {statusData?.status?.toLowerCase() === "pending" && (
              <div className="mt-5 space-y-3 text-sm text-gray-300">
                <p className="text-center">
                  {statusData.requestDate && (
                    <>Requested {formatDate(statusData.requestDate)}</>
                  )}
                </p>
                {user?.nameid === statusData.requestedByUserId ? (
                  <button
                    onClick={declineFriendRequest}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-800 hover:text-red-400 transition"
                  >
                    <Icon icon={BiSolidUserX} />
                    Cancel Request
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={acceptFriendRequest}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-green-700 text-green-400 rounded-lg hover:bg-green-800/20 transition"
                    >
                      <Icon icon={BiSolidUserCheck} />
                      Accept Friend Request
                    </button>
                    <button
                      onClick={declineFriendRequest}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-800 hover:text-red-400 transition"
                    >
                      <Icon icon={BiSolidUserX} />
                      Decline Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACCEPTED STATUS */}
            {statusData?.status?.toLowerCase() === "accepted" && (
              <div className="mt-5 space-y-3 text-sm text-gray-300 text-center">
                <p>Friends since {formatDate(statusData.requestResponse)}</p>
                <button
                  onClick={declineFriendRequest}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-800 hover:text-red-400 transition"
                >
                  <Icon icon={BiSolidUserX} />
                  Remove Friend
                </button>
              </div>
            )}

            {/* NOT FRIENDS */}
            {statusData === undefined && (
              <div className="mt-5">
                <button
                  onClick={sendFriendRequest}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-sky-700 text-sky-400 rounded-lg hover:bg-sky-800/20 transition"
                >
                  <Icon icon={HiUserAdd} />
                  Send Friend Request
                </button>
              </div>
            )}
            <button
              onClick={acceptFriendRequest}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-green-700 text-green-400 rounded-lg hover:bg-green-800/20 transition"
            >
              <Icon icon={BiSolidUserCheck} />
              Accept Friend Request
            </button>
            <ReportModal
              reportType="User"
              reportTargetId={profileData?.userId ?? ""}
              openButtonClassname="cursor-pointer w-full flex items-center justify-center gap-2 py-2 border border-red-700 text-red-400 rounded-lg hover:bg-red-800/20 transition"
              openButtonContent={
                <>
                  <Icon icon={IoIosFlag}></Icon>
                  Report this user
                </>
              }
            ></ReportModal>
            {user?.role === "Admin" && profileData && (
              <>
                <BanUserModal
                  accountId={profileData?.userId}
                  userName={profileData?.userName}
                  profilePicUrl={profileData?.profilePicThumbnailUrl}
                ></BanUserModal>
                <BanHistoryModal
                  accountId={profileData?.userId}
                  userName={profileData?.userName}
                  profilePicUrl={profileData?.profilePicThumbnailUrl}
                ></BanHistoryModal>
                <StorageFromUserModal
                  accountId={profileData?.userId}
                  userName={profileData?.userName}
                  profilePicUrl={profileData?.profilePicThumbnailUrl}
                ></StorageFromUserModal>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
