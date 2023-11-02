import { KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

export const OnboardingEnter: KeyboardButton[][] = [
  [{ text: Actions.Done }],
  [{ text: Actions.Assistance }],
  [{ text: Actions.Back }],
];
