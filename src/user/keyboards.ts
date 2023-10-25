import { Actions } from 'src/constants';
import { InlineKeyboardButton, KeyboardButton } from '@telegraf/types/markup';

export const enter: KeyboardButton[][] = [
  [
    { text: Actions.ViewUsers },
    {
      text: Actions.AddUser,
      request_user: {
        request_id: +performance.now().toFixed(),
      },
    },
    {
      text: Actions.ShareChat,
      request_chat: {
        request_id: +performance.now().toFixed() + 1,
        chat_is_channel: false,
      },
    },
  ],
  [
    {
      text: Actions.Back,
    },
  ],
];

export const userView: InlineKeyboardButton[][] = [
  [
    {
      text: Actions.Edit,
      callback_data: Actions.Edit,
    },
    {
      text: Actions.Remove,
      callback_data: Actions.Remove,
    },
  ],
];
