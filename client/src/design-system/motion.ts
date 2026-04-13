import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const drawerVariants: Variants = {
  closed: { x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
  open: { x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
};

export const overlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.2 } },
};
