import React, {MouseEvent, useCallback, useEffect, useState} from 'react';
import Button from '@common/button';

const useFullscreenTrigger = () => {
  const [icon, setIcon] = useState('/images/maximize.svg');

  const changeDocumentFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIcon('/images/minimize.svg');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIcon('/images/maximize.svg');
      }
    }
  };

  const eventListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      changeDocumentFullscreen();
    }
  }, []);

  const handleClickButton = useCallback((e?: MouseEvent) => {
    changeDocumentFullscreen();
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', eventListener);

    return () => {
      window.removeEventListener('keyup', eventListener);
    };
  });

  const FullScreenButton = () => {
    return <Button className={'button-icon-only button-rounded'} icon={icon} onClick={handleClickButton} />;
  };

  return {FullScreenButton};
};

export default useFullscreenTrigger;
