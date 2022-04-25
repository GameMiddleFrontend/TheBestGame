import {useSelector} from 'react-redux';
import IConfiguredStore from '../redux/reducers/configured-store';
import React from 'react';
import ErrorFallbackComponent from '../components/common/error-fallback';
import TextEnum from '../models/enum/text.enum';

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
      <ErrorFallbackComponent customMessage={TextEnum.AUTH_WARNING} customMessageHeader={TextEnum.AUTH_WARNING_FULL} />
    );
  };
};

export default withAuth;
