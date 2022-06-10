import ServiceUtils from './service.utils';
import {CurrentUserItem} from '@models/user.model';

type authError = {
  reason: string;
};

const _authBaseUrl = '/auth';

class AuthService {
  static createUserProcess = false;
  static async auth(): Promise<CurrentUserItem> {
    const response = await ServiceUtils.GET(`${_authBaseUrl}/user`);
    let result: authError | CurrentUserItem = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    if (!AuthService.createUserProcess) {
      AuthService.createUserProcess = true;
      result = await AuthService.createDBUser(result as CurrentUserItem);
      AuthService.createUserProcess = false;
    }
    return result as CurrentUserItem;
  }

  static async logout() {
    return await ServiceUtils.post(`${_authBaseUrl}/logout`);
  }

  static async createDBUser(user: CurrentUserItem) {
    return await ServiceUtils.post('', user, undefined, 'http://localhost:3000/api/v1/user'.concat('/add'));
  }

  static async changeUserTheme(userId: number) {
    return await ServiceUtils.post('', {userId}, undefined, 'http://localhost:3000/api/v1/user'.concat('/changeTheme'));
  }
}

export default AuthService;
