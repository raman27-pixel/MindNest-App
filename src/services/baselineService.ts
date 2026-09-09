import { ActivitySession, PersonalBaseline, ActivityType } from '../types';

export class BaselineService {
  /**
   * Compute a patient's personal baseline from activity sessions.
   * Compares the patient ONLY against their own history.
   */
  public static calculateBaseline(patientId: string, sessions: ActivitySession[]): PersonalBaseline {
    const patientSessions = sessions.filter(s => s.patientId === patientId);
    
    if (patientSessions.length === 0) {
      return {
        patientId,
        sampleCount: 0,
        averageSessionDurationSeconds: 200,
        completionRate: 1.0,
        skipRate: 0.0,
        averageResponseTimeSeconds: 10,
        assistanceRate: 0.0,
        preferredActivityTypes: ['photo_recognition', 'picture_matching'],
        preferredTimesOfDay: ['10:00 AM'],
        lastUpdated: new Date().toISOString()
      };
    }

    const totalSessions = patientSessions.length;
    const completedCount = patientSessions.filter(s => s.completed).length;
    const skippedCount = patientSessions.filter(s => s.skipped).length;
    const assistanceCount = patientSessions.filter(s => s.assistanceRequested).length;

    const totalDuration = patientSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

    // Count preferred activity types
    const typeCounts: Record<string, number> = {};
    patientSessions.forEach(s => {
      typeCounts[s.activityType] = (typeCounts[s.activityType] || 0) + 1;
    });

    const sortedTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type as ActivityType);

    return {
      patientId,
      sampleCount: totalSessions,
      averageSessionDurationSeconds: Math.round(totalDuration / totalSessions),
      completionRate: Number((completedCount / totalSessions).toFixed(2)),
      skipRate: Number((skippedCount / totalSessions).toFixed(2)),
      averageResponseTimeSeconds: 12,
      assistanceRate: Number((assistanceCount / totalSessions).toFixed(2)),
      preferredActivityTypes: sortedTypes.slice(0, 3),
      preferredTimesOfDay: ['10:00 AM', '04:00 PM'],
      lastUpdated: new Date().toISOString()
    };
  }
}
