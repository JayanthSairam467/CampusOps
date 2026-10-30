/**
 * Top Navigation Bar — matches the reference SugarCRM top bar with pill links and role switcher
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Bell,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const ROLES: { id: UserRole; label: string; desc: string; badge: string }[] = [
  { id: 'FACILITIES_ADMIN', label: 'Facilities Admin', desc: 'Full operational sign-off & dispatch authority', badge: 'Admin' },
  { id: 'DEPARTMENT_MANAGER', label: 'Department Manager', desc: 'Faculty dean & academic continuity lead', badge: 'Manager' },
  { id: 'TECHNICIAN', label: 'Campus Technician', desc: 'High-voltage & HVAC field specialist', badge: 'Field Tech' },
  { id: 'REQUESTER', label: 'Academic Proctor', desc: 'Exam supervisor / Faculty reporter', badge: 'Proctor' },
  { id: 'PROCUREMENT_APPROVER', label: 'Procurement Lead', desc: 'Inventory requisition & spend approver', badge: 'Finance' },
  { id: 'SYSTEM_ADMIN', label: 'System Root', desc: 'Platform resilience engineer & audit prober', badge: 'SuperAdmin' },
];

export const TopNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUserRole,
    setCurrentUserRole,
    currentUser,
    setIsReportModalOpen,
    setIsChaosModalOpen,
    resetSandbox,
    incidents,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const p1Count = incidents.filter((i) => i.severity === 'P1' && i.status !== 'RESOLVED').length;

  return (
    <header className="sticky top-0 z-30 w-full px-4 md:px-8 pt-4 pb-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 py-2.5 px-4 md:px-6 rounded-full bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#10141A] dark:bg-white flex items-center justify-center text-white dark:text-[#10141A] shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#10141A] dark:text-white whitespace-nowrap">
            CampusOps <span className="font-medium text-[#83A2DB]">Aegis</span>
          </span>
        </div>

        {/* Central Pill Navigation (matching SugarCRM top pills!) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-200/50 dark:bg-white/5" aria-label="Top Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'operations'
                ? 'bg-[#10141A] text-white shadow-sm dark:bg-white dark:text-[#10141A]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Operations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journeys')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'journeys'
                ? 'bg-[#10141A] text-white shadow-sm dark:bg-white dark:text-[#10141A]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Journeys
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workorders')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'workorders'
                ? 'bg-[#10141A] text-white shadow-sm dark:bg-white dark:text-[#10141A]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Work Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'approvals'
                ? 'bg-[#10141A] text-white shadow-sm dark:bg-white dark:text-[#10141A]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Approvals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-[#10141A] text-white shadow-sm dark:bg-white dark:text-[#10141A]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Right Actions & Persona Switcher */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Quick Report Button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#10141A] hover:bg-slate-800 dark:bg-white dark:text-[#10141A] dark:hover:bg-slate-100 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#83A2DB] dark:text-[#10141A]" />
            <span>+ Report Incident</span>
          </button>

          {/* Chaos Lab Trigger */}
          <button
            type="button"
            onClick={() => setIsChaosModalOpen(true)}
            title="Inject Chaos Scenario"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#CE6969] bg-[#CE6969]/10 hover:bg-[#CE6969]/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chaos Lab</span>
          </button>

          {/* Reset Sandbox */}
          <button
            type="button"
            onClick={resetSandbox}
            title="Reset to Baseline Scenario"
            aria-label="Reset Sandbox"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Separation of Duties Persona / Role Switcher Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRoleDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-white/60 dark:border-white/20"
              />
              <span className="hidden md:inline font-semibold">{currentUserRole.replace('_', ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Active Authority Clearance
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Separation of Duties (SoD) is strictly validated against this role.
                  </p>
                </div>
                <div className="space-y-1">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setCurrentUserRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUserRole === r.id
                          ? 'bg-[#10141A] text-white dark:bg-[#83A2DB] dark:text-[#10141A]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {r.label}
                          {currentUserRole === r.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <p className={`text-[11px] line-clamp-1 ${currentUserRole === r.id ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>
                          {r.desc}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        currentUserRole === r.id
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#10141A]'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                      }`}>
                        {r.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
