import { UpdateUserDto } from 'src/user/dto';

export const isUserUpdateDto = (obj: any): obj is UpdateUserDto => {
  return (
    typeof obj.id === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.role === 'string'
  );
};
