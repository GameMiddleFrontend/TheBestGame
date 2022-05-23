import React, {useCallback, useMemo, useState} from 'react';

import './register.scss';
import {FormikValues} from 'formik';
import {Link, useNavigate} from 'react-router-dom';
import SignUpAPI from '@services/signUpAPI';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '@styles/modal.scss';
import AuthService from '@services/auth.service';
import FormComponent from '@common/form';
import {RegisterFormElementsDef} from './types';
import TextEnum from '@models/enum/text.enum';
import AppRoutes from '@utils/app-routes';

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
            navigate(AppRoutes.GAME);
          })
          .catch(errorHandler);
      })
      .catch(errorHandler);
  }, []);

  const signUpForm = useMemo(
    () => (
      <div className={formContainerClass}>
        <div className={formNameClass}>{TextEnum.REGISTER}</div>
        <FormComponent
          formElementsDef={RegisterFormElementsDef}
          isEditMode={true}
          submitText={TextEnum.REGISTER}
          onSubmit={onRegisterFormSubmit}
        />
        <Link to={AppRoutes.LOGIN} className={'link'}>
          {TextEnum.LOGIN}
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
