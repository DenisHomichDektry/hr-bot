import { KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

export const enter: KeyboardButton[][] = [
  [{ text: Actions.UserManagement }, { text: Actions.LinkToWebVersion }],
  [{ text: Actions.Back }],
];
