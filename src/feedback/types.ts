interface IFeedbackCreateUserId {
  value: number;
  userId?: string;
}

export interface IFeedbackCreateTelegramId {
  value: number;
  telegramId?: number;
}

export type IFeedbackCreate = IFeedbackCreateUserId | IFeedbackCreateTelegramId;

interface IUserIdFeedbacks {
  userId: string;
}

interface ITelegramIdFeedbacks {
  telegramId: number;
}

export type IUserFeedbacks = IUserIdFeedbacks | ITelegramIdFeedbacks;
