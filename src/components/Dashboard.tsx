'use client';

import React, { useEffect, useState } from 'react';
import { EvaluationResult } from '@/types';
import {
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  Scale,
  DollarSign,
  AlertTriangle,
  Users,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ParameterCardProps {
  title: string;
  icon: React.ReactNode;
  score: number;
  analysis: string;
}

function ParameterCard({ title, icon, score, analysis }: ParameterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayScore = useCountUp(score, 600, isHovered);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      className={`glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 cursor-default ${
        isHovered 
          ? 'border-blue-500/30 bg-[#0c0c0c]/90 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
          : 'border-white/5'
      }`}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-display flex items-center gap-1.5">
            {icon}
            {title}
          </h3>
          <span className={`text-lg font-bold font-display transition-colors duration-300 ${isHovered ? 'text-[#60a5fa]' : 'text-white'}`}>
            {isHovered ? displayScore : score}/100
          </span>
        </div>
        
        {/* Progress Bar with Blue gradient */}
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ 
              width: `${score}%`,
              background: isHovered 
                ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' 
                : 'linear-gradient(90deg, #1e293b 0%, #94a3b8 100%)' 
            }}
          />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="pt-2 space-y-3.5 overflow-hidden"
            >
              {/* Mini Electric Blue chart */}
              <div className="h-16 w-full rounded-xl bg-black/40 border border-white/5 p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`blueChartGrad-${title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  {/* Area under curve */}
                  <motion.path
                    d={`M 0 30 L 0 22 Q 25 ${30 - score * 0.22} 50 ${30 - score * 0.16} T 100 ${30 - score * 0.25} L 100 30 Z`}
                    fill={`url(#blueChartGrad-${title.replace(/\s+/g, '-')})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Grid lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  {/* Curve */}
                  <motion.path
                    d={`M 0 22 Q 25 ${30 - score * 0.22} 50 ${30 - score * 0.16} T 100 ${30 - score * 0.25}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {analysis}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface DashboardProps {
  result: EvaluationResult;
  onReset: () => void;
}

export default function Dashboard({ result, onReset }: DashboardProps) {
  const [copied, setCopied] = useState(false);
  const [dashOffset, setDashOffset] = useState(283); // full length of SVG path

  useEffect(() => {
    // Animate circular progress on mount
    const percentage = result.overallScore / 100;
    const targetOffset = 283 - (283 * percentage);
    const timer = setTimeout(() => {
      setDashOffset(targetOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [result.overallScore]);

  const handleCopyMarkdown = () => {
    const markdown = `# Evaluation Report: ${result.startupName}
## Overall Score: ${result.overallScore}/100

### Description
${result.startupDescription}

### Executive Summary
${result.summary}

### Market Potential (Score: ${result.marketPotentialScore}/100)
${result.marketPotentialAnalysis}

### Scalability (Score: ${result.scalabilityScore}/100)
${result.scalabilityAnalysis}

### Proposed Revenue Models
${result.revenueModels.map(rm => `- **${rm.model}** (Viability: ${rm.viability})\n  ${rm.description}`).join('\n')}

### Major Risks & Mitigations
${result.majorRisks.map(r => `- **${r.risk}** (Impact: ${r.impact})\n  *Mitigation:* ${r.mitigation}`).join('\n')}

### Competitor Analysis & Moat
${result.competitors.map(c => `- **${c.name}**\n  *Differentiation:* ${c.differentiation}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-white border-white/20 bg-white/5';
    if (score >= 60) return 'text-slate-300 border-white/10 bg-white/3';
    return 'text-slate-400 border-white/5 bg-white/2';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Strong Concept';
    if (score >= 60) return 'Moderate Viability';
    return 'High-Risk Concept';
  };

  const getImpactBadge = (impact: 'High' | 'Medium' | 'Low') => {
    switch (impact) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 border border-white/20 text-white">High Impact</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">Medium Impact</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/2 border border-white/5 text-slate-400">Low Impact</span>;
    }
  };

  const getViabilityBadge = (viability: 'High' | 'Medium' | 'Low') => {
    switch (viability) {
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 border border-white/20 text-white flex items-center gap-1">✦ High Viability</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">⚡ Medium Viability</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/2 border border-white/5 text-slate-400 flex items-center gap-1">⚬ Low Viability</span>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Upper Navigation & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onReset}
          className="glass-button-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Evaluate New Startup
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopyMarkdown}
            className="w-full sm:w-auto glass-button-secondary px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Copied Report!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Report (MD)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden text-center">
        {/* Glow behind title */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase font-display block">
            AI EVALUATION SUMMARY
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-glow text-white">
            {result.startupName}
          </h1>
          <p className="text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto">
            {result.startupDescription}
          </p>
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 font-sans text-sm text-slate-300 italic flex gap-3 items-start leading-relaxed text-left max-w-3xl mx-auto">
            <Compass className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>"{result.summary}"</span>
          </div>
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score Circle */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-display mb-4">
            OVERALL SCORE
          </h3>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="45"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="45"
                className="score-ring"
                stroke="url(#overallGrad)"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="50%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-display leading-none text-glow text-white">
                {result.overallScore}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                OUT OF 100
              </span>
            </div>
          </div>

          <div className={`mt-4 px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getScoreColor(result.overallScore)}`}>
            {getScoreText(result.overallScore)}
          </div>
        </div>

        {/* Market Potential Block */}
        <ParameterCard
          title="MARKET POTENTIAL"
          icon={<TrendingUp className="w-4 h-4 text-white" />}
          score={result.marketPotentialScore}
          analysis={result.marketPotentialAnalysis}
        />

        {/* Scalability Block */}
        <ParameterCard
          title="SCALABILITY"
          icon={<Scale className="w-4 h-4 text-white" />}
          score={result.scalabilityScore}
          analysis={result.scalabilityAnalysis}
        />
      </div>

      {/* Revenue Models Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-display tracking-wide uppercase text-slate-400 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-white" />
          REVENUE MODEL SUGGESTIONS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.revenueModels.map((item, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-200 font-display text-sm leading-snug">{item.model}</h4>
                  {getViabilityBadge(item.viability)}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Competitors Double Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks Box */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold font-display tracking-wide uppercase text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
            MAJOR RISKS & MITIGATIONS
          </h2>
          <div className="space-y-4 divide-y divide-white/5">
            {result.majorRisks.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-200 font-display leading-tight">{item.risk}</h4>
                  {getImpactBadge(item.impact)}
                </div>
                <div className="text-xs font-sans text-slate-300 leading-relaxed bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="font-semibold text-white block mb-0.5">Mitigation Strategy:</span>
                  {item.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Analysis Box */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold font-display tracking-wide uppercase text-slate-400 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            COMPETITOR ANALYSIS & MOAT
          </h2>
          <div className="space-y-4 divide-y divide-white/5">
            {result.competitors.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <h4 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {item.name}
                </h4>
                <div className="text-xs font-sans text-slate-300 leading-relaxed bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="font-semibold text-white block mb-0.5">Differentiation Strategy:</span>
                  {item.differentiation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
