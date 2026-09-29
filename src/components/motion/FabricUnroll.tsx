import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FabricUnrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function FabricUnroll({
  children,
  delay = 0.1,
  duration = 0.9,
  className = '',
}: FabricUnrollProps) {
  return (
    <motion.div
      initial={{
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0.2,
      }}
      whileInView={{
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Unrolling fabric momentum
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
