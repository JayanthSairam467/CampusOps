/**
 * Active Incident Queue — matches the "Suggested Knowledge" table from reference screenshot
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';

export const ActiveIncidentsQueue: React.FC = () => {
  const { incidents, selectedIncidentId, setSelectedIncidentId, setIsReportModalOpen } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'P1' | 'AT_RISK' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = incidents.filter((inc) => {
    if (filter === 'P1' && inc.severity !== 'P1') return false;
    if (filter === 'AT_RISK' && (inc.status === 'RESOLVED' || inc.deadlineMinutesRemaining <= 0)) return false;
    if (filter === 'RESOLVED' && inc.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.room.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="clay-card rounded-[28px] p-5 md:p-6 flex flex-col justify-between transition-all">
      <div>
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-white/5">
          <div>
            <h2 className="text-base font-bold text-[#10141A] dark:text-white">
              Active Incident Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live campus telemetry & triage stream
            </p>
          </div>

          {/* Segmented Filter Pills (matching RON design!) */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/60 dark:bg-black/30 text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filter === 'ALL'
                  ? 'bg-[#10141A] text-white dark:bg-white dark:text-[#10141A] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('P1')}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filter === 'P1'
                  ? 'bg-[#CE6969] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              P1 Critical
            </button>
            <button
              type="button"
              onClick={() => setFilter('AT_RISK')}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filter === 'AT_RISK'
                  ? 'bg-[#83A2DB] text-[#10141A] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              At-Risk
            </button>
            <button
              type="button"
              onClick={() => setFilter('RESOLVED')}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-3 mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room, category, or incident ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#83A2DB]"
          />
        </div>

        {/* Table / List */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No incidents matching filter.
            </div>
          ) : (
            filtered.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-white dark:bg-[#161B22] border-[#83A2DB] shadow-md -translate-y-0.5'
                      : 'bg-white/60 dark:bg-white/5 border-transparent hover:bg-white/90 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          inc.severity === 'P1'
                            ? 'bg-[#CE6969]'
                            : inc.severity === 'P2'
                            ? 'bg-amber-500'
                            : 'bg-[#83A2DB]'
                        }`}
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {inc.id}
                      </span>
                      <span className="text-xs font-bold text-[#10141A] dark:text-white truncate max-w-[180px]">
                        {inc.room}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {inc.severity === 'P1' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CE6969]/15 text-[#CE6969]">
                          P1 Critical
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                    {inc.title}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={inc.reporter.avatar}
                        alt={inc.reporter.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="truncate max-w-[120px]">{inc.reporter.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#CE6969]" />
                      <span className="tabular-timer font-semibold text-[#CE6969]">
                        {inc.deadlineMinutesRemaining > 0 ? `${inc.deadlineMinutesRemaining}m remaining` : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing {filtered.length} of {incidents.length} active anomalies
        </span>
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="text-xs font-bold text-[#83A2DB] hover:underline"
        >
          + Report Anomaly
        </button>
      </div>
    </div>
  );
};
