import { useState } from "react";
import BaseModal from "./BaseModal";
import ProfilePic from "../avatar/ProfilePic";
import { IoBan } from "react-icons/io5";
import Icon from "../icon/Icon";
import { banAccount, type BanAccountRequest } from "../../services/banService";

interface BanUserModalProps {
  accountId: string;
  userName: string;
  profilePicUrl?: string;
}

export default function BanUserModal({
  accountId,
  userName,
  profilePicUrl,
}: BanUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [banUntil, setBanUntil] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 0,
    minute: 0,
  });

  const [privateReason, setPrivateReason] = useState("");
  const [publicReason, setPublicReason] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (field: keyof typeof banUntil, value: number) => {
    setBanUntil({ ...banUntil, [field]: value });
  };

  const handleBan = async () => {
    setIsLoading(true);
    const untilDate = new Date(
      banUntil.year,
      banUntil.month - 1,
      banUntil.day,
      banUntil.hour,
      banUntil.minute,
    );

    const request: BanAccountRequest = {
      targetUserId: accountId,
      expiresAt: untilDate.toISOString(),
      privateReason: privateReason,
      publicReason: publicReason,
    };

    try {
      await banAccount(request);
      alert(`${userName} unbanned!`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const footerButtons = isLoading ? (
    <button
      disabled
      className="py-2 px-4 rounded-2xl bg-neutral-600-600  text-white font-semibold transition-all shadow-md"
    >
      Loading
    </button>
  ) : (
    <button
      onClick={handleBan}
      className="py-2 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-md"
    >
      Ban
    </button>
  );

  return (
    <BaseModal
      blurBackground
      title="Ban user"
      openButtonClassname="cursor-pointer w-full flex items-center justify-center gap-2 py-2  rounded-lg bg-red-900 hover:bg-red-800 hover:text-red-400 transition"
      openButtonContent={
        <span className="flex items-center gap-1 font-bold">
          <Icon icon={IoBan}></Icon>Ban Account
        </span>
      }
      footerButtons={footerButtons}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-3 text-left text-sm">
        {/* User data */}
        <div className="flex items-center gap-3 mb-2">
          <ProfilePic fileUrl={profilePicUrl} userName={userName} size={40} />
          <div>
            <p className="font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-neutral-400 truncate">
              Account ID: {accountId}
            </p>
          </div>
        </div>

        {/* Reasons */}
        <div className="flex flex-col gap-3 bg-neutral-900 border border-neutral-700 rounded-xl p-3">
          <div>
            <label className="block text-neutral-300 font-medium text-sm mb-1">
              Private Reason
            </label>
            <textarea
              value={privateReason}
              onChange={(e) => setPrivateReason(e.target.value)}
              placeholder="Visible only to moderators"
              rows={2}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100 resize-none focus:ring-2 focus:ring-red-500 placeholder-neutral-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium text-sm mb-1">
              Public Reason
            </label>
            <textarea
              value={publicReason}
              onChange={(e) => setPublicReason(e.target.value)}
              placeholder="Visible for the user"
              rows={2}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100 resize-none focus:ring-2 focus:ring-red-500 placeholder-neutral-500"
            />
          </div>
        </div>

        {/* Ban datetime*/}
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-3 flex flex-col gap-2">
          <label className="text-neutral-300 font-medium text-sm">
            Expiration date
          </label>

          <div className="flex flex-wrap gap-2">
            <input
              type="number"
              min={2024}
              max={2100}
              value={banUntil.year}
              onChange={(e) => handleChange("year", +e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md p-2 w-20 text-center text-neutral-100 focus:ring-2 focus:ring-red-500"
              placeholder="Year"
            />
            <input
              type="number"
              min={1}
              max={12}
              value={banUntil.month}
              onChange={(e) => handleChange("month", +e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md p-2 w-16 text-center text-neutral-100 focus:ring-2 focus:ring-red-500"
              placeholder="Month"
            />
            <input
              type="number"
              min={1}
              max={31}
              value={banUntil.day}
              onChange={(e) => handleChange("day", +e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md p-2 w-16 text-center text-neutral-100 focus:ring-2 focus:ring-red-500"
              placeholder="Day"
            />
            <input
              type="number"
              min={0}
              max={23}
              value={banUntil.hour}
              onChange={(e) => handleChange("hour", +e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md p-2 w-16 text-center text-neutral-100 focus:ring-2 focus:ring-red-500"
              placeholder="Hour"
            />
            <input
              type="number"
              min={0}
              max={59}
              value={banUntil.minute}
              onChange={(e) => handleChange("minute", +e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md p-2 w-16 text-center text-neutral-100 focus:ring-2 focus:ring-red-500"
              placeholder="Min"
            />
          </div>

          <div className="text-xs text-neutral-400 mt-2">
            <span className="font-semibold text-neutral-300">Until: </span>
            {`${banUntil.year}-${banUntil.month
              .toString()
              .padStart(2, "0")}-${banUntil.day
              .toString()
              .padStart(2, "0")} ${banUntil.hour
              .toString()
              .padStart(2, "0")}:${banUntil.minute
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
