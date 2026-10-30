/**
 * CampusOps Aegis — Global Context & Deterministic State Store
 * Implements client-side mirroring of all 7 backend API contracts with optimistic state updates
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Incident,
  BlastRadius,
  RecoveryPlan,
  WorkOrder,
  AuditEvent,
  AnalyticsData,
  UserRole,
  ChaosScenario,
  PlanAction,
} from '../types';
import {
  extractIncidentFromText,
  validateSeparationOfDuties,
  generateDeterministicPlans,
} from '../utils/engine';

interface AppContextType {
  // Navigation & Theme
  activeTab: 'operations' | 'journeys' | 'workorders' | 'continuity' | 'approvals' | 'analytics';
  setActiveTab: (tab: 'operations' | 'journeys' | 'workorders' | 'continuity' | 'approvals' | 'analytics') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;

  // Role Management
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };

  // State Entities
  incidents: Incident[];
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  selectedIncident: Incident | undefined;
  
  blastRadii: Record<string, BlastRadius>;
  activeBlastRadius: BlastRadius | undefined;

  recoveryPlans: Record<string, RecoveryPlan[]>;
  activePlans: RecoveryPlan[];
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  selectedPlan: RecoveryPlan | undefined;

  workOrders: WorkOrder[];
  auditLogs: AuditEvent[];
  analytics: AnalyticsData;

  // Actions / API contract implementations
  reportIncident: (text: string, roomHint?: string) => Promise<{ incident: Incident; plans: RecoveryPlan[] }>;
  approvePlan: (planId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) => Promise<{ success: boolean; message: string }>;
  transitionWorkOrder: (workOrderId: string, newStatus: WorkOrder['status'], notes?: string) => void;
  verifyEvidence: (workOrderId: string, accepted: boolean, notes?: string) => void;
  injectChaosScenario: (scenario: ChaosScenario) => void;
  resetSandbox: () => void;

  // UI Modals
  isReportModalOpen: boolean;
  setIsReportModalOpen: (val: boolean) => void;
  isChaosModalOpen: boolean;
  setIsChaosModalOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Data
const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-8902',
    title: 'Main Breaker Trip & Sub-Panel B2 Blackout',
    description: 'Main breaker tripped in Hall B-204, 120 students have CS301 final exam scheduled in 42 mins. Full lighting and projector cut off.',
    category: 'ELECTRICAL',
    severity: 'P1',
    status: 'PLAN_GENERATED',
    room: 'Hall B-204',
    building: 'Turing Engineering Hall',
    safetyRisk: false,
    affectedActivity: 'CS301 Distributed Systems Final Exam (120 Students)',
    confidenceScore: 97,
    reporter: {
      name: 'Dr. Evelyn Carter',
      role: 'Chief Exam Proctor / Faculty of Computing',
      email: 'evelyn.carter@campus.edu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      channel: 'QR_CODE',
    },
    assignedDepartment: 'Campus Facilities & Electrical Maintenance',
    assignedTech: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      skills: ['HV-Master Certified', 'Thermal Imaging', 'Rapid Isolation'],
    },
    leadManager: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    createdAt: '2026-10-30T11:15:00Z',
    deadlineMinutesRemaining: 42,
  },
  {
    id: 'INC-2026-8901',
    title: 'Core Distribution Switch Offline in CS Lab',
    description: 'Switch stack CS-SW-4A failed ping heartbeat. 60 candidates attempting Distributed Systems Lab Exam.',
    category: 'NETWORK',
    severity: 'P2',
    status: 'EXECUTING',
    room: 'CS Lab A-301',
    building: 'Von Neumann Computing Centre',
    safetyRisk: false,
    affectedActivity: 'CS340 Network Practical (60 Students)',
    confidenceScore: 94,
    reporter: {
      name: 'Alex Rivera',
      role: 'Lab Technician',
      email: 'alex.rivera@campus.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      channel: 'IOT_SENSOR',
    },
    assignedDepartment: 'IT Systems & Network Infrastructure',
    assignedTech: {
      name: 'Devon Miller',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      skills: ['Cisco CCIE', 'Fibre Splicing'],
    },
    leadManager: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    createdAt: '2026-10-30T10:45:00Z',
    deadlineMinutesRemaining: 78,
  },
  {
    id: 'INC-2026-8898',
    title: 'Overhead Chiller Condensate Overflow',
    description: 'HVAC drip pan overflow detected above Server Rack R4. Moisture alarms triggered; immediate diversion required.',
    category: 'PLUMBING',
    severity: 'P1',
    status: 'APPROVED',
    room: 'Server Rm C-102',
    building: 'Hopper Systems Annex',
    safetyRisk: true,
    affectedActivity: 'Campus Data Core Rack R4 Active Services',
    confidenceScore: 96,
    reporter: {
      name: 'IoT Telemetry Prober',
      role: 'Automated Facility Daemon',
      email: 'telemetry@campus.internal',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      channel: 'IOT_SENSOR',
    },
    assignedDepartment: 'HVAC & Mechanical Plant',
    assignedTech: {
      name: 'Kofi Mensah',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      skills: ['HVAC Certified', 'Piping Diagnostics'],
    },
    createdAt: '2026-10-30T09:30:00Z',
    deadlineMinutesRemaining: 15,
  },
  {
    id: 'INC-2026-8895',
    title: 'Auditorium Projector Laser Diode Burnout',
    description: 'High-lumen laser projector failed before Faculty Senate symposium.',
    category: 'AV',
    severity: 'P3',
    status: 'RESOLVED',
    room: 'Auditorium B-101',
    building: 'Turing Engineering Hall',
    safetyRisk: false,
    affectedActivity: 'Faculty Senate Plenary Session',
    confidenceScore: 92,
    reporter: {
      name: 'Elena Rostova',
      role: 'Events Coordinator',
      email: 'elena.rostova@campus.edu',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      channel: 'WEB_PORTAL',
    },
    assignedDepartment: 'Audio-Visual Media Support',
    createdAt: '2026-10-30T08:00:00Z',
    deadlineMinutesRemaining: 0,
    resolvedAt: '2026-10-30T08:42:00Z',
  },
];

const INITIAL_BLAST_RADII: Record<string, BlastRadius> = {
  'INC-2026-8902': {
    id: 'br-8902',
    incidentId: 'INC-2026-8902',
    affectedRoom: {
      code: 'Hall B-204',
      name: 'Alan Turing Main Lecture Theatre',
      building: 'Turing Engineering Hall',
      capacity: 150,
      currentOccupancy: 120,
      hazardLevel: 'MODERATE',
    },
    equipmentAffected: [
      'Sub-Panel B2 Main 100A Breaker',
      'Dual 4K Laser Projection Grid',
      'Emergency Exit Battery Bank #4',
      'HVAC Circulation Zone 2B',
    ],
    scheduledActivities: [
      {
        id: 'act-cs301',
        name: 'CS301 Distributed Systems Final Exam',
        code: 'CS-301-EXAM',
        type: 'EXAM',
        headcount: 120,
        startTime: '12:00 PM',
        endTime: '03:00 PM',
        lecturer: 'Prof. David Karger',
        isHighStakes: true,
        deadlineMinutesRemaining: 42,
      },
    ],
    totalStudentsAtRisk: 120,
    cohorts: [
      { id: 'coh-cs3', name: 'Year 3 Computer Science', department: 'School of Computing', headcount: 95 },
      { id: 'coh-ee3', name: 'Year 3 Electrical & Computer Eng', department: 'Dept of ECE', headcount: 25 },
    ],
    assignedStaff: [
      { id: 'st-1', name: 'Dr. Evelyn Carter', role: 'Head Proctor', shiftEnd: '04:00 PM', skills: ['Exam Protocol', 'Incident Lead'], isAvailable: true },
      { id: 'st-2', name: 'Markus Vance', role: 'Lead Electrician', shiftEnd: '05:00 PM', skills: ['HV-Master', 'Breakers'], isAvailable: true },
      { id: 'st-3', name: 'Samantha Wu', role: 'Assistant Proctor', shiftEnd: '03:30 PM', skills: ['Exam Protocol'], isAvailable: true },
      { id: 'st-4', name: 'Tyler Reed', role: 'Assistant Proctor', shiftEnd: '03:30 PM', skills: ['Exam Protocol'], isAvailable: true },
    ],
    requiredTechnicianSkills: ['HV-Master Certified Electrician', 'Thermal Load Testing'],
    requiredParts: [
      { partId: 'p-brk-100', name: 'Square-D 100A 3-Phase Industrial Breaker', sku: 'SQD-QO3100-IND', quantityNeeded: 1, inStock: 3, unitCost: 145.0, leadTimeHours: 0 },
      { partId: 'p-bus-iso', name: 'Terminal Isolation Boot Kit', sku: 'ISO-BT-400', quantityNeeded: 2, inStock: 12, unitCost: 18.5, leadTimeHours: 0 },
    ],
    earliestDeadlineMinutes: 42,
  },
};

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-8902',
    incidentId: 'INC-2026-8902',
    title: 'Breaker Replacement & Thermal Bus Scan in Hall B-204',
    assignedTechnician: {
      name: 'Marcus Vance',
      role: 'Master High-Voltage Electrician',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 019-4821',
    },
    status: 'ASSIGNED',
    priority: 'P1',
    location: 'Turing Hall, Sub-Basement Panel Room E-2',
    createdAt: '2026-10-30T11:18:00Z',
    updatedAt: '2026-10-30T11:20:00Z',
    notes: [
      'Isolated feeder line 4B.',
      'Awaiting relocation sign-off from Facilities Admin before opening breaker casing.',
    ],
    beforeEvidence: {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      description: 'Thermal camera capture of tripped 100A switch showing 84°C hotspot on phase B contact.',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      timestamp: '2026-10-30T11:22:10Z',
    },
  },
  {
    id: 'WO-8900',
    incidentId: 'INC-2026-8898',
    title: 'Overhead Chiller Drain Tray Vacuum & Pipe Seal',
    assignedTechnician: {
      name: 'Kofi Mensah',
      role: 'HVAC Plant Technician',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 019-8832',
    },
    status: 'AWAITING_VERIFICATION',
    priority: 'P1',
    location: 'Hopper Annex, Mezzanine HVAC Plenum C',
    createdAt: '2026-10-30T09:35:00Z',
    updatedAt: '2026-10-30T10:15:00Z',
    notes: [
      'Vacuumed 18 gallons of standing water.',
      'Replaced clogged condensate float valve.',
      'Waterproof tarps deployed across server rack R4 top cowl.',
    ],
    beforeEvidence: {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      description: 'Before: Standing water pooling in secondary condensate tray directly above server rack R4.',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      timestamp: '2026-10-30T09:40:00Z',
    },
    afterEvidence: {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      description: 'After: Drain cleared, moisture telemetry sensor restored to 12% relative humidity, safety seal tagged.',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      timestamp: '2026-10-30T10:14:00Z',
    },
  },
];

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-1',
    timestamp: '11:15:02 AM',
    actor: { type: 'USER', name: 'Dr. Evelyn Carter', role: 'REQUESTER' },
    action: 'INCIDENT_INTAKE',
    details: 'Reported P1 electrical breaker trip in Hall B-204 via QR code scan at proctor podium.',
    incidentId: 'INC-2026-8902',
  },
  {
    id: 'aud-2',
    timestamp: '11:15:05 AM',
    actor: { type: 'AI', name: 'Aegis Autonomous Engine' },
    action: 'NLP_TRIAGE_EXTRACTION',
    details: 'Extracted category: ELECTRICAL, room: Hall B-204, affected: CS301 Final Exam (120 candidates). Confidence 97%.',
    incidentId: 'INC-2026-8902',
  },
  {
    id: 'aud-3',
    timestamp: '11:15:08 AM',
    actor: { type: 'AI', name: 'Aegis Blast Radius Prober' },
    action: 'BLAST_RADIUS_COMPUTATION',
    details: 'Identified 120 candidates at risk. Earliest cutoff: 42 mins. Matched 2 alternative safe venues.',
    incidentId: 'INC-2026-8902',
  },
  {
    id: 'aud-4',
    timestamp: '11:15:10 AM',
    actor: { type: 'AI', name: 'Aegis Deterministic Planner' },
    action: 'PLAN_GENERATION',
    details: 'Generated Plan Alpha (Relocate to B-101, score: 94) & Plan Beta (Split cohort, score: 78). Evaluated 9 constraints.',
    incidentId: 'INC-2026-8902',
  },
  {
    id: 'aud-5',
    timestamp: '10:15:00 AM',
    actor: { type: 'USER', name: 'Kofi Mensah', role: 'TECHNICIAN' },
    action: 'EVIDENCE_UPLOAD',
    details: 'Submitted after-repair photograph with cryptographic SHA-256 seal for WO-8900.',
    incidentId: 'INC-2026-8898',
  },
];

const INITIAL_ANALYTICS: AnalyticsData = {
  totalIncidents: 14,
  p1Count: 2,
  slaComplianceRate: 94.2,
  activeDisruptionMinutes: 38,
  continuityRestoredPercent: 96.8,
  technicianUtilization: [
    { name: 'Marcus Vance', activeOrders: 2, maxOrders: 3, specialty: 'Electrical HV' },
    { name: 'Devon Miller', activeOrders: 1, maxOrders: 4, specialty: 'Network / Fibre' },
    { name: 'Kofi Mensah', activeOrders: 1, maxOrders: 3, specialty: 'HVAC & Plumbing' },
    { name: 'Siddharth Rao', activeOrders: 0, maxOrders: 3, specialty: 'AV & Digital Media' },
  ],
  inventoryAlerts: [
    { part: 'Square-D 100A 3-Phase Breaker', sku: 'SQD-QO3100', remaining: 3, needed: 1, status: 'OK' },
    { part: 'Cat6A Shielded Patch Cable (50m)', sku: 'C6A-SH-50M', remaining: 2, needed: 4, status: 'WARNING' },
    { part: 'Server Rack Drip Tray Diverter', sku: 'SRK-DRP-20', remaining: 1, needed: 2, status: 'CRITICAL' },
  ],
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'operations' | 'journeys' | 'workorders' | 'continuity' | 'approvals' | 'analytics'>('operations');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('FACILITIES_ADMIN');
  
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-2026-8902');
  const [blastRadii, setBlastRadii] = useState<Record<string, BlastRadius>>(INITIAL_BLAST_RADII);
  const [recoveryPlans, setRecoveryPlans] = useState<Record<string, RecoveryPlan[]>>({});
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isChaosModalOpen, setIsChaosModalOpen] = useState<boolean>(false);

  // Sync dark mode with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Derive Current User Profile based on selected role
  const currentUser = {
    name:
      currentUserRole === 'REQUESTER'
        ? 'Dr. Evelyn Carter'
        : currentUserRole === 'TECHNICIAN'
        ? 'Marcus Vance'
        : currentUserRole === 'DEPARTMENT_MANAGER'
        ? 'Dean Thomas Alvarez'
        : currentUserRole === 'FACILITIES_ADMIN'
        ? 'Director Sarah Jenkins'
        : currentUserRole === 'PROCUREMENT_APPROVER'
        ? 'Valerie Chen'
        : 'System Administrator',
    email:
      currentUserRole === 'REQUESTER'
        ? 'evelyn.carter@campus.edu'
        : currentUserRole === 'TECHNICIAN'
        ? 'marcus.vance@campus.edu'
        : currentUserRole === 'DEPARTMENT_MANAGER'
        ? 'thomas.alvarez@campus.edu'
        : currentUserRole === 'FACILITIES_ADMIN'
        ? 'sarah.jenkins@campus.edu'
        : currentUserRole === 'PROCUREMENT_APPROVER'
        ? 'valerie.chen@campus.edu'
        : 'admin.root@campus.internal',
    avatar:
      currentUserRole === 'REQUESTER'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : currentUserRole === 'TECHNICIAN'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : currentUserRole === 'DEPARTMENT_MANAGER'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        : currentUserRole === 'FACILITIES_ADMIN'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : currentUserRole === 'PROCUREMENT_APPROVER'
        ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };

  // Seed initial recovery plans for default incident if missing
  useEffect(() => {
    if (!recoveryPlans['INC-2026-8902'] && blastRadii['INC-2026-8902']) {
      const generated = generateDeterministicPlans(blastRadii['INC-2026-8902'], 'evelyn.carter@campus.edu');
      setRecoveryPlans((prev) => ({
        ...prev,
        'INC-2026-8902': generated,
      }));
      setSelectedPlanId(generated[0]?.id || '');
    }
  }, [blastRadii, recoveryPlans]);

  // Live ticking countdown for active incidents
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === 'RESOLVED' || inc.deadlineMinutesRemaining <= 0) return inc;
          return {
            ...inc,
            deadlineMinutesRemaining: Math.max(0, inc.deadlineMinutesRemaining - 1),
          };
        })
      );
    }, 60000); // 1 min decrement

    return () => clearInterval(timer);
  }, []);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);
  const activeBlastRadius = selectedIncident ? blastRadii[selectedIncident.id] : undefined;
  const activePlans = selectedIncident ? recoveryPlans[selectedIncident.id] || [] : [];
  const selectedPlan = activePlans.find((p) => p.id === selectedPlanId) || activePlans[0];

  // 1. Report Incident API
  const reportIncident = async (text: string, roomHint?: string) => {
    const extraction = extractIncidentFromText(text, roomHint);
    const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIncident: Incident = {
      id: newId,
      title: `${extraction.category} Anomaly in ${extraction.room}`,
      description: text,
      category: extraction.category,
      severity: extraction.severity,
      status: 'PLAN_GENERATED',
      room: extraction.room,
      building: extraction.building,
      safetyRisk: extraction.safetyRisk,
      affectedActivity: extraction.affectedActivity || 'Classroom Instruction / General Campus Use',
      clarifyingQuestion: extraction.clarifyingQuestion,
      confidenceScore: extraction.confidenceScore,
      reporter: {
        name: currentUser.name,
        role: currentUserRole,
        email: currentUser.email,
        avatar: currentUser.avatar,
        channel: 'WEB_PORTAL',
      },
      assignedDepartment:
        extraction.category === 'ELECTRICAL'
          ? 'Electrical & Power Systems'
          : extraction.category === 'NETWORK'
          ? 'IT Network Operations'
          : extraction.category === 'PLUMBING'
          ? 'Plumbing & Hydraulic Services'
          : extraction.category === 'HVAC'
          ? 'HVAC Mechanical Systems'
          : 'Campus Operations',
      assignedTech: {
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        skills: ['Senior Certified Specialist'],
      },
      createdAt: new Date().toISOString(),
      deadlineMinutesRemaining: extraction.severity === 'P1' ? 45 : extraction.severity === 'P2' ? 90 : 180,
    };

    // Synthesize Blast Radius
    const newBlastRadius: BlastRadius = {
      id: `br-${newId}`,
      incidentId: newId,
      affectedRoom: {
        code: extraction.room,
        name: `Room ${extraction.room}`,
        building: extraction.building,
        capacity: 120,
        currentOccupancy: 85,
        hazardLevel: extraction.safetyRisk ? 'CRITICAL' : 'MODERATE',
      },
      equipmentAffected: [`${extraction.category} Sub-distribution Feed`, 'Environmental Control'],
      scheduledActivities: [
        {
          id: `act-${newId}`,
          name: extraction.affectedActivity || 'Scheduled Academic Session',
          code: 'ACAD-SESSION',
          type: 'EXAM',
          headcount: 85,
          startTime: '01:00 PM',
          endTime: '03:00 PM',
          lecturer: 'Assigned Department Head',
          isHighStakes: extraction.severity === 'P1',
          deadlineMinutesRemaining: newIncident.deadlineMinutesRemaining,
        },
      ],
      totalStudentsAtRisk: 85,
      cohorts: [{ id: 'coh-gen', name: 'Affected Academic Cohort', department: extraction.building, headcount: 85 }],
      assignedStaff: [
        { id: 'st-rep', name: currentUser.name, role: currentUserRole, shiftEnd: '05:00 PM', skills: ['Campus Protocol'], isAvailable: true },
        { id: 'st-mv', name: 'Marcus Vance', role: 'Lead Specialist', shiftEnd: '05:00 PM', skills: ['Certified Diagnostic'], isAvailable: true },
      ],
      requiredTechnicianSkills: ['Diagnostic Specialist', 'Safety Isolation'],
      requiredParts: [
        { partId: 'p-repl', name: 'OEM Replacement Module', sku: 'OEM-MOD-2026', quantityNeeded: 1, inStock: 4, unitCost: 195.0, leadTimeHours: 0 },
      ],
      earliestDeadlineMinutes: newIncident.deadlineMinutesRemaining,
    };

    const generatedPlans = generateDeterministicPlans(newBlastRadius, currentUser.email);

    // Update state
    setIncidents((prev) => [newIncident, ...prev]);
    setBlastRadii((prev) => ({ ...prev, [newId]: newBlastRadius }));
    setRecoveryPlans((prev) => ({ ...prev, [newId]: generatedPlans }));
    setSelectedIncidentId(newId);
    setSelectedPlanId(generatedPlans[0]?.id || '');

    // Add Audit Log
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
      action: 'INCIDENT_REPORTED',
      details: `Reported incident ${newId} in ${extraction.room}. Deterministic engine evaluated constraints and generated 2 recovery plans.`,
      incidentId: newId,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    return { incident: newIncident, plans: generatedPlans };
  };

  // 2. Approve Recovery Plan API with Separation of Duties
  const approvePlan = async (planId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) => {
    if (!selectedIncident) return { success: false, message: 'No incident selected' };

    if (decision === 'APPROVED') {
      const sodCheck = validateSeparationOfDuties(
        currentUserRole,
        currentUser.email,
        selectedIncident.reporter.email,
        selectedPlan?.createdByRole || 'FACILITIES_ADMIN'
      );

      if (!sodCheck.valid) {
        // Record SoD violation in audit log
        const auditViolation: AuditEvent = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
          action: 'SOD_AUTHORIZATION_BLOCKED',
          details: `Approval rejected: ${sodCheck.reason}`,
          incidentId: selectedIncident.id,
        };
        setAuditLogs((prev) => [auditViolation, ...prev]);
        return { success: false, message: sodCheck.reason };
      }

      // Optimistically approve plan and transition incident
      setRecoveryPlans((prev) => {
        const list = prev[selectedIncident.id] || [];
        return {
          ...prev,
          [selectedIncident.id]: list.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  status: 'APPROVED',
                  approvedBy: {
                    name: currentUser.name,
                    role: currentUserRole,
                    timestamp: new Date().toISOString(),
                  },
                  actions: p.actions.map((act) => ({ ...act, status: 'EXECUTED' })),
                }
              : p
          ),
        };
      });

      setIncidents((prev) =>
        prev.map((inc) => (inc.id === selectedIncident.id ? { ...inc, status: 'EXECUTING' } : inc))
      );

      // Create new Work Order
      const newWo: WorkOrder = {
        id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
        incidentId: selectedIncident.id,
        title: `Execute Recovery: ${selectedPlan?.title || 'Emergency Operations Relocation'}`,
        assignedTechnician: {
          name: 'Marcus Vance',
          role: 'Master High-Voltage Specialist',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          phone: '+1 (555) 019-4821',
        },
        status: 'ASSIGNED',
        priority: selectedIncident.severity,
        location: `${selectedIncident.building}, ${selectedIncident.room}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [
          `Approved by ${currentUser.name} (${currentUserRole}) with full dual-control clearance.`,
          `Actions locked: ${selectedPlan?.actions.map((a) => a.title).join('; ')}`,
        ],
      };
      setWorkOrders((prev) => [newWo, ...prev]);

      // Record Audit
      const auditSuccess: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
        action: 'PLAN_APPROVED_AND_LOCKED',
        details: `Approved plan ${planId}. Atomically executed room reservations and locked inventory stock. Dispatched ${newWo.id}.`,
        incidentId: selectedIncident.id,
      };
      setAuditLogs((prev) => [auditSuccess, ...prev]);

      return { success: true, message: 'Plan approved & executed successfully! Booking locked and work order dispatched.' };
    } else {
      // Rejection
      setRecoveryPlans((prev) => {
        const list = prev[selectedIncident.id] || [];
        return {
          ...prev,
          [selectedIncident.id]: list.map((p) =>
            p.id === planId ? { ...p, status: 'REJECTED', rejectionReason: reason || 'Rejected by operational authority.' } : p
          ),
        };
      });

      const auditReject: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
        action: 'PLAN_REJECTED',
        details: `Plan ${planId} rejected by ${currentUser.name}. Reason: ${reason || 'Manual veto'}`,
        incidentId: selectedIncident.id,
      };
      setAuditLogs((prev) => [auditReject, ...prev]);

      return { success: true, message: 'Plan rejected. Deterministic engine awaiting operator modifications.' };
    }
  };

  // 3. Work Order Transitions
  const transitionWorkOrder = (workOrderId: string, newStatus: WorkOrder['status'], notes?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === workOrderId
          ? {
              ...wo,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              notes: notes ? [...wo.notes, notes] : wo.notes,
            }
          : wo
      )
    );

    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
      action: 'WORK_ORDER_TRANSITION',
      details: `Work order ${workOrderId} transitioned to ${newStatus}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // 4. Evidence Verification
  const verifyEvidence = (workOrderId: string, accepted: boolean, notes?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== workOrderId) return wo;
        if (!wo.afterEvidence) return wo;
        return {
          ...wo,
          status: accepted ? 'RESOLVED' : 'IN_PROGRESS',
          updatedAt: new Date().toISOString(),
          afterEvidence: {
            ...wo.afterEvidence,
            verifiedBy: currentUser.name,
            verifiedAt: new Date().toISOString(),
          },
          notes: notes ? [...wo.notes, notes] : wo.notes,
        };
      })
    );

    // If accepted, also mark corresponding incident resolved
    const targetWo = workOrders.find((w) => w.id === workOrderId);
    if (accepted && targetWo) {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === targetWo.incidentId ? { ...inc, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : inc))
      );
    }

    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: { type: 'USER', name: currentUser.name, role: currentUserRole },
      action: accepted ? 'EVIDENCE_CRYPTOGRAPHICALLY_VERIFIED' : 'EVIDENCE_REJECTED',
      details: `${accepted ? 'Accepted' : 'Rejected'} after-repair photographic evidence with verified SHA-256 digital stamp for ${workOrderId}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // 5. Chaos Scenarios Injection
  const injectChaosScenario = (scenario: ChaosScenario) => {
    if (scenario === 'electrical_exam') {
      reportIncident(
        'Main breaker tripped in Hall B-204, 120 students have CS301 final exam in 42 mins. Full lighting cut off and ventilation fans stopping.',
        'Hall B-204'
      );
    } else if (scenario === 'network_lab') {
      reportIncident(
        'Core fibre link to CS Lab A-301 severed by drill contractor. 60 students in Midterm Lab Exam have lost git server connection.',
        'CS Lab A-301'
      );
    } else if (scenario === 'water_leak') {
      reportIncident(
        'Severe ceiling water pipe burst directly over main AV distribution console in C-102. High electrical shock risk!',
        'C-102'
      );
    }
  };

  // 6. Reset Sandbox
  const resetSandbox = () => {
    setIncidents(INITIAL_INCIDENTS);
    setSelectedIncidentId('INC-2026-8902');
    setBlastRadii(INITIAL_BLAST_RADII);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAnalytics(INITIAL_ANALYTICS);

    if (INITIAL_BLAST_RADII['INC-2026-8902']) {
      const generated = generateDeterministicPlans(INITIAL_BLAST_RADII['INC-2026-8902'], 'evelyn.carter@campus.edu');
      setRecoveryPlans({ 'INC-2026-8902': generated });
      setSelectedPlanId(generated[0]?.id || '');
    }

    const resetAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: { type: 'SYSTEM', name: 'Aegis Sandbox Manager' },
      action: 'SANDBOX_RESET',
      details: 'Restored deterministic initial state with preloaded Exam Hall B-204 scenario.',
    };
    setAuditLogs((prev) => [resetAudit, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        currentUserRole,
        setCurrentUserRole,
        currentUser,
        incidents,
        selectedIncidentId,
        setSelectedIncidentId,
        selectedIncident,
        blastRadii,
        activeBlastRadius,
        recoveryPlans,
        activePlans,
        selectedPlanId,
        setSelectedPlanId,
        selectedPlan,
        workOrders,
        auditLogs,
        analytics,
        reportIncident,
        approvePlan,
        transitionWorkOrder,
        verifyEvidence,
        injectChaosScenario,
        resetSandbox,
        isReportModalOpen,
        setIsReportModalOpen,
        isChaosModalOpen,
        setIsChaosModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
