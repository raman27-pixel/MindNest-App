import { ActivitySession, PersonalBaseline, MeaningfulChangeAlert, AlertSeverity } from '../types';
import { BaselineService } from './baselineService';

export class ChangeDetectionService {
  /**
   * Evaluate a patient's recent sessions against their baseline to detect meaningful engagement deviations.
   * STRICT NON-CLINICAL RULE: Never diagnose or make medical claims.
   */
  public static evaluateChange(
    patientId: string,
    allSessions: ActivitySession[],
    recentWindowSize: number = 5
  ): MeaningfulChangeAlert | null {
    const patientSessions = allSessions
      .filter(s => s.patientId === patientId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Require at least 8 total sessions to establish baseline + recent window comparison
    if (patientSessions.length < recentWindowSize + 3) {
      return null;
    }

    const baselineSessions = patientSessions.slice(0, patientSessions.length - recentWindowSize);
    const recentSessions = patientSessions.slice(patientSessions.length - recentWindowSize);

    const baseline = BaselineService.calculateBaseline(patientId, baselineSessions);
    const recentBaseline = BaselineService.calculateBaseline(patientId, recentSessions);

    const completionDrop = baseline.completionRate - recentBaseline.completionRate;
    const durationIncrease = recentBaseline.averageSessionDurationSeconds - baseline.averageSessionDurationSeconds;
    const skipSpike = recentBaseline.skipRate - baseline.skipRate;
    const assistanceIncrease = recentBaseline.assistanceRate - baseline.assistanceRate;

    // Check thresholds
    let severity: AlertSeverity | null = null;
    let signal = '';
    let explanation = '';
    let alertType: MeaningfulChangeAlert['type'] = 'COMPLETION_DROP';

    if (completionDrop >= 0.25) {
      severity = completionDrop >= 0.40 ? 'ATTENTION' : 'NOTICE';
      alertType = 'COMPLETION_DROP';
      signal = `Activity completion rate dropped by ${Math.round(completionDrop * 100)}% over recent sessions.`;
      explanation = `Recent completion rate is ${Math.round(recentBaseline.completionRate * 100)}% compared to historical baseline of ${Math.round(baseline.completionRate * 100)}%. Patient skipped ${recentSessions.filter(s => s.skipped).length} out of ${recentWindowSize} recent activities.`;
    } else if (durationIncrease >= 120) {
      severity = durationIncrease >= 240 ? 'ATTENTION' : 'NOTICE';
      alertType = 'DURATION_INCREASE';
      signal = `Average session duration increased by ${Math.round(durationIncrease / 60)} minutes.`;
      explanation = `Recent session duration averaged ${Math.round(recentBaseline.averageSessionDurationSeconds / 60)} mins compared to historical average of ${Math.round(baseline.averageSessionDurationSeconds / 60)} mins.`;
    } else if (skipSpike >= 0.30) {
      severity = 'NOTICE';
      alertType = 'SKIP_SPIKE';
      signal = `Higher than usual skip rate detected in recent activities.`;
      explanation = `Patient skipped ${Math.round(recentBaseline.skipRate * 100)}% of recent activities compared to baseline skip rate of ${Math.round(baseline.skipRate * 100)}%.`;
    } else if (assistanceIncrease >= 0.30) {
      severity = 'INFO';
      alertType = 'ASSISTANCE_INCREASE';
      signal = `Increased request for activity guidance observed.`;
      explanation = `Guidance requested in ${Math.round(recentBaseline.assistanceRate * 100)}% of recent sessions compared to baseline ${Math.round(baseline.assistanceRate * 100)}%.`;
    }

    if (!severity) {
      return null;
    }

    return {
      id: `alert-gen-${Date.now()}`,
      patientId,
      type: alertType,
      severity,
      signal,
      baselineValue: `${Math.round(baseline.completionRate * 100)}% completion, ${baseline.averageSessionDurationSeconds}s avg duration`,
      currentValue: `${Math.round(recentBaseline.completionRate * 100)}% completion, ${recentBaseline.averageSessionDurationSeconds}s avg duration`,
      confidence: 85,
      timeWindow: `Past ${recentWindowSize} sessions`,
      explanation,
      suggestedAction: 'Consider checking in with the patient, offering a familiar family photo or music activity, or simplifying task choices.',
      disclaimer: 'MindNest provides supportive engagement tracking for caregivers. This alert is not a medical assessment or diagnosis.',
      status: 'UNREVIEWED',
      createdAt: new Date().toISOString()
    };
  }
}
