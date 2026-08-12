import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';
import './ProjectCarousel.css';

interface ProjectCarouselProps {
  images: string[];
  title: string;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ images, title }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const count = images?.length ?? 0;

  const paginate = (newDirection: number) => {
    if (count === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = count - 1;
      if (nextIndex >= count) nextIndex = 0;
      return nextIndex;
    });
  };

  // Keyboard navigation — sempre registrado; decide dentro do handler
  useEffect(() => {
    if (count === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isActive = isLightboxOpen || !!document.activeElement?.closest('.project-carousel-container');
      if (!isActive) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, count]);

  // Scroll-lock enquanto o lightbox está aberto
  useEffect(() => {
    if (!isLightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isLightboxOpen]);

  if (count === 0) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="project-carousel-wrapper">
      <div className="project-carousel-container" tabIndex={0}>
        <div className="project-carousel-main" onClick={() => setIsLightboxOpen(true)}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset, velocity }) => {
                const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -10000) paginate(1);
                else if (swipe > 10000) paginate(-1);
              }}
              className="carousel-image"
              alt={`${title} - screenshot ${currentIndex + 1}`}
            />
          </AnimatePresence>

          <div className="carousel-ui-overlay">
            {images.length > 1 && (
              <>
                <button
                  className="carousel-nav prev"
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="carousel-nav next"
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              </>
            )}

            <div className="carousel-zoom-hint">
              <FiMaximize2 />
              <span>{t('projectDetail.zoomHint')}</span>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                aria-label={`Go to image ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div 
                      layoutId="active-indicator"
                      className="active-pillar"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                className="lightbox-image"
                alt={`${title} full size`}
              />
              
              <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
                <FiX />
              </button>

              {images.length > 1 && (
                <div className="lightbox-nav-container">
                    <button className="lightbox-nav prev" onClick={() => paginate(-1)}>
                        <FiChevronLeft />
                    </button>
                    <span className="lightbox-counter">
                        {currentIndex + 1} / {images.length}
                    </span>
                    <button className="lightbox-nav next" onClick={() => paginate(1)}>
                        <FiChevronRight />
                    </button>
                </div>
              )}

              <p className="lightbox-title">{title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
