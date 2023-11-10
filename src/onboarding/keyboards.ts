import { InlineKeyboardButton, KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

export const OnboardingEnter: KeyboardButton[][] = [
  [{ text: Actions.Done }],
  [{ text: Actions.Assistance }],
  [{ text: Actions.Back }],
];

export const onboardingManagementInline: InlineKeyboardButton[][] = [
  [
    {
      text: Actions.LaunchWebApp,
      web_app: {
        url: 'https://innocent-skink-severely.ngrok-free.app',
      },
    },
  ],
];

export const onboardingManagement: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];
