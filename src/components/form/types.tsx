import {FormHTMLAttributes} from 'react';

type FormProps = {
  formName?: string;
} & FormHTMLAttributes<HTMLFormElement>;

type FormState = {
  isValid: boolean;
};

export {FormProps, FormState};
