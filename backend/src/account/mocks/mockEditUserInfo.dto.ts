import { EditUserInfoDto } from '../dtos/editUserInfo.dto';

export const mockEditUserInfoDto = (): EditUserInfoDto => {
  return {
    username: 'Test user',
    firstName: 'Test first name',
    lastName: 'Test last name',
  };
};
