interface ITelegramIdUser {
  telegramId: number;
}
interface IUUIDUsers {
  id: string;
}
type TUser = ITelegramIdUser | IUUIDUsers;
export interface IMessageCreate {
  from: TUser;
  to: TUser;
  text: string;
}

interface IFindAllMessagesFrom {
  from: TUser;
}

interface IFindAllMessagesTo {
  to: TUser;
}

export type TFindAllMessages = IFindAllMessagesFrom | IFindAllMessagesTo;
