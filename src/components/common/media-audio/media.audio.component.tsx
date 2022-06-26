import React, {FC, useEffect, useRef, useState} from 'react';
import MediaAudioTypes from '@common/media-audio/media.audio.types';
import Button from '@common/button';

import '@images/volume.svg';
import '@images/mute.svg';

import './media.audio.styles.scss';

const MediaAudio: FC<MediaAudioTypes> = ({src, codec}) => {
  const [isMute, setMute] = useState(true);
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

  const handleClick = () => {
    if (audio.current) {
      if (audio.current.paused && isMute) {
        audio.current.play();
      }

      setMute(!isMute);
    }
  };

  return (
    <>
      <Button
        className={'button-icon-only button-rounded button-media-audio'}
        icon={isMute ? '/images/mute.svg' : '/images/volume.svg'}
        onClick={handleClick}
      />
      <audio className={'media-audio'} muted={isMute} controls={true} ref={audio} autoPlay={true} loop />
    </>
  );
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
