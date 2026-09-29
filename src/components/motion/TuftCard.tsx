import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TuftCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TuftCard({ children, className = '', onClick }: TuftCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -5,
        scale: 1.012,
        boxShadow: '0 24px 48px -18px rgba(22, 21, 19, 0.12), 0 8px 16px -8px rgba(22, 21, 19, 0.04)',
      }}
      whileTap={{
        scale: 0.988,
        boxShadow: '0 8px 16px -6px rgba(22, 21, 19, 0.08)',
      }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 24,
      }}
      className={`transition-colors border border-warm-border/80 bg-white ${className}`}
    >
      {children}
    </motion.div>
  );
}
