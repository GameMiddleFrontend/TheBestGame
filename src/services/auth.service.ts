import ServiceUtils from './service.utils';
import {CurrentUserItem} from '../models/current-user.model';

type authError = {
  reason: string;
};

class AuthService {
  static async auth(): Promise<CurrentUserItem> {
    const response = await ServiceUtils.GET('/auth/user');
    const result: authError | CurrentUserItem = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    return result as CurrentUserItem;
  }

  async logout() {
    return await ServiceUtils.post('/logout');
  }
}

export default AuthService;
