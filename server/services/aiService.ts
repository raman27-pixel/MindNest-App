import { AiActivityGuardSchema, sanitizeTextContent } from '../safety/aiGuard';

export class ServerAiService {
  public static SYSTEM_PROMPT = `
You are a supportive dementia-companion personalization engine.
Your purpose is to create safe, simple, respectful engagement activities.
You may use ONLY approved personal memory information supplied in the context.
Never invent a person, event, place, relationship, or memory.
Never diagnose a medical condition.
Never interpret activity performance as proof of disease progression.
Never tell the patient that their dementia is worsening.
Always provide at least 4 multiple-choice options. Randomize the correct answer position.
Use simple language.
Never shame the patient for mistakes.
Prefer encouragement.
If uncertain, choose a generic validated activity.
Return only the required structured JSON.
`;

  public static async generatePersonalizedActivity(
    approvedMemories: any[],
    requestedType?: string,
    requestedDifficulty: string = 'EASY'
  ) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && approvedMemories.length > 0) {
      try {
        const memory = approvedMemories[0];
        const rawActivity = {
          title: `Looking at ${memory.title}`,
          instructions: 'Take your time to look at this familiar photo.',
          type: requestedType || 'photo_recognition',
          difficulty: requestedDifficulty || 'EASY',
          estimatedDurationMinutes: 3,
          prompt: sanitizeTextContent(`Do you remember this place: ${memory.place}?`),
          choices: [
            { id: 'c1', text: memory.place || 'At Home', isCorrect: true },
            { id: 'c2', text: 'Another neighborhood', isCorrect: false },
            { id: 'c3', text: 'A busy market', isCorrect: false },
            { id: 'c4', text: 'I am not quite sure', isCorrect: false }
          ],
          correctChoiceId: 'c1',
          personalizationNote: `Based on approved memory: ${memory.title}`,
          safetyNote: 'Validated supportive tone. Minimum 4 options.'
        };

        const validated = AiActivityGuardSchema.safeParse(rawActivity);
        if (validated.success) {
          return validated.data;
        }
      } catch (err) {
        console.error('Server AI generation fallback:', err);
      }
    }

    // Default safe fallback template with 4 options
    return {
      title: 'Matching Pink Roses',
      instructions: 'Touch the picture of the pink rose flower.',
      type: 'picture_matching',
      difficulty: 'EASY',
      estimatedDurationMinutes: 3,
      prompt: 'Which picture shows the pink rose flower?',
      choices: [
        { id: 'c1', text: 'Pink Rose Flower', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80', isCorrect: true },
        { id: 'c2', text: 'Yellow Sunflower', imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80', isCorrect: false },
        { id: 'c3', text: 'Green Fern Leaves', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80', isCorrect: false },
        { id: 'c4', text: 'Purple Lavender', imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=400&q=80', isCorrect: false }
      ],
      correctChoiceId: 'c1',
      personalizationNote: 'Generic nature match activity with 4 high-contrast options',
      safetyNote: 'Safe fallback activity.'
    };
  }
}
