import { CreateItemDto } from 'src/knowledge-base/dto/create-item.dto';

export const isCreateItemDto = (
  obj: Partial<CreateItemDto>,
): obj is CreateItemDto => {
  return (
    typeof obj.title === 'string' &&
    typeof obj.link === 'string' &&
    typeof obj.category === 'string'
  );
};
