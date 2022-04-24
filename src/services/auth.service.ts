import ServiceUtils from './service.utils';
import {CurrentUserItem} from '../models/user.model';

type authError = {
  reason: string;
};

const _authBaseUrl = '/auth';

class AuthService {
  static async auth(): Promise<CurrentUserItem> {
    const response = await ServiceUtils.GET(`${_authBaseUrl}/user`);
    const result: authError | CurrentUserItem = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    return result as CurrentUserItem;
  }

  static async logout() {
    return await ServiceUtils.post(`${_authBaseUrl}/logout`);
  }
}

export default AuthService;
