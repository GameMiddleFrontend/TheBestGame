import React, {FormEvent, useState} from 'react';

import '../../styles/login-page.scss';
import Form from '../form';
import Input from '../input';
import ValidatorFactory from '../../validators';
import {Link} from 'react-router-dom';
import LoginAPI from '../../services/loginAPI';

function LoginPage() {
  return (
    <div className={'login-page-container'}>
      <Form className={'login-form'} formName={'Войти'} onSubmit={(event) => onLoginFormSubmit(event)}>
        <div className={'fields-container'}>
          <Input
            name={'login'}
            placeholder={'Имя'}
            type={'text'}
            className={'login-page-input login-input'}
            containerProps={getContainerProps()}
            labelProps={getLabelProps()}
            validationProps={getInputValidationProps()}
            validator={ValidatorFactory.getValidator('name')}
          />
          <Input
            name={'password'}
            placeholder={'Пароль'}
            type={'password'}
            className={'login-page-input password-input'}
            containerProps={getContainerProps()}
            labelProps={getLabelProps()}
            validationProps={getInputValidationProps()}
            validator={ValidatorFactory.getValidator('password')}
          />
        </div>
        <input type={'submit'} value={'Войти'} className={'sign-in-button'}></input>
        <Link to={'/sign-up'} className={'sign-up-link'}>
          Регистрация
        </Link>
      </Form>
    </div>
  );
}

function getContainerProps() {
  return {
    className: 'input-container',
  };
}

function getLabelProps() {
  return {
    className: 'input-label',
  };
}

function getInputValidationProps() {
  return {
    className: 'input-validate',
  };
}

function onLoginFormSubmit(submit: FormEvent<HTMLFormElement>) {
  submit.preventDefault();
  const form = submit.target as any;
  const body: Record<string, string> = {
    login: form.login.value,
    password: form.password.value,
  };
  LoginAPI.signIn(JSON.stringify(body)).then(onLoginSuccess).catch(onLoginFailure);
}

function onLoginSuccess(result: string) {
  //TODO
}

function onLoginFailure(err: Promise<string>) {
  err.then((errorText) => {
    //TODO
  });
}

export default LoginPage;
