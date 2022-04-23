import * as Yup from 'yup';
import {FORM_VALIDATE_PATTERNS} from '../../../utils/validation';
import {CurrentUserItem, CurrentUserPasswordItem} from '../../../models/user.model';
import {FormElementsDef, IInputType} from '../../common/form/types';

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
    validatePattern: FORM_VALIDATE_PATTERNS.LOGIN,
  },
  {
    name: 'email',
    label: 'Почта',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.EMAIL,
  },
  {
    name: 'phone',
    label: 'Телефон',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.PHONE_NUMBER,
  },
];

export const settingsEditFormElementsDef: FormElementsDef<CurrentUserItem>[] = [
  {
    name: 'display_name',
    label: 'Имя в чате',
    defaultValue: '',
    validatePattern: FORM_VALIDATE_PATTERNS.USER_NAME,
  },
  ...settingsFormElementsDef,
];

export const settingsPasswordsFormElementsDef: FormElementsDef<CurrentUserPasswordItem>[] = [
  {
    name: 'oldPassword',
    label: 'Старый пароль',
    defaultValue: '',
    type: IInputType.password,
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
  {
    name: 'newPassword',
    label: 'Новый пароль',
    defaultValue: '',
    type: IInputType.password,
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD,
  },
  {
    name: 'newPasswordCopy',
    label: 'Повторите новый пароль',
    defaultValue: '',
    type: IInputType.password,
    validatePattern: FORM_VALIDATE_PATTERNS.PASSWORD.oneOf([Yup.ref('newPassword')], 'Введенные пароли не совпадают'),
  },
];
