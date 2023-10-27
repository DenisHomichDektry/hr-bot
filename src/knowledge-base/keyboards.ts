import { Actions } from 'src/constants';
import { KeyboardButton } from '@telegraf/types/markup';

export const knowledgeBaseManagementEnter: KeyboardButton[][] = [
  [
    { text: Actions.AddKnowledgeBaseCategory },
    { text: Actions.RemoveKnowledgeBaseCategory },
  ],
  [
    { text: Actions.AddKnowledgeBaseItem },
    { text: Actions.RemoveKnowledgeBaseItem },
  ],
  [{ text: Actions.Back }],
];

export const addKnowledgeBaseCategory: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];

export const addKnowledgeBaseItem: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];
