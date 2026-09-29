import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface WeaveRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function WeaveReveal({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  direction = 'up',
}: WeaveRevealProps) {
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 32, filter: 'blur(4px)' };
      case 'down':
        return { opacity: 0, y: -32, filter: 'blur(4px)' };
      case 'left':
        return { opacity: 0, x: 32, filter: 'blur(4px)' };
      case 'right':
        return { opacity: 0, x: -32, filter: 'blur(4px)' };
      default:
        return { opacity: 0, filter: 'blur(4px)' };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom bespoke cubic-bezier for tactile momentum
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
