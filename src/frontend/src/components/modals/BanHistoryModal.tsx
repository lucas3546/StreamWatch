import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { GoLog } from "react-icons/go";
import { useEffect, useState } from "react";
import ProfilePic from "../avatar/ProfilePic";
import {
  getBanHistoryFromUser,
  unbanAccount,
  type GetBansHistoryFromUserItemResponse,
} from "../../services/banService";
interface BanHistoryModalProps {
  profilePicUrl: string;
  accountId: string;
  userName: string;
}

export default function BanHistoryModal({
  profilePicUrl,
  accountId,
  userName,
}: BanHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [banHistory, setBanHistory] =
    useState<GetBansHistoryFromUserItemResponse[]>();

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      const data = await getBanHistoryFromUser(accountId);

      setBanHistory(data);
    };

    fetchData();
  }, [isOpen, accountId]);

  const onClickRemoveBanButton = async () => {
    const confirmUnban = confirm(
      `Are you sure do you wanna unban ${userName}?`,
    );

    if (confirmUnban) {
      try {
        await unbanAccount(accountId);
        alert(`${userName} unbanned!`);
        setIsOpen(false);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <BaseModal
      blurBackground
      title="Ban History"
      openButtonClassname="cursor-pointer w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-900 hover:bg-red-800 hover:text-red-400 transition"
      openButtonContent={
        <span className="flex items-center gap-1 font-bold">
          <Icon icon={GoLog} />
          Ban History
        </span>
      }
      footerButtons={null}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <>
        {/* Header del usuario */}
        <div className="flex items-center gap-3 mb-4 border-b border-neutral-800 pb-3">
          <ProfilePic fileUrl={profilePicUrl} userName={userName} size={40} />
          <div className="flex flex-col">
            <p className="font-semibold text-white text-sm leading-tight">
              {userName}
            </p>
            <p className="text-xs text-neutral-400 leading-tight">
              Account ID: {accountId}
            </p>
          </div>
        </div>

        {/* Sin historial */}
        {!banHistory?.length && (
          <p className="text-neutral-400 text-sm text-center py-4">
            This user has no ban history.
          </p>
        )}

        {/* Estilo TABLA */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          {banHistory
            ?.slice()
            .sort((a, b) => Number(a.isExpired) - Number(b.isExpired))
            .map((ban) => {
              const expired = ban.isExpired;

              return (
                <div
                  key={ban.banId}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition text-sm"
                >
                  {/* Header: estado + fechas */}
                  <div className="flex flex-wrap justify-between gap-3 pb-3 border-b border-neutral-800">
                    {/* Estado */}
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        expired
                          ? "bg-neutral-800 text-neutral-400"
                          : "bg-red-800 text-red-200"
                      }`}
                    >
                      {expired ? "Expired" : "Active"}
                    </span>

                    {/* Fecha de creación */}
                    <span className="text-neutral-400">
                      Created:{" "}
                      <span className="text-neutral-300">
                        {new Date(ban.createdAt).toLocaleString()}
                      </span>
                    </span>

                    {/* Fecha de expiración */}
                    <span className="text-neutral-400">
                      Expires:{" "}
                      <span className="text-neutral-300">
                        {new Date(ban.expiresAt).toLocaleString()}
                      </span>
                    </span>

                    {/* ID */}
                    <span className="text-xs text-neutral-500">
                      ID: {ban.banId}
                    </span>
                  </div>

                  {/* Public reason */}
                  {ban.publicReason && (
                    <div className="flex mt-3 gap-3">
                      <span className="text-neutral-500 w-32">
                        Public reason:
                      </span>
                      <p className="text-neutral-300 whitespace-pre-line flex-1">
                        {ban.publicReason}
                      </p>
                    </div>
                  )}

                  {/* Private reason */}
                  {ban.privateReason && (
                    <div className="flex mt-2 gap-3">
                      <span className="text-neutral-500 w-32">
                        Private reason:
                      </span>
                      <p className="text-neutral-300 whitespace-pre-line flex-1">
                        {ban.privateReason}
                      </p>
                    </div>
                  )}
                  {!expired && (
                    <button
                      onClick={onClickRemoveBanButton}
                      className="bg-red-700 hover:bg-red-600 p-2 rounded-full mt-2 cursor-pointer"
                    >
                      Remove ban
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </>
    </BaseModal>
  );
}
