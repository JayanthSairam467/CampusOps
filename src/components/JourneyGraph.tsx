/**
 * JourneyGraph — High-fidelity SVG connected pipeline replicating the SugarCRM / Ron Design journey card
 * Features smooth bezier curves, interactive nodes, avatar stack, countdown clock, and action execution pills
 */

import React from 'react';
import {
  Calendar,
  CheckCheck,
  MoreHorizontal,
  Clock,
  Plus,
  Share2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JourneyGraph: React.FC = () => {
  const {
    selectedIncident,
    activeBlastRadius,
    selectedPlan,
    activePlans,
    setSelectedPlanId,
    setIsReportModalOpen,
    currentUserRole,
    approvePlan,
  } = useApp();

  if (!selectedIncident) {
    return (
      <div className="clay-card rounded-[28px] p-8 text-center text-slate-500">
        No incident selected. Select an incident from the queue to view its recovery journey.
      </div>
    );
  }

  const isApproved = selectedIncident.status === 'APPROVED' || selectedIncident.status === 'EXECUTING' || selectedIncident.status === 'RESOLVED';

  // Team avatar roster for the top recessed pill stack (matching reference!)
  const teamRoster = [
    { name: selectedIncident.reporter.name, avatar: selectedIncident.reporter.avatar, count: 2, badgeColor: 'bg-[#83A2DB]' },
    { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', count: 3, badgeColor: 'bg-[#83A2DB]' },
    { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', count: 2, badgeColor: 'bg-[#CE6969]' },
    { name: 'Dr. Evelyn Carter', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', count: 1, badgeColor: 'bg-[#CE6969]' },
    { name: 'Devon Miller', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', count: 1, badgeColor: 'bg-slate-400' },
    { name: 'Kofi Mensah', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', count: 2, badgeColor: 'bg-[#83A2DB]' },
  ];

  return (
    <div className="clay-card rounded-[32px] p-5 md:p-7 relative overflow-hidden transition-all duration-300">
      {/* Top Header Row of Journey Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#10141A] dark:text-white">
              Campus Incident & Recovery Journey
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#10141A] text-white dark:bg-[#83A2DB] dark:text-[#10141A]">
              {selectedIncident.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time deterministic orchestration for {selectedIncident.room} ({selectedIncident.building})
          </p>
        </div>

        {/* Center Recessed Avatar Pill Stack (matching reference screenshot!) */}
        <div className="clay-recessed px-3 py-1.5 rounded-full flex items-center gap-2">
          {teamRoster.map((m, idx) => (
            <div key={idx} className="relative flex flex-col items-center group cursor-pointer" title={m.name}>
              <img
                src={m.avatar}
                alt={m.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[#161B22] transition-transform group-hover:scale-110"
              />
              <span className={`-mt-1.5 text-[9px] font-bold text-white px-1 rounded-full ${m.badgeColor} ring-1 ring-white dark:ring-[#161B22]`}>
                {m.count}
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            aria-label="Add Team Member or Incident"
            className="w-7 h-7 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20 transition-all text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Clock className="w-3.5 h-3.5 text-[#CE6969]" />
            <span className="tabular-timer font-semibold text-[#CE6969]">
              {selectedIncident.deadlineMinutesRemaining}m cutoff
            </span>
          </div>

          <button
            type="button"
            aria-label="Calendar View"
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Share or Export Journey"
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flowchart: 4 Interconnected Columns */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 pt-2">
        {/* SVG Connector Overlay for Desktop */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curve 1: Intake to Identification Top */}
          <path
            d="M 278 75 C 292 75, 292 68, 308 68"
            fill="none"
            stroke="#83A2DB"
            strokeWidth="3"
          />
          <circle cx="278" cy="75" r="4" fill="#83A2DB" />
          <circle cx="308" cy="68" r="4" fill="#83A2DB" />

          {/* Curve 2: Intake to Identification Middle */}
          <path
            d="M 278 190 C 295 190, 295 125, 308 125"
            fill="none"
            stroke="#83A2DB"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <circle cx="278" cy="190" r="3.5" fill="#83A2DB" />
          <circle cx="308" cy="125" r="3.5" fill="#83A2DB" />

          {/* Curve 3: Identification to Blast Radius / Resolution */}
          <path
            d="M 578 68 C 592 68, 592 68, 608 68"
            fill="none"
            stroke="#83A2DB"
            strokeWidth="3"
          />
          <circle cx="578" cy="68" r="4" fill="#83A2DB" />
          <circle cx="608" cy="68" r="4" fill="#83A2DB" />

          {/* Curve 4: Identification to Hazard Estimate */}
          <path
            d="M 578 185 C 595 185, 595 155, 608 155"
            fill="none"
            stroke="#CE6969"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <circle cx="578" cy="185" r="3.5" fill="#CE6969" />
          <circle cx="608" cy="155" r="3.5" fill="#CE6969" />

          {/* Curve 5: Technical Resolution to Black Recommended Plan */}
          <path
            d="M 878 155 C 895 155, 895 90, 908 90"
            fill="none"
            stroke="#10141A"
            strokeWidth="3"
          />
          <circle cx="878" cy="155" r="4" fill="#10141A" />
          <circle cx="908" cy="90" r="4" fill="#10141A" />
        </svg>

        {/* STAGE 1: Case Allocation & Intake */}
        <div className="flex flex-col gap-3 relative z-10">
          <div className="clay-pill rounded-[24px] p-4 bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedIncident.reporter.avatar}
                  alt={selectedIncident.reporter.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <div>
                  <p className="text-xs font-bold text-[#10141A] dark:text-white">
                    {selectedIncident.reporter.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Channel: {selectedIncident.reporter.channel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="w-4 h-4" />
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Allocate Incident to Team!
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                NLP Extraction: {selectedIncident.confidenceScore}% confidence
              </p>
            </div>
          </div>

          <div className="clay-pill rounded-[24px] p-4 bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedIncident.leadManager?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Lead Manager"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <div>
                  <p className="text-xs font-bold text-[#10141A] dark:text-white">
                    Automated Intake Prober
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Safety Risk: {selectedIncident.safetyRisk ? 'CRITICAL' : 'NOMINAL'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="w-4 h-4" />
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Acknowledge Receipt to Faculty!
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automated SMS & push dispatch sent
              </p>
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Intake & Allocation
          </p>
        </div>

        {/* STAGE 2: Issue Identification */}
        <div className="clay-pill rounded-[24px] p-4 bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 flex flex-col justify-between relative z-10 space-y-3">
          <div className="space-y-3">
            {/* Row 1: Category */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="AI Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Category: <span className="font-bold text-[#10141A] dark:text-white">{selectedIncident.category}</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCheck className="w-3.5 h-3.5" />
                <Calendar className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Row 2: Severity */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Severity:{' '}
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    selectedIncident.severity === 'P1'
                      ? 'bg-[#CE6969] text-white'
                      : 'bg-[#83A2DB] text-[#10141A]'
                  }`}>
                    {selectedIncident.severity} High Priority
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCheck className="w-3.5 h-3.5" />
                <Calendar className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Row 3: Impact */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Blast Radius: <strong className="text-slate-900 dark:text-white">{activeBlastRadius?.totalStudentsAtRisk || 120} candidates</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCheck className="w-3.5 h-3.5" />
                <Calendar className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Row 4: Assigned Team */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                  {selectedIncident.assignedDepartment}
                </span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Row 5: Notification */}
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Advise Faculty Dean
                </span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Issue Identification
          </p>
        </div>

        {/* STAGE 3: Technical Resolution Assessment */}
        <div className="clay-pill rounded-[24px] p-4 bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 flex flex-col justify-between relative z-10 space-y-2.5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Identify Sub-Panel Feeder</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Lock Spare Stock (Bin E-12)</span>
              </div>
            </div>

            {/* Highlighted Estimate Resolution Card */}
            <div className="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-black/30 border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Marcus Vance"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-[#10141A] dark:text-white">
                      Estimated Recovery Time
                    </p>
                    <p className="text-[10px] text-[#CE6969] font-mono font-bold">
                      {selectedPlan?.estimatedRecoveryMinutes || 20} mins to venue ready
                    </p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Manager"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-slate-700 dark:text-slate-300">Advise Exam Operations</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">Notify Campus Registrar</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Technical Resolution
          </p>
        </div>

        {/* STAGE 4: Autonomous Plan & Discrete Actions (Black pill card matching Ron Design!) */}
        <div className="flex flex-col gap-2.5 relative z-10">
          {/* Main Recommended Plan Node (Solid Onyx Black with White Text) */}
          <div className="clay-pill rounded-[26px] p-4 bg-[#10141A] text-white shadow-lg flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#83A2DB]">
                Autonomous Plan Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#83A2DB] text-[#10141A]">
                Score {selectedPlan?.score.overall || 94}%
              </span>
            </div>
            
            <div className="my-2">
              <h2 className="text-sm font-bold leading-tight text-white">
                {selectedPlan?.title || 'Plan Alpha: Rapid Relocation to Turing Hall B-101'}
              </h2>
              <p className="text-[11px] text-slate-300 mt-1">
                Zero timetable collision; 140 seats ready.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-300">
                {isApproved ? 'Status: EXECUTING' : 'Awaiting Approval'}
              </span>
              <span className="text-[#83A2DB] font-semibold">
                {selectedPlan?.actions.length || 4} Actions Locked
              </span>
            </div>
          </div>

          {/* Action Pills Connected to Plan Node */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400">Action 1</p>
              <p className="text-xs font-bold text-[#10141A] dark:text-white mt-0.5 truncate">
                Relocate Activity
              </p>
              <p className="text-[10px] text-[#83A2DB] font-medium truncate">
                → Hall B-101 (45m)
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400">Action 2</p>
              <p className="text-xs font-bold text-[#10141A] dark:text-white mt-0.5 truncate">
                Reserve Part
              </p>
              <p className="text-[10px] text-[#83A2DB] font-medium truncate">
                → 100A 3-Ph Breaker
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400">Action 3</p>
              <p className="text-xs font-bold text-[#10141A] dark:text-white mt-0.5 truncate">
                Reassign Tech
              </p>
              <p className="text-[10px] text-[#83A2DB] font-medium truncate">
                → Marcus Vance (HV)
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#161B22]/90 border border-white/80 dark:border-white/10 text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400">Action 4</p>
              <p className="text-xs font-bold text-[#10141A] dark:text-white mt-0.5 truncate">
                Deploy UPS Pod
              </p>
              <p className="text-[10px] text-[#CE6969] font-medium truncate">
                → Proctor Biometrics
              </p>
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            New Tasks & Execution
          </p>
        </div>
      </div>
    </div>
  );
};
