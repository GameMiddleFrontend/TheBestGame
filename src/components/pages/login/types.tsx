import {FormElementsDef, IInputType} from '@common/form/types';
import {UserLoginItem} from '@models/user.model';
import {FORM_VALIDATE_PATTERNS} from '@utils/validation';

const LoginFormElementsDef: FormElementsDef<UserLoginItem>[] = [
  {
    name: 'login',
    label: 'Логин',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.LOGIN,
    type: IInputType.text,
  },
  {
    name: 'password',
    label: 'Пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
    type: IInputType.password,
  },
];

export {LoginFormElementsDef};
