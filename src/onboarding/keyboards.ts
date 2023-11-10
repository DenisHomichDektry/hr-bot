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
        url: process.env.WEB_APP_URL,
      },
    },
  ],
];

export const onboardingManagement: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];
