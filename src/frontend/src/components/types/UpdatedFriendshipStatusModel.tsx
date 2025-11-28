import type { FriendshipStatusType } from "./FriendshipStatusType";

export interface UpdateFriendshipStatusModel {
  requesterId: string;
  receiverId: string;
  friendshipStatus: FriendshipStatusType;
  requestedDate: string;
  responseDate: string;
}
