'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  startupName: string;
}

const STEPS = [
  'Understanding startup...',
  'Researching market...',
  'Estimating demand...',
  'Analyzing competitors...',
  'Evaluating scalability...',
  'Assessing risks...',
  'Generating report...'
];

export default function LoadingSkeleton({ startupName }: LoadingSkeletonProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervals = [700, 800, 750, 900, 850, 950];
    
    let timeoutId: NodeJS.Timeout;
    
    const runNextStep = (index: number) => {
      if (index >= STEPS.length - 1) return;
      
      timeoutId = setTimeout(() => {
        setActiveStep(index + 1);
        runNextStep(index + 1);
      }, intervals[index]);
    };

    runNextStep(0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-12 md:py-20 text-center space-y-10 z-20 relative">
      {/* Sci-fi pulsing core visual */}
      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-110 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-dashed border-[#60a5fa]/20 animate-spin" style={{ animationDuration: '20s' }} />
        
        {/* Middle glowing element */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#3b82f6]/10 to-transparent border border-[#3b82f6]/20 animate-pulse" />
        
        {/* Inner core */}
        <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <Loader2 className="w-6 h-6 text-[#60a5fa] animate-spin" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
          Venture Analyst Triage: <span className="text-[#60a5fa]">"{startupName}"</span>
        </h2>
        <p className="text-xs md:text-sm text-[#a1a1aa] max-w-md mx-auto font-sans leading-relaxed">
          The AI engine is conducting multi-dimensional analysis on market potential, risk, scale, and moats.
        </p>
      </div>

      {/* Sequential steps panel */}
      <div className="p-6 md:p-8 rounded-[24px] bg-gradient-to-b from-[#0a0a0c]/90 to-[#030304]/95 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-md mx-auto space-y-4 text-left relative overflow-hidden">
        {/* Subtle grid pattern background in the loading card */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {STEPS.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isPending ? 0.35 : 1, 
                x: 0,
                scale: isActive ? 1.02 : 1
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex items-center justify-between transition-colors duration-300 ${
                isCompleted 
                  ? 'text-emerald-400 font-medium' 
                  : isActive 
                  ? 'text-[#60a5fa] font-semibold' 
                  : 'text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border border-dashed border-[#60a5fa] animate-spin flex items-center justify-center" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/10 bg-white/2" />
                  )}
                </div>
                <span className="text-xs md:text-sm font-sans tracking-wide">
                  {step}
                </span>
              </div>
              
              {isCompleted && (
                <motion.span 
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 0.6, x: 0 }}
                  className="text-[9px] font-mono uppercase tracking-wider text-emerald-500"
                >
                  Done
                </motion.span>
              )}
              {isActive && (
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#60a5fa] animate-pulse">
                  Active
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
