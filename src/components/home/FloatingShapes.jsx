import React from 'react';
import { motion } from 'framer-motion';

const shapes = [
  { id: 1, style: 'w-16 h-16 bg-blue-200/50 dark:bg-blue-500/20 rounded-full', top: '10%', left: '5%', duration: 15 },
  { id: 2, style: 'w-24 h-24 bg-purple-200/50 dark:bg-purple-500/20 rounded-2xl', top: '20%', left: '80%', duration: 18 },
  { id: 3, style: 'w-8 h-8 bg-pink-200/50 dark:bg-pink-500/20 rounded-full', top: '75%', left: '10%', duration: 20 },
  { id: 4, style: 'w-20 h-20 bg-sky-200/50 dark:bg-sky-500/20 rounded-3xl', top: '80%', left: '90%', duration: 12 },
  { id: 5, style: 'w-12 h-12 bg-indigo-200/50 dark:bg-indigo-500/20 rounded-lg', top: '50%', left: '45%', duration: 22 },
];

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          initial={{ y: 0, x: 0, scale: 1, opacity: 0 }}
          animate={{ 
            y: [0, 20, -20, 0],
            x: [0, -15, 15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 0.95, 1],
            opacity: 1
          }}
          transition={{
            duration: shape.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className={`absolute blur-lg ${shape.style}`}
          style={{ top: shape.top, left: shape.left }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;