import {FormElementsDef} from '../../common/form/types';
import {UserLoginItem} from '../../../models/user.model';
import {FORM_VALIDATE_PATTERNS} from '../../../utils/validation';

const LoginFormElementsDef: FormElementsDef<UserLoginItem>[] = [
  {
    name: 'login',
    label: 'Логин',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.LOGIN,
  },
  {
    name: 'password',
    label: 'Пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
];

export {LoginFormElementsDef};
