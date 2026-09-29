import { motion } from 'framer-motion';

interface ThreadDividerProps {
  className?: string;
  accent?: 'jute' | 'terracotta' | 'sage' | 'neutral';
}

export default function ThreadDivider({
  className = '',
  accent = 'jute',
}: ThreadDividerProps) {
  const strokeColor =
    accent === 'jute'
      ? '#C89B3C'
      : accent === 'terracotta'
      ? '#BD632F'
      : accent === 'sage'
      ? '#7A8471'
      : '#E8E3D9';

  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <svg
        width="100%"
        height="14"
        viewBox="0 0 800 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-2xl overflow-visible"
      >
        <motion.path
          d="M0 7 H380 M420 7 H800"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Central Loom Knot */}
        <motion.circle
          cx="400"
          cy="7"
          r="4.5"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.circle
          cx="400"
          cy="7"
          r="2"
          fill={strokeColor}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.3 }}
        />
      </svg>
    </div>
  );
}
