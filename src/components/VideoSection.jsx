import React from 'react';
import '../assets/styles/VideoSection.css';
import sampleVideo from '../assets/images/Video.mp4'; // replace with your actual path

function VideoSection() {
  return (
    <section className="video-section">
      <video
        className="section-video"
        src={sampleVideo}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
}

export default VideoSection;
