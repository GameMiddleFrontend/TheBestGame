import {FormikValues} from 'formik';
import AuthService, {authSuccess} from './auth.service';
import ServiceUtils from './service.utils';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: FormikValues): Promise<authSuccess> {
    return await ServiceUtils.post(`/auth/signin`, body);
  }
}

export default LoginAPI;
