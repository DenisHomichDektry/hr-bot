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

export const addUserEnter: KeyboardButton[][] = [
  [
    {
      text: Actions.Back,
    },
  ],
];

export const removeUser: KeyboardButton[][] = [
  [{ text: Actions.Confirm }],
  [{ text: Actions.Back }],
];
