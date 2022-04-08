import React, {FC} from 'react';
import {Field, Form, Formik, FormikValues} from 'formik';
import {FormElementsDef, getFormInitialValues, getFormValidationSchema} from './types';

import './form.scss';

interface IProps {
  formElementsDef: FormElementsDef[];
  isEditMode?: boolean;
  submitText?: string;
}

interface IHandlers {
  onSubmit(values: FormikValues): void;
}

const FormComponent: FC<IProps & IHandlers> = (props: IProps & IHandlers) => {
  return (
    <Formik
      initialValues={getFormInitialValues(props.formElementsDef)}
      validationSchema={getFormValidationSchema(props.formElementsDef)}
      onSubmit={props.onSubmit}
    >
      {({errors, touched}) => (
        <Form className={'form'}>
          <div className={'form-items-container form-fields-container'}>
            {props.formElementsDef.map((field) => {
              return (
                <div key={field.name} className={'form-input-container'}>
                  <Field
                    name={field.name}
                    placeholder={field.label}
                    type={'text'}
                    className={'form-input'}
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
              <button type={'submit'}>{props.submitText}</button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
