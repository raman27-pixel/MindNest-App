import { z } from 'zod';

export const AiActivityGuardSchema = z.object({
  title: z.string().min(3).max(100),
  instructions: z.string().min(5).max(200),
  type: z.enum([
    'memory_recall', 
    'photo_recognition', 
    'picture_matching', 
    'sequence', 
    'word_association', 
    'familiar_person', 
    'music_memory',
    'story_recall',
    'daily_routine_recall',
    'object_recognition',
    'memory_lane',
    'conversational_reminiscence'
  ]),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  estimatedDurationMinutes: z.number().min(1).max(10),
  prompt: z.string().min(5).max(300),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string(),
    imageUrl: z.string().optional(),
    isCorrect: z.boolean().optional()
  })).min(4).max(6), // MANDATORY: Minimum 4 options, up to 6
  correctChoiceId: z.string(),
  personalizationNote: z.string().optional(),
  safetyNote: z.string().optional()
});

/**
 * Filter text for unsafe medical or diagnostic claims.
 * Preserves safe, supportive, non-clinical explanations.
 */
export function sanitizeTextContent(text: string): string {
  if (!text) return '';

  const forbiddenPhrases: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /dementia is worsening/gi, replacement: 'activity pattern shows natural variation' },
    { pattern: /your dementia is getting worse/gi, replacement: 'your recent activity pattern is different from your usual pattern' },
    { pattern: /cognitive decline detected/gi, replacement: 'engagement variation observed' },
    { pattern: /Alzheimer's stage/gi, replacement: 'supportive baseline' },
    { pattern: /medical diagnosis/gi, replacement: 'supportive observation' },
    { pattern: /disease progression/gi, replacement: 'pacing difference' },
    { pattern: /brain degeneration/gi, replacement: 'daily change' }
  ];

  let cleaned = text;
  forbiddenPhrases.forEach(({ pattern, replacement }) => {
    cleaned = cleaned.replace(pattern, replacement);
  });

  return cleaned;
}
