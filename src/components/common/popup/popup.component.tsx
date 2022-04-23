import React, {useState, FC, useEffect, useCallback} from 'react';
import Popup from 'reactjs-popup';
import {PopupProps} from './types';

import 'reactjs-popup/dist/index.css';

const PopupComponent: FC<PopupProps> = ({message}) => {
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => setPopupMessage(message), [message]);

  const handleClosePopup = useCallback(
    (close: () => void) => {
      close();
      setPopupMessage('');
    },
    [popupMessage],
  );

  return (
    <Popup open={!!popupMessage}>
      {(close: () => void) => (
        <div className={'modal'}>
          {/*TODO добавить title*/}
          <div className={'modal-content'}>{popupMessage}</div>
          <button className={'modal-close-button'} onClick={handleClosePopup.bind(null, close)}>
            Закрыть
          </button>
        </div>
      )}
    </Popup>
  );
};

export default PopupComponent;
