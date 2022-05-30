import React, {FC, useEffect, useRef} from 'react';
import MediaAudioTypes from '@common/media-audio/media.audio.types';

import './media.audio.styles.scss';

const MediaAudio: FC<MediaAudioTypes> = ({src, codec}) => {
  const audio = useRef<HTMLAudioElement>(null);

  const onSourceOpen = function () {
    const sourceBuffer = this.addSourceBuffer(codec);
    getBuffer(src, (buf: Response) => {
      sourceBuffer.addEventListener('updateend', () => {
        this.endOfStream();
      });
      sourceBuffer.appendBuffer(buf);
    });
  };

  useEffect(() => {
    if ('MediaSource' in window && MediaSource.isTypeSupported(codec) && audio && audio.current) {
      const mediaSource = new MediaSource();
      audio.current.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', onSourceOpen);
    } else {
      console.error('Unsupported MIME type or codec: ', codec);
    }
  }, []);

  return <audio className={'media-audio'} muted={true} controls={true} ref={audio} />;
};

function getBuffer(url: string, cb: (response: Response) => void) {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    cb(xhr.response);
  };
  xhr.send();
}

export default MediaAudio;
