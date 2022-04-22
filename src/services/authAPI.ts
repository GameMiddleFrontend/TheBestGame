import APIUtils from './APIUtils';
import {CurrentUserItem} from '../models/current-user.model';

type authError = {
  reason: string;
};

class AuthAPI {
  static async auth(): Promise<CurrentUserItem> {
    const response = await APIUtils.GET('/auth/user');
    const result: authError | CurrentUserItem = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    return result as CurrentUserItem;
  }
}

export default AuthAPI;
