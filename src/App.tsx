/**
 * CampusOps Aegis — Autonomous Campus Recovery & Operational Resilience Platform
 * Visual aesthetic: Soft Claymorphic Glassmorphism & Neo-Brutalist Layout (RON DESIGN)
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SidebarDock } from './components/SidebarDock';
import { TopNav } from './components/TopNav';
import { JourneyGraph } from './components/JourneyGraph';
import { ActiveIncidentsQueue } from './components/ActiveIncidentsQueue';
import { BlastRadiusCard } from './components/BlastRadiusCard';
import { RecoveryPlanCard } from './components/RecoveryPlanCard';
import { WorkOrdersBoard } from './components/WorkOrdersBoard';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportModal } from './components/ReportModal';
import { ChaosLabModal } from './components/ChaosLabModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#E4E4E4] dark:bg-[#0D1117] transition-colors duration-300">
      {/* Floating Left Dock (Vertical Pill Sidebar) */}
      <SidebarDock />

      {/* Main Canvas Container (offset to clear the floating left dock on desktop) */}
      <div className="md:pl-24 transition-all duration-300">
        <TopNav />

        <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-2 pb-8 space-y-6">
          {/* VIEW A & B: Operations Command & Recovery Journey */}
          {(activeTab === 'operations' || activeTab === 'journeys') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* HERO: Incident Recovery Journey (SVG-connected 4-stage pipeline) */}
              <JourneyGraph />

              {/* LOWER SPLIT SECTION: 3 Balanced Claymorphic Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Active Incident Queue (Suggested Knowledge style table) */}
                <ActiveIncidentsQueue />

                {/* Middle Card: Blast Radius & Room Constraints */}
                <BlastRadiusCard />

                {/* Right Card: Recovery Plan Approval & Execution (9 checks + SoD) */}
                <RecoveryPlanCard />
              </div>
            </div>
          )}

          {/* VIEW C: Work Orders & Cryptographic Evidence Board */}
          {activeTab === 'workorders' && (
            <div className="animate-in fade-in duration-200">
              <WorkOrdersBoard />
            </div>
          )}

          {/* VIEW: Approvals & Academic Continuity */}
          {(activeTab === 'approvals' || activeTab === 'continuity') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecoveryPlanCard />
                <BlastRadiusCard />
              </div>
            </div>
          )}

          {/* VIEW D: Analytics & Telemetry Radial Gauges */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-200">
              <AnalyticsView />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ReportModal />
      <ChaosLabModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
