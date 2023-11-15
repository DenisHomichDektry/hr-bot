import { InlineKeyboardButton, KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

export const assistanceEnter: KeyboardButton[][] = [[{ text: Actions.Back }]];

export const responseToAssistance: InlineKeyboardButton[][] = [
  [
    {
      text: Actions.Reply,
      callback_data: Actions.Reply,
    },
  ],
];

export const replyEnter: KeyboardButton[][] = [[{ text: Actions.Back }]];
