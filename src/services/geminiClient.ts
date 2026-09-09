import { MemoryItem } from '../types';
import { sanitizeTextForSpeech } from './speechSanitizer';

export class GeminiClient {
  private static STORAGE_KEY = 'mindnest_gemini_api_key';

  public static getApiKey(): string {
    const local = localStorage.getItem(this.STORAGE_KEY);
    if (local && local.trim().length > 0) return local.trim();
    return ((import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();
  }

  public static setApiKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEY, key.trim());
  }

  public static isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  /**
   * Dementia-specific therapeutic system instructions
   */
  private static SYSTEM_PROMPT = `
You are MindNest's compassionate AI Memory Companion for an elderly dementia patient.
Your role is to bring comfort, emotional reassurance, and warm reminiscing.

CRITICAL ETHICAL & CLINICAL GUIDELINES:
1. Speak with warmth, patience, and deep respect. Keep sentences simple, peaceful, and concise (1-3 sentences).
2. ONLY reference approved family memories provided in the prompt context.
3. NEVER invent deceased relatives, dates, or unfamiliar people.
4. NEVER diagnose, evaluate memory decline, test the user, or say "your memory is failing".
5. If the patient expresses confusion, anxiety, or asks repetitive questions, validate their feelings gently with reassurance (e.g., "You are completely safe here", "Take all the time you need").
6. LANGUAGE RULE (MOST IMPORTANT): Always detect the language of the user's message and reply in EXACTLY the same language.
   - If the user writes in Hindi (हिंदी), reply entirely in Hindi using warm, respectful words like 'जी', 'आप'.
   - If the user writes in English, reply in English.
   - If the user writes in Bengali (বাংলা), reply in Bengali.
   - If the user writes in Assamese (অসমীয়া), reply in Assamese.
   - If the user writes in Tamil (தமிழ்), reply in Tamil.
   - NEVER mix languages in a single reply unless the user mixed them first.
7. Conclude with a warm, open-ended question or soothing affirmation in the same language.
`;


  /**
   * Generates a conversational reminiscence response using Google Gemini 1.5 Flash
   */
  public static async generateCompanionReply(
    patientName: string,
    messageHistory: Array<{ sender: 'PATIENT' | 'COMPANION'; text: string }>,
    approvedMemories: MemoryItem[] = [],
    language: string = 'en'
  ): Promise<{ message: string; topic?: string; sourceMemoryTitle?: string }> {
    const apiKey = this.getApiKey();
    const lastUserMessage = messageHistory[messageHistory.length - 1]?.text || 'Hello';

    // Format approved memories context
    const memoriesContext = approvedMemories.length > 0
      ? approvedMemories.map(m => `- ${m.title} (${m.place || 'Home'}): ${m.associatedStory || m.description}`).join('\n')
      : '- Son Gaurav visits with warm tea.\n- Childhood stilt home in Tezpur.\n- Rongali Bihu celebration with muga silk.\n- Traditional Til Pitha.\n- Brahmaputra river sunset.';

    if (apiKey) {
      try {
        const prompt = `
Caregiver-Approved Memories Context for ${patientName}:
${memoriesContext}

Patient Question or Remark:
"${lastUserMessage}"

Please provide a soothing, supportive companion reply following your system instructions.
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ],
            systemInstruction: {
              parts: [{ text: this.SYSTEM_PROMPT }]
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 250
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 0) {
            return {
              message: sanitizeTextForSpeech(candidateText.trim()),
              topic: 'Gemini Memory Conversation'
            };
          }
        } else {
          console.warn('Gemini API response error, falling back to backend or local template', response.status);
        }
      } catch (err) {
        console.warn('Gemini direct call exception:', err);
      }
    }

    // Try backend server route if direct Gemini key failed or not set
    try {
      const serverRes = await fetch('/api/ai/reminiscence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          messageHistory,
          approvedMemories,
          language
        })
      });
      if (serverRes.ok) {
        const serverData = await serverRes.json();
        if (serverData.message) {
          return {
            message: sanitizeTextForSpeech(serverData.message),
            topic: serverData.topic,
            sourceMemoryTitle: serverData.sourceMemoryTitle
          };
        }
      }
    } catch {
      // Offline / Local safe fallback
    }

    // High quality empathetic dementia fallback
    const lower = lastUserMessage.toLowerCase();
    if (lower.includes('home') || lower.includes('ghar') || lower.includes('घर') || lower.includes('tezpur')) {
      return {
        message: 'Your childhood stilt home in Tezpur was so peaceful with the rain gently tapping on the banana leaves. It is always a warm place in your heart.',
        topic: 'Childhood Home'
      };
    } else if (lower.includes('son') || lower.includes('beta') || lower.includes('gaurav') || lower.includes('बेटा')) {
      return {
        message: 'Your son Gaurav loves you so dearly. He always makes sure your tea is warm and visits whenever he can.',
        topic: 'Son Gaurav'
      };
    } else if (lower.includes('song') || lower.includes('music') || lower.includes('गाना')) {
      return {
        message: 'Listening to "Mur Apunar Dex" and gentle flute melodies always brings so much calm. Music is a soothing friend.',
        topic: 'Music'
      };
    }

    return {
      message: `I hear you with all my heart, ${patientName}. You are safe and surrounded by love today. Would you like to remember the Tezpur porch, or look at family photos together?`,
      topic: 'Gentle Presence'
    };
  }
}
