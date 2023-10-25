import { SceneContext as SceneContextImport } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { User } from '@telegraf/types/manage';

export interface SceneContext extends SceneContextImport {
  update: Update.MessageUpdate;
  message: Update.MessageUpdate['message'] & {
    from: User & {
      role: 'admin' | 'user' | null;
    };
    chat_shared?: {
      request_id: number;
      chat_id: number;
    };
    user_shared?: {
      request_id: number;
      user_id: number;
    };
  };
  state: {
    role?: 'admin' | 'user' | null;
  };
}
