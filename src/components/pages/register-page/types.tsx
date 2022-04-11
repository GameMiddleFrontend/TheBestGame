import {FormElementsDef} from '../../common/form/types';
import {UserLoginItem, UserRegisterItem} from '../../../models/current-user.model';
import {FORM_VALIDATE_PATTERNS} from '../../../utils/validation';

const RegisterFormElementsDef: FormElementsDef<UserRegisterItem>[] = [
  {
    name: 'email',
    label: 'email',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.EMAIL,
  },
  {
    name: 'login',
    label: 'Логин',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.LOGIN,
  },
  {
    name: 'first_name',
    label: 'Имя',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
  {
    name: 'second_name',
    label: 'Фамилия',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
  {
    name: 'phone',
    label: 'Телефон',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PHONE_NUMBER,
  },
  {
    name: 'password',
    label: 'Пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
];

export {RegisterFormElementsDef};
