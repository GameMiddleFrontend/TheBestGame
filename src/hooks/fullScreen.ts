import {useCallback, useEffect} from 'react';

/**можно прокидывать наружу колбеки и флаг есть ли фулскрин. Можно давбавить кнопку для открытия фулскрина */
const useFullscreenTrigger = () => {
  const eventListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', eventListener);

    return () => {
      window.removeEventListener('keyup', eventListener);
    };
  });
};

export default useFullscreenTrigger;
