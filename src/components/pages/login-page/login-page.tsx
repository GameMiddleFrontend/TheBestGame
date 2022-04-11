import React, {useCallback, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import './login-page.scss';
import LoginAPI from '../../../services/loginAPI';
import {FormikValues} from 'formik';
import 'reactjs-popup/dist/index.css';
import '../../../styles/modal.scss';
import PopupComponent from '../../common/popup';
import FormComponent from '../../common/form';
import {LoginFormElementsDef} from './types';

const loginPageRootClass = 'login-page-container';
const formContainerClass = 'form-container';
const formNameClass = 'form-name';

const canRedirectMessage = 'user already in system';

function LoginPage() {
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

  const onLoginFormSubmit = useCallback((data: FormikValues) => {
    LoginAPI.signIn(data)
      .then((result) => {
        navigate('/game');
      })
      .catch((err: Error) => {
        if (err.message.toLowerCase() === canRedirectMessage) {
          navigate('/game');
        }
        setPopupMessage(err.message);
      });
  }, []);

  const form = useMemo(
    () => (
      <div className={formContainerClass}>
        <div className={formNameClass}>Войти</div>
        <FormComponent
          formElementsDef={LoginFormElementsDef}
          isEditMode={true}
          submitText={'Войти'}
          onSubmit={onLoginFormSubmit}
        />
        <Link to={'/sign-up'} className={'sign-up-link'}>
          {'Регистрация'}
        </Link>
      </div>
    ),
    [],
  );

  return (
    <div className={loginPageRootClass}>
      {form}
      <PopupComponent message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
}

export default LoginPage;
