import React from 'react';
import {Formik} from 'formik';
import {getFormInitialValues, getFormValidationSchema} from './types';
import {IHandlers, IProps} from './form.component';

export function withFormik<P extends IProps & IHandlers>(WrappedComponent: React.ComponentType<P>) {
  return function ComponentWithValidator(props: P) {
    return (
      <Formik
        initialValues={getFormInitialValues(props.formElementsDef)}
        validationSchema={getFormValidationSchema(props.formElementsDef)}
        onSubmit={props.onSubmit}
      >
        <WrappedComponent {...props} />
      </Formik>
    );
  };
}
