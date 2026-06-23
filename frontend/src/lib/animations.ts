import type { Variants, Transition } from 'framer-motion';

export const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const fadeSlide: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export const stagger: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const fadeSlideTransition: Transition = {
  duration: 0.5,
  ease,
};

export const fadeSlideUpTransition: Transition = {
  duration: 0.5,
  ease,
};
