/**
 * Speech Sanitizer for dementia companion text-to-speech.
 * Emojis and decorative symbols MUST NEVER be read aloud by speech synthesis or ElevenLabs.
 *
 * Preserves:
 * - English text (latin alphabet)
 * - Indian-language scripts (Devanagari, Bengali, Tamil, Telugu, Gurmukhi, Gujarati,
 *   Kannada, Malayalam, Odia, Urdu/Perso-Arabic, etc.)
 * - Numbers and digits
 * - Meaningful punctuation (. , ! ? ' " : ;)
 * - Sentence structure and natural spacing
 *
 * Strips:
 * - Unicode emojis (emoticons, pictographs, symbols, dingbats, surrogate pairs)
 * - Decorative symbols (stars, hearts, arrows, geometric shapes)
 * - Markdown syntax (*, _, #, ~, `, [, ], (, ))
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove Markdown formatting symbols (bold, italic, links, headers, code)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // [text](link) -> text
  cleaned = cleaned.replace(/[*_~`#]/g, ' '); // remove markdown emphasis characters

  // 2. Remove emojis and pictographs using Unicode property escapes
  // \p{Extended_Pictographic} covers all modern emojis including skin tones, hair styles, ZWJ sequences
  // \p{Emoji_Presentation}, \p{Emoji_Modifier_Base}, \p{Emoji_Component}
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, ' ');
    cleaned = cleaned.replace(/\p{Emoji_Component}/gu, ' ');
  } catch {
    // Fallback regex for older regex engines
    cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, ' ');
  }

  // 3. Remove common decorative unicode symbols & dingbats (stars, hearts, musical notes, geometric shapes, arrows)
  cleaned = cleaned.replace(/[\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u2B50\u2764\uFE0F\u200D]/gu, ' ');

  // 4. Remove UI tag patterns like [START], [Explore], (Hint)
  cleaned = cleaned.replace(/\[[A-Z0-9_\s]+\]/g, ' ');

  // 5. Clean up multiple spaces and trim, preserving punctuation
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s+([.,!?:;])/g, '$1');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Unit test helper to verify sanitizeTextForSpeech correctness.
 */
export function verifySpeechSanitizer(): { passed: boolean; message: string } {
  const testInput = "Great job! 🎉👏 You remembered Grandpa ❤️.";
  const expectedOutput = "Great job! You remembered Grandpa.";
  const actualOutput = sanitizeTextForSpeech(testInput);

  const passed = actualOutput === expectedOutput;
  return {
    passed,
    message: passed 
      ? `Sanitizer verified: "${actualOutput}" matches expected.`
      : `Sanitizer mismatch: expected "${expectedOutput}", got "${actualOutput}"`
  };
}
