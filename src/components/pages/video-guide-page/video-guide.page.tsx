import React from 'react';

import './video-guide.styles.scss';

function VideoGuide() {
  return (
    <div className={'video-guide-container'}>
      <video className={'video-guide-player'} controls autoPlay>
        <source
          src={
            'https://media.istockphoto.com/videos/the-sun-casts-its-beautiful-rays-into-the-fresh-green-forest-time-video-id1134911129'
          }
          type={'video/mp4'}
        />
      </video>
    </div>
  );
}

export default VideoGuide;
