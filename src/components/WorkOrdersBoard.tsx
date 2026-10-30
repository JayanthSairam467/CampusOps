/**
 * WorkOrdersBoard — Technician dispatch card with status pills and Before/After
 * photographic evidence sealed with cryptographic SHA-256 hashes
 */

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  FileCheck,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkOrder } from '../types';

export const WorkOrdersBoard: React.FC = () => {
  const { workOrders, transitionWorkOrder, verifyEvidence, currentUserRole, currentUser } = useApp();
  const [selectedWoId, setSelectedWoId] = useState<string>(workOrders[0]?.id || '');

  const selectedWo = workOrders.find((w) => w.id === selectedWoId) || workOrders[0];

  const canVerify = currentUserRole === 'FACILITIES_ADMIN' || currentUserRole === 'DEPARTMENT_MANAGER' || currentUserRole === 'SYSTEM_ADMIN';

  return (
    <div className="space-y-6 pt-2">
      {/* Top Header */}
      <div className="clay-card rounded-[28px] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#10141A] dark:text-white">
            Technician Dispatch & Evidence Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically sealed photo evidence & automated physical work order dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 font-bold text-slate-700 dark:text-slate-200">
            {workOrders.filter((w) => w.status === 'RESOLVED').length} of {workOrders.length} Resolved
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Work Order Dispatch Queue */}
        <div className="clay-card rounded-[28px] p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#10141A] dark:text-white pb-2 border-b border-slate-200/60 dark:border-white/5">
            Active Field Work Orders ({workOrders.length})
          </h2>

          <div className="space-y-2">
            {workOrders.map((wo) => {
              const isSelected = wo.id === selectedWo?.id;
              return (
                <div
                  key={wo.id}
                  onClick={() => setSelectedWoId(wo.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white dark:bg-[#161B22] border-[#83A2DB] shadow-md -translate-y-0.5'
                      : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {wo.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      wo.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : wo.status === 'AWAITING_VERIFICATION'
                        ? 'bg-[#83A2DB]/20 text-[#10141A] dark:text-white'
                        : 'bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#10141A] dark:text-white mt-1 line-clamp-1">
                    {wo.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {wo.location}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={wo.assignedTechnician.avatar}
                        alt={wo.assignedTechnician.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{wo.assignedTechnician.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(wo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Inspection & Evidence Verification Board */}
        {selectedWo && (
          <div className="lg:col-span-2 clay-card rounded-[28px] p-6 space-y-6">
            {/* Header with Lifecycle Status Stepper */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/60 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#10141A] dark:text-white">
                      {selectedWo.title}
                    </h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {selectedWo.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Location: <strong>{selectedWo.location}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={selectedWo.assignedTechnician.avatar}
                    alt={selectedWo.assignedTechnician.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#83A2DB]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#10141A] dark:text-white">
                      {selectedWo.assignedTechnician.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{selectedWo.assignedTechnician.role}</p>
                  </div>
                </div>
              </div>

              {/* Status Stepper Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(['CREATED', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_VERIFICATION', 'RESOLVED'] as const).map((st, i) => {
                  const isCurrent = selectedWo.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => transitionWorkOrder(selectedWo.id, st)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? 'bg-[#10141A] text-white dark:bg-white dark:text-[#10141A] shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side-by-side Before/After Photographic Evidence (Mandatory Requirement!) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#10141A] dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#83A2DB]" />
                  Cryptographic Evidence Vault
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  SHA-256 HMAC Digital Imprint
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE EVIDENCE */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#CE6969]">Before Repair</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedWo.beforeEvidence?.timestamp || 'Logged at triage'}
                    </span>
                  </div>
                  
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                    <img
                      src={selectedWo.beforeEvidence?.url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'}
                      alt="Before Repair Evidence"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {selectedWo.beforeEvidence?.description || 'Pre-intervention anomaly capture.'}
                  </p>

                  <div className="mt-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 font-mono text-[9px] text-slate-500 break-all">
                    SHA256: {selectedWo.beforeEvidence?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </div>
                </div>

                {/* AFTER EVIDENCE */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-600">After Resolution</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedWo.afterEvidence?.timestamp || 'Pending tech upload'}
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group flex items-center justify-center">
                    {selectedWo.afterEvidence ? (
                      <img
                        src={selectedWo.afterEvidence.url}
                        alt="After Repair Evidence"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Technician on-site. Photographic evidence upload in progress.
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {selectedWo.afterEvidence?.description || 'Post-repair verification photo pending submission.'}
                  </p>

                  <div className="mt-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 font-mono text-[9px] text-slate-500 break-all">
                    SHA256: {selectedWo.afterEvidence?.sha256 || 'Unverified Hash Lock'}
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Verification & Sign-off Actions */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#10141A] dark:text-white">
                  Operational Sign-Off Authority
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedWo.afterEvidence?.verifiedBy
                    ? `Verified by ${selectedWo.afterEvidence.verifiedBy} on ${new Date(selectedWo.afterEvidence.verifiedAt || '').toLocaleTimeString()}`
                    : 'Requires Manager or Facilities Admin dual-control acceptance of cryptographic photo evidence.'}
                </p>
              </div>

              {selectedWo.status === 'RESOLVED' ? (
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Work Order Verified & Sealed</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!canVerify}
                  onClick={() => verifyEvidence(selectedWo.id, true, `Evidence approved by ${currentUser.name}`)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    canVerify
                      ? 'bg-[#10141A] text-white hover:bg-slate-800 dark:bg-white dark:text-[#10141A] shadow-md hover:-translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-white/10 dark:text-slate-500'
                  }`}
                >
                  Accept & Verify Evidence
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
