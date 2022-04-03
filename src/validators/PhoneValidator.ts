import {BaseValidator} from './BaseValidator';

export class PhoneValidator extends BaseValidator {
  constructor() {
    const validFncs: {text: string; fn: (value: string | undefined) => boolean}[] = [];

    validFncs.push({
      text: 'Длина от 10 до 15 символов',
      fn: (value: string | undefined) => {
        return !!value && value.length >= 10 && value.length <= 15;
      },
    });

    validFncs.push({
      text: 'Неверный формат телефона',
      fn: (value: string | undefined) => {
        return !/\++\d+/.test(value || '');
      },
    });

    super(validFncs);
  }
}
