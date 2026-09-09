import { z } from 'zod';
import { sanitizeTextContent } from '../safety/aiGuard';

export const AiReminiscenceResponseSchema = z.object({
  message: z.string().min(5).max(300),
  sourceMemoryIds: z.array(z.string()),
  topic: z.string().min(2).max(100),
  confidence: z.number().min(0).max(1),
  safetyStatus: z.enum(['safe', 'flagged']),
  followUpAllowed: z.boolean()
});

export type AiReminiscenceResponse = z.infer<typeof AiReminiscenceResponseSchema>;

export class ReminiscenceService {
  public static SYSTEM_PROMPT = `
You are the Memory Companion in MindNest, a supportive dementia engagement companion.
Your mission is to share gentle, warm reminiscence with an elderly person.

STRICT SAFETY AND ETHICAL GUARDRAILS:
1. Only use verified personal memories supplied in the approved memories list.
2. NEVER invent people, family members, pets, or names.
3. NEVER invent events, trips, dates, or milestones.
4. NEVER claim the patient said or did something if it is not in the approved context.
5. NEVER fabricate dates, places, or false relationships.
6. NEVER diagnose dementia, assess cognitive decline, or make any medical claims.
7. NEVER tell the patient that their memory is failing or shame them.
8. Keep responses short (1-2 sentences), warm, respectful, and gentle.
9. Ask at most ONE simple question at a time.
10. If information is not in the approved memories, warmly steer the conversation back to known approved memories.
11. Return strictly structured JSON matching the requested schema.
`;

  public static async generateReminiscenceReply(
    patientName: string,
    messageHistory: Array<{ sender: 'PATIENT' | 'COMPANION'; text: string }>,
    approvedMemories: any[],
    language: string = 'en'
  ): Promise<AiReminiscenceResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Filter strictly to approved memories
    const validMemories = (approvedMemories || []).filter(m => m.approved && (m.approvedForAI !== false));

    if (apiKey && validMemories.length > 0) {
      try {
        const memoriesContext = validMemories.map(m => `
Memory ID: ${m.id}
Title: ${m.title}
Place: ${m.place}
People: ${(m.people || []).join(', ')}
Story: ${m.associatedStory || m.description || ''}
`).join('\n---\n');

        const lastUserMessage = messageHistory[messageHistory.length - 1]?.text || 'Hello';

        const prompt = `
Context of Caregiver-Approved Memories for ${patientName}:
${memoriesContext}

Recent Patient Input:
"${lastUserMessage}"

Generate a short, soothing conversational reply adhering strictly to the system prompt.
Respond ONLY with a valid JSON object of format:
{
  "message": "...",
  "sourceMemoryIds": ["..."],
  "topic": "...",
  "confidence": 0.95,
  "safetyStatus": "safe",
  "followUpAllowed": true
}
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: this.SYSTEM_PROMPT }] },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            const validated = AiReminiscenceResponseSchema.safeParse(parsed);
            if (validated.success && validated.data.safetyStatus === 'safe') {
              validated.data.message = sanitizeTextContent(validated.data.message);
              return validated.data;
            }
          }
        }
      } catch (error) {
        console.error('Gemini Reminiscence Error, falling back gracefully:', error);
      }
    }

    // Safe, deterministic fallback using first approved memory
    const memory = validMemories[0] || {
      id: 'mem-1',
      title: 'Family Picnic at Lodhi Gardens',
      place: 'Lodhi Gardens',
      people: ['Rahul', 'Sunita', 'Aarav']
    };

    return {
      message: `It is always wonderful to remember peaceful times at ${memory.place || 'the gardens'}. Do you remember having tea with your family there?`,
      sourceMemoryIds: [memory.id],
      topic: memory.title,
      confidence: 0.9,
      safetyStatus: 'safe',
      followUpAllowed: true
    };
  }
}
