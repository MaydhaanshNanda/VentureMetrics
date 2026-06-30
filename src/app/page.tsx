'use client';

import React, { useState, useEffect } from 'react';
import FormInput from '@/components/FormInput';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Dashboard from '@/components/Dashboard';
import HistoryList from '@/components/HistoryList';
import InteractiveDashboardMockup from '@/components/InteractiveDashboardMockup';
import { evaluateStartupAction } from './actions';
import { EvaluationResult } from '@/types';
import { 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Compass, 
  Award,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticlesBg = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }> = [];
    
    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 20,
        size: Math.random() * 1.8 + 0.6,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.35 + 0.1,
      };
    };
    
    // Initial particles scattered
    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }
    
    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Attracted slightly to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          // Subtle drift towards mouse spotlight
          p.x += (dx / dist) * 0.18;
          p.y += (dy / dist) * 0.18;
        }
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.y < 0) {
          // Reset particle to bottom
          const newP = createParticle();
          p.x = newP.x;
          p.y = newP.y;
          p.size = newP.size;
          p.speedY = newP.speedY;
          p.speedX = newP.speedX;
          p.opacity = newP.opacity;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`; // Electric blue accents
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-60" />;
};

export default function Home() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [startupName, setStartupName] = useState('');
  const [startupDescription, setStartupDescription] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Mouse spotlight positioning and parallax depth offsets
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxX = (mousePosition.x - windowSize.width / 2) * 0.015;
  const parallaxY = (mousePosition.y - windowSize.height / 2) * 0.015;

  // Load history from LocalStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('startup_evaluator_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  const handleStartEvaluation = async (name: string, description: string) => {
    setStartupName(name);
    setStartupDescription(description);
    setError(null);
    setStep('loading');
    setIsPending(true);

    try {
      const response = await evaluateStartupAction(name, description);

      if (response.success) {
        const evaluationData = response.data;
        setResult(evaluationData);

        // Update local history (max 5 records)
        const updatedHistory = [
          evaluationData,
          ...history.filter((item) => item.startupName.toLowerCase() !== name.toLowerCase()),
        ].slice(0, 5);

        setHistory(updatedHistory);
        localStorage.setItem('startup_evaluator_history', JSON.stringify(updatedHistory));
        setStep('result');
      } else {
        setError(response.error);
        setStep('input');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setStep('input');
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectHistoryItem = (item: EvaluationResult) => {
    setResult(item);
    setStartupName(item.startupName);
    setStartupDescription(item.startupDescription);
    setError(null);
    setStep('result');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('startup_evaluator_history');
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('input');
  };

  const handleViewSample = () => {
    handleStartEvaluation(
      "NexusDoc",
      "An agentic AI documentation assistant that crawls software repositories, traces execution graphs, and generates interactive developer portals with self-updating code examples."
    );
  };

  const handleScrollToForm = () => {
    const element = document.getElementById('evaluation-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Framer Motion entry animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen relative overflow-hidden bg-[#050505] text-slate-100 selection:bg-white/20 selection:text-white">
      {/* Background visuals */}
      <div className="gradient-bg-glow" />
      <div className="grid-pattern" />
      <div className="noise-overlay" />
      <ParticlesBg />

      {/* Mouse Follow Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 85%)`
        }}
      />

      {/* Sticky Navbar */}
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-white/5 ${
        isScrolled 
          ? 'py-3.5 bg-black/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
          : 'py-5 bg-transparent backdrop-blur-md'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={handleReset}>
              <div className="w-8.5 h-8.5 rounded-xl bg-white border border-white/10 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4.5 h-4.5 text-black" />
              </div>
              <span className="font-display font-extrabold tracking-tight text-white text-base">
                Venture<span className="text-slate-400">Metrics</span>
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-medium bg-blue-500/10 text-[#60a5fa] border border-blue-500/20 tracking-wider font-mono">
              AI ENGINE: GEMINI 3.5
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-9 text-xs font-semibold tracking-wider uppercase text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#examples" className="hover:text-white transition-colors">Examples</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#signin" className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-slate-400 hover:text-white transition-colors">Sign In</a>
            <button 
              onClick={handleScrollToForm}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 text-white transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-24 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-28 md:space-y-36"
            >
              {/* Hero Section Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Hero Text */}
                <div className="space-y-6 text-left">
                {/* Title Area */}
                  
                  {/* Headline */}
                  <motion.h1 
                    variants={itemVariants} 
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] font-display text-white"
                  >
                    See the{" "}
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold"
                      style={{ textShadow: '0 0 15px rgba(52, 211, 153, 0.25)' }}
                    >
                      potential
                    </span>
                    , the{" "}
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 font-extrabold"
                      style={{ textShadow: '0 0 15px rgba(244, 63, 94, 0.25)' }}
                    >
                      risks
                    </span>
                    , and the{" "}
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold"
                      style={{ textShadow: '0 0 15px rgba(52, 211, 153, 0.25)' }}
                    >
                      opportunities
                    </span>{" "}
                    before you commit to building.
                  </motion.h1>

                  {/* Subheadline */}
                  <motion.p 
                    variants={itemVariants} 
                    className="text-slate-400 text-sm md:text-base font-sans leading-relaxed max-w-lg"
                  >
                    VentureMetrics analyzes market demand, competition, revenue potential, scalability, and execution challenges to help founders make smarter, data-driven decisions before investing significant time and resources.
                  </motion.p>

                  {/* Buttons */}
                  <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleScrollToForm}
                      className="px-6 py-3.5 rounded-xl glass-button-primary shine-sweep-hover text-sm cursor-pointer flex items-center gap-2 transition-all duration-300"
                    >
                      Validate My Idea
                      <ArrowRight className="w-4 h-4 text-black" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Hero Visual Mockup with Cursor Parallax */}
                <motion.div 
                  variants={itemVariants} 
                  className="relative flex justify-center lg:justify-end"
                  style={{
                    transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <InteractiveDashboardMockup />
                </motion.div>
              </motion.div>



              {/* Error Banner */}
              {error && (
                <motion.div 
                  variants={itemVariants} 
                  className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-3 items-start"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm font-sans">
                    <h4 className="font-bold text-rose-200">Configuration / Evaluation Error</h4>
                    <p className="text-slate-300 leading-relaxed">{error}</p>
                    {error.includes('GEMINI_API_KEY') && (
                      <div className="pt-2 font-mono text-xs text-slate-400 flex items-center gap-1.5 bg-[#080808]/80 p-2 rounded border border-white/5">
                        <Terminal className="w-3.5 h-3.5" />
                        Add GEMINI_API_KEY=your_key to .env.local
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Command Interface / Form Section */}
              <div id="evaluation-form" className="scroll-mt-24 space-y-10">
                <div className="text-center space-y-4 max-w-[760px] mx-auto">
                  <h2 className="text-[42px] md:text-[64px] font-extrabold font-display text-white leading-[1.1] tracking-tight">
                    Tell us about your startup.
                  </h2>
                  <p className="text-lg md:text-[22px] text-[#A1A1AA] leading-relaxed font-sans font-normal max-w-[760px] mx-auto">
                    We'll analyze your idea across market demand, competition, scalability, revenue potential, execution risk, and much more—then generate a comprehensive venture intelligence report in seconds.
                  </p>
                </div>
                
                <FormInput onSubmit={handleStartEvaluation} isLoading={isPending} />
              </div>

              {/* Analysis Preview Section */}
              <div id="features" className="space-y-12 scroll-mt-24">
                <div className="text-center space-y-3 max-w-lg mx-auto">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-display block">
                    Venture Intelligence Report
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
                    You'll receive
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    A comprehensive, multi-dimensional assessment of your business model before you write a single line of code.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Market Opportunity Analysis</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Deep dive into addressable market size, demographic demand, and growth vectors.
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Revenue Model Evaluation</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Evaluation of pricing models, unit economics, and monetization strategies.
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Competitive Landscape</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Mapping of direct and indirect competitors with strategic moat analysis.
                    </p>
                  </div>
                  {/* Card 4 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Risk Assessment</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Identification of regulatory, execution, and market entry risk factors.
                    </p>
                  </div>
                  {/* Card 5 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Go-To-Market Strategy</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Tactical acquisition channels and launch blueprints tailored to your niche.
                    </p>
                  </div>
                  {/* Card 6 */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-white/5 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.01)]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold font-display text-slate-200 text-base">Investor Readiness Score</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      VC-grade feedback and scoring based on scalability and concept strength.
                    </p>
                  </div>
                </div>
              </div>



              {/* Local History */}
              {history.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                  <HistoryList
                    history={history}
                    onSelect={handleSelectHistoryItem}
                    onClear={handleClearHistory}
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton startupName={startupName} />
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Directory Footer */}
      <footer className="w-full py-12 md:py-16 border-t border-white/5 mt-auto relative z-10 bg-black/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={handleReset}>
              <div className="w-8 h-8 rounded-lg bg-white border border-white/10 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-black" />
              </div>
              <span className="font-display font-extrabold tracking-tight text-white text-base">
                Venture<span className="text-slate-400">Metrics</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-xs">
              Know if your startup will work before you build it. VC-grade venture intelligence in under 30 seconds.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-400 font-display tracking-widest uppercase">Product</h4>
            <ul className="space-y-2 text-slate-500 font-sans">
              <li><a href="#features" className="hover:text-slate-300 transition-colors">Features</a></li>
              <li><a href="#examples" className="hover:text-slate-300 transition-colors">Examples</a></li>
              <li><a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-400 font-display tracking-widest uppercase">Resources</h4>
            <ul className="space-y-2 text-slate-500 font-sans">
              <li><a href="#blog" className="hover:text-slate-300 transition-colors">Blog</a></li>
              <li><a href="#docs" className="hover:text-slate-300 transition-colors">Documentation</a></li>
              <li><a href="#guides" className="hover:text-slate-300 transition-colors">Guides</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-400 font-display tracking-widest uppercase">Company</h4>
            <ul className="space-y-2 text-slate-500 font-sans">
              <li><a href="#about" className="hover:text-slate-300 transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-slate-300 transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-slate-300 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-sans">
          <p>© 2026 Venture Metrics. All rights reserved. Recommendations are AI-powered suggestions.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="https://aistudio.google.com/" target="_blank" className="hover:text-slate-300 transition-colors">Google AI Studio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
