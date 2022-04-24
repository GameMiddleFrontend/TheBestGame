import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {connect, MapDispatchToPropsParam} from 'react-redux';
import {compose} from 'redux';

import FormComponent from '../../common/form';
import {LoginFormElementsDef} from './types';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import {initialState as authInitialState, Actions as authActions} from '../../../redux/reducers/auth/auth.ducks';
import {UserLoginItem} from '../../../models/user.model';

import './login-page.scss';
import withAuth from '../../../hooks/chechAuthHookHOC';

const loginPageRootClass = 'login-page-container';
const formContainerClass = 'form-container';
const formNameClass = 'form-name';

const canRedirectMessage = 'user already in system';

interface IProps {
  isLoading: boolean;
  isLoggedIn: boolean;
}

interface IHandler {
  login(data: UserLoginItem): void;
}

const mapStateToProps = (state: IConfiguredStore): IProps => {
  //TODO add Reselect
  const {isLoading, isLoggedIn} = state && state.auth ? state.auth : authInitialState;
  return {
    isLoading,
    isLoggedIn,
  };
};

const mapDispatchToProps: MapDispatchToPropsParam<IHandler, unknown> = {
  login: authActions.login,
};

const LoginPage: FC<IProps & IHandler> = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.isLoggedIn && navigate('/game');
  }, [props.isLoggedIn]);

  const onLoginFormSubmit = useCallback((data: UserLoginItem) => {
    props.login(data);
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
