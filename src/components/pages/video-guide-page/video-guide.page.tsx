import React from 'react';

import './video-guide.styles.scss';

import './video.mp4';

function VideoGuide() {
  return (
    <div className={'video-guide-container'}>
      <video className={'video-guide-player'} controls autoPlay>
        <source src={'/video/video.mp4'} type={'video/mp4'} />
      </video>
    </div>
  );
}

export default VideoGuide;
