interface IFeedbackCreateUserId {
  value: number;
  userId?: string;
}

interface IFeedbackCreateTelegramId {
  value: number;
  telegramId?: number;
}

export type IFeedbackCreate = IFeedbackCreateUserId | IFeedbackCreateTelegramId;
