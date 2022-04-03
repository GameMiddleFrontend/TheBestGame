export class BaseValidator {
  protected validationFunctions: {text: string; fn: (value: string | undefined) => boolean}[];

  constructor(validFncs?: {text: string; fn: (value: string | undefined) => boolean}[]) {
    validFncs = validFncs || [];
    validFncs.push({
      text: 'Заполните поле',
      fn: (value: string | undefined) => {
        return !!value;
      },
    });
    this.validationFunctions = validFncs;
  }

  checkValid(value: string): string | undefined {
    for (let i = 0; i < this.validationFunctions.length; i++) {
      const current: {text: string; fn: (value: string | undefined) => boolean} = this.validationFunctions[i];
      if (!current.fn(value)) {
        return current.text;
      }
    }
  }
}
