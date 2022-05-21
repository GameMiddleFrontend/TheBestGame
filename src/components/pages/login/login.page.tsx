import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import FormComponent from '@common/form';
import {LoginFormElementsDef} from './types';
import IConfiguredStore from '@store/reducers/configured-store';
import {Actions as authActions, IStore as IAuthStore} from '@store/reducers/auth/auth.ducks';
import {UserLoginItem} from '@models/user.model';

import './login.scss';
import AppRoutes from '@utils/app-routes';
import TextEnum from '@models/enum/text.enum';

const formContainerClass = 'form-container';
const formNameClass = 'form-name';

const LoginPage: FC = (props) => {
  const {isLoggedIn} = useSelector<IConfiguredStore, IAuthStore>((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate(AppRoutes.GAME);
  }, [isLoggedIn]);

  const onLoginFormSubmit = useCallback((data: UserLoginItem) => {
    dispatch(authActions.login(data));
  }, []);

  const form = useMemo(
    () => (
      <div className={formContainerClass}>
        <div className={formNameClass}>{TextEnum.LOGIN}</div>
        <FormComponent
          formElementsDef={LoginFormElementsDef}
          isEditMode={true}
          submitText={TextEnum.LOGIN}
          onSubmit={onLoginFormSubmit}
        />
        <Link to={AppRoutes.REGISTER} className={'link'}>
          {TextEnum.REGISTER}
        </Link>
      </div>
    ),
    [],
  );

  return (
    <div className={'page-container login-container'}>
      {/*TODO добавить лоадер*/}
      {form}
    </div>
  );
};

export default LoginPage;
