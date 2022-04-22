import APIUtils from './service.utils';

export interface IUserPasswordApi {
  oldPassword: string;
  newPassword: string;
}

export class UserService {
  static async setUserPassword(data: IUserPasswordApi): Promise<string> {
    return await APIUtils.put('/password', data);
  }
}
