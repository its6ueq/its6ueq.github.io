import React from 'react';
import './BackgroundVideo.css';

interface BackgroundVideoProps {
  videoSrc: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoSrc }) => {
  return (
    <div className="background-container">
      <video 
        className="background-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
      <div className="background-overlay"></div>
    </div>
  );
};

export default BackgroundVideo;
