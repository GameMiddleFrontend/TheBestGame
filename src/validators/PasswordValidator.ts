import {BaseValidator} from './BaseValidator';

export class PasswordValidator extends BaseValidator {
  constructor() {
    const validFncs: {text: string; fn: (value: string | undefined) => boolean}[] = [];

    validFncs.push({
      text: 'Длина от 8 до 40 символов',
      fn: (value: string | undefined) => {
        return !!value && value.length >= 8 && value.length <= 40;
      },
    });

    validFncs.push({
      text: 'Неверный формат пароля (большая буква)',
      fn: (value: string | undefined) => {
        return /[A-ZА-ЯЁ]/.test(value || '');
      },
    });

    validFncs.push({
      text: 'Неверный формат пароля (digit)',
      fn: (value: string | undefined) => {
        return /\d/.test(value || '');
      },
    });

    super(validFncs);
  }
}
