import ServiceUtils from './service.utils';
import {CurrentUserItem, UserPasswordApiItem} from '../models/user.model';

const _userBaseUrl = '/user';

export class UserService {
  static async setUserPassword(data: UserPasswordApiItem): Promise<string> {
    return await ServiceUtils.put(`${_userBaseUrl}/password`, data);
  }

  static async setUserInfo(data: CurrentUserItem): Promise<CurrentUserItem> {
    return await ServiceUtils.put(`${_userBaseUrl}/profile`, data);
  }

  static async updateUserAvatar(avatar: File): Promise<CurrentUserItem> {
    const formData = new FormData();
    formData.append('avatar', avatar, `avatar`);

    return await ServiceUtils.put(`${_userBaseUrl}/profile/avatar`, formData);
  }
}
