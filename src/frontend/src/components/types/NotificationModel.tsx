export interface NotificationModel {
  id: string;
  fromUserName: string;
  fromUserId: string;
  type: string;
  payload: string | undefined;
  sentAt: string;
  image?: string;
}
