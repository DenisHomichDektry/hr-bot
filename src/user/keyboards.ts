import { Actions } from 'src/constants';
import { KeyboardButton } from '@telegraf/types/markup';

export const enter: KeyboardButton[][] = [
  [
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
