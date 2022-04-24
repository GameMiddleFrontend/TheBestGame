import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import FormComponent from '../../common/form';
import {LoginFormElementsDef} from './types';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import {Actions as authActions, IStore as IAuthStore} from '../../../redux/reducers/auth/auth.ducks';
import {UserLoginItem} from '../../../models/user.model';

import './login-page.scss';

const loginPageRootClass = 'login-page-container';
const formContainerClass = 'form-container';
const formNameClass = 'form-name';

const canRedirectMessage = 'user already in system';

const LoginPage: FC = (props) => {
  const {isLoading, isLoggedIn} = useSelector<IConfiguredStore, IAuthStore>((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate('/game');
  }, [isLoggedIn]);

  const onLoginFormSubmit = useCallback((data: UserLoginItem) => {
    dispatch(authActions.login(data));
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
      {/*TODO добавить лоадер*/}
      {form}
    </div>
  );
};

export default LoginPage;
