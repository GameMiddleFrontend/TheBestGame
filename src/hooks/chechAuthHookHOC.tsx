import {useSelector} from 'react-redux';
import IConfiguredStore from '../redux/reducers/configured-store';
import React from 'react';
import ErrorFallbackComponent from '../components/common/error-fallback';

export function useAuth() {
  const userItem = useSelector((state: IConfiguredStore) => {
    return state.auth.isLoggedIn;
  });

  return userItem;
}

const withAuth = (Component: React.ComponentType) => {
  return ({...props}) => {
    const auth = useAuth();
    return auth ? (
      <Component {...props} />
    ) : (
      <ErrorFallbackComponent
        customMessage={'Доступ запрещен'}
        customMessageHeader={'Для посещения этой страницы вы должны быть авторизованы'}
      />
    );
  };
};

export default withAuth;
