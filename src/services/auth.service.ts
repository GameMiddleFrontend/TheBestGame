import ServiceUtils from './service.utils';
import {CurrentUserItem} from '@models/user.model';
import AxiosUtils from '@services/server.fetch';
import isServer from '@utils/isServer';

type authError = {
  reason: string;
};

const _authBaseUrl = '/auth';

const _baseURL = 'https://ya-praktikum.tech/api/v2';

class AuthService {
  static createUserProcess = false;

  static userUrl = isServer ? '' : window.location.origin;

  static userAPIUrl = '/api/v1/user';

  static async auth(cookieHeader?: string, url?: string): Promise<CurrentUserItem> {
    const axiosOptions: any = {
      withCredentials: true,
    };
    if (cookieHeader) {
      axiosOptions.headers = {
        Cookie: cookieHeader,
      };
    }
    const response = await AxiosUtils.get(_baseURL.concat(`${_authBaseUrl}/user`), undefined, axiosOptions);
    let result = response.data;
    if (response.status !== 200) {
      throw new Error('Ошибка аутентификации');
    }
    if (!AuthService.createUserProcess) {
      AuthService.createUserProcess = true;
      result = await AuthService.createDBUser(result as CurrentUserItem, url);
      AuthService.createUserProcess = false;
    }
    return result as CurrentUserItem;
  }

  static async logout() {
    return await ServiceUtils.post(`${_authBaseUrl}/logout`);
  }

  static async createDBUser(user: CurrentUserItem, url?: string) {
    const tmpUrl = url || AuthService.userUrl;
    return await ServiceUtils.post('', user, undefined, tmpUrl.concat(AuthService.userAPIUrl, '/add'));
  }

  static async changeUserTheme(userId: number, url?: string) {
    const tmpUrl = url || AuthService.userUrl;
    return await ServiceUtils.post('', {userId}, undefined, tmpUrl.concat(AuthService.userAPIUrl, '/changeTheme'));
  }
}

export default AuthService;
