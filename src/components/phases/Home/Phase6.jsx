'use client';

import { motion, LayoutGroup } from 'motion/react';
import RotatingText from '@/components/animations/RotatingText';

const rotatingWords = ['Perfected.', 'Elevated.', 'Simplified.', 'Delivered.'];

const LAYOUT_TRANSITION = { type: 'spring', damping: 26, stiffness: 200 };

export default function Phase6() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-between bg-black px-6 py-10 text-white font-power">
      <p className="font-mono text-xs tracking-widest text-white/70">[Our Values]</p>

      <LayoutGroup>
        <h1 className="flex flex-wrap items-center justify-center gap-4 text-center text-6xl font-bold leading-none sm:text-7xl md:text-8xl">
          <motion.span layout transition={LAYOUT_TRANSITION}>
            Design
          </motion.span>
          <RotatingText texts={rotatingWords} mainClassName="text-white" />
        </h1>
      </LayoutGroup>

      <p className="font-mono text-xs tracking-widest text-white/50">[Scroll Chill dude]</p>
    </section>
  );
}