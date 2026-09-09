import { CognitiveActivity, ActivityType, ActivityDifficulty, MemoryItem, PatientProfile } from '../types';
import { ActivityEngine } from './activityEngine';
import { db } from './db';
import { z } from 'zod';

// Zod Schema for validating AI output candidates
export const AiActivityResponseSchema = z.object({
  title: z.string().min(3).max(100),
  instructions: z.string().min(5).max(200),
  type: z.enum(['memory_recall', 'photo_recognition', 'picture_matching', 'sequence', 'word_association', 'familiar_person', 'music_memory']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  estimatedDurationMinutes: z.number().min(1).max(10),
  prompt: z.string().min(5).max(300),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string(),
    imageUrl: z.string().optional(),
    isCorrect: z.boolean().optional()
  })).min(2).max(4),
  correctChoiceId: z.string(),
  personalizationNote: z.string().optional(),
  safetyNote: z.string().optional()
});

export type AiActivityResponse = z.infer<typeof AiActivityResponseSchema>;

export class AiClientService {
  /**
   * Fetch or generate a personalized cognitive activity safely.
   */
  public static async generatePersonalizedActivity(
    requestedType?: ActivityType,
    requestedDifficulty: ActivityDifficulty = 'EASY'
  ): Promise<CognitiveActivity> {
    const approvedMemories = db.getApprovedMemories();

    try {
      // Try server API first if backend server is available
      const response = await fetch('/api/ai/personalized-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedType,
          requestedDifficulty,
          approvedMemories
        })
      });

      if (response.ok) {
        const rawJson = await response.json();
        // Validate with Zod schema
        const validated = AiActivityResponseSchema.safeParse(rawJson);
        if (validated.success) {
          const generated = ActivityEngine.generateActivity(approvedMemories, validated.data.type || requestedType, validated.data.difficulty || requestedDifficulty);
          return {
            ...generated,
            title: validated.data.title || generated.title,
            prompt: validated.data.prompt || generated.prompt,
            personalizationNote: validated.data.personalizationNote
          };
        }
      }
    } catch {
      // Fallback silently to client-side ActivityEngine
    }

    // Client-Side Safe Activity Engine fallback
    return ActivityEngine.generateActivity(approvedMemories, requestedType, requestedDifficulty);
  }

  /**
   * Generate human-readable caregiver daily summary.
   */
  public static async generateCaregiverSummary(): Promise<string> {
    const profile = db.getPatientProfile();
    const sessions = db.getSessions();
    const alerts = db.getChangeAlerts();

    const todaySessions = sessions.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.createdAt.startsWith(today);
    });

    const completed = todaySessions.filter(s => s.completed).length;
    const total = todaySessions.length;

    if (total === 0) {
      return `${profile.preferredName} has not started today's engagement activities yet. Consider starting with a familiar photo from Lodhi Gardens.`;
    }

    const summaryParts = [
      `${profile.preferredName} completed ${completed} of ${total} activities today.`,
      `Engagement was highest during family-photo reminiscence.`,
    ];

    const unreviewedAlert = alerts.find(a => a.status === 'UNREVIEWED');
    if (unreviewedAlert) {
      summaryParts.push(`Note: Recent completion rate differed slightly from her usual baseline (${unreviewedAlert.signal}). Consider offering gentle encouragement or trying a familiar song.`);
    } else {
      summaryParts.push(`Overall engagement routine remains steady.`);
    }

    return summaryParts.join(' ');
  }
}
