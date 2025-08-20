import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TestimonialSlider = ({ slides, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
       <div className="w-full h-full flex items-center justify-center bg-gray-900 p-8">
         <Card className="bg-gray-800/50 border-gray-700 text-white text-center p-8 rounded-2xl">
           <h3 className="text-xl font-bold">Slaytlar Yüklenemedi</h3>
           <p className="text-muted-foreground mt-2">Görseller şu anda mevcut değil. Lütfen yönetici panelinden slayt ekleyin.</p>
         </Card>
       </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const contentVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } },
  };

  const itemVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
        >
          <motion.img
            src={currentSlide.image_url}
            alt={currentSlide.title || 'Authentication background'}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-t ${currentSlide.gradient_colors || 'from-black/90 via-black/60 to-transparent'}`} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end h-full p-10 md:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-white"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] italic">
                “{currentSlide.subtitle}”
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center">
              <Avatar className="h-16 w-16 border-4 border-white/20 flex-shrink-0 shadow-lg">
                <AvatarImage src={currentSlide.avatar_url} alt={currentSlide.title} className="object-cover" />
                <AvatarFallback className="bg-primary/20 text-white font-bold text-2xl">
                  {currentSlide.title ? currentSlide.title.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-5">
                <p className="font-bold text-lg text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                  {currentSlide.title}
                </p>
                <p className="text-md text-white/70">
                  {currentSlide.user_title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-2.5 h-2.5 rounded-full"
                animate={{
                  backgroundColor: index === currentIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.4)',
                  scale: index === currentIndex ? 1.3 : 1,
                }}
                whileHover={{ scale: 1.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialSlider;