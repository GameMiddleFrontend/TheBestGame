import React, {FormEvent} from 'react';

import '../../../styles/login-page.scss';
import {Link} from 'react-router-dom';
import LoginAPI from '../../../services/loginAPI';
import {Field, Form, Formik, FormikValues} from 'formik';
import {SignInSchema} from './types';

function LoginPage() {
  return (
    <div className={'login-page-container'}>
      <Formik
        initialValues={{
          login: '',
          password: '',
        }}
        validationSchema={SignInSchema}
        onSubmit={(values) => {
          onLoginFormSubmit(values);
        }}
      >
        {({errors, touched}) => (
          <Form className={'login-form'}>
            <div className={'form-name'}>Войти</div>
            <div className={'form-container fields-container'}>
              <Field name={'login'} placeholder={'Имя'} type={'text'} className={'login-page-input login-input'} />
              {errors.login && touched.login ? <div {...getValidatorConfig()}>{errors.login}</div> : null}
              <Field
                name={'password'}
                placeholder={'Пароль'}
                type={'password'}
                className={'login-page-input password-input'}
              />
              {errors.password && touched.password ? <div {...getValidatorConfig()}>{errors.password}</div> : null}
            </div>
            <div className={'form-container'}>
              <input type={'submit'} value={'Войти'} className={'sign-in-button'}></input>
              <Link to={'/sign-up'} className={'sign-up-link'}>
                Регистрация
              </Link>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}

function getValidatorConfig() {
  return {
    className: 'input-validator',
  };
}

function onLoginFormSubmit(data: FormikValues) {
  LoginAPI.signIn(JSON.stringify(data)).then(onLoginSuccess).catch(onLoginFailure);
}

function onLoginSuccess(result: string) {
  //TODO
}

function onLoginFailure(err: Promise<string>) {
  err.then((errorText) => {
    //TODO
  });
}

export default LoginPage;
