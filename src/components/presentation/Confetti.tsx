import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Plane } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

const Confetti = ({ active }: { active: boolean }) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    if (!active) return;
    const newHearts: FloatingHeart[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: 10 + Math.random() * 14,
      duration: 2 + Math.random() * 2,
    }));
    setHearts(newHearts);
    const timer = setTimeout(() => setHearts([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: '100vh', x: `${h.x}vw`, scale: 0 }}
            animate={{ opacity: [1, 1, 0], y: '-20vh', scale: [0, 1, 0.5], rotate: [0, 15, -15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut' }}
            className="absolute text-rose-glow"
            style={{ fontSize: h.size }}
          >
            {Math.random() > 0.5 ? '💕' : '✨'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
