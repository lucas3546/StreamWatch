import type { NotificationType } from "./NotificationTypeModel";

export interface NotificationModel {
  id: string;
  fromUserName: string;
  fromUserId: string;
  type: NotificationType;
  payload: string | undefined;
  sentAt: string;
  pictureUrl?: string;
}
