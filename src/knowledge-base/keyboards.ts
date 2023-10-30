import { Actions } from 'src/constants';
import { KeyboardButton } from '@telegraf/types/markup';

export const knowledgeBaseManagementEnter: KeyboardButton[][] = [
  [
    { text: Actions.AddKnowledgeBaseCategory },
    { text: Actions.ViewKnowledgeBaseCategories },
  ],
  [
    { text: Actions.AddKnowledgeBaseItem },
    { text: Actions.ViewKnowledgeBaseItems },
  ],
  [{ text: Actions.Back }],
];

export const addKnowledgeBaseCategory: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];

export const addKnowledgeBaseItem: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];

export const editKnowledgeBaseCategory: KeyboardButton[][] = [
  [{ text: Actions.Back }],
];

export const removeKnowledgeBaseCategory: KeyboardButton[][] = [
  [{ text: Actions.Confirm }],
  [{ text: Actions.Back }],
];
