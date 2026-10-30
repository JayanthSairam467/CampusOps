/**
 * Floating Left Dock — matches the reference SugarCRM / Ron Design vertical dock
 */

import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Wrench,
  ShieldCheck,
  BarChart3,
  Flame,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarDock: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    setIsReportModalOpen,
    setIsChaosModalOpen,
  } = useApp();

  return (
    <aside
      aria-label="Sidebar Navigation Dock"
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center py-4 px-2.5 rounded-full bg-white/80 dark:bg-[#161B22]/85 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      {/* Top Action Pill (Quick Report) */}
      <button
        type="button"
        onClick={() => setIsReportModalOpen(true)}
        title="Report Incident (+)"
        aria-label="Report Incident"
        className="w-11 h-11 mb-3 rounded-full flex items-center justify-center bg-[#10141A] dark:bg-white text-white dark:text-[#10141A] shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Navigation Icons Stack */}
      <nav className="flex flex-col items-center gap-2" aria-label="Main Dock Menu">
        <button
          type="button"
          onClick={() => setActiveTab('operations')}
          title="Operations Command"
          aria-label="Operations Command"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            activeTab === 'operations'
              ? 'bg-[#10141A] text-white shadow-sm dark:bg-[#83A2DB] dark:text-[#10141A]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('journeys')}
          title="Incident Recovery Journey"
          aria-label="Incident Recovery Journey"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            activeTab === 'journeys'
              ? 'bg-[#10141A] text-white shadow-sm dark:bg-[#83A2DB] dark:text-[#10141A]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
          }`}
        >
          <GitFork className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('workorders')}
          title="Work Orders & Cryptographic Evidence"
          aria-label="Work Orders"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            activeTab === 'workorders'
              ? 'bg-[#10141A] text-white shadow-sm dark:bg-[#83A2DB] dark:text-[#10141A]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
          }`}
        >
          <Wrench className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          title="Continuity & SoD Approvals"
          aria-label="Continuity and Approvals"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            activeTab === 'approvals'
              ? 'bg-[#10141A] text-white shadow-sm dark:bg-[#83A2DB] dark:text-[#10141A]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          title="SLA Analytics & Telemetry"
          aria-label="SLA Analytics"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            activeTab === 'analytics'
              ? 'bg-[#10141A] text-white shadow-sm dark:bg-[#83A2DB] dark:text-[#10141A]'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsChaosModalOpen(true)}
          title="Chaos Lab Sandbox"
          aria-label="Chaos Lab"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#CE6969] hover:bg-[#CE6969]/10 transition-all duration-200"
        >
          <Flame className="w-4 h-4" />
        </button>
      </nav>

      <div className="w-5 h-[1px] bg-slate-300/70 dark:bg-slate-700/70 my-3" />

      {/* Dark/Light Mode Pill Toggle at bottom (matching reference!) */}
      <div className="flex flex-col items-center p-1 rounded-full bg-slate-200/80 dark:bg-black/40">
        <button
          type="button"
          onClick={() => !darkMode || toggleDarkMode()}
          title="Switch to Light Mode"
          aria-label="Switch to Light Mode"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            !darkMode
              ? 'bg-[#10141A] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => darkMode || toggleDarkMode()}
          title="Switch to Dark Mode"
          aria-label="Switch to Dark Mode"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            darkMode
              ? 'bg-[#83A2DB] text-[#10141A] shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
