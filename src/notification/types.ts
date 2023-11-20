import { UserEntity } from 'src/user/entities/user.entity';

export interface IGetNotification {
  source: string; // see NotificationEntity
}

interface INotificationCreateTelegramId {
  telegramId: number;
  text: string;
  source: string; // see NotificationEntity
  sendAt: string;
}

interface INotificationCreateUser {
  user: UserEntity;
  text: string;
  source: string; // see NotificationEntity
  sendAt: string;
}

export type TNotificationCreate =
  | INotificationCreateTelegramId
  | INotificationCreateUser;
