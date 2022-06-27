import {FormikValues} from 'formik';
import ServiceUtils from './service.utils';

class SignUpAPI {
  static async signUp(body: FormikValues): Promise<string> {
    const response = await ServiceUtils.post('/auth/signup', body);
    return response;
  }
}

export default SignUpAPI;
