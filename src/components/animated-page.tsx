import { ReactElement } from 'react';
import { motion } from 'framer-motion';

export type AnimatedPageProps = { children?: ReactElement };

const animations = {
  initial: { opacity: 0, x: 50 },
  enter: { opacity: 1, x: -30 },
  exit: { opacity: 0, x: 30 },
};

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
