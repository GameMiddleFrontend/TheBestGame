import APIUtils from './service.utils';
import {FormikValues} from 'formik';
import AuthService, {authSuccess} from './auth.service';

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
    return AuthService.auth();
  }
}

export default LoginAPI;
