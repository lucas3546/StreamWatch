import { useEffect, useState } from "react";
import Icon from "../icon/Icon";
import BaseModal from "./BaseModal";
import { BiSolidUserPlus } from "react-icons/bi";
import { FaCopy } from "react-icons/fa6";
import {
  getFriends,
  type GetFriendsResponse,
} from "../../services/friendshipService";
import RoomUserInviteItem from "./Friends/RoomUserInviteItem";
import { FaShareAlt } from "react-icons/fa";
export default function RoomInviteModal() {
  const [friends, setFriends] = useState<GetFriendsResponse[]>();
  const [loadingFriends, setLoadingFriends] = useState<boolean>();
  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await getFriends();
        const acceptedFriends = data.filter(
          (friend) => friend.status === "Accepted",
        );
        setFriends(acceptedFriends);
      } finally {
        setLoadingFriends(false);
      }
    };
    loadFriends();
  }, []);

  const openButtonContent = (
    <>
      <Icon icon={BiSolidUserPlus} />
      Invite
    </>
  );

  const footerButtons = <></>;

  const onShareButtonClicked = async () => {
    const url = window.location.href;

    if (canShare) {
      try {
        await navigator.share({
          title: "Join my room!",
          text: "Come watch together 🎬",
          url,
        });
      } catch (err) {
        console.log("Sharing canceled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };
  return (
    <BaseModal
      blurBackground={true}
      title="Invite Friends"
      openButtonClassname="bg-neutral-700 gap-1 text-sm rounded-md flex items-center p-1 cursor-pointer hover:bg-neutral-600 transition-colors"
      openButtonContent={openButtonContent}
      footerButtons={footerButtons}
    >
      <>
        <h3>Share this link</h3>
        <div className="flex items-center gap-2 text-sm bg-neutral-800 p-2 rounded-xl border border-neutral-700">
          <span className="truncate text-neutral-300">{location.href}</span>

          <button
            onClick={onShareButtonClicked}
            className="ml-auto bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 cursor-pointer rounded-lg px-3 py-1 transition-all"
            title={canShare ? "Share link" : "Copy link"}
          >
            <Icon size={18} icon={canShare ? FaShareAlt : FaCopy} />
          </button>
        </div>
        <h2>Or select friends do you want to invite</h2>
        <div className="flex flex-col gap-1 max-h-50 overflow-y-auto border-defaultbordercolor border-1 p-2 rounded-xl">
          {loadingFriends ? (
            <p>Loading friends..</p>
          ) : (
            <>
              {friends?.length === 0 && <p>You don´t have any friends yet</p>}
              {friends?.map((friend) => (
                <RoomUserInviteItem friend={friend}></RoomUserInviteItem>
              ))}
            </>
          )}
        </div>
      </>
    </BaseModal>
  );
}
