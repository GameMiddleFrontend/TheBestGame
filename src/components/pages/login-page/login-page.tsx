import React, {useCallback} from 'react';

import '../../../styles/login-page.scss';
import {Link} from 'react-router-dom';
import LoginAPI from '../../../services/loginAPI';
import {Field, Form, Formik, FormikValues} from 'formik';
import {SignInSchema} from './types';

const loginPageRootClass = 'login-page-container';

function LoginPage() {
  const onLoginFormSubmit = useCallback((data: FormikValues) => {
    LoginAPI.signIn(JSON.stringify(data)).then().catch();
  }, []);

  return (
    <div className={loginPageRootClass}>
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
              <input type={'submit'} value={'Войти'} className={'sign-in-button'} />
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

export default LoginPage;
