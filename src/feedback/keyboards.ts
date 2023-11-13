import { KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

export const feedbackEnter: KeyboardButton[][] = [
  [{ text: Actions.OneStar }, { text: Actions.TwoStars }],
  [{ text: Actions.ThreeStars }, { text: Actions.FourStars }],
  [{ text: Actions.FiveStars }],
];
