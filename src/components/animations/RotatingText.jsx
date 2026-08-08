'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Fixed animation settings — not exposed as props on purpose.
const ROTATION_INTERVAL = 1800;
const STAGGER_DURATION = 0.025;

// Character enter/exit — snappy pop-in for each letter.
const CHAR_TRANSITION = { type: 'spring', damping: 30, stiffness: 400 };
// Container reflow — softer/slower so the width glide reads as smooth,
// not a snap, when the word gets shorter or longer.
const LAYOUT_TRANSITION = { type: 'spring', damping: 26, stiffness: 200 };

const INITIAL = { y: '100%', opacity: 0 };
const ANIMATE = { y: 0, opacity: 1 };
const EXIT = { y: '-120%', opacity: 0 };

function splitIntoCharacters(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
}

export default function RotatingText({ texts, mainClassName, splitLevelClassName, elementLevelClassName }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const elements = useMemo(() => {
    const words = texts[currentTextIndex].split(' ');
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1
    }));
  }, [texts, currentTextIndex]);

  // staggerFrom="first": delay grows with character index, left to right.
  const getStaggerDelay = useCallback((index) => index * STAGGER_DURATION, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prev) => (prev === texts.length - 1 ? 0 : prev + 1));
    }, ROTATION_INTERVAL);
    return () => clearInterval(intervalId);
  }, [texts.length]);

  return (
    <motion.span
      className={cn('relative flex flex-wrap whitespace-pre-wrap', mainClassName)}
      layout
      transition={LAYOUT_TRANSITION}
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentTextIndex}
          className="relative flex flex-wrap whitespace-pre-wrap"
          layout
          transition={LAYOUT_TRANSITION}
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span key={wordIndex} className={cn('inline-flex', splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={INITIAL}
                    animate={ANIMATE}
                    exit={EXIT}
                    transition={{
                      ...CHAR_TRANSITION,
                      delay: getStaggerDelay(previousCharsCount + charIndex)
                    }}
                    className={cn('inline-block', elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}