import APIUtils from './APIUtils';

type authError = {
  reason: string;
};

export type authSuccess = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
};

class AuthAPI {
  static async auth(): Promise<authSuccess> {
    const response = await APIUtils.GET('/auth/user');
    const result: authError | authSuccess = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    return result as authSuccess;
  }
}

export default AuthAPI;
