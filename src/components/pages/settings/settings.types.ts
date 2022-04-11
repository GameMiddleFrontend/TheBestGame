import {FORM_VALIDATE_PATTERNS} from '../../../utils/validation';
import {CurrentUserItem, CurrentUserPasswordItem} from '../../../models/current-user.model';
import {FormElementsDef} from '../../common/form/types';

export const settingsFormElementsDef: FormElementsDef<CurrentUserItem>[] = [
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
    name: 'login',
    label: 'Логин',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
  {
    name: 'email',
    label: 'Почта',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
  {
    name: 'phone',
    label: 'Телефон',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
];

export const settingsPasswordsFormElementsDef: FormElementsDef<CurrentUserPasswordItem>[] = [
  {
    name: 'oldPassword',
    label: 'Старый пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
  {
    name: 'newPassword',
    label: 'Новый пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
  {
    name: 'newPasswordCopy',
    label: 'Повторите новый пароль',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
];
