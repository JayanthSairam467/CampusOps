/**
 * RecoveryPlanCard — Displays deterministic recovery plans, feasibility meters,
 * 9 constraint check badges, and Separation of Duties (SoD) approval controls
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validateSeparationOfDuties } from '../utils/engine';

export const RecoveryPlanCard: React.FC = () => {
  const {
    selectedIncident,
    activePlans,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    currentUserRole,
    currentUser,
    approvePlan,
    setCurrentUserRole,
  } = useApp();

  const [expandedChecks, setExpandedChecks] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!selectedIncident || activePlans.length === 0) {
    return (
      <div className="clay-card rounded-[28px] p-6 text-center text-slate-500">
        No recovery plans generated. Deterministic engine is triaging constraints.
      </div>
    );
  }

  const currentPlan = selectedPlan || activePlans[0];

  // Evaluate current user's SoD clearance
  const sodEvaluation = validateSeparationOfDuties(
    currentUserRole,
    currentUser.email,
    selectedIncident.reporter.email,
    currentPlan.createdByRole
  );

  const handleApprove = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const result = await approvePlan(currentPlan.id, 'APPROVED');
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const result = await approvePlan(currentPlan.id, 'REJECTED', 'Manual operator override requested');
      setFeedback({
        type: 'success',
        message: result.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExecuted = currentPlan.status === 'APPROVED' || currentPlan.status === 'EXECUTED';

  return (
    <div className="clay-card rounded-[28px] p-5 md:p-6 flex flex-col justify-between transition-all">
      <div>
        {/* Header & Plan Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/5">
          <div>
            <h2 className="text-base font-bold text-[#10141A] dark:text-white flex items-center gap-2">
              <span>Autonomous Recovery Plan</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#10141A] text-white dark:bg-white dark:text-[#10141A]">
                v{currentPlan.version}.0 Locked
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated across 9 deterministic constraints
            </p>
          </div>

          {/* Alternative Plan Selectors */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-200/60 dark:bg-black/30 text-xs">
            {activePlans.map((plan, index) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setFeedback(null);
                }}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  currentPlan.id === plan.id
                    ? 'bg-[#10141A] text-white dark:bg-white dark:text-[#10141A] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Option {index === 0 ? 'Alpha' : 'Beta'} ({plan.score.overall}%)
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Overview Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recommended Action Strategy
              </p>
              <h3 className="text-sm font-bold text-[#10141A] dark:text-white mt-0.5">
                {currentPlan.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Target: <strong>{currentPlan.alternativeTargetRoom?.code || 'Hall B-101'}</strong> ({currentPlan.alternativeTargetRoom?.capacity || 140} seats, {currentPlan.alternativeTargetRoom?.distanceMeters || 45}m transit).
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-[#10141A] dark:text-white tabular-nums">
                {currentPlan.score.overall}%
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Feasibility</p>
            </div>
          </div>

          {/* Feasibility Score Breakdown Bar Grid */}
          <div className="mt-3 grid grid-cols-4 gap-2 pt-3 border-t border-slate-200/60 dark:border-white/5 text-center">
            <div className="p-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5">
              <p className="text-[10px] text-slate-500 font-semibold">Time Margin</p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentPlan.score.timeScore}%
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5">
              <p className="text-[10px] text-slate-500 font-semibold">Min Disruption</p>
              <p className="text-xs font-mono font-bold text-[#83A2DB]">
                {currentPlan.score.disruptionScore}%
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5">
              <p className="text-[10px] text-slate-500 font-semibold">Stability</p>
              <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {currentPlan.score.changeScore}%
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-100/70 dark:bg-white/5">
              <p className="text-[10px] text-slate-500 font-semibold">Cost Impact</p>
              <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                ${currentPlan.estimatedCostUsd}
              </p>
            </div>
          </div>
        </div>

        {/* 9 Deterministic Checks Accordion */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpandedChecks((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              9 Deterministic Invariants ({currentPlan.deterministicChecks.filter((c) => c.passed).length}/9 Passing)
            </span>
            {expandedChecks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expandedChecks && (
            <div className="mt-1 space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
              {currentPlan.deterministicChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-start gap-2 p-2 rounded-xl bg-white/50 dark:bg-white/5 text-[11px] border border-slate-100 dark:border-white/5"
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#CE6969] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-[#10141A] dark:text-white mr-1.5">
                      {check.name}:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {check.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Separation of Duties (SoD) Notice Box */}
        <div className={`mt-3 p-3 rounded-2xl border text-xs ${
          sodEvaluation.valid
            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
        }`}>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Separation of Duties (SoD) Protocol:
              </p>
              <p className="text-[11px] mt-0.5">
                {sodEvaluation.valid
                  ? `Clearance Verified: As ${currentUserRole}, you hold dual-control sign-off authority.`
                  : sodEvaluation.reason}
              </p>
              {!sodEvaluation.valid && (
                <button
                  type="button"
                  onClick={() => setCurrentUserRole('FACILITIES_ADMIN')}
                  className="mt-1.5 font-bold underline text-[11px] text-amber-900 dark:text-amber-200 block"
                >
                  Switch role to Facilities Admin to exercise approval authority →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alert if present */}
        {feedback && (
          <div className={`mt-3 p-2.5 rounded-xl text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3">
        {isExecuted ? (
          <div className="w-full py-2 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Recovery Plan Approved & Dispatched
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleReject}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Reject / Modify
            </button>

            <button
              type="button"
              disabled={isSubmitting || !sodEvaluation.valid}
              onClick={handleApprove}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                sodEvaluation.valid
                  ? 'bg-[#10141A] text-white hover:bg-slate-800 dark:bg-white dark:text-[#10141A] dark:hover:bg-slate-100 shadow-md'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-white/10 dark:text-slate-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#83A2DB] dark:text-[#10141A]" />
              <span>Approve & Atomically Execute Plan</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
