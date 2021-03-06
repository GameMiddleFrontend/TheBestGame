import {FormElementsDef, IInputType} from '@common/form/types';
import {UserRegisterItem} from '@models/user.model';
import {FORM_VALIDATE_PATTERNS} from '@utils/validation';

const RegisterFormElementsDef: FormElementsDef<UserRegisterItem>[] = [
  {
    name: 'email',
    label: 'email',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.EMAIL,
    type: IInputType.text,
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
    type: IInputType.password,
  },
];

export {RegisterFormElementsDef};
