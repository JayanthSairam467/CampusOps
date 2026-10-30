/**
 * BlastRadiusCard — Displays room capacity, student cohorts at risk, and ticking countdown
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  Building,
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BlastRadiusCard: React.FC = () => {
  const { selectedIncident, activeBlastRadius } = useApp();
  const [seconds, setSeconds] = useState(59);

  // High precision seconds ticker for urgency
  useEffect(() => {
    const sTimer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(sTimer);
  }, []);

  if (!selectedIncident || !activeBlastRadius) {
    return (
      <div className="clay-card rounded-[28px] p-6 text-center text-slate-500">
        Select an incident to view blast radius and room impact.
      </div>
    );
  }

  const room = activeBlastRadius.affectedRoom;
  const primaryActivity = activeBlastRadius.scheduledActivities[0];
  const occupancyPercent = Math.min(100, Math.round((primaryActivity?.headcount || 120) / room.capacity * 100));

  return (
    <div className="clay-card rounded-[28px] p-5 md:p-6 flex flex-col justify-between transition-all">
      <div>
        {/* Top Header with live urgent ticking clock */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/5">
          <div>
            <h2 className="text-base font-bold text-[#10141A] dark:text-white flex items-center gap-2">
              <span>Blast Radius & Constraints</span>
              {selectedIncident.safetyRisk && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CE6969] text-white">
                  Hazard Active
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic impact bounds on campus schedule
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CE6969]/10 border border-[#CE6969]/20 text-[#CE6969]">
            <Clock className="w-4 h-4 animate-pulse" />
            <div className="text-xs font-mono font-bold tabular-timer">
              <span>{selectedIncident.deadlineMinutesRemaining}m</span> : <span>{seconds < 10 ? `0${seconds}` : seconds}s</span>
            </div>
          </div>
        </div>

        {/* Room & Cohort Impact Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Affected Venue */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold">
                <Building className="w-3.5 h-3.5" /> Affected Venue
              </span>
              <span className="font-mono text-[11px] text-[#CE6969] font-bold">
                {room.hazardLevel} RISK
              </span>
            </div>
            <p className="text-sm font-bold text-[#10141A] dark:text-white mt-1">
              {room.code}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{room.name}</p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500">Capacity Occupancy</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{occupancyPercent}% ({primaryActivity?.headcount || 120}/{room.capacity})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#CE6969]"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Scheduled High-Stakes Activity */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-[#83A2DB]">
                <Users className="w-3.5 h-3.5" /> High-Stakes Cohort
              </span>
              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[#83A2DB]/20 text-[#10141A] dark:text-white">
                {primaryActivity?.type || 'EXAM'}
              </span>
            </div>
            <p className="text-sm font-bold text-[#10141A] dark:text-white mt-1 truncate">
              {primaryActivity?.name || 'CS301 Distributed Systems Exam'}
            </p>
            <p className="text-[11px] text-slate-500">
              Lead: {primaryActivity?.lecturer || 'Faculty Dean'} · {primaryActivity?.startTime}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#10141A] text-white dark:bg-white dark:text-[#10141A]">
                {activeBlastRadius.totalStudentsAtRisk} Candidates
              </span>
              <span className="text-[11px] text-slate-500">
                {activeBlastRadius.cohorts.length} cohorts affected
              </span>
            </div>
          </div>
        </div>

        {/* Required Hardware & Skill Prerequisites */}
        <div className="mt-3 space-y-2">
          {/* Required Hardware */}
          <div className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#83A2DB]" /> Required Replacement Parts
              </span>
              <span className="text-[11px] text-emerald-600 font-mono font-bold">
                ✓ IN STOCK (Bay 4)
              </span>
            </div>
            {activeBlastRadius.requiredParts.map((p) => (
              <div key={p.partId} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 py-0.5">
                <span className="truncate max-w-[200px]">{p.name}</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {p.quantityNeeded} needed · {p.inStock} on-hand
                </span>
              </div>
            ))}
          </div>

          {/* Technician Credentials */}
          <div className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#83A2DB]" /> Assigned Dispatch & Skills
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {activeBlastRadius.assignedStaff.length} on shift
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeBlastRadius.requiredTechnicianSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
        <span>Campus Schedule Lock Status</span>
        <span className="text-[#83A2DB] font-semibold">Atomic Sync Active</span>
      </div>
    </div>
  );
};
