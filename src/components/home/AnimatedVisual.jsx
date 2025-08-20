import React from 'react';
import { motion } from 'framer-motion';

const AnimatedVisual = () => {
  const images = {
    laptop: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/8e4da15f7992a68d2379afd09d9b840c.png',
    tablet: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/10bb739c5df82a97d762dcd29e1a7d3e.png',
    phone: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/8ea15bcadeb7d90c9ac4778aba6d0daa.png'
  };

  const abstractShapes = [
    {
      style: {
        width: 'clamp(80px, 10vw, 120px)',
        height: 'clamp(80px, 10vw, 120px)',
        top: '10%',
        left: '5%',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.5))',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      },
      animate: { y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 15, 0] },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }
    },
    {
      style: {
        width: 'clamp(60px, 8vw, 80px)',
        height: 'clamp(60px, 8vw, 80px)',
        top: '75%',
        left: '85%',
        background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.6), rgba(251, 146, 60, 0.6))',
        borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%',
      },
      animate: { y: [0, 20, 0], x: [0, -20, 0], scale: [1, 1.1, 1] },
      transition: { duration: 15, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 2 }
    },
    {
      style: {
        width: 'clamp(40px, 5vw, 60px)',
        height: 'clamp(40px, 5vw, 60px)',
        top: '80%',
        left: '10%',
        border: '3px solid rgba(29, 78, 216, 0.4)',
      },
      animate: { rotate: [0, 180, 360] },
      transition: { duration: 20, repeat: Infinity, ease: 'linear' }
    },
    {
      style: {
        width: 'clamp(70px, 9vw, 100px)',
        height: 'clamp(70px, 9vw, 100px)',
        top: '15%',
        left: '80%',
        background: 'rgba(34, 197, 94, 0.3)',
        clipPath: 'circle(50% at 50% 50%)',
        filter: 'blur(8px)',
      },
      animate: { scale: [1, 1.2, 1] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 1 }
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[450px] md:min-h-[550px] flex items-center justify-center">
      {abstractShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute z-0"
          style={shape.style}
          animate={shape.animate}
          transition={shape.transition}
        />
      ))}
      
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="relative z-10 w-[90%] max-w-[450px] lg:w-full lg:max-w-[520px]"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <img
            src={images.laptop}
            alt="HikayeGO on a laptop"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          className="absolute z-0 w-[50%] max-w-[220px] lg:w-[45%] lg:max-w-[280px] bottom-[-5%] left-[-15%] sm:bottom-[-2%] sm:-left-20"
          initial={{ opacity: 0, scale: 0.8, x: -50, y: 50, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: -15 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 50 }}
        >
          <img
            src={images.tablet}
            alt="HikayeGO on a tablet"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          className="absolute z-20 w-[30%] max-w-[140px] lg:w-[28%] lg:max-w-[160px] top-[-2%] right-[-12%] sm:top-0 sm:-right-16"
          initial={{ opacity: 0, scale: 0.8, x: 50, y: -50, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 15 }}
          transition={{ duration: 0.8, delay: 0.6, type: 'spring', stiffness: 50 }}
        >
          <img
            src={images.phone}
            alt="HikayeGO on a phone"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedVisual;