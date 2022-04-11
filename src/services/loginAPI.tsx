import APIUtils from './APIUtils';
import {FormikValues} from 'formik';
import AuthAPI, {authSuccess} from './authAPI';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: FormikValues): Promise<authSuccess> {
    const response = await APIUtils.POST('/auth/signin', body);
    if (!response.ok) {
      const result: LoginErrorRespone = await response.json();
      throw new Error(result?.reason || 'Ошибка входа');
    }
    return AuthAPI.auth();
  }
}

export default LoginAPI;
