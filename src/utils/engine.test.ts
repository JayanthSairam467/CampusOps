import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractIncidentFromText,
  validateSeparationOfDuties,
  evaluateDeterministicChecks,
  calculatePlanScore,
} from './engine';

test('NLP extractor accurately categorizes electrical incident and detects room and severity', () => {
  const text = 'Main breaker tripped in Hall B-204, 120 students have CS301 final exam in 45 mins';
  const result = extractIncidentFromText(text);

  assert.equal(result.category, 'ELECTRICAL');
  assert.equal(result.severity, 'P1');
  assert.equal(result.room, 'Hall B-204');
  assert.equal(result.safetyRisk, false);
  assert.ok(result.affectedActivity?.includes('CS301') || result.affectedActivity?.includes('final exam'));
  assert.ok(result.confidenceScore >= 90);
});

test('NLP extractor identifies safety hazard and sets safetyRisk flag', () => {
  const text = 'Heavy smoke and sparking power lines in Science C-102';
  const result = extractIncidentFromText(text);

  assert.equal(result.safetyRisk, true);
  assert.equal(result.severity, 'P1');
});

test('Separation of Duties prevents incident reporter from approving recovery plan', () => {
  const reporterEmail = 'sarah.connor@campus.edu';
  const approverEmail = 'sarah.connor@campus.edu'; // Same person
  const check = validateSeparationOfDuties('DEPARTMENT_MANAGER', approverEmail, reporterEmail, 'FACILITIES_ADMIN');

  assert.equal(check.valid, false);
  assert.match(check.reason, /Separation of Duties violation/);
});

test('Separation of Duties approves when independent manager acts', () => {
  const reporterEmail = 'proctor.dave@campus.edu';
  const approverEmail = 'dean.marcus@campus.edu';
  const check = validateSeparationOfDuties('DEPARTMENT_MANAGER', approverEmail, reporterEmail, 'FACILITIES_ADMIN');

  assert.equal(check.valid, true);
});

test('Separation of Duties blocks unauthorized roles like TECHNICIAN from approving', () => {
  const check = validateSeparationOfDuties('TECHNICIAN', 'tech.bob@campus.edu', 'prof@campus.edu', 'FACILITIES_ADMIN');
  assert.equal(check.valid, false);
});

test('Deterministic checks evaluate all 9 constraints and catch capacity deficit', () => {
  const checks = evaluateDeterministicChecks({
    targetRoomCapacity: 80, // deficit!
    cohortHeadcount: 120,
    targetRoomHasHazards: false,
    hasScheduleOverlap: false,
    estimatedRelocationMinutes: 20,
    deadlineMinutesRemaining: 45,
    staffHasRequiredSkills: true,
    proctorStudentRatio: 0.033,
    minRequiredRatio: 0.025,
    hasSufficientParts: true,
    sodClearance: true,
    planVersion: 1,
    activeLockVersion: 1,
  });

  assert.equal(checks.length, 9);
  const capacityCheck = checks.find((c) => c.id === 'check-capacity-match');
  assert.ok(capacityCheck);
  assert.equal(capacityCheck.passed, false);
});

test('Plan feasibility scoring penalizes constraint check failures', () => {
  const passedChecks = evaluateDeterministicChecks({
    targetRoomCapacity: 150,
    cohortHeadcount: 120,
    targetRoomHasHazards: false,
    hasScheduleOverlap: false,
    estimatedRelocationMinutes: 20,
    deadlineMinutesRemaining: 45,
    staffHasRequiredSkills: true,
    proctorStudentRatio: 0.033,
    minRequiredRatio: 0.025,
    hasSufficientParts: true,
    sodClearance: true,
    planVersion: 1,
    activeLockVersion: 1,
  });

  const scores = calculatePlanScore({
    estimatedRecoveryMinutes: 20,
    deadlineMinutesRemaining: 45,
    costUsd: 150,
    maxAcceptableCost: 2000,
    numberOfChanges: 2,
    disruptionIndex: 2,
    checks: passedChecks,
  });

  assert.ok(scores.overall >= 80);
  assert.ok(scores.timeScore > 70);
});
