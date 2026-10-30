/**
 * CampusOps Aegis — Core Type Definitions & API Contracts
 */

export type IncidentCategory = 
  | 'ELECTRICAL'
  | 'NETWORK'
  | 'PLUMBING'
  | 'HVAC'
  | 'CIVIL'
  | 'HOUSEKEEPING'
  | 'AV'
  | 'SAFETY'
  | 'OTHER';

export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';

export type IncidentStatus = 
  | 'NEW'
  | 'TRIAGED'
  | 'ANALYZING'
  | 'PLAN_GENERATED'
  | 'APPROVED'
  | 'EXECUTING'
  | 'RESOLVED';

export type UserRole = 
  | 'REQUESTER'
  | 'TECHNICIAN'
  | 'DEPARTMENT_MANAGER'
  | 'FACILITIES_ADMIN'
  | 'PROCUREMENT_APPROVER'
  | 'SYSTEM_ADMIN';

export interface IncidentReporter {
  name: string;
  role: string;
  email: string;
  avatar: string;
  channel: 'QR_CODE' | 'MOBILE_APP' | 'WEB_PORTAL' | 'IOT_SENSOR' | 'DESK_HOTLINE';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  room: string;
  building: string;
  safetyRisk: boolean;
  affectedActivity?: string;
  clarifyingQuestion?: string;
  confidenceScore: number; // 0 - 100
  reporter: IncidentReporter;
  assignedDepartment: string;
  assignedTech?: {
    name: string;
    avatar: string;
    skills: string[];
  };
  leadManager?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  deadlineMinutesRemaining: number;
  resolvedAt?: string;
}

export interface ScheduledActivity {
  id: string;
  name: string;
  code: string;
  type: 'EXAM' | 'LECTURE' | 'LAB' | 'WORKSHOP';
  headcount: number;
  startTime: string;
  endTime: string;
  lecturer: string;
  isHighStakes: boolean;
  deadlineMinutesRemaining: number;
}

export interface SparePartItem {
  partId: string;
  name: string;
  sku: string;
  quantityNeeded: number;
  inStock: number;
  unitCost: number;
  leadTimeHours: number;
}

export interface BlastRadius {
  id: string;
  incidentId: string;
  affectedRoom: {
    code: string;
    name: string;
    building: string;
    capacity: number;
    currentOccupancy: number;
    hazardLevel: 'NONE' | 'MODERATE' | 'CRITICAL';
  };
  equipmentAffected: string[];
  scheduledActivities: ScheduledActivity[];
  totalStudentsAtRisk: number;
  cohorts: {
    id: string;
    name: string;
    department: string;
    headcount: number;
  }[];
  assignedStaff: {
    id: string;
    name: string;
    role: string;
    shiftEnd: string;
    skills: string[];
    isAvailable: boolean;
  }[];
  requiredTechnicianSkills: string[];
  requiredParts: SparePartItem[];
  earliestDeadlineMinutes: number;
}

export type ActionType = 
  | 'RELOCATE_ACTIVITY'
  | 'SPLIT_ACTIVITY'
  | 'REASSIGN_STAFF'
  | 'RESERVE_PART'
  | 'RESERVE_EQUIPMENT'
  | 'SERVICE_WORKAROUND'
  | 'PROCURE_PART';

export interface PlanAction {
  id: string;
  type: ActionType;
  title: string;
  details: string;
  targetResource: string;
  status: 'PENDING' | 'EXECUTED';
  badgeColor?: string;
}

export interface DeterministicCheck {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

export interface RecoveryPlan {
  id: string;
  incidentId: string;
  title: string;
  version: number;
  strategy: 'RELOCATION' | 'SPLIT' | 'WORKAROUND' | 'HYBRID';
  score: {
    overall: number; // 0 - 100
    timeScore: number; // 0 - 100
    changeScore: number; // 0 - 100
    costScore: number; // 0 - 100
    disruptionScore: number; // 0 - 100
  };
  estimatedRecoveryMinutes: number;
  estimatedCostUsd: number;
  actions: PlanAction[];
  deterministicChecks: DeterministicCheck[];
  status: 'DRAFT' | 'READY_FOR_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  createdByRole: UserRole;
  approvedBy?: {
    name: string;
    role: UserRole;
    timestamp: string;
  };
  rejectionReason?: string;
  alternativeTargetRoom?: {
    code: string;
    capacity: number;
    distanceMeters: number;
    avEquipped: boolean;
  };
}

export interface EvidenceAttachment {
  url: string;
  description: string;
  sha256: string;
  timestamp: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface WorkOrder {
  id: string;
  incidentId: string;
  title: string;
  assignedTechnician: {
    name: string;
    role: string;
    avatar: string;
    phone: string;
  };
  status: 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_VERIFICATION' | 'RESOLVED';
  priority: IncidentSeverity;
  location: string;
  createdAt: string;
  updatedAt: string;
  notes: string[];
  beforeEvidence?: EvidenceAttachment;
  afterEvidence?: EvidenceAttachment;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    type: 'USER' | 'AI' | 'SYSTEM';
    name: string;
    role?: UserRole;
  };
  action: string;
  details: string;
  incidentId?: string;
}

export interface AnalyticsData {
  totalIncidents: number;
  p1Count: number;
  slaComplianceRate: number;
  activeDisruptionMinutes: number;
  continuityRestoredPercent: number;
  technicianUtilization: {
    name: string;
    activeOrders: number;
    maxOrders: number;
    specialty: string;
  }[];
  inventoryAlerts: {
    part: string;
    sku: string;
    remaining: number;
    needed: number;
    status: 'CRITICAL' | 'WARNING' | 'OK';
  }[];
}

export type ChaosScenario = 'electrical_exam' | 'network_lab' | 'water_leak';
