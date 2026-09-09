import { SupportedLanguage } from '../types';

export type TranslationKey = 
  | 'common.home'
  | 'common.back'
  | 'common.next'
  | 'common.cancel'
  | 'common.save'
  | 'common.close'
  | 'common.loading'
  | 'common.readAloud'
  | 'common.stop'
  | 'common.menu'
  | 'patient.goodMorning'
  | 'patient.todayActivity'
  | 'patient.startActivity'
  | 'patient.exploreMemories'
  | 'patient.talkCompanion'
  | 'patient.routine'
  | 'patient.sos'
  | 'patient.emergencyHelp'
  | 'patient.gentleSuggestion'
  | 'patient.playGames'
  | 'patient.memories'
  | 'patient.talk'
  | 'patient.myRoutine'
  | 'patient.questionOf'
  | 'patient.needHelp'
  | 'patient.greatJob'
  | 'patient.gentleFeedback'
  | 'patient.sosConfirmTitle'
  | 'patient.sosCallHelp'
  | 'caregiver.dashboard'
  | 'caregiver.patientProfile'
  | 'caregiver.memoryLibrary'
  | 'caregiver.activityAnalysis'
  | 'caregiver.meaningfulChanges'
  | 'caregiver.reminders'
  | 'caregiver.aiRecommendations'
  | 'caregiver.familyMembers'
  | 'caregiver.connectedAccounts'
  | 'caregiver.reports'
  | 'caregiver.settings'
  | 'caregiver.consentPrivacy'
  | 'caregiver.voiceSettings';

export const TRANSLATIONS: Record<string, Partial<Record<TranslationKey, string>>> = {
  en: {
    'common.home': 'Home',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.readAloud': 'Read Aloud',
    'common.stop': 'Stop',
    'common.menu': 'Menu',
    'patient.goodMorning': 'Good morning. Have a peaceful day.',
    'patient.todayActivity': "Today's Gentle Activity",
    'patient.startActivity': 'START',
    'patient.exploreMemories': 'Explore Memories',
    'patient.talkCompanion': 'Talk to Memory Companion',
    'patient.routine': 'My Routine',
    'patient.sos': 'SOS',
    'patient.emergencyHelp': 'Emergency Help',
    'patient.gentleSuggestion': "Today's Gentle Suggestion",
    'patient.playGames': 'Play Games',
    'patient.memories': 'Memories',
    'patient.talk': 'Talk',
    'patient.myRoutine': 'My Routine',
    'patient.questionOf': 'Question {current} of {total}',
    'patient.needHelp': 'Need a Hint?',
    'patient.greatJob': 'Wonderful! You remembered so well.',
    'patient.gentleFeedback': "That's okay. Thank you for trying.",
    'patient.sosConfirmTitle': 'Do you need emergency help?',
    'patient.sosCallHelp': 'CALL FOR HELP',
    'caregiver.dashboard': 'Dashboard',
    'caregiver.patientProfile': 'Patient Profile',
    'caregiver.memoryLibrary': 'Memory Library',
    'caregiver.activityAnalysis': 'Activity Analysis',
    'caregiver.meaningfulChanges': 'Meaningful Changes',
    'caregiver.reminders': 'Reminders',
    'caregiver.aiRecommendations': 'AI Recommendations',
    'caregiver.familyMembers': 'Family & Care Team',
    'caregiver.connectedAccounts': 'Connected Accounts',
    'caregiver.reports': 'Activity Reports',
    'caregiver.settings': 'Settings',
    'caregiver.consentPrivacy': 'Consent & Privacy',
    'caregiver.voiceSettings': 'Voice & Language'
  },
  hi: {
    'common.home': 'होम',
    'common.back': 'पीछे',
    'common.next': 'आगे',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    'common.readAloud': 'बोलकर सुनाएं',
    'common.stop': 'रोकें',
    'common.menu': 'मेनू',
    'patient.goodMorning': 'शुभ प्रभात। आपका दिन मंगलमय हो।',
    'patient.todayActivity': 'आज की गतिविधि',
    'patient.startActivity': 'शुरू करें',
    'patient.exploreMemories': 'यादें देखें',
    'patient.talkCompanion': 'यादों पर बातचीत करें',
    'patient.routine': 'मेरी दिनचर्या',
    'patient.sos': 'आपातकालीन सहायता (SOS)',
    'patient.emergencyHelp': 'मदद के लिए बुलाएं',
    'patient.gentleSuggestion': 'आज का शांत सुझाव',
    'patient.playGames': 'खेल खेलें',
    'patient.memories': 'यादें',
    'patient.talk': 'बातचीत',
    'patient.myRoutine': 'दिनचर्या',
    'patient.questionOf': 'प्रश्न {current} / {total}',
    'patient.needHelp': 'संकेत चाहिए?',
    'patient.greatJob': 'बहुत सुंदर! आपने बहुत अच्छा किया।',
    'patient.gentleFeedback': 'कोई बात नहीं, प्रयास के लिए धन्यवाद।',
    'patient.sosConfirmTitle': 'क्या आपको तुरंत सहायता चाहिए?',
    'patient.sosCallHelp': 'मदद के लिए कॉल करें',
    'caregiver.dashboard': 'डैशबोर्ड',
    'caregiver.patientProfile': 'मरीज़ प्रोफ़ाइल',
    'caregiver.memoryLibrary': 'स्मृति पुस्तकालय',
    'caregiver.activityAnalysis': 'गतिविधि विश्लेषण',
    'caregiver.meaningfulChanges': 'पैटर्न में बदलाव',
    'caregiver.reminders': 'याद दिलाने वाले संदेश',
    'caregiver.aiRecommendations': 'एआई सुझाव',
    'caregiver.familyMembers': 'परिवार और देखभाल दल',
    'caregiver.connectedAccounts': 'जुड़े हुए खाते',
    'caregiver.reports': 'गतिविधि रिपोर्ट',
    'caregiver.settings': 'सेटिंग्स',
    'caregiver.consentPrivacy': 'सहमति और गोपनीयता',
    'caregiver.voiceSettings': 'आवाज़ और भाषा'
  },
  as: {
    'common.home': 'ঘৰ',
    'common.back': 'পিছলৈ',
    'common.next': 'পৰৱৰ্তী',
    'common.cancel': 'বাতিল কৰক',
    'common.save': 'সংৰক্ষণ',
    'patient.goodMorning': 'শুভ প্ৰভাত। আপোনাৰ দিনটো শান্তিময় আৰু আনন্দদায়ক হওক।',
    'patient.startActivity': 'আৰম্ভ কৰক',
    'patient.memories': 'সোণালী স্মৃতি',
    'patient.talk': 'কথা পাতক',
    'patient.myRoutine': 'দৈনন্দিন ৰুটিন',
    'patient.sos': 'জৰুৰী সহায় (SOS)',
    'patient.sosCallHelp': 'সহায়ৰ বাবে কল কৰক',
    'caregiver.dashboard': 'ডেশ্ববৰ্ড',
    'caregiver.familyMembers': 'পৰিয়াল আৰু যত্ন দল'
  },
  bn: {
    'common.home': 'হোম',
    'common.back': 'পেছনে',
    'common.next': 'পরবর্তী',
    'common.cancel': 'বাতিল',
    'common.save': 'সংরক্ষণ',
    'patient.goodMorning': 'সুপ্রভাত। দিনটি শান্তিময় হোক।',
    'patient.startActivity': 'শুরু করুন',
    'patient.memories': 'স্মৃতিমালা',
    'patient.talk': 'কথা বলুন',
    'patient.myRoutine': 'রুটিন',
    'patient.sos': 'জরুরি সাহায্য (SOS)',
    'patient.sosCallHelp': 'সাহায্যের জন্য কল করুন',
    'caregiver.dashboard': 'ড্যাশবোর্ড',
    'caregiver.familyMembers': 'পরিবার এবং যত্ন দল'
  },
  ta: {
    'common.home': 'முகப்பு',
    'common.back': 'பின்செல்',
    'common.next': 'அடுத்து',
    'common.cancel': 'ரத்து செய்',
    'patient.goodMorning': 'காலை வணக்கம். இனிய நாளாக அமையட்டும்.',
    'patient.startActivity': 'தொடங்கு',
    'patient.memories': 'நினைவுகள்',
    'patient.talk': 'பேசுங்கள்',
    'patient.myRoutine': 'அன்றாட வழக்கம்',
    'patient.sos': 'அவசர உதவி (SOS)',
    'patient.sosCallHelp': 'உதவிக்கு அழைக்கவும்',
    'caregiver.dashboard': 'டாஷ்போர்டு',
    'caregiver.familyMembers': 'குடும்பம் & பராமரிப்பாளர்'
  },
  te: {
    'common.home': 'హోమ్',
    'common.back': 'వెనుకకు',
    'common.next': 'తరువాత',
    'common.cancel': 'రద్దు చేయి',
    'patient.goodMorning': 'శుభోదయం. ఈ రోజు ప్రశాంతంగా గడవాలి.',
    'patient.startActivity': 'ప్రారంభించు',
    'patient.memories': 'జ్ఞాపకాలు',
    'patient.talk': 'మాట్లాడండి',
    'patient.myRoutine': 'దినచర్య',
    'patient.sos': 'అత్యవసర సహాయం (SOS)',
    'patient.sosCallHelp': 'సహాయం కోసం కాల్ చేయండి',
    'caregiver.dashboard': 'డాష్‌బోర్డ్',
    'caregiver.familyMembers': 'కుటుంబ సభ్యులు & సంరక్షకులు'
  },
  mr: {
    'common.home': 'मुख्यपृष्ठ',
    'common.back': 'मागे',
    'common.next': 'पुढे',
    'common.cancel': 'रद्द करा',
    'patient.goodMorning': 'शुभ सकाळ. आजचा दिवस शांततेचा जावो.',
    'patient.startActivity': 'सुरू करा',
    'patient.memories': 'आठवणी',
    'patient.talk': 'गप्पा मारा',
    'patient.myRoutine': 'दिनक्रम',
    'patient.sos': 'तातडीची मदत (SOS)',
    'patient.sosCallHelp': 'मदतीसाठी कॉल करा',
    'caregiver.dashboard': 'डॅशबोर्ड',
    'caregiver.familyMembers': 'कुटुंब आणि काळजीवाहक'
  },
  gu: {
    'common.home': 'હોમ',
    'common.back': 'પાછળ',
    'common.next': 'આગળ',
    'common.cancel': 'રદ કરો',
    'patient.goodMorning': 'સુપ્રભાત. આજનો દિવસ શાંતિપૂર્ણ રહે.',
    'patient.startActivity': 'શરૂ કરો',
    'patient.memories': 'યાદો',
    'patient.talk': 'વાત કરો',
    'patient.myRoutine': 'દિનચર્યા',
    'patient.sos': 'કટોકટી સહાય (SOS)',
    'patient.sosCallHelp': 'મદદ માટે કૉલ કરો'
  },
  kn: {
    'common.home': 'ಮುಖಪುಟ',
    'common.back': 'ಹಿಂದೆ',
    'common.next': 'ಮುಂದೆ',
    'common.cancel': 'ರದ್ದುಮಾಡು',
    'patient.goodMorning': 'ಶುಭೋದಯ. ದಿನವು ಶಾಂತಿಯುತವಾಗಿರಲಿ.',
    'patient.startActivity': 'ಪ್ರಾರಂಭಿಸಿ',
    'patient.memories': 'ನೆನಪುಗಳು',
    'patient.talk': 'ಮಾತನಾಡಿ',
    'patient.myRoutine': 'ದಿನಚರಿ',
    'patient.sos': 'ತುರ್ತು ಸಹಾಯ (SOS)',
    'patient.sosCallHelp': 'ಸಹಾಯಕ್ಕಾಗಿ ಕರೆ ಮಾಡಿ'
  },
  ml: {
    'common.home': 'ഹോം',
    'common.back': 'തിരികെ',
    'common.next': 'അടുത്തത്',
    'common.cancel': 'റദ്ദാക്കുക',
    'patient.goodMorning': 'സുപ്രഭാതം. സന്തോഷകരമായ ഒരു ദിവസം ആശംസിക്കുന്നു.',
    'patient.startActivity': 'തുടങ്ങുക',
    'patient.memories': 'ഓർമ്മകൾ',
    'patient.talk': 'സംസാരിക്കുക',
    'patient.myRoutine': 'ദിനചര്യ',
    'patient.sos': 'അടിയന്തര സഹായം (SOS)',
    'patient.sosCallHelp': 'സഹായത്തിനായി വിളിക്കുക'
  },
  pa: {
    'common.home': 'ਮੁੱਖ ਪੰਨਾ',
    'common.back': 'ਪਿੱਛੇ',
    'common.next': 'ਅੱਗੇ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'patient.goodMorning': 'ਸ਼ੁਭ ਸਵੇਰ। ਤੁਹਾਡਾ ਦਿਨ ਸ਼ਾਂਤੀਪੂਰਨ ਰਹੇ।',
    'patient.startActivity': 'ਸ਼ੁਰੂ ਕਰੋ',
    'patient.memories': 'ਯਾਦਾਂ',
    'patient.talk': 'ਗੱਲਬਾਤ ਕਰੋ',
    'patient.myRoutine': 'ਰੋਜ਼ਾਨਾ ਰੁਟੀਨ',
    'patient.sos': 'ਐਮਰਜੈਂਸੀ ਮਦਦ (SOS)',
    'patient.sosCallHelp': 'ਮਦਦ ਲਈ ਕਾਲ ਕਰੋ'
  },
  ur: {
    'common.home': 'ہوم',
    'common.back': 'پیچھے',
    'common.next': 'آگے',
    'common.cancel': 'منسوخ',
    'patient.goodMorning': 'صبح بخیر۔ آپ کا دن پرسکون گزرے۔',
    'patient.startActivity': 'شروع کریں',
    'patient.memories': 'یادیں',
    'patient.talk': 'بات چیت',
    'patient.myRoutine': 'روزمرہ معمولات',
    'patient.sos': 'ہنگامی مدد (SOS)',
    'patient.sosCallHelp': 'مدد کے لیے کال کریں'
  }
};

/**
 * Translate a key into the target language with variable replacement and English fallback.
 */
export function t(key: TranslationKey, lang: SupportedLanguage = 'en', params?: Record<string, string | number>): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dict[key] || TRANSLATIONS.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }

  return text;
}
