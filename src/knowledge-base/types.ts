import { CreateItemDto, UpdateItemDto } from './dto';

export const isCreateItemDto = (
  obj: Partial<CreateItemDto>,
): obj is CreateItemDto => {
  return (
    typeof obj.title === 'string' &&
    typeof obj.link === 'string' &&
    typeof obj.category === 'string'
  );
};

export const isUpdateItemDto = (
  obj: Partial<UpdateItemDto>,
): obj is UpdateItemDto => {
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.link === 'string' &&
    typeof obj.category === 'string'
  );
};
