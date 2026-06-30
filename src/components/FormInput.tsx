'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormInputProps {
  onSubmit: (name: string, description: string) => void;
  isLoading: boolean;
}

const SAMPLE_CHIPS = [
  {
    label: '🚀 AI SaaS',
    name: 'NexusDoc',
    desc: 'An agentic AI documentation assistant that crawls software repositories, traces execution graphs, and generates interactive developer portals with self-updating code examples.'
  },
  {
    label: '🩺 Healthcare',
    name: 'SomaHealth',
    desc: 'A remote patient monitoring system using continuous wearable sensor streams and ML to alert cardiology teams of early physiological degradation before critical incidents occur.'
  },
  {
    label: '💳 FinTech',
    name: 'SplitPay',
    desc: 'An API-first merchant payment infrastructure enabling split transactions, instant currency hedging, and dynamic fraud prevention for global marketplace platforms.'
  },
  {
    label: '🎓 Education',
    name: 'EduAI',
    desc: 'An adaptive learning platform that generates personalized math and science curricula for high school students based on daily quizzes.'
  },
  {
    label: '🛒 Marketplace',
    name: 'FarmToTable',
    desc: 'A direct-to-consumer digital marketplace connecting regional organic farmers with local restaurants for subscription-based produce sourcing.'
  },
  {
    label: '🌍 Climate',
    name: 'GreenTrace',
    desc: 'A supply chain carbon tracking dashboard that pulls real-time customs records, logistics telematics, and energy bills to calculate Scope 1, 2, and 3 emissions automatically.'
  },
  {
    label: '📦 Logistics',
    name: 'FleetFlow',
    desc: 'An AI-powered route optimization tool for local delivery fleets that reduces fuel consumption by adjusting schedules dynamically in real-time.'
  },
  {
    label: '🤖 Automation',
    name: 'AutoFlow',
    desc: 'A no-code robotic process automation software for back-office teams to automate email data extraction and database entry.'
  }
];

const EXAMPLE_CARDS = [
  {
    title: "An AI assistant helping doctors automate clinical documentation.",
    shortDesc: "Captures patient discussions and populates EHR forms.",
    name: "AegisScribe",
    text: "An AI assistant helping doctors automate clinical documentation. Uses secure ambient audio recording during consultations to capture key symptoms, treatments, and follow-ups, automatically drafting standardized medical SOAP notes for EHR entry in seconds."
  },
  {
    title: "A marketplace connecting local farmers directly with restaurants.",
    shortDesc: "Optimizes regional logistics to offer fresh organic produce.",
    name: "GreenRoute",
    text: "A direct digital marketplace connecting local organic farmers directly with restaurant kitchens. Automates logistics scheduling, enables dynamic menu alignment based on seasonal yields, and cuts out wholesale markups."
  },
  {
    title: "A fintech platform that helps freelancers manage taxes.",
    shortDesc: "Automates expense tracking and estimates quarterly write-offs.",
    name: "TaxTriage",
    text: "A fintech platform that helps freelance creators and independent contractors manage taxes. Features automatic expense categorization via credit card feeds, real-time quarterly tax calculation, and automated savings triggers."
  }
];

export default function FormInput({ onSubmit, isLoading }: FormInputProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [hoveredExampleIdx, setHoveredExampleIdx] = useState<number | null>(null);

  // Real-time analysis metrics state derived from inputs
  const [analysis, setAnalysis] = useState({
    market: '',
    industry: '',
    revenueModel: '',
    businessType: '',
    audience: ''
  });

  // Calculate live heuristics whenever name or description changes
  useEffect(() => {
    const text = (name + ' ' + description).toLowerCase();

    let market = '';
    if (text.includes('health') || text.includes('doctor') || text.includes('clinic') || text.includes('medical') || text.includes('patient') || text.includes('hospital')) {
      market = 'MedTech / Digital Health';
    } else if (text.includes('finance') || text.includes('tax') || text.includes('pay') || text.includes('bank') || text.includes('wallet') || text.includes('credit') || text.includes('lend')) {
      market = 'Financial Technology';
    } else if (text.includes('ai') || text.includes('agent') || text.includes('llm') || text.includes('gpt') || text.includes('intelligence') || text.includes('learning')) {
      market = 'Artificial Intelligence';
    } else if (text.includes('carbon') || text.includes('emissions') || text.includes('climate') || text.includes('energy') || text.includes('green') || text.includes('sustainable')) {
      market = 'ClimateTech / ESG';
    } else if (text.includes('learn') || text.includes('student') || text.includes('school') || text.includes('class') || text.includes('academy') || text.includes('tutor')) {
      market = 'EdTech / Education';
    } else if (text.includes('farmer') || text.includes('restaurant') || text.includes('marketplace') || text.includes('shop') || text.includes('e-commerce') || text.includes('b2b')) {
      market = 'B2B Commerce';
    } else if (text.includes('delivery') || text.includes('route') || text.includes('logistics') || text.includes('fleet') || text.includes('ship') || text.includes('supply')) {
      market = 'Logistics & Supply';
    } else if (text.includes('automate') || text.includes('workflow') || text.includes('no-code') || text.includes('rpa') || text.includes('integration')) {
      market = 'Enterprise Automation';
    }

    let industry = '';
    if (market) {
      industry = market.split(' / ')[0].split(' ')[0] + ' Solutions';
    } else if (name.trim().length > 2 || description.trim().length > 5) {
      industry = 'Digital Technology Services';
    }

    let revenueModel = '';
    if (text.includes('subscription') || text.includes('saas') || text.includes('monthly') || text.includes('annual') || text.includes('billed')) {
      revenueModel = 'SaaS Subscription';
    } else if (text.includes('transaction') || text.includes('fee') || text.includes('split') || text.includes('charge') || text.includes('stripe')) {
      revenueModel = 'Transaction-Based Fee';
    } else if (text.includes('marketplace') || text.includes('commission') || text.includes('take-rate')) {
      revenueModel = 'Marketplace Cut';
    } else if (text.includes('api') || text.includes('developer') || text.includes('token') || text.includes('usage')) {
      revenueModel = 'Usage-Based API Pricing';
    } else if (text.includes('freemium') || text.includes('ad-') || text.includes('sponsors')) {
      revenueModel = 'Freemium / Advertising';
    } else if (description.trim().length > 15) {
      revenueModel = 'B2B Software Licensing';
    }

    let businessType = '';
    if (text.includes('api') || text.includes('sdk') || text.includes('infrastructure')) {
      businessType = 'Developer Tool / API';
    } else if (text.includes('marketplace') || text.includes('network') || text.includes('peer')) {
      businessType = 'Double-Sided Marketplace';
    } else if (text.includes('platform') || text.includes('software') || text.includes('portal')) {
      businessType = 'SaaS Application';
    } else if (text.includes('hardware') || text.includes('device') || text.includes('iot') || text.includes('sensor')) {
      businessType = 'IoT & Hardware Platform';
    } else if (text.includes('extension') || text.includes('plugin') || text.includes('widget')) {
      businessType = 'Browser Integration';
    } else if (description.trim().length > 10) {
      businessType = 'B2B Web Platform';
    }

    let audience = '';
    if (text.includes('doctor') || text.includes('patient') || text.includes('hospital') || text.includes('clinic')) {
      audience = 'Healthcare & Medical Staff';
    } else if (text.includes('freelancer') || text.includes('contractor') || text.includes('creator') || text.includes('independent')) {
      audience = 'Self-Employed Professionals';
    } else if (text.includes('farmer') || text.includes('restaurant') || text.includes('kitchen')) {
      audience = 'Culinary & Farm Operations';
    } else if (text.includes('student') || text.includes('teacher') || text.includes('school') || text.includes('kid')) {
      audience = 'Students & Educational Institutions';
    } else if (text.includes('developer') || text.includes('engineer') || text.includes('data scientist')) {
      audience = 'Software Engineers / Devs';
    } else if (text.includes('enterprise') || text.includes('firm') || text.includes('corporation')) {
      audience = 'Corporate & Mid-Market Teams';
    } else if (description.trim().length > 15) {
      audience = 'SMEs & Startup Teams';
    }

    setAnalysis({
      market,
      industry,
      revenueModel,
      businessType,
      audience
    });
  }, [name, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a startup name to begin the evaluation.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a startup description of at least 20 characters.');
      return;
    }

    onSubmit(name, description);
  };

  const handleApplyChip = (chip: { name: string; desc: string }) => {
    setName(chip.name);
    setDescription(chip.desc);
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto z-20 relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        className="w-full p-[1px] rounded-[28px] bg-gradient-to-b from-[#3b82f6]/20 via-[#3b82f6]/5 to-[#3b82f6]/20 shadow-[0_24px_50px_rgba(0,0,0,0.85),_0_0_80px_rgba(59,130,246,0.03)] backdrop-blur-[28px] overflow-hidden"
      >
        <div className="bg-gradient-to-b from-[#0a0a0c]/90 to-[#030304]/95 p-6 md:p-10 rounded-[27px] relative overflow-hidden">
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.02] mix-blend-overlay" />
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left: Input command panel */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Field 1: Startup Name */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-widest text-[#a1a1aa] uppercase font-display">
                  Startup Identity
                </label>
                <div 
                  className={`relative rounded-2xl bg-black/45 border transition-all duration-500 flex items-center px-4 py-3.5 ${
                    nameFocused 
                      ? 'border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.15),_inset_0_1px_2px_rgba(255,255,255,0.05)]' 
                      : 'border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)] hover:border-white/10'
                  }`}
                >
                  <div className="flex-1 relative">
                    <label 
                      className={`absolute left-0 transition-all duration-300 pointer-events-none text-slate-500 font-sans ${
                        nameFocused || name 
                          ? 'top-[-8px] text-[10px] text-[#60a5fa] font-semibold uppercase tracking-wider' 
                          : 'top-1 text-sm'
                      }`}
                    >
                      What should we call your startup?
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      disabled={isLoading}
                      maxLength={100}
                      className={`w-full bg-transparent border-0 p-0 text-white placeholder-transparent focus:ring-0 focus:outline-none text-sm transition-all duration-300 ${
                        nameFocused || name ? 'pt-4 pb-0' : 'py-1'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Field 2: Description Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-widest text-[#a1a1aa] uppercase font-display">
                  Core Venture Concept
                </label>
                <div 
                  className={`relative rounded-2xl bg-black/45 border transition-all duration-500 px-4 py-3.5 ${
                    descFocused 
                      ? 'border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.15),_inset_0_1px_2px_rgba(255,255,255,0.05)]' 
                      : 'border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)] hover:border-white/10'
                  }`}
                >
                  <div className="relative">
                    <label 
                      className={`absolute left-0 transition-all duration-300 pointer-events-none text-slate-500 font-sans ${
                        descFocused || description 
                          ? 'top-[-8px] text-[10px] text-[#60a5fa] font-semibold uppercase tracking-wider' 
                          : 'top-1 text-sm'
                      }`}
                    >
                      Describe your startup idea
                    </label>
                    
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => setDescFocused(true)}
                      onBlur={() => setDescFocused(false)}
                      disabled={isLoading}
                      maxLength={1200}
                      placeholder={
                        descFocused 
                          ? "Explain the problem you're solving, who it's for, and how your business works.\n\nThe more detail you provide, the more accurate your analysis will be." 
                          : ""
                      }
                      className={`w-full bg-transparent border-0 p-0 text-white placeholder-slate-500 focus:ring-0 focus:outline-none text-sm leading-relaxed transition-all duration-300 resize-none ${
                        descFocused || description ? 'pt-4 pb-0' : 'py-1'
                      }`}
                    />
                    
                    {/* Blinking ChatGPT-style custom caret when active and input is empty */}
                    {descFocused && !description && (
                      <span className="absolute left-[1px] bottom-1 w-[8px] h-[15px] bg-[#60a5fa] animate-pulse pointer-events-none opacity-80" />
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 select-none">
                    <span>Min. 20 characters required.</span>
                    <span className={description.trim().length >= 20 ? 'text-[#60a5fa]' : 'text-amber-500/80'}>
                      {description.length} / 1200 characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 text-xs text-rose-300 bg-rose-500/5 border border-rose-500/10 rounded-xl font-sans"
                >
                  {error}
                </motion.div>
              )}

              {/* Section 3: Smart Prompt Chips */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] font-display">
                  Industry Blueprints
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_CHIPS.map((chip) => (
                    <motion.button
                      key={chip.label}
                      type="button"
                      onClick={() => handleApplyChip(chip)}
                      disabled={isLoading}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-[#3b82f6]/30 text-left text-xs text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer disabled:opacity-50 select-none flex items-center gap-2 hover:bg-gradient-to-tr hover:from-black hover:to-[#0a0f1d] hover:shadow-[0_4px_15px_rgba(59,130,246,0.06)]"
                    >
                      <span className="font-sans text-[11px] font-medium truncate">{chip.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Section 4: Example Prompts */}
              <div className="space-y-3 pt-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] font-display">
                  Need inspiration?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EXAMPLE_CARDS.map((ex, idx) => {
                    const isHovered = hoveredExampleIdx === idx;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        onMouseEnter={() => setHoveredExampleIdx(idx)}
                        onMouseLeave={() => setHoveredExampleIdx(null)}
                        onClick={() => {
                          if (isLoading) return;
                          setName(ex.name);
                          setDescription(ex.text);
                          setError('');
                        }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 cursor-pointer hover:border-[#3b82f6]/20 transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between hover:bg-gradient-to-b hover:from-white/[0.02] hover:to-transparent"
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] text-white font-medium leading-normal tracking-wide">
                            "{ex.title}"
                          </p>
                          <AnimatePresence initial={false}>
                            {isHovered && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[10px] text-slate-400 font-sans mt-2 leading-relaxed"
                              >
                                {ex.shortDesc}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="text-[9px] text-[#60a5fa] mt-3 font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 flex items-center gap-0.5 self-start">
                          Use Template
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: Floating AI Analysis preview */}
            <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-black/30 border border-white/5 relative overflow-hidden">
              {/* Sci-fi styling glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#60a5fa] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest text-[#a1a1aa] uppercase font-display">
                      Triage Matrix
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">v3.5</span>
                </div>

                <div className="space-y-4">
                  {/* Analysis item 1: Market */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {analysis.market ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 animate-pulse" />
                      )}
                      <span className={`text-xs font-sans ${analysis.market ? 'text-slate-200' : 'text-slate-500'}`}>
                        Market Detected
                      </span>
                    </div>
                    {analysis.market && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-5 text-[10px] text-[#60a5fa] font-mono font-medium"
                      >
                        {analysis.market}
                      </motion.div>
                    )}
                  </div>

                  {/* Analysis item 2: Industry */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {analysis.industry ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-sans ${analysis.industry ? 'text-slate-200' : 'text-slate-500'}`}>
                        Industry Mapping
                      </span>
                    </div>
                    {analysis.industry && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-5 text-[10px] text-[#60a5fa] font-mono font-medium"
                      >
                        {analysis.industry}
                      </motion.div>
                    )}
                  </div>

                  {/* Analysis item 3: Revenue Model */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {analysis.revenueModel ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-sans ${analysis.revenueModel ? 'text-slate-200' : 'text-slate-500'}`}>
                        Revenue Blueprint
                      </span>
                    </div>
                    {analysis.revenueModel && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-5 text-[10px] text-[#60a5fa] font-mono font-medium"
                      >
                        {analysis.revenueModel}
                      </motion.div>
                    )}
                  </div>

                  {/* Analysis item 4: Business Type */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {analysis.businessType ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-sans ${analysis.businessType ? 'text-slate-200' : 'text-slate-500'}`}>
                        Architecture Model
                      </span>
                    </div>
                    {analysis.businessType && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-5 text-[10px] text-[#60a5fa] font-mono font-medium"
                      >
                        {analysis.businessType}
                      </motion.div>
                    )}
                  </div>

                  {/* Analysis item 5: Target Audience */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {analysis.audience ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-sans ${analysis.audience ? 'text-slate-200' : 'text-slate-500'}`}>
                        Target Segment
                      </span>
                    </div>
                    {analysis.audience && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="pl-5 text-[10px] text-[#60a5fa] font-mono font-medium"
                      >
                        {analysis.audience}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Controls */}
              <div className="pt-8 mt-8 border-t border-white/5 space-y-4">
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Brief your AI analyst by filling the name and description. Real-time NLP extracts key parameters instantly.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden rounded-xl py-4 bg-[#60a5fa] text-black font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(96,165,250,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                >
                  {/* Subtle inner sweep shine */}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-[25deg] -translate-x-[200%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
                  
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Synthesizing Concept...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5 text-black" />
                      Generate Venture Report
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>
              </div>

            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
