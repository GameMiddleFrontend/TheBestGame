import * as Yup from 'yup';

export type FormElementsDef<T = any> = {
  name: keyof T & string;
  label: string;
  defaultValue: string;
  validatePattern: any;
};

export const getFormInitialValues = (formElementsDef: FormElementsDef[]) =>
  Object.fromEntries(formElementsDef.map((item) => [item.name, item.defaultValue]));

export const getFormValidationSchema = (formElementsDef: FormElementsDef[]) =>
  Yup.object(Object.fromEntries(formElementsDef.map((item) => [item.name, item.validatePattern])));
