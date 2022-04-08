import React, {useCallback, useMemo, useState} from 'react';

import './register-page.scss';
import {Field, Form, Formik, FormikValues} from 'formik';
import {Link} from 'react-router-dom';
import {RegisterSchema} from './types';
import SignUpAPI from '../../../services/signUpAPI';
import Popup from 'reactjs-popup';

const registerPageRootClass = 'login-page-container';

function RegisterPage() {
  const [popupMessage, setPopupMessage] = useState('');

  const onRegisterFormSubmit = useCallback((values: FormikValues) => {
    SignUpAPI.signUp(JSON.stringify(values)).then().catch();
  }, []);

  const signUpForm = useMemo(
    () => (
      <Formik
        initialValues={{
          email: '',
          login: '',
          first_name: '',
          second_name: '',
          phone: '',
          password: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          onRegisterFormSubmit(values);
        }}
      >
        {({errors, touched}) => (
          <Form className={'login-form'}>
            <div className={'form-name'}>Регистрация</div>
            <div className={'auth-input-container fields-container'}>
              <Field name={'email'} placeholder={'Email'} type={'text'} className={'login-page-input login-input'} />
              {errors.email && touched.email ? <div {...getValidatorConfig()}>{errors.email}</div> : null}

              <Field name={'login'} placeholder={'Логин'} type={'text'} className={'login-page-input login-input'} />
              {errors.login && touched.login ? <div {...getValidatorConfig()}>{errors.login}</div> : null}

              <Field name={'first_name'} placeholder={'Имя'} type={'text'} className={'login-page-input login-input'} />
              {errors.first_name && touched.first_name ? (
                <div {...getValidatorConfig()}>{errors.first_name}</div>
              ) : null}

              <Field
                name={'second_name'}
                placeholder={'Фамилия'}
                type={'text'}
                className={'login-page-input login-input'}
              />
              {errors.second_name && touched.second_name ? (
                <div {...getValidatorConfig()}>{errors.second_name}</div>
              ) : null}

              <Field name={'phone'} placeholder={'Телефон'} type={'text'} className={'login-page-input login-input'} />
              {errors.phone && touched.phone ? <div {...getValidatorConfig()}>{errors.phone}</div> : null}

              <Field
                name={'password'}
                placeholder={'Пароль'}
                type={'password'}
                className={'login-page-input password-input'}
              />
              {errors.password && touched.password ? <div {...getValidatorConfig()}>{errors.password}</div> : null}
            </div>
            <div className={'auth-input-container'}>
              <input type={'submit'} value={'Зарегистрироваться'} className={'sign-in-button'} />
              <Link to={'/'} className={'sign-up-link'}>
                На главную
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    ),
    [onRegisterFormSubmit],
  );

  return (
    <div className={registerPageRootClass}>
      {signUpForm}
      <Popup open={!!popupMessage} onClose={() => setPopupMessage('')}>
        {(close: () => void) => (
          <div className={'modal'}>
            <div className={'modal-content'}>{popupMessage}</div>
            <button className={'modal-close-button'} onClick={() => close()}>
              Закрыть
            </button>
          </div>
        )}
      </Popup>
    </div>
  );
}

function getValidatorConfig() {
  return {
    className: 'input-validator',
  };
}

export default RegisterPage;
