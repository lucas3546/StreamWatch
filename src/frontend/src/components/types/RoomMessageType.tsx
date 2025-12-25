export interface RoomChatMessageType {
  id: string;
  userName: string;
  userId: string;
  text: string;
  fromMe: boolean;
  countryCode: string;
  countryName: string;
  isNotification: boolean;
  image?: string | null;
  replyToMessageId?: string | null;
  isWhisper: boolean;
}
