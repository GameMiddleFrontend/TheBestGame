import * as Yup from 'yup';
import {FORM_VALIDATE_PATTERNS} from '../../../utils/validation';

const SignInSchema = Yup.object({
  login: FORM_VALIDATE_PATTERNS.LOGIN,
  password: FORM_VALIDATE_PATTERNS.PASSWORD,
});

export {SignInSchema};
