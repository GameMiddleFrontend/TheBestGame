import React, {FC} from 'react';
import {OAuthHandlers, OAuthTypes} from '@common/oauth/oauth.types';

import './oauth.styles.scss';

const OAuth: FC<OAuthTypes & OAuthHandlers> = ({src, onClick}) => {
  return (
    <div className={'oauth-wrapper'}>
      <img src={src} className={'oauth-img'} onClick={onClick} />
    </div>
  );
};

export default OAuth;
