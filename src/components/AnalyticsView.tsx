/**
 * AnalyticsView — Telemetry gauges matching the reference screenshot "Support Ticket Journey"
 * Recreates circular radial progress arcs (blue & coral), technician utilization, and live audit stream
 */

import React from 'react';
import {
  Activity,
  ShieldCheck,
  Clock,
  Package,
  Wrench,
  AlertTriangle,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { analytics, auditLogs, setIsChaosModalOpen, resetSandbox } = useApp();

  return (
    <div className="space-y-6 pt-2">
      {/* Top Header */}
      <div className="clay-card rounded-[28px] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#10141A] dark:text-white">
            Operational Telemetry & SLA Resilience
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time audit invariants, technician loads, and autonomous recovery compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChaosModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#CE6969] bg-[#CE6969]/10 hover:bg-[#CE6969]/20 transition-all"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Launch Chaos Injection</span>
          </button>
        </div>
      </div>

      {/* Hero Radial Gauges (Direct replica of the reference screenshot "Support Ticket Journey"!) */}
      <div className="clay-card rounded-[32px] p-6 lg:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/5">
          <div>
            <h2 className="text-lg font-bold text-[#10141A] dark:text-white">
              Campus Recovery & Support Journey Telemetry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic invariant health and continuous SLA adherence
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-[#10141A] font-bold shadow-xs">
              Live Horizon: 24h
            </span>
          </div>
        </div>

        {/* The 2 Major Radial Progress Rings matching Screenshot 1! */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {/* Gauge 1: Soft Periwinkle Blue Radial (Executed / On-Time) */}
          <div className="clay-pill rounded-[28px] p-6 bg-white/70 dark:bg-black/20 border border-white/80 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Number badge floating top-left (matching reference!) */}
            <div className="absolute top-4 left-5 flex items-center justify-center w-8 h-8 rounded-full bg-slate-200/80 dark:bg-white/10 text-xs font-bold text-[#10141A] dark:text-white shadow-sm">
              94%
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-white/5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#83A2DB"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="251.2"
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset: `${251.2 * (1 - 0.942)}`,
                    transition: 'stroke-dashoffset 1.5s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#10141A] dark:text-white tabular-nums">
                  94.2%
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  SLA On-Time
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
              12 of 14 Incidents Restored ≤ 45 mins
            </p>
          </div>

          {/* Gauge 2: Coral Red Radial (Active Critical Disruption) */}
          <div className="clay-pill rounded-[28px] p-6 bg-white/70 dark:bg-black/20 border border-white/80 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Number badge floating top-left (matching reference!) */}
            <div className="absolute top-4 left-5 flex items-center justify-center w-8 h-8 rounded-full bg-[#CE6969]/20 text-xs font-bold text-[#CE6969] shadow-sm">
              {analytics.p1Count}
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-white/5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#CE6969"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="251.2"
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset: `${251.2 * (1 - 0.28)}`,
                    transition: 'stroke-dashoffset 1.5s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#CE6969] tabular-nums">
                  {analytics.activeDisruptionMinutes}m
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Disruption
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
              2 High-Stakes Exam Halls Guarded
            </p>
          </div>

          {/* Gauge 3: Solid Dark Onyx Gauge (Continuity Index) */}
          <div className="clay-pill rounded-[28px] p-6 bg-[#10141A] text-white flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs font-bold text-[#83A2DB]">
              97%
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#83A2DB"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="251.2"
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset: `${251.2 * (1 - 0.968)}`,
                    transition: 'stroke-dashoffset 1.5s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white tabular-nums">
                  96.8%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Continuity Index
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-300 mt-2">
              Zero Unmitigated Exam Cancellations
            </p>
          </div>
        </div>
      </div>

      {/* Lower Split: Staff Utilization + Spare Parts + Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Field Staff & Workload */}
        <div className="clay-card rounded-[28px] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
            <h3 className="text-sm font-bold text-[#10141A] dark:text-white flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#83A2DB]" />
              Staff Capacity & Skill Loads
            </h3>
            <span className="text-[11px] font-mono text-slate-500">4 Active</span>
          </div>

          <div className="space-y-3">
            {analytics.technicianUtilization.map((tech) => {
              const pct = (tech.activeOrders / tech.maxOrders) * 100;
              return (
                <div key={tech.name} className="p-3 rounded-2xl bg-white/60 dark:bg-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#10141A] dark:text-white">{tech.name}</span>
                    <span className="font-mono text-[11px] text-slate-500 font-bold">
                      {tech.activeOrders} / {tech.maxOrders} orders
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tech.specialty}</p>

                  <div className="mt-2 w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 80 ? 'bg-[#CE6969]' : 'bg-[#83A2DB]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Hardware Inventory Shortages */}
        <div className="clay-card rounded-[28px] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
            <h3 className="text-sm font-bold text-[#10141A] dark:text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#83A2DB]" />
              Critical Hardware Spares
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Bay 4 Stock</span>
          </div>

          <div className="space-y-2.5">
            {analytics.inventoryAlerts.map((item) => (
              <div
                key={item.sku}
                className="p-3 rounded-2xl bg-white/60 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-[#10141A] dark:text-white truncate max-w-[170px]">
                    {item.part}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {item.sku} · {item.remaining} on-hand
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'CRITICAL'
                    ? 'bg-[#CE6969]/15 text-[#CE6969]'
                    : item.status === 'WARNING'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real-Time Audit Log Ticker with USER / AI / SYSTEM Badges */}
        <div className="clay-card rounded-[28px] p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
            <h3 className="text-sm font-bold text-[#10141A] dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#83A2DB]" />
              Immutable Audit Ledger
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">● Streaming</span>
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px]"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold ${
                      log.actor.type === 'AI'
                        ? 'bg-[#83A2DB] text-[#10141A]'
                        : log.actor.type === 'SYSTEM'
                        ? 'bg-[#10141A] text-white dark:bg-white dark:text-[#10141A]'
                        : 'bg-[#CE6969] text-white'
                    }`}>
                      {log.actor.type}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {log.actor.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {log.action}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
