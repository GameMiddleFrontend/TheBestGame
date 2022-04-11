import React, {useCallback, useState, FC, useEffect} from 'react';
import Popup from 'reactjs-popup';
import {PopupProps} from './types';

const PopupComponent: FC<PopupProps> = ({message, onClose}) => {
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => setPopupMessage(message), [message]);

  return (
    <Popup open={!!popupMessage} onClose={() => onClose()}>
      {(close: () => void) => (
        <div className={'modal'}>
          <div className={'modal-content'}>{popupMessage}</div>
          <button className={'modal-close-button'} onClick={() => close()}>
            Закрыть
          </button>
        </div>
      )}
    </Popup>
  );
};

export default PopupComponent;
