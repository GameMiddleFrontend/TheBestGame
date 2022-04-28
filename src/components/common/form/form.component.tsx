import React, {FC, useEffect} from 'react';
import {Field, Form, FormikValues, useFormikContext} from 'formik';
import {FormElementsDef, IInputType} from './types';
import {withFormik} from './formik-wrapper.component';
import Button from '../button';

import './form.scss';

export interface IProps {
  formElementsDef: FormElementsDef[];
  values?: Record<string, unknown>;
  isEditMode?: boolean;
  submitText?: string;
}

export interface IHandlers {
  onSubmit(values: FormikValues): void;
}

const FormComponent: FC<IProps & IHandlers> = (props: IProps & IHandlers) => {
  const {setValues, errors, touched} = useFormikContext<any>();

  useEffect(() => {
    props.values && setValues(props.values);
  }, [props.values]);

  return (
    <Form className={'form'}>
      <div className={'form-items-container form-fields-container'}>
        {props.formElementsDef.map((field) => {
          return (
            <div key={field.name} className={'form-input-container'}>
              <Field
                name={field.name}
                placeholder={field.label}
                type={field.type ?? IInputType.text}
                className={`form-input${errors[field.name] && touched[field.name] ? ' form-input-invalid' : ''}`}
                disabled={!props.isEditMode}
              />
              {errors[field.name] && touched[field.name] ? (
                <div className="input-validator">{errors[field.name]}</div>
              ) : null}
            </div>
          );
        })}
      </div>
      {props.isEditMode && props.submitText && (
        <div className={'form-items-container'}>
          <Button className={'auth-button'} type={'submit'}>
            {props.submitText}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default withFormik(FormComponent);
