import {BaseValidator} from './BaseValidator';

export class LoginValidator extends BaseValidator {
  constructor() {
    const validFncs: {text: string; fn: (value: string | undefined) => boolean}[] = [];

    validFncs.push({
      text: 'Нет букв',
      fn: (value: string | undefined) => {
        return /\w+/.test(value || '');
      },
    });

    validFncs.push({
      text: 'От 3 до 20 символов',
      fn: (value: string | undefined) => {
        return !!value && value.length >= 3 && value.length <= 20;
      },
    });

    validFncs.push({
      text: 'Только латинница',
      fn: (value: string | undefined) => {
        return !/[а-яёА-ЯЁ]/.test(value || '');
      },
    });

    validFncs.push({
      text: 'Есть спецсимволы или пробел',
      fn: (value: string | undefined) => {
        return !/[''&<>\s]/.test(value || '');
      },
    });

    super(validFncs);
  }
}
