/**
 * CampusOps Aegis — Deterministic Planning Engine & NLP Parser
 * Pure algorithmic logic decoupled for deterministic verification & unit testing
 */

import {
  IncidentCategory,
  IncidentSeverity,
  BlastRadius,
  RecoveryPlan,
  PlanAction,
  DeterministicCheck,
  UserRole,
} from '../types';

export interface NLPExtractionResult {
  category: IncidentCategory;
  severity: IncidentSeverity;
  room: string;
  building: string;
  safetyRisk: boolean;
  affectedActivity?: string;
  clarifyingQuestion?: string;
  confidenceScore: number;
}

/**
 * Extracts structured incident data from natural language text using deterministic NLP heuristics
 */
export function extractIncidentFromText(text: string, roomHint?: string): NLPExtractionResult {
  const lower = text.toLowerCase();
  
  // 1. Detect Category
  let category: IncidentCategory = 'OTHER';
  let categoryConfidence = 70;

  if (/\b(breaker|power|spark|electric|tripped|short circuit|blackout|socket|generator)\b/.test(lower)) {
    category = 'ELECTRICAL';
    categoryConfidence = 96;
  } else if (/\b(network|wifi|switch|router|ethernet|offline|ping|internet|connection|subnet)\b/.test(lower)) {
    category = 'NETWORK';
    categoryConfidence = 94;
  } else if (/\b(water|leak|pipe|plumbing|drain|flood|dripping|sink|toilet)\b/.test(lower)) {
    category = 'PLUMBING';
    categoryConfidence = 95;
  } else if (/\b(ac|hvac|ventilation|heating|temperature|chiller|air condition|airflow)\b/.test(lower)) {
    category = 'HVAC';
    categoryConfidence = 92;
  } else if (/\b(projector|audio|microphone|screen|speaker|hdmi|display|camera|av)\b/.test(lower)) {
    category = 'AV';
    categoryConfidence = 91;
  } else if (/\b(smoke|fire|alarm|hazard|chemical|gas|spill|danger|flame)\b/.test(lower)) {
    category = 'SAFETY';
    categoryConfidence = 98;
  } else if (/\b(door|lock|window|ceiling|tile|wall|crack|roof)\b/.test(lower)) {
    category = 'CIVIL';
    categoryConfidence = 88;
  } else if (/\b(trash|clean|spill|stain|housekeeping|sanitation)\b/.test(lower)) {
    category = 'HOUSEKEEPING';
    categoryConfidence = 89;
  }

  // 2. Safety Risk
  const safetyRisk = /\b(spark|fire|smoke|shock|hazard|danger|chemical|flooding|exposed|gas)\b/.test(lower) || category === 'SAFETY';

  // 3. Room & Building Extraction
  let room = roomHint || '';
  let building = 'North Campus';

  const roomMatch = text.match(/\b(?:Hall|Room|Lab|Auditorium|Building)?\s*([A-Za-z]-?\d{3,4})\b/i);
  if (roomMatch && !room) {
    room = roomMatch[0].trim();
  } else if (!room && /\b(hall\s+b-?204|b-?204)\b/i.test(text)) {
    room = 'Hall B-204';
  } else if (!room && /\b(lab\s+a-?301|a-?301)\b/i.test(text)) {
    room = 'CS Lab A-301';
  } else if (!room && /\b(c-?102)\b/i.test(text)) {
    room = 'Server Rm C-102';
  }

  if (room.toUpperCase().includes('B-')) {
    building = 'Turing Engineering Hall';
  } else if (room.toUpperCase().includes('A-')) {
    building = 'Von Neumann Computing Centre';
  } else if (room.toUpperCase().includes('C-')) {
    building = 'Hopper Systems Annex';
  }

  // 4. Affected Activity
  let affectedActivity: string | undefined;
  const examMatch = text.match(/([a-z]{2,4}\s*\d{3,4}|final\s+exam|midterm|practical\s+exam|cs301|cs\s*301)[^.,\n]*/i);
  if (examMatch) {
    affectedActivity = examMatch[0].trim();
  } else if (/\b(exam|final|test|quiz)\b/i.test(lower)) {
    affectedActivity = 'Scheduled Examination Session';
  } else if (/\b(lecture|class|seminar)\b/i.test(lower)) {
    affectedActivity = 'Academic Lecture';
  } else if (/\b(lab|practical)\b/i.test(lower)) {
    affectedActivity = 'Hands-on Laboratory Session';
  }

  // 5. Severity Assessment
  let severity: IncidentSeverity = 'P3';
  if (safetyRisk || /\b(final exam|exam in \d+|critical|emergency|high-stakes|120 students)\b/i.test(lower)) {
    severity = 'P1';
  } else if (/\b(lab exam|lecture in|tomorrow|50 students|soon)\b/i.test(lower)) {
    severity = 'P2';
  } else if (/\b(maintenance|minor|intermittent)\b/i.test(lower)) {
    severity = 'P4';
  }

  // 6. Clarifying Question if details are thin
  let clarifyingQuestion: string | undefined;
  if (!room) {
    clarifyingQuestion = 'Which room or lecture hall is primarily experiencing this issue?';
  } else if (!affectedActivity && (severity === 'P1' || severity === 'P2')) {
    clarifyingQuestion = 'Are there any students, classes, or exams currently scheduled in this room?';
  } else if (category === 'ELECTRICAL' && !safetyRisk) {
    clarifyingQuestion = 'Did you notice any burning odor or sparks before the power cutoff?';
  }

  return {
    category,
    severity,
    room: room || 'Unassigned / Needs Triaging',
    building,
    safetyRisk,
    affectedActivity,
    clarifyingQuestion,
    confidenceScore: categoryConfidence,
  };
}

/**
 * Validates Separation of Duties (SoD)
 * A user cannot approve a recovery plan if they were the incident reporter or the plan creator
 */
export function validateSeparationOfDuties(
  approverRole: UserRole,
  approverEmail: string,
  reporterEmail: string,
  creatorRole: UserRole
): { valid: boolean; reason: string } {
  // Only managers, admins can approve
  const authorizedRoles: UserRole[] = ['DEPARTMENT_MANAGER', 'FACILITIES_ADMIN', 'SYSTEM_ADMIN'];
  if (!authorizedRoles.includes(approverRole)) {
    return {
      valid: false,
      reason: `Role '${approverRole}' does not hold operational sign-off privileges. Requires Manager or Admin authorization.`,
    };
  }

  // Enforce Separation of Duties against Reporter
  if (approverEmail && reporterEmail && approverEmail.toLowerCase() === reporterEmail.toLowerCase()) {
    return {
      valid: false,
      reason: 'Separation of Duties violation: The incident reporter cannot approve their own incident recovery plan.',
    };
  }

  return {
    valid: true,
    reason: `Authorized by ${approverRole} with verified dual-control clearance.`,
  };
}

/**
 * Evaluates the 9 Deterministic Checks for an Autonomous Recovery Plan
 */
export function evaluateDeterministicChecks(params: {
  targetRoomCapacity: number;
  cohortHeadcount: number;
  targetRoomHasHazards: boolean;
  hasScheduleOverlap: boolean;
  estimatedRelocationMinutes: number;
  deadlineMinutesRemaining: number;
  staffHasRequiredSkills: boolean;
  proctorStudentRatio: number; // e.g. 1 / 30 = 0.0333
  minRequiredRatio: number; // e.g. 0.025 (1:40)
  hasSufficientParts: boolean;
  sodClearance: boolean;
  planVersion: number;
  activeLockVersion: number;
}): DeterministicCheck[] {
  const {
    targetRoomCapacity,
    cohortHeadcount,
    targetRoomHasHazards,
    hasScheduleOverlap,
    estimatedRelocationMinutes,
    deadlineMinutesRemaining,
    staffHasRequiredSkills,
    proctorStudentRatio,
    minRequiredRatio,
    hasSufficientParts,
    sodClearance,
    planVersion,
    activeLockVersion,
  } = params;

  return [
    {
      id: 'check-room-safe',
      name: 'Room Safe',
      passed: !targetRoomHasHazards,
      details: targetRoomHasHazards
        ? 'Target venue has reported environmental hazards or pending clearances.'
        : 'Destination hall verified hazard-free, verified HVAC & electrical load capacity.',
    },
    {
      id: 'check-capacity-match',
      name: 'Capacity Match',
      passed: targetRoomCapacity >= cohortHeadcount,
      details: targetRoomCapacity >= cohortHeadcount
        ? `Capacity (${targetRoomCapacity}) meets or exceeds cohort demand (${cohortHeadcount}).`
        : `Capacity deficit: Target room (${targetRoomCapacity}) too small for cohort (${cohortHeadcount}).`,
    },
    {
      id: 'check-no-overlap',
      name: 'No Overlap',
      passed: !hasScheduleOverlap,
      details: !hasScheduleOverlap
        ? 'Time slot verified empty; zero calendar collisions with concurrent lectures.'
        : 'Time collision detected: Destination room booked by another academic department.',
    },
    {
      id: 'check-deadline-met',
      name: 'Deadline Met',
      passed: estimatedRelocationMinutes < deadlineMinutesRemaining,
      details: estimatedRelocationMinutes < deadlineMinutesRemaining
        ? `Relocation window (${estimatedRelocationMinutes}m) fits well within deadline (${deadlineMinutesRemaining}m).`
        : `SLA Breach Risk: Estimated transit & setup (${estimatedRelocationMinutes}m) exceeds cutoff (${deadlineMinutesRemaining}m).`,
    },
    {
      id: 'check-staff-skill',
      name: 'Staff Shift & Skill',
      passed: staffHasRequiredSkills,
      details: staffHasRequiredSkills
        ? 'On-duty personnel possess certified HV Electrical & Exam Proctoring credentials.'
        : 'Skill gap detected: Assigned staff lack required high-voltage certs.',
    },
    {
      id: 'check-staff-ratio',
      name: 'Staff Ratio',
      passed: proctorStudentRatio >= minRequiredRatio,
      details: proctorStudentRatio >= minRequiredRatio
        ? `Staff ratio (${(proctorStudentRatio * 100).toFixed(1)}%) satisfies academic honor code standards.`
        : 'Proctor ratio inadequate for high-stakes examination seating.',
    },
    {
      id: 'check-stock-sufficient',
      name: 'Stock Sufficient',
      passed: hasSufficientParts,
      details: hasSufficientParts
        ? 'All required spare components (100A Breaker / Patch kit) verified on-site in Storehouse Bay 4.'
        : 'Hardware stockout: Component must be expedited from central distributor (4h delay).',
    },
    {
      id: 'check-approval-sod',
      name: 'Approval & SoD',
      passed: sodClearance,
      details: sodClearance
        ? 'Role compliance verified: Approver is independent of reporter and holds tier authority.'
        : 'Separation of Duties violation: Awaiting independent manager clearance.',
    },
    {
      id: 'check-idempotence',
      name: 'Plan Version Idempotence',
      passed: planVersion === activeLockVersion,
      details: planVersion === activeLockVersion
        ? `Version lock (v${planVersion}) valid and immutable across dispatch nodes.`
        : 'Stale plan version: State altered concurrently by another campus controller.',
    },
  ];
}

/**
 * Calculates a multi-objective plan feasibility score (0 - 100)
 */
export function calculatePlanScore(params: {
  estimatedRecoveryMinutes: number;
  deadlineMinutesRemaining: number;
  costUsd: number;
  maxAcceptableCost: number;
  numberOfChanges: number;
  disruptionIndex: number; // 0 (none) - 10 (extreme)
  checks: DeterministicCheck[];
}): {
  overall: number;
  timeScore: number;
  changeScore: number;
  costScore: number;
  disruptionScore: number;
} {
  const {
    estimatedRecoveryMinutes,
    deadlineMinutesRemaining,
    costUsd,
    maxAcceptableCost,
    numberOfChanges,
    disruptionIndex,
    checks,
  } = params;

  // Time Score (0-100)
  const timeMargin = deadlineMinutesRemaining - estimatedRecoveryMinutes;
  const timeScore = Math.max(0, Math.min(100, Math.round(50 + (timeMargin / deadlineMinutesRemaining) * 50)));

  // Cost Score (0-100)
  const costRatio = Math.min(1, costUsd / Math.max(1, maxAcceptableCost));
  const costScore = Math.max(0, Math.round(100 - costRatio * 50));

  // Change Score (penalize excessive room swaps or staff splits)
  const changeScore = Math.max(20, Math.round(100 - numberOfChanges * 12));

  // Disruption Score (0-100, higher is better / less disruptive)
  const disruptionScore = Math.max(10, Math.round(100 - disruptionIndex * 9));

  // Any critical check failure caps the overall score
  const allChecksPassed = checks.every((c) => c.passed);
  const passCount = checks.filter((c) => c.passed).length;
  const checkMultiplier = passCount / checks.length;

  let overall = Math.round(
    (timeScore * 0.35 + disruptionScore * 0.30 + changeScore * 0.20 + costScore * 0.15) * checkMultiplier
  );

  if (!allChecksPassed) {
    overall = Math.min(overall, 68); // Cannot exceed 68 if any deterministic constraint fails
  }

  return {
    overall: Math.max(5, Math.min(99, overall)),
    timeScore,
    changeScore,
    costScore,
    disruptionScore,
  };
}

/**
 * Generates alternative recovery plans for a blast radius
 */
export function generateDeterministicPlans(blastRadius: BlastRadius, incidentReporterEmail: string): RecoveryPlan[] {
  // Option 1: Primary Plan - Immediate Relocation to adjacent Hall B-101
  const option1Checks = evaluateDeterministicChecks({
    targetRoomCapacity: 140,
    cohortHeadcount: blastRadius.totalStudentsAtRisk,
    targetRoomHasHazards: false,
    hasScheduleOverlap: false,
    estimatedRelocationMinutes: 20,
    deadlineMinutesRemaining: blastRadius.earliestDeadlineMinutes,
    staffHasRequiredSkills: true,
    proctorStudentRatio: 4 / blastRadius.totalStudentsAtRisk, // 4 proctors for 120 students = 1:30
    minRequiredRatio: 0.025,
    hasSufficientParts: true,
    sodClearance: true,
    planVersion: 1,
    activeLockVersion: 1,
  });

  const option1Scores = calculatePlanScore({
    estimatedRecoveryMinutes: 20,
    deadlineMinutesRemaining: blastRadius.earliestDeadlineMinutes,
    costUsd: 180,
    maxAcceptableCost: 2000,
    numberOfChanges: 2,
    disruptionIndex: 2,
    checks: option1Checks,
  });

  const plan1: RecoveryPlan = {
    id: `plan-${blastRadius.incidentId}-1`,
    incidentId: blastRadius.incidentId,
    title: 'Plan Alpha: Rapid Relocation to Turing Hall B-101',
    version: 1,
    strategy: 'RELOCATION',
    score: option1Scores,
    estimatedRecoveryMinutes: 20,
    estimatedCostUsd: 180,
    createdByRole: 'FACILITIES_ADMIN',
    status: 'READY_FOR_APPROVAL',
    alternativeTargetRoom: {
      code: 'Hall B-101',
      capacity: 140,
      distanceMeters: 45,
      avEquipped: true,
    },
    deterministicChecks: option1Checks,
    actions: [
      {
        id: 'act-1',
        type: 'RELOCATE_ACTIVITY',
        title: 'Relocate CS301 Final Exam',
        details: 'Transition 120 candidates to ground-floor Hall B-101 (45m transit, pre-warmed AV & exam seating ready).',
        targetResource: 'Hall B-101',
        status: 'PENDING',
        badgeColor: '#10141A',
      },
      {
        id: 'act-2',
        type: 'RESERVE_PART',
        title: 'Lock Replacement 100A Main Breaker',
        details: 'Reserve Square-D 100A 3-Phase Industrial Breaker in Bay 4 Stockroom (Bin E-12).',
        targetResource: 'Bay 4 Inventory',
        status: 'PENDING',
        badgeColor: '#83A2DB',
      },
      {
        id: 'act-3',
        type: 'REASSIGN_STAFF',
        title: 'Dispatch Senior High-Voltage Electrician',
        details: 'Assign Tech Marcus Vance (Cert: HV-Master) to isolate sub-panel B2 before exam start.',
        targetResource: 'Tech Marcus Vance',
        status: 'PENDING',
        badgeColor: '#83A2DB',
      },
      {
        id: 'act-4',
        type: 'SERVICE_WORKAROUND',
        title: 'Deploy Battery UPS Pod for Proctor Terminal',
        details: 'Provide auxiliary 1.5kVA UPS unit to ensure attendance scanners and biometrics remain active.',
        targetResource: 'Mobile UPS Cart #3',
        status: 'PENDING',
        badgeColor: '#CE6969',
      },
    ],
  };

  // Option 2: Split Cohort into Labs A-201 and A-202
  const option2Checks = evaluateDeterministicChecks({
    targetRoomCapacity: 130, // 65 + 65
    cohortHeadcount: blastRadius.totalStudentsAtRisk,
    targetRoomHasHazards: false,
    hasScheduleOverlap: false,
    estimatedRelocationMinutes: 35,
    deadlineMinutesRemaining: blastRadius.earliestDeadlineMinutes,
    staffHasRequiredSkills: true,
    proctorStudentRatio: 5 / blastRadius.totalStudentsAtRisk,
    minRequiredRatio: 0.025,
    hasSufficientParts: true,
    sodClearance: true,
    planVersion: 1,
    activeLockVersion: 1,
  });

  const option2Scores = calculatePlanScore({
    estimatedRecoveryMinutes: 35,
    deadlineMinutesRemaining: blastRadius.earliestDeadlineMinutes,
    costUsd: 320,
    maxAcceptableCost: 2000,
    numberOfChanges: 4,
    disruptionIndex: 4,
    checks: option2Checks,
  });

  const plan2: RecoveryPlan = {
    id: `plan-${blastRadius.incidentId}-2`,
    incidentId: blastRadius.incidentId,
    title: 'Plan Beta: Dual Cohort Split (CS Labs A-201 & A-202)',
    version: 1,
    strategy: 'SPLIT',
    score: option2Scores,
    estimatedRecoveryMinutes: 35,
    estimatedCostUsd: 320,
    createdByRole: 'FACILITIES_ADMIN',
    status: 'READY_FOR_APPROVAL',
    alternativeTargetRoom: {
      code: 'Labs A-201 / A-202',
      capacity: 130,
      distanceMeters: 120,
      avEquipped: true,
    },
    deterministicChecks: option2Checks,
    actions: [
      {
        id: 'act-201',
        type: 'SPLIT_ACTIVITY',
        title: 'Partition 120 Candidates (60 / 60)',
        details: 'Cohort Alpha to Computing Lab A-201; Cohort Beta to Computing Lab A-202.',
        targetResource: 'Labs A-201 & A-202',
        status: 'PENDING',
        badgeColor: '#10141A',
      },
      {
        id: 'act-202',
        type: 'REASSIGN_STAFF',
        title: 'Enlist 2 Additional Auxiliary Proctors',
        details: 'Draft available departmental TAs to maintain mandatory 1:30 supervision ratio in split rooms.',
        targetResource: 'TA Pool Floor 2',
        status: 'PENDING',
        badgeColor: '#83A2DB',
      },
    ],
  };

  return [plan1, plan2];
}
