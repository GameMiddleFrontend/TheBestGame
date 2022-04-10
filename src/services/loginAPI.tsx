import APIUtils from './APIUtils';
import {FormikValues} from 'formik';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: FormikValues): Promise<string> {
    const response = await APIUtils.getFetch(
      {
        method: 'POST',
        headers: APIUtils.simpleJsonHeader,
        body: JSON.stringify(body),
        keepalive: true,
        credentials: 'include',
      },
      '/auth/signin',
    );
    if (response.ok) {
      return response.text();
    }
    const result: LoginErrorRespone = await response.json();
    throw new Error(result?.reason || 'Ошибка входа');
  }
}

export default LoginAPI;
