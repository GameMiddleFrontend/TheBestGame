import React, {FC} from 'react';
import {FallbackProps} from '../error-boundary';
import TextEnum from '../../../models/enum/text.enum';

import './error-fallback.scss';

const ErrorFallbackComponent: FC<FallbackProps> = (props: FallbackProps) => {
  return (
    <div className="error-text-container">
      <h2>{TextEnum.ERROR_MSG}</h2>
      <p>{TextEnum.ERROR_MSG_FULL}</p>
    </div>
  );
};

export default ErrorFallbackComponent;
