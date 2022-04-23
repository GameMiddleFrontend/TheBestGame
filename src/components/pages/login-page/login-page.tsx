import React, {FC, useCallback, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {connect, MapDispatchToPropsParam} from 'react-redux';

import FormComponent from '../../common/form';
import {LoginFormElementsDef} from './types';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import {initialState as authInitialState, Actions as authActions} from '../../../redux/reducers/auth/auth.ducks';

import './login-page.scss';

import {UserLoginItem} from '../../../models/current-user.model';

const loginPageRootClass = 'login-page-container';
const formContainerClass = 'form-container';
const formNameClass = 'form-name';

const canRedirectMessage = 'user already in system';

interface IProps {
  isLoading: boolean;
}

interface IHandler {
  login(data: UserLoginItem): void;
}

const mapStateToProps = (state: IConfiguredStore): IProps => {
  //TODO add Reselect
  const {isLoading} = state && state.auth ? state.auth : authInitialState;
  return {
    isLoading,
  };
};

const mapDispatchToProps: MapDispatchToPropsParam<IHandler, unknown> = {
  login: authActions.login,
};

const LoginPage: FC<IProps & IHandler> = (props) => {
  const navigate = useNavigate();

  const onLoginFormSubmit = useCallback((data: UserLoginItem) => {
    props.login(data);
    //TODO вынести в app redirect для залогиненного пользователя
    // LoginAPI.signIn(data)
    //   .then((result) => {
    //     navigate('/game');
    //   })
    //   .catch((err: Error) => {
    //     if (err.message.toLowerCase() === canRedirectMessage) {
    //       navigate('/game');
    //     }
    //     setPopupMessage(err.message);
    //   });
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
