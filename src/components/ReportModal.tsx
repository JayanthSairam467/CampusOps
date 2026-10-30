/**
 * ReportModal — Natural Language Incident Intake with Real-time AI Extraction Preview,
 * Clarifying Follow-ups, and Immediate Blast-Radius Warnings
 */

import React, { useState, useId } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  Send,
  Building,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractIncidentFromText } from '../utils/engine';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportIncident } = useApp();
  const [inputText, setInputText] = useState(
    'Main breaker tripped in Hall B-204, 120 students have CS301 final exam in 45 mins. Lighting and projector off.'
  );
  const [clarifyingAnswer, setClarifyingAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportInputId = useId();
  const clarifyingInputId = useId();

  if (!isReportModalOpen) return null;

  // Live real-time NLP extraction as the user types
  const extraction = extractIncidentFromText(inputText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    try {
      const fullText = clarifyingAnswer.trim()
        ? `${inputText} Note: ${clarifyingAnswer}`
        : inputText;
      await reportIncident(fullText, extraction.room);
      setIsReportModalOpen(false);
      setInputText('');
      setClarifyingAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#10141A] dark:bg-white flex items-center justify-center text-white dark:text-[#10141A]">
              <Sparkles className="w-4 h-4 text-[#83A2DB]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#10141A] dark:text-white">
                Report Campus Anomaly or Crisis
              </h2>
              <p className="text-xs text-slate-500">
                Natural language intake with real-time heuristic parsing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(false)}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Fill Preset Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick scenarios:
          </span>
          <button
            type="button"
            onClick={() =>
              handleQuickFill(
                'Main breaker tripped in Hall B-204, 120 students have CS301 final exam in 45 mins'
              )
            }
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            ⚡ Breaker Trip + Exam
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickFill(
                'Core switch stack offline in CS Lab A-301, 60 candidates doing Distributed Systems lab'
              )
            }
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            🌐 Switch Outage + Lab
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickFill(
                'Ceiling water pipe dripping above server rack C-102. Exposed wiring risk!'
              )
            }
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            💧 Water Pipe Leak
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor={reportInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Describe the incident in plain natural language
            </label>
            <textarea
              id={reportInputId}
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Main breaker tripped in Hall B-204, 120 students have CS301 final exam in 45 mins..."
              className="w-full p-3.5 rounded-2xl bg-slate-100/80 dark:bg-black/30 border border-slate-200/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#83A2DB] resize-none"
              required
            />
          </div>

          {/* Real-time AI Extraction Preview Box */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#10141A] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#83A2DB]" />
                Live Heuristic Extraction Preview
              </span>
              <span className="text-[10px] font-mono font-bold text-[#83A2DB]">
                {extraction.confidenceScore}% Confidence
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10141A] text-white dark:bg-white dark:text-[#10141A]">
                Category: {extraction.category}
              </div>

              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                Venue: {extraction.room}
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                extraction.severity === 'P1'
                  ? 'bg-[#CE6969] text-white'
                  : extraction.severity === 'P2'
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#83A2DB] text-[#10141A]'
              }`}>
                Severity: {extraction.severity} Priority
              </div>

              {extraction.safetyRisk && (
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-[#CE6969] text-white animate-pulse">
                  ⚠ Safety Risk Flagged
                </div>
              )}
            </div>

            {extraction.affectedActivity && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Identified Session: <strong className="text-slate-800 dark:text-slate-200">{extraction.affectedActivity}</strong>
              </p>
            )}
          </div>

          {/* Follow-up Clarifying Question Bubble if needed */}
          {extraction.clarifyingQuestion && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <label htmlFor={clarifyingInputId} className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                    Autonomous Engine Clarifying Question:
                  </label>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400 mb-1.5">
                    {extraction.clarifyingQuestion}
                  </p>
                  <input
                    id={clarifyingInputId}
                    type="text"
                    value={clarifyingAnswer}
                    onChange={(e) => setClarifyingAnswer(e.target.value)}
                    placeholder="Provide additional details..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-800/40 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Immediate Blast-Radius Warning Banner */}
          {extraction.severity === 'P1' && (
            <div className="p-3 rounded-2xl bg-[#CE6969]/10 border border-[#CE6969]/20 flex items-center gap-2 text-xs text-[#CE6969] font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Immediate blast-radius evaluation: High-stakes campus examination will be jeopardized unless autonomous recovery plan is approved within 45 minutes.
              </span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#10141A] hover:bg-slate-800 dark:bg-white dark:text-[#10141A] dark:hover:bg-slate-100 shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Processing Constraints...' : 'Triage & Generate Recovery Plans'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
