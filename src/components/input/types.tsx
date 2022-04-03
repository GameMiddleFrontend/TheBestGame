import React, {PureComponent, InputHTMLAttributes, HTMLAttributes} from 'react';
import {BaseValidator} from '../../validators/BaseValidator';

type InputProps = {
  containerProps: HTMLAttributes<HTMLDivElement>;
  labelProps: HTMLAttributes<HTMLDivElement>;
  validationProps: HTMLAttributes<HTMLDivElement>;
  alwaysShowLabel?: boolean;
  neverShowLabel?: boolean;
  validator?: BaseValidator;
  onValidate?: (fieldName: string | undefined, validateMessage: string | undefined) => void;
} & InputHTMLAttributes<HTMLInputElement>;

type InputState = {
  shouldShowLabel: boolean;
  validationMessage: string | undefined;
};

export {InputProps, InputState};
