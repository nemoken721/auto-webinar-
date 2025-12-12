'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CTABannerProps {
  visible: boolean;
  label: string;
  url: string;
  isEmbed?: boolean;
}

export function CTABanner({ visible, label, url, isEmbed = false }: CTABannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-4 left-4 right-4 z-20"
        >
          <a
            href={url}
            target={isEmbed ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block w-full py-4 px-6
                       bg-gradient-to-r from-orange-500 to-red-500
                       text-white text-center text-lg font-bold rounded-xl
                       hover:from-orange-600 hover:to-red-600
                       transition-all duration-300
                       shadow-lg shadow-orange-500/30
                       hover:shadow-xl hover:shadow-orange-500/40
                       hover:scale-[1.02]
                       focus:outline-none focus:ring-4 focus:ring-orange-500/50"
          >
            {label} →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
