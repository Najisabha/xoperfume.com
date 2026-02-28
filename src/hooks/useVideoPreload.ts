import { useEffect } from 'react';

export const useVideoPreload = (videoSources: string[]) => {
  useEffect(() => {
    const videos = videoSources.map(src => {
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto';
      return video;
    });

    return () => {
      videos.forEach(video => {
        video.src = '';
      });
    };
  }, [videoSources]);
};
