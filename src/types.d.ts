import { SceneContext as TelegrafSceneContext } from 'telegraf/typings/scenes';

export interface SceneContext extends TelegrafSceneContext {
  message: tg.Update.New &
    tg.Update.NonChannel &
    tg.Message & {
      chat_shared?: {
        request_id: number;
        chat_id: number;
      };
      user_shared?: {
        request_id: number;
        user_id: number;
        user_name: string;
      };
    };
  callbackQuery: tg.CallbackQuery.DataCallbackQuery;
  state: {
    role?: 'admin' | 'user' | null;
  };
  session: {
    __scenes?: {
      current?: string;
      expires?: number;
      state?: {
        management: boolean;
        previousScene?: string;
        replyTo?: number; // telegram user id
        knowledgeBaseItem?: {
          id?: string;
          title?: string;
          link?: string;
          category?: string;
        };
        knowledgeBaseCategory?: {
          id?: string;
          name?: string;
        };
        user?: {
          id?: string;
          telegramId?: number;
          firstName?: string;
          lastName?: string;
          role?: 'admin' | 'user';
          username?: string;
        };
      };
    };
  };
  payload?: string;
}
