'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useMediaLoader } from "@/hooks/useMediaLoader";

interface MediaItem {
  type: "video" | "image";
  src: string;
  header: string;
  link: string;
  title?: string;
  description?: string;
}

const DURATION = {
  image: 4000,
  video: 15000,
} as const;

const HeroSlider = ({ lang, dict }: { lang: string; dict: any }) => {
  const slides: MediaItem[] = useMemo(() => [
    {
      type: "image" as const,
      src: "/assets/banners/men-perfume.png",
      header: dict.men,
      link: "/shop/men-perfume",
    },
    {
      type: "image",
      src: "/assets/banners/women-perfume.png",
      header: dict.women,
      link: "/shop/women-perfume",
    },
    {
      type: "image",
      src: "/assets/banners/makeup-beauty.png",
      header: dict.beauty,
      link: "/shop/makeup-beauty",
    },
    {
      type: "video",
      src: "/assets/videos/hero.mp4",
      header: dict.explore,
      link: "/shop",
      title: "",
      description: dict.explore_desc
    },
  ], [dict]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload next slide
  const nextSlideIndex = useMemo(() => (currentSlide + 1) % slides.length, [currentSlide, slides.length]);
  const { isLoading } = useMediaLoader([slides[currentSlide], slides[nextSlideIndex]]);

  const current = useMemo(() => slides[currentSlide], [currentSlide, slides]);

  const goToSlide = useCallback((index: number) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const duration = DURATION[current.type];
    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / duration) * 100;

      if (newProgress >= 100) {
        goToSlide(nextSlideIndex);
      } else {
        setProgress(Math.min(newProgress, 100));
      }
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [currentSlide, isLoading, current.type, goToSlide, nextSlideIndex]);

  const handleVideoEnded = useCallback(() => {
    goToSlide(nextSlideIndex);
  }, [goToSlide, nextSlideIndex]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-100">
        <div className="animate-pulse h-full w-full bg-gradient-to-r from-gray-100 to-gray-200" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {current.type === "video" ? (
        <>
          <video
            ref={videoRef}
            key={current.src}
            src={current.src}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnded}
            onError={(e) => console.error('Video loading error:', e)}
          />
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </>
      ) : (
        <>
          <img
            src={current.src}
            alt={current.header}
            className="absolute inset-0 h-full w-full object-cover"
            loading={currentSlide === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
          {/* Preload next image */}
          {slides[nextSlideIndex].type === 'image' && (
            <link
              rel="preload"
              as="image"
              href={slides[nextSlideIndex].src}
              key={slides[nextSlideIndex].src}
            />
          )}
        </>
      )}

      {/* Content Section with improved contrast */}
      <div className="absolute inset-0 h-32 my-auto flex flex-col items-center justify-center text-center text-white z-20 p-4">
        <h1 className="text-3xl md:text-5xl font-light mb-4 drop-shadow-lg">
          {current.title}
        </h1>
        <p className="text-base md:text-lg max-w-2xl mb-8 px-4 drop-shadow">
          {current.description}
        </p>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Header and Navigation */}
      <div className="relative z-10 flex h-full items-end justify-center lg:pb-12 pb-40">
        <button
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="me-4 text-3xl px-8 text-white"
        >
          &#10094;
        </button>
        <Link href={`/${lang}${current.link}`}>
          <h2 className="text-white text-4xl text-center">{current.header}</h2>
        </Link>
        <button
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="ms-4 text-3xl px-8 text-white"
        >
          &#10095;
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => {
          const isActive = currentSlide === index;
          return (
            <button
              key={index}
              className="relative h-1 w-16 bg-white/30 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
            >
              <div
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  width: `${isActive ? progress : index < currentSlide ? 100 : 0}%`,
                  transition: 'width 10ms linear'
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSlider;
