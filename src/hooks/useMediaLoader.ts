import { useState, useEffect } from 'react';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
};

export const useMediaLoader = (mediaItems: MediaItem[]) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      const promises = mediaItems.map((item) => {
        return new Promise((resolve, reject) => {
          if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.onloadeddata = () => resolve(item);
            video.onerror = reject;
          } else {
            const img = new Image();
            img.src = item.src;
            img.onload = () => resolve(item);
            img.onerror = reject;
          }
        });
      });

      try {
        await Promise.all(promises);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load media:', error);
        setIsLoading(false);
      }
    };

    loadMedia();
  }, []);

  return { isLoading };
};
