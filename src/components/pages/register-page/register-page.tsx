import React, {useCallback, useMemo, useState} from 'react';

import './register-page.scss';
import {FormikValues} from 'formik';
import {Link, useNavigate} from 'react-router-dom';
import SignUpAPI from '../../../services/signUpAPI';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../../styles/modal.scss';
import AuthService from '../../../services/auth.service';
import FormComponent from '../../common/form';
import {RegisterFormElementsDef} from './types';

const registerPageRootClass = 'login-container';
const formContainerClass = 'form-container';
const formNameClass = 'form-name';

function RegisterPage() {
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const errorHandler = (err: Error) => {
    setPopupMessage(err.message);
  };

  const onRegisterFormSubmit = useCallback((values: FormikValues) => {
    SignUpAPI.signUp(values)
      .then(() => {
        AuthService.auth()
          .then(() => {
            navigate('/game');
          })
          .catch(errorHandler);
      })
      .catch(errorHandler);
  }, []);

  const signUpForm = useMemo(
    () => (
      <div className={formContainerClass}>
        <div className={formNameClass}>Зарегистрироваться</div>
        <FormComponent
          formElementsDef={RegisterFormElementsDef}
          isEditMode={true}
          submitText={'Зарегистрироваться'}
          onSubmit={onRegisterFormSubmit}
        />
        <Link to={'/sign-in'} className={'sign-up-link'}>
          {'Войти'}
        </Link>
      </div>
    ),
    [],
  );

  return (
    <div className={'page-container login-container'}>
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

export default RegisterPage;
