import { VoiceProfile, SupportedLanguage } from '../types';

/**
 * Configurable voice registry for MindNest dementia companion.
 * Contains conceptual Indian-accented and regional voice profiles.
 * Actual ElevenLabs voice IDs are routed server-side.
 */
export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'male-in-warm-1',
    name: 'Aarav (Warm Indian Voice)',
    gender: 'MALE',
    language: 'all',
    accent: 'Indian English / Hindi',
    elevenLabsVoiceId: 'ELEVENLABS_MALE_INDIAN_VOICE_1',
    description: 'Warm, friendly, patient male voice with a gentle conversational Indian cadence.',
    enabled: true
  },
  {
    id: 'male-in-calm-2',
    name: 'Kabir (Calm Mature Voice)',
    gender: 'MALE',
    language: 'all',
    accent: 'Indian English / Hindi',
    elevenLabsVoiceId: 'ELEVENLABS_MALE_INDIAN_VOICE_2',
    description: 'Calm, steady, mature male voice designed to reduce anxiety and convey safety.',
    enabled: true
  },
  {
    id: 'female-in-warm-1',
    name: 'Ananya (Warm Indian Voice)',
    gender: 'FEMALE',
    language: 'all',
    accent: 'Indian English / Hindi',
    elevenLabsVoiceId: 'ELEVENLABS_FEMALE_INDIAN_VOICE_1',
    description: 'Warm, affectionate, clear female voice like a caring daughter or companion.',
    enabled: true
  },
  {
    id: 'female-in-calm-2',
    name: 'Meera (Calm Mature Voice)',
    gender: 'FEMALE',
    language: 'all',
    accent: 'Indian English / Hindi',
    elevenLabsVoiceId: 'ELEVENLABS_FEMALE_INDIAN_VOICE_2',
    description: 'Peaceful, gentle, mature female voice with reassuring cadence for reminiscing.',
    enabled: true
  }
];

export function getVoiceProfileById(id: string): VoiceProfile {
  const profile = VOICE_PROFILES.find(p => p.id === id);
  return profile || VOICE_PROFILES[2]; // Default to Ananya (Warm Female)
}

/**
 * Maps a supported language to the best browser speech synthesis BCP-47 language tag.
 */
export function getBrowserVoiceLangTag(lang: SupportedLanguage): string {
  const langTagMap: Record<SupportedLanguage, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    ur: 'ur-IN',
    or: 'or-IN',
    as: 'as-IN',
    sa: 'sa-IN',
    ne: 'ne-NP',
    ks: 'ks-IN',
    kok: 'kok-IN',
    mai: 'mai-IN',
    mni: 'mni-IN',
    brx: 'brx-IN',
    doi: 'doi-IN',
    sat: 'sat-IN',
    sd: 'sd-IN'
  };

  return langTagMap[lang] || 'en-IN';
}
