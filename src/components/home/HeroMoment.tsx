'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroMoment() {
  const [phase, setPhase] = useState<'strike' | 'goal' | 'settled'>('strike');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('goal'), 1500),
      setTimeout(() => setPhase('settled'), 2500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] bg-[#07090e] group">
      <AnimatePresence mode="wait">
        {phase === 'strike' && (
          <motion.div
            key="strike"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src="/images/hero-strike.png" 
              alt="The Strike" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
            />
            {/* Animated Ball */}
            <motion.div
              initial={{ x: -100, y: 100, scale: 0.5, opacity: 0 }}
              animate={{ x: 300, y: -300, scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "circIn" }}
              className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gold rounded-full blur-[2px] shadow-[0_0_30px_rgba(242,201,76,1)] z-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
          </motion.div>
        )}

        {phase === 'goal' && (
          <motion.div
            key="goal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center z-30"
          >
            <div className="absolute inset-0 bg-gold/20 blur-[100px] animate-pulse" />
            <motion.h2 
              initial={{ letterSpacing: '0.5em', filter: 'blur(20px)' }}
              animate={{ letterSpacing: '0.1em', filter: 'blur(0px)' }}
              className="text-7xl md:text-9xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] z-40"
            >
              GOAL.
            </motion.h2>
          </motion.div>
        )}

        {phase === 'settled' && (
          <motion.div
            key="settled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <motion.img 
              src="/images/hero-settled.png" 
              alt="Settle" 
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-1000"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
            
            {/* Verified Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 left-10 p-6 rounded-2xl bg-black/60 border border-gold/20 backdrop-blur-xl flex items-center gap-4 shadow-depth-gold"
            >
               <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Verified Systems</span>
                  <span className="text-[8px] font-black text-gold/60 uppercase tracking-[0.2em] italic">Arena Operational</span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
