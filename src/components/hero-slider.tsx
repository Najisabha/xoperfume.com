'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useMediaLoader } from "@/hooks/useMediaLoader";

interface MediaItem {
  type: "image";
  src: string;
  header: string;
  link: string;
}

const DURATION = 4000;

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
  ], [dict]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const nextSlideIndex = (currentSlide + 1) % slides.length;
  const { isLoading } = useMediaLoader(slides);

  const current = slides[currentSlide];

  const goToSlide = useCallback((index: number) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / DURATION) * 100;

      if (newProgress >= 100) {
        goToSlide((currentSlide + 1) % slides.length);
      } else {
        setProgress(Math.min(newProgress, 100));
      }
    }, 16);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSlide, isLoading, goToSlide, slides.length]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 h-[60vh]">
        <div className="animate-pulse h-full w-full bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-12">
      <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl shadow-xl">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative min-w-full h-full">
              <img
                src={slide.src}
                alt={slide.header}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                <Link href={`/${lang}${slide.link}`} className="group">
                  <h2 className="text-white text-3xl md:text-5xl font-light tracking-wide hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                    {slide.header}
                  </h2>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => {
            const isActive = currentSlide === index;
            return (
              <button
                key={index}
                className="relative h-1 w-12 bg-white/30 rounded-full overflow-hidden focus:outline-none"
                onClick={() => goToSlide(index)}
              >
                <div
                  className="absolute inset-0 bg-white rounded-full transition-all duration-100"
                  style={{
                    width: `${isActive ? progress : index < currentSlide ? 100 : 0}%`,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white opacity-50 hover:opacity-100 transition-opacity"
        >
          &#10094;
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white opacity-50 hover:opacity-100 transition-opacity"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
