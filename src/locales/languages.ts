import { LanguageInfo, SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali' },
  { code: 'ma', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari' } as any,
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari' },
  { code: 'mni', name: 'Manipuri / Meitei', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meetei Mayek' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كٲشُر', script: 'Perso-Arabic / Devanagari' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिंधी', script: 'Perso-Arabic / Devanagari' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर’', script: 'Devanagari' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari' }
].filter((item, index, self) => index === self.findIndex(t => t.code === item.code));

export function getLanguageInfo(code: SupportedLanguage): LanguageInfo {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}
