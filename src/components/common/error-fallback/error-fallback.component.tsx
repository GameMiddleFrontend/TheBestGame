import React, {FC} from 'react';
import {FallbackProps} from '../error-boundary';

import './error-fallback.scss';

const ErrorFallbackComponent: FC<FallbackProps> = (props: FallbackProps) => {
  return (
    <div className="error-text-container">
      {/*TODO вынести в enum*/}
      <h2>{'Что-то пошло не так ^_^'}</h2>
      <p>{'Возникла непредвиденная ошибка. Обратитесь к разработчикам'}</p>
    </div>
  );
};

export default ErrorFallbackComponent;
