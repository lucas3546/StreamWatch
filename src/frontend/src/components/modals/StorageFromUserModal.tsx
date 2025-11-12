import BaseModal from "./BaseModal";
import Icon from "../icon/Icon";
import { MdStorage } from "react-icons/md";
import { useEffect, useState } from "react";
import ProfilePic from "../avatar/ProfilePic";
import {
  getFullStorageForomUser,
  type StorageResponse,
} from "../../services/storageService";
import VideoItemCard from "../cards/VideoItemCard";
import { DateTime } from "luxon";
import formatBytes from "../../utils/byteFormatter";
interface StorageFromUserModalProps {
  profilePicUrl: string;
  accountId: string;
  userName: string;
}

export default function StorageFromUserModal({
  profilePicUrl,
  accountId,
  userName,
}: StorageFromUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [storageResp, setStorageResp] = useState<StorageResponse>();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFullStorageForomUser(accountId);
      setStorageResp(data);
    };

    fetchData();
  }, [storageResp, accountId]);
  return (
    <BaseModal
      blurBackground
      title="User storage"
      openButtonClassname="cursor-pointer w-full flex items-center justify-center gap-2 py-2  rounded-lg bg-blue-900 hover:bg-blue-800 hover:text-red-400 transition"
      openButtonContent={
        <span className="flex items-center gap-1 font-bold">
          <Icon icon={MdStorage}></Icon>Storage from this user
        </span>
      }
      footerButtons={null}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <>
        <div className="flex items-center gap-3 mb-2 text-xs text-left">
          <ProfilePic fileUrl={profilePicUrl} userName={userName} size={40} />
          <div>
            <p className="font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-neutral-400 truncate">
              Account ID: {accountId}
            </p>
          </div>
        </div>
        {storageResp && <p>Total: {formatBytes(storageResp.storageUse)}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-h-[30vh] overflow-y-auto overflow-x-hidden border-defaultbordercolor border-1 p-2">
          {storageResp?.medias.map((media) => (
            <>
              <VideoItemCard
                size={media.size}
                fileUrl={media.fileUrl}
                provider={media.mediaProvider}
                expirestAt={DateTime.fromISO(media.expiresAt).toUTC()}
                thumbnailUrl={media.thumbnailUrl}
              ></VideoItemCard>
            </>
          ))}
        </div>
      </>
    </BaseModal>
  );
}
