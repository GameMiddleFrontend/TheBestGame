import * as Yup from 'yup';

export type FormElementsDef<T = any> = {
  name: keyof T & string;
  label: string;
  defaultValue: string;
  type?: IInputType;
  validatePattern?: any;
};

export enum IInputType {
  button = 'button',
  checkbox = 'checkbox',
  file = 'file',
  hidden = 'hidden',
  image = 'image',
  password = 'password',
  radio = 'radio',
  reset = 'reset',
  submit = 'submit',
  text = 'text',
}

export const getFormInitialValues = (formElementsDef: FormElementsDef[]) =>
  Object.fromEntries(formElementsDef.map((item) => [item.name, item.defaultValue]));

export const getFormValidationSchema = (formElementsDef: FormElementsDef[]) =>
  Yup.object(Object.fromEntries(formElementsDef.map((item) => [item.name, item.validatePattern])));
