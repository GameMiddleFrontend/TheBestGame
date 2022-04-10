import {FormikValues} from 'formik';
import APIUtils from './APIUtils';

type SignUpError = {
  reason: string;
};

class SignUpAPI {
  static async signUp(body: FormikValues): Promise<string> {
    const response = await APIUtils.getFetch(
      {
        method: 'POST',
        headers: APIUtils.simpleJsonHeader,
        body: JSON.stringify(body),
        keepalive: true,
        credentials: 'include',
      },
      '/auth/signup',
    );
    let result: SignUpError | string;
    if (!response.ok) {
      result = await response.json();
      throw new Error((result as SignUpError).reason);
    }
    return response.text();
  }
}

export default SignUpAPI;
