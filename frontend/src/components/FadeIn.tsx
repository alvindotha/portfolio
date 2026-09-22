'use client';

import { motion } from 'framer-motion';
import { fadeSlideTransition } from '@/lib/animations';

/** Small client wrapper so server components can still animate their headings. */
export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...fadeSlideTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
