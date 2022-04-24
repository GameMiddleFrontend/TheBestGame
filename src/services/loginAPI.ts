import {FormikValues} from 'formik';
import ServiceUtils from './service.utils';
import {CurrentUserItem} from '../models/user.model';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: FormikValues): Promise<CurrentUserItem> {
    return await ServiceUtils.post(`/auth/signin`, body);
  }
}

export default LoginAPI;
