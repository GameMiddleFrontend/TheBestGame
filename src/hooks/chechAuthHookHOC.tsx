import {useSelector} from 'react-redux';
import React from 'react';

import IConfiguredStore from '@store/reducers/configured-store';
import ErrorFallbackComponent from '@components/common/error-fallback';
import TextEnum from '@models/enum/text.enum';

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
