'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  Award,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Count-up helper hook
const useCountUp = (target: number, duration: number, trigger: boolean, decimals = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }
    let start = 0;
    const end = target;
    const stepTime = 16; // ~60fps
    const steps = Math.ceil(duration / stepTime);
    const increment = end / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(parseFloat((increment * currentStep).toFixed(decimals)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger, decimals]);

  return count;
};

export default function InteractiveDashboardMockup() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover states for individual cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Limit to max 4 degrees
    const maxDegree = 4;
    setRotate({
      x: -(y / (box.height / 2)) * maxDegree,
      y: (x / (box.width / 2)) * maxDegree
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  // Radar chart math values (symmetrical indicators)
  const defaultValues = [0.3, 0.3, 0.3, 0.3, 0.3];
  const activeValues = [0.55, 0.55, 0.55, 0.55, 0.55]; // Symmetrical pentagon
  const radarValues = hoveredCard === 'scalability' ? activeValues : defaultValues;

  const R = 22;
  const cx = 40;
  const cy = 40;
  
  const x1 = cx;
  const y1 = cy - radarValues[0] * R; 
  
  const x2 = cx + radarValues[1] * R * 0.951;
  const y2 = cy - radarValues[1] * R * 0.309; 
  
  const x3 = cx + radarValues[2] * R * 0.588;
  const y3 = cy + radarValues[2] * R * 0.809; 
  
  const x4 = cx - radarValues[3] * R * 0.588;
  const y4 = cy + radarValues[3] * R * 0.809; 
  
  const x5 = cx - radarValues[4] * R * 0.951;
  const y5 = cy - radarValues[4] * R * 0.309; 

  const radarPoints = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5}`;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[500px] h-[480px] relative transition-transform duration-300 ease-out cursor-default select-none scale-[0.85] sm:scale-100 origin-center"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {/* Dynamic ambient spotlight back-glow */}
      <div 
        className="absolute -inset-10 bg-radial-gradient from-white/5 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none transition-all duration-300"
        style={{
          transform: `translate(${rotate.y * 6}px, ${-rotate.x * 6}px)`
        }}
      />

      {/* Main SaaS Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a2d1a] to-[#070503] border border-[#d4af37]/65 rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.18),0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* macOS Style Header Bar */}
        <div className="w-full border-b border-white/5 bg-[#0a0a0a] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 font-display">
              VentureMetrics Analyst v3.5.0
            </span>
            <span className="px-1.5 py-0.5 rounded-[4px] text-[7px] font-bold bg-amber-500/10 border border-amber-500/20 text-[#d4af37] tracking-wider font-mono">
              SAMPLE PREVIEW
            </span>
          </div>
          <span className="w-6 h-1 bg-white/5 rounded-full" />
        </div>

        {/* Dashboard Grid Container */}
        <div className="p-6 h-[calc(100%-48px)] relative overflow-hidden">
          
          {/* 1. Venture Rating / Score Card */}
          <div 
            onMouseEnter={() => setHoveredCard('score')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute top-4 left-4 w-[220px] p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out ${
              hoveredCard === 'score' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-30 animate-float-slow border-white/10 bg-[#070707]/80'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-bold tracking-widest text-[#c9ccd3] uppercase font-display flex items-center gap-1.5">
                <Activity className="w-2.5 h-2.5 text-blue-400" />
                Venture Rating
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 border border-blue-500/25 text-blue-400">Pending</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="20" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeDasharray="4, 4" 
                    fill="transparent" 
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                </svg>
                <span className="absolute text-xs font-semibold font-display text-white">—</span>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white font-display">Venture Score</h4>
                <p className="text-[8px] text-slate-400 mt-0.5">Success Prob: Pending</p>
              </div>
            </div>

            <AnimatePresence>
              {hoveredCard === 'score' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5 text-[8px] font-sans text-slate-300 overflow-hidden"
                >
                  <div className="flex justify-between">
                    <span>Market Score</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Execution Potential</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investor readiness</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. TAM Revenue / Forecast Card */}
          <div 
            onMouseEnter={() => setHoveredCard('revenue')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute top-10 right-4 w-[190px] p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out ${
              hoveredCard === 'revenue' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-20 animate-float-medium border-white/10 bg-[#070707]/80'
            }`}
          >
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[8px] font-bold tracking-widest text-[#c9ccd3] uppercase font-display">TAM Analysis</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-blue-400" />
            </div>
            <div className="text-sm font-bold font-display text-white">Awaiting Input</div>
            <p className="text-[8px] text-slate-400 font-sans mt-0.5">Market Volume & TAM Analysis</p>

            <AnimatePresence>
              {hoveredCard === 'revenue' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-2.5 border-t border-white/10 space-y-2.5 overflow-hidden"
                >
                  <div className="flex flex-col gap-1.5 text-[8px] font-sans text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>SAM (Serviceable)</span>
                      <span className="text-white font-medium">Pending</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>SOM (Obtainable)</span>
                      <span className="text-white font-medium">Pending</span>
                    </div>
                  </div>
                  <div className="h-12 w-full mt-1">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      
                      <motion.path 
                        d="M 5 20 Q 25 20 50 20 T 95 20" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="1.5"
                        strokeDasharray="3, 3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Competition Index Card */}
          <div 
            onMouseEnter={() => setHoveredCard('competitors')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute bottom-36 right-4 w-[190px] p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out ${
              hoveredCard === 'competitors' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-10 animate-float-slow border-white/10 bg-[#070707]/80'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-bold tracking-widest text-[#c9ccd3] uppercase font-display flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-blue-400" />
                Competition Index
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 border border-blue-500/25 text-blue-400">—</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-normal font-sans">Competitor density & market saturation audit.</p>

            <AnimatePresence>
              {hoveredCard === 'competitors' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-2.5 border-t border-white/10 space-y-2 text-[8px] font-sans text-slate-300 overflow-hidden"
                >
                  <div className="flex justify-between">
                    <span>Tracked Competitors</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defensibility rating</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Barriers to Entry</span>
                    <span className="text-white font-semibold">Pending</span>
                  </div>
                  <div className="mt-2 text-[7px] font-bold uppercase tracking-wider text-slate-400 font-display">
                    Market Defensibility Curve
                  </div>
                  <svg className="w-full h-10 mt-1" viewBox="0 0 100 40">
                    <line x1="10" y1="5" x2="10" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    <line x1="10" y1="35" x2="95" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    <path d="M 10 35 Q 50 35 90 35" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2,2" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Risk Matrix Card */}
          <div 
            onMouseEnter={() => setHoveredCard('risk')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute bottom-4 left-4 w-[220px] p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out ${
              hoveredCard === 'risk' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-30 animate-float-medium border-white/10 bg-[#070707]/80'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-bold tracking-widest text-[#c9ccd3] uppercase font-display flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5 text-blue-400" />
                Risk Matrix
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 border border-blue-500/25 text-blue-400">—</span>
            </div>
            <p className="text-[9px] text-slate-400 font-sans leading-relaxed">Regulatory, funding, and operational risk assessment.</p>

            <AnimatePresence>
              {hoveredCard === 'risk' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-2.5 border-t border-white/10 space-y-2.5 overflow-hidden"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-slate-300 font-sans">
                      <span>Market Risk</span>
                      <span className="text-white font-medium">Pending</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div className="h-full bg-[#3b82f6] rounded-full" initial={{ width: 0 }} animate={{ width: '5%' }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-slate-300 font-sans">
                      <span>Execution Risk</span>
                      <span className="text-white font-medium">Pending</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div className="h-full bg-[#3b82f6] rounded-full" initial={{ width: 0 }} animate={{ width: '5%' }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-slate-300 font-sans">
                      <span>Funding Risk</span>
                      <span className="text-white font-medium">Pending</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div className="h-full bg-[#3b82f6] rounded-full" initial={{ width: 0 }} animate={{ width: '5%' }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Scalability Radar Card */}
          <div 
            onMouseEnter={() => setHoveredCard('scalability')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute top-[150px] left-[70px] w-[180px] p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out ${
              hoveredCard === 'scalability' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-20 animate-float-fast border-white/10 bg-[#070707]/80'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-bold tracking-widest text-[#c9ccd3] uppercase font-display flex items-center gap-1">
                <Award className="w-2.5 h-2.5 text-blue-400" />
                Scalability Radar
              </span>
              <span className="text-[8px] text-[#c9ccd3]">—</span>
            </div>

            <div className="flex items-center justify-center py-1">
              <svg className="w-24 h-24" viewBox="0 0 80 80">
                {/* Radar Grid circles */}
                <circle cx="40" cy="40" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                
                {/* Radar Grid Axes */}
                <line x1="40" y1="18" x2="40" y2="62" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="19" y1="40" x2="61" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                {/* Animated Radar Polygon */}
                <polygon 
                  points={radarPoints} 
                  fill="rgba(59, 130, 246, 0.15)" 
                  stroke="#3b82f6" 
                  strokeWidth="1.2"
                  className="transition-all duration-700 ease-out"
                />

                {/* Point indicators */}
                <circle cx={x1} cy={y1} r="1.5" fill="#60a5fa" />
                <circle cx={x2} cy={y2} r="1.5" fill="#60a5fa" />
                <circle cx={x3} cy={y3} r="1.5" fill="#60a5fa" />
                <circle cx={x4} cy={y4} r="1.5" fill="#60a5fa" />
                <circle cx={x5} cy={y5} r="1.5" fill="#60a5fa" />
              </svg>
            </div>

            <AnimatePresence>
              {hoveredCard === 'scalability' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[7px] font-sans text-slate-300 overflow-hidden"
                >
                  <div className="flex justify-between">
                    <span>Technology</span>
                    <span className="text-white">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operations</span>
                    <span className="text-white">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing</span>
                    <span className="text-white">Pending</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Founder-Market Fit indicators card */}
          <div 
            onMouseEnter={() => setHoveredCard('fit')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute bottom-4 right-4 w-[160px] p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 ease-out text-[8px] font-sans text-[#c9ccd3] space-y-2 ${
              hoveredCard === 'fit' 
                ? 'z-40 scale-[1.03] border-blue-500/40 bg-[#0e0e0e]/85 shadow-[0_0_25px_rgba(59,130,246,0.22)]' 
                : 'z-10 animate-float-medium border-white/10 bg-[#070707]/80'
            }`}
          >
            <span className="text-[7px] font-bold tracking-widest text-[#c9ccd3] uppercase block font-display">Founder-Market Fit</span>
            <div className="flex justify-between text-slate-300">
              <span>FMF Index</span>
              <span className="text-white font-semibold">Pending</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Readiness</span>
              <span className="text-white font-bold">Pending</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#3b82f6] rounded-full w-[5%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
