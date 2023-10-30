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
        knowledgeBaseItem?: {
          title?: string;
          link?: string;
          category?: string;
        };
        knowledgeBaseCategory?: {
          id?: string;
          name?: string;
        };
        user_id?: number;
        user?: {
          firstName?: string;
          lastName?: string;
          role?: 'admin' | 'user';
        };
      };
    };
  };
}
