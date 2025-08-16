import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface SliderImage {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
}

interface ImageSliderProps {
  images: SliderImage[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function ImageSlider({ 
  images, 
  autoPlay = true, 
  interval = 5000, 
  showControls = true, 
  showIndicators = true,
  className = "" 
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full h-96 bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Main Image Display */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {image.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed opacity-90">
                  {image.description}
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-temer-blue hover:bg-temer-blue-dark text-white px-8 py-3">
                    Explore Properties
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-12 w-12 rounded-full"
            onClick={goToPrevious}
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-12 w-12 rounded-full"
            onClick={goToNext}
            data-testid="button-slider-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              data-testid={`button-indicator-${index}`}
            />
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temer-blue"></div>
        </div>
      )}
    </div>
  );
}