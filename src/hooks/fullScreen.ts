import {useCallback, useEffect} from 'react';

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
