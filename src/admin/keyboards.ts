import { Actions } from 'src/constants';
import { KeyboardButton } from '@telegraf/types/markup';

export const enter: KeyboardButton[][] = [
  [{ text: Actions.UserManagement }, { text: Actions.KnowledgeBaseManagement }],
  [{ text: Actions.OnboardingManagement }, { text: Actions.Back }],
];
