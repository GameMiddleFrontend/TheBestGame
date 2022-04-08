import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import './login-page.scss';
import {Link} from 'react-router-dom';
import LoginAPI from '../../../services/loginAPI';
import {Field, Form, Formik, FormikValues} from 'formik';
import {SignInSchema} from './types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../../styles/modal.scss';
import AuthAPI from '../../../services/authAPI';

const loginPageRootClass = 'login-page-container';

const canRedirectMessage = 'user already in system';

function LoginPage() {
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

  const onLoginFormSubmit = useCallback((data: FormikValues) => {
    LoginAPI.signIn(JSON.stringify(data))
      .then(() => {
        AuthAPI.auth()
          .then(() => {
            navigate('/game');
          })
          .catch((err: Error) => {
            setPopupMessage(err.message);
          });
      })
      .catch((err: Error) => {
        if (err.message === canRedirectMessage) {
          navigate('/game');
        }
        setPopupMessage(err.message);
      });
  }, []);

  const form = useMemo(() => {
    return (
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
            <div className={'auth-input-container fields-container'}>
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
            <div className={'auth-input-container'}>
              <input type={'submit'} value={'Войти'} className={'sign-in-button'} />
              <Link to={'/sign-up'} className={'sign-up-link'}>
                Регистрация
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    );
  }, [onLoginFormSubmit]);

  return (
    <div className={loginPageRootClass}>
      {form}
      <Popup open={!!popupMessage} onClose={() => setPopupMessage('')}>
        {(close: () => void) => (
          <div className={'modal'}>
            <div className={'modal-content'}>{popupMessage}</div>
            <button className={'modal-close-button'} onClick={useCallback(() => close(), [popupMessage])}>
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

export default LoginPage;
