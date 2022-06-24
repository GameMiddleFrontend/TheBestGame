import ServiceUtils from './service.utils';
import {CurrentUserItem} from '@models/user.model';
import AxiosUtils from '@services/server.fetch';

type authError = {
  reason: string;
};

const _authBaseUrl = '/auth';

const _baseURL = 'https://ya-praktikum.tech/api/v2';

class AuthService {
  static createUserProcess = false;
  static async auth(cookieHeader?: string): Promise<CurrentUserItem> {
    const axiosOptions: any = {
      withCredentials: true,
    };
    if (cookieHeader) {
      axiosOptions.headers = {
        Cookie: cookieHeader,
      };
    }
    const response = await AxiosUtils.get(_baseURL.concat(`${_authBaseUrl}/user`), undefined, axiosOptions);
    const result = response.data;
    if (response.status !== 200) {
      throw new Error('Ошибка аутентификации');
    }
    if (!AuthService.createUserProcess) {
      AuthService.createUserProcess = true;
      await AuthService.createDBUser(result as CurrentUserItem);
      AuthService.createUserProcess = false;
    }
    return result as CurrentUserItem;
  }

  static async logout() {
    return await ServiceUtils.post(`${_authBaseUrl}/logout`);
  }

  static async createDBUser(user: CurrentUserItem) {
    return AxiosUtils.post('http://localhost:3000/api/v1/user'.concat('/add'), user, {withCredentials: true});
  }
}

export default AuthService;
