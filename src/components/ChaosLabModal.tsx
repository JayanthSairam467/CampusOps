/**
 * ChaosLabModal — Interactive stress testing & crisis scenario injector
 */

import React from 'react';
import {
  Flame,
  X,
  Zap,
  WifiOff,
  Droplets,
  RotateCcw,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChaosScenario } from '../types';

export const ChaosLabModal: React.FC = () => {
  const { isChaosModalOpen, setIsChaosModalOpen, injectChaosScenario, resetSandbox } = useApp();

  if (!isChaosModalOpen) return null;

  const scenarios: {
    id: ChaosScenario;
    title: string;
    icon: React.ReactNode;
    severity: string;
    impact: string;
    desc: string;
    color: string;
  }[] = [
    {
      id: 'electrical_exam',
      title: 'Electrical Failure + Final Exam',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      severity: 'P1 Critical',
      impact: '120 Students · 42m Cutoff',
      desc: 'Simulates a main 100A sub-panel breaker trip in Hall B-204 during CS301 final exam. Verifies immediate relocation & SoD dual-control approval.',
      color: 'border-amber-400/40 hover:border-amber-500',
    },
    {
      id: 'network_lab',
      title: 'Fibre Severance + Practical Exam',
      icon: <WifiOff className="w-5 h-5 text-[#83A2DB]" />,
      severity: 'P2 High',
      impact: '60 Students · 78m Cutoff',
      desc: 'Simulates uplink failure on Cisco Catalyst distribution switches in CS Lab A-301. Tests cohort partitioning & TA proctor reallocation.',
      color: 'border-[#83A2DB]/40 hover:border-[#83A2DB]',
    },
    {
      id: 'water_leak',
      title: 'Plumbing Rupture + Server Rack Hazard',
      icon: <Droplets className="w-5 h-5 text-[#CE6969]" />,
      severity: 'P1 Hazard',
      impact: 'Physical Hazard · 15m Cutoff',
      desc: 'Simulates ceiling HVAC drip tray overflow dripping onto active server rack R4 in C-102. Triggers safety lockout & cryptographic evidence verification.',
      color: 'border-[#CE6969]/40 hover:border-[#CE6969]',
    },
  ];

  const handleSelectScenario = (id: ChaosScenario) => {
    injectChaosScenario(id);
    setIsChaosModalOpen(false);
  };

  const handleReset = () => {
    resetSandbox();
    setIsChaosModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-[32px] bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#CE6969]/15 flex items-center justify-center text-[#CE6969]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#10141A] dark:text-white">
                Resilience Chaos Lab
              </h2>
              <p className="text-xs text-slate-500">
                Inject deterministic campus crises to test autonomous recovery pipelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsChaosModalOpen(false)}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc.id)}
              className={`w-full text-left p-4 rounded-2xl bg-white/70 dark:bg-black/20 border transition-all duration-200 flex items-start gap-3.5 hover:shadow-md hover:-translate-y-0.5 ${sc.color}`}
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 shrink-0">
                {sc.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#10141A] dark:text-white">
                    {sc.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {sc.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {sc.desc}
                </p>
                <p className="text-[10px] font-mono font-semibold text-[#83A2DB] mt-2">
                  Impact: {sc.impact}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Reset Sandbox Option */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox to Clean Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setIsChaosModalOpen(false)}
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
