'use client';

import React from 'react';
import { EvaluationResult } from '@/types';
import { History, Trash2, ArrowRight, Award } from 'lucide-react';

interface HistoryListProps {
  history: EvaluationResult[];
  onSelect: (item: EvaluationResult) => void;
  onClear: () => void;
}

export default function HistoryList({ history, onSelect, onClear }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase font-display flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          RECENT EVALUATIONS
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="text-left w-full glass-panel glass-panel-hover rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="font-semibold text-slate-200 font-display text-sm truncate">
                {item.startupName}
              </h4>
              <p className="text-xs text-slate-400 font-sans truncate">
                {item.startupDescription}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Award className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold font-display text-violet-300">{item.overallScore}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
