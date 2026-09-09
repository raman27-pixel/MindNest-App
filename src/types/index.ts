export type UserRole = 
  | 'PATIENT' 
  | 'CAREGIVER' 
  | 'FAMILY_MEMBER' 
  | 'PROFESSIONAL_CAREGIVER' 
  | 'ADMIN';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  patientId?: string; // Assigned patient for patient role or linked caregiver patient
  photoURL?: string;
  googleUserId?: string;
  authProvider?: 'google' | 'demo' | 'email';
  createdAt: string;
  lastLoginAt?: string;
}

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ks' // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml' // Malayalam
  | 'mni' // Manipuri / Meitei
  | 'mr' // Marathi
  | 'ne' // Nepali
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'sa' // Sanskrit
  | 'sat' // Santali
  | 'sd' // Sindhi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur'; // Urdu

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
}

export type MemoryCategory = 
  | 'Family Photo'
  | 'Family Video'
  | 'Music'
  | 'Voice Recording'
  | 'Story'
  | 'Person'
  | 'Place'
  | 'Event'
  | 'Favorite Object'
  | 'Favorite Song'
  | 'Routine Information'
  | 'Life Event'
  | 'Other';

export type ApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface MemoryItem {
  id: string;
  patientId: string;
  title: string;
  description: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  people: string[];
  relationship?: string;
  place: string;
  dateApproximation: string;
  category: MemoryCategory;
  tags: string[];
  associatedStory?: string;
  associatedMusic?: string;
  language?: SupportedLanguage;
  
  // Guardrails & Approval
  approved: boolean; // Must be true for patient visibility
  approvedForAI: boolean; // MANDATORY: AI only uses approvedForAI === true memories
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  consentStatus: 'GRANTED' | 'PENDING' | 'WITHDRAWN';
  
  // Source metadata
  source?: 'manual' | 'google_photos' | 'google_drive' | 'device_upload';
  sourceId?: string;
  filename?: string;
  mimeType?: string;
  duration?: number;
  
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRoutineItem {
  id: string;
  time: string; // e.g. "08:30 AM"
  title: string;
  category: 'WAKEUP' | 'MEAL' | 'MEDICATION' | 'ACTIVITY' | 'SLEEP' | 'FAMILY_CALL';
  notes?: string;
  completedToday?: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  language: SupportedLanguage | 'all';
  accent: string;
  elevenLabsVoiceId?: string;
  description: string;
  enabled: boolean;
}

export interface VoiceSettings {
  patientLanguage: SupportedLanguage;
  caregiverLanguage: SupportedLanguage;
  voiceProfileId: string;
  voiceGender: 'MALE' | 'FEMALE';
  voiceStyle: 'warm' | 'calm' | 'gentle' | 'clear';
  voiceAccent: 'Indian English' | 'Hindi' | 'Regional Indian';
  speechSpeed: number; // 0.7 to 1.3 (default 0.9 for elderly)
  speechVolume: number; // 0.1 to 1.0 (default 1.0)
  autoReadEnabled: boolean;
  useElevenLabs: boolean;
}

export interface PatientAccessibilitySettings {
  textSize: 'NORMAL' | 'LARGE' | 'XLARGE';
  contrast: 'NORMAL' | 'HIGH';
  voiceEnabled: boolean;
  speechSpeed: number; // 0.75 to 1.25
  language: SupportedLanguage;
  caregiverLanguage: SupportedLanguage;
  simplifiedMode: boolean;
  reducedMotion: boolean;
  voiceSettings: VoiceSettings;
}

export interface FamilyMember {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  photoUrl?: string;
  priority: number; // 1 = highest
  isPrimaryCaregiver: boolean;
  isEmergencyContact: boolean;
  canReceiveAlerts: boolean;
  canReceiveReports: boolean;
  canContactPatient: boolean;
  notes?: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface SOSEvent {
  id: string;
  patientId: string;
  triggeredAt: string;
  triggeredBy: 'PATIENT' | 'CAREGIVER' | 'SYSTEM';
  location?: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    timestamp: string;
  };
  contactsNotified: string[];
  callAttempted: boolean;
  smsAttempted: boolean;
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CANCELLED';
  notes?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  profilePhotoUrl: string;
  context: string;
  abilities: string[];
  limitations: string[];
  communicationPreferences: string;
  interests: string[];
  favoriteMusic: string[];
  importantPeople: Array<{ name: string; relation: string; photoUrl?: string }>;
  importantPlaces: string[];
  routines: PatientRoutineItem[];
  accessibility: PatientAccessibilitySettings;
  preferredLanguage: SupportedLanguage;
  emergencyNumber?: string; // Configurable emergency number (e.g. 112)
  emergencyCustomMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 
  | 'memory_recall' 
  | 'photo_recognition' 
  | 'picture_matching' 
  | 'sequence' 
  | 'word_association' 
  | 'familiar_person' 
  | 'music_memory'
  | 'story_recall'
  | 'daily_routine_recall'
  | 'object_recognition'
  | 'memory_lane'
  | 'conversational_reminiscence';

export type ActivityDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ActivityChoice {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

export interface ActivityQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  instructions?: string;
  choices: ActivityChoice[]; // Minimum 4 options required
  correctChoiceId: string;
  memoryImageUrl?: string;
  memoryTitle?: string;
  explanation?: string;
}

export interface CognitiveActivity {
  id: string;
  title: string;
  instructions: string;
  type: ActivityType;
  difficulty: ActivityDifficulty;
  estimatedDurationMinutes: number;
  prompt: string;
  questionCount: number; // Default 7 (configurable 5, 6, 7, 8, 10)
  questions: ActivityQuestion[];
  choices: ActivityChoice[]; // For legacy compatibility with single-step views
  correctChoiceId: string;
  memoryId?: string; // Reference to source approved memory
  memoryTitle?: string;
  memoryImageUrl?: string;
  personalizationNote?: string;
  safetyNote?: string;
}

export interface ActivitySession {
  id: string;
  patientId: string;
  activityId: string;
  activityType: ActivityType;
  difficulty: ActivityDifficulty;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  completed: boolean;
  skipped: boolean;
  assistanceRequested: boolean;
  hesitationCount: number;
  selectedChoiceId?: string;
  
  // Detailed tracking
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  hintCount: number;
  voiceInteractionUsed: boolean;
  conversationDurationSeconds?: number;
  createdAt: string;
}

export interface PersonalBaseline {
  patientId: string;
  sampleCount: number;
  averageSessionDurationSeconds: number;
  completionRate: number; // 0 to 1
  skipRate: number; // 0 to 1
  averageResponseTimeSeconds: number;
  assistanceRate: number; // 0 to 1
  preferredActivityTypes: ActivityType[];
  preferredTimesOfDay: string[];
  lastUpdated: string;
}

export type AlertSeverity = 'INFO' | 'NOTICE' | 'ATTENTION';

export interface MeaningfulChangeAlert {
  id: string;
  patientId: string;
  type: 'COMPLETION_DROP' | 'DURATION_INCREASE' | 'SKIP_SPIKE' | 'ASSISTANCE_INCREASE' | 'ROUTINE_DEVIATION';
  severity: AlertSeverity;
  signal: string;
  baselineValue: string;
  currentValue: string;
  confidence: number; // 0 to 100%
  timeWindow: string;
  explanation: string;
  suggestedAction: string;
  disclaimer: string;
  status: 'UNREVIEWED' | 'REVIEWED' | 'DISMISSED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AIActivityRecommendation {
  id: string;
  patientId: string;
  activityType: ActivityType;
  proposedTitle: string;
  proposedDifficulty: ActivityDifficulty;
  rationale: string;
  sourceMemoryId?: string;
  sourceMemoryTitle?: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'OVERRIDDEN';
  overrideDetails?: {
    chosenDifficulty: ActivityDifficulty;
    chosenActivityType: ActivityType;
    reason?: string;
    overriddenBy: string;
    overriddenAt: string;
  };
}

export interface CaregiverReminder {
  id: string;
  patientId: string;
  title: string;
  category: 'HYDRATION' | 'ROUTINE' | 'APPOINTMENT' | 'FAMILY_CALL' | 'ACTIVITY' | 'MEDICATION';
  scheduledTime: string;
  active: boolean;
  repeatDaily: boolean;
  iconName: string;
  gentleMessage: string;
  createdAt: string;
}

export interface ConsentSettings {
  patientId: string;
  personalProfile: boolean;
  photos: boolean;
  videos: boolean;
  audioVoice: boolean;
  voiceProcessing: boolean;
  aiPersonalization: boolean;
  memoryCompanion: boolean;
  activityAnalysis: boolean;
  reportSharing: boolean;
  familyNotifications: boolean;
  emergencyNotifications: boolean;
  googlePhotosImport: boolean;
  googleDriveImport: boolean;
  caregiverSharing: boolean;
  professionalAccess: boolean;
  approvedBy: string;
  updatedAt: string;
}

export interface GoogleConnectionStatus {
  accountConnected: boolean;
  googleEmail?: string;
  googleDisplayName?: string;
  photosConnected: boolean;
  driveConnected: boolean;
  tokenExpiresAt?: string;
  lastSyncAt?: string;
}

export interface GooglePhotosPickerSession {
  sessionId: string;
  pickerUri: string;
  mediaItemsSet: boolean;
  createdAt: string;
  expiresAt: string;
  status: 'CREATED' | 'WAITING_FOR_SELECTION' | 'ITEMS_READY' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
}

export interface ImportedMediaCandidate {
  id: string;
  source: 'google_photos' | 'google_drive';
  filename: string;
  title: string;
  mediaUrl: string;
  mimeType: string;
  description?: string;
  category: MemoryCategory;
  people?: string[];
  place?: string;
  dateApproximation?: string;
  approvalStatus: ApprovalStatus;
}

export interface ReminiscenceMessage {
  id: string;
  sender: 'PATIENT' | 'COMPANION';
  text: string;
  timestamp: string;
  sourceMemoryIds?: string[];
  topic?: string;
}

export interface ActivityReport {
  id: string;
  patientId: string;
  patientName: string;
  reportDateRange: string;
  generatedAt: string;
  totalActivitiesCompleted: number;
  completionRate: number;
  averageDurationMinutes: number;
  assistanceLevel: 'Low' | 'Moderate' | 'High';
  activityBreakdown: Record<string, number>;
  baselineComparison: {
    durationDelta: string;
    completionDelta: string;
    commentary: string;
  };
  caregiverNotes?: string;
  aiSummary: string;
  disclaimer: string;
}

export interface SharedReportLink {
  id: string;
  reportId: string;
  shareToken: string;
  recipientType: 'DOCTOR' | 'PRIMARY_CAREGIVER' | 'FAMILY_MEMBER' | 'OTHER';
  recipientName: string;
  recipientEmail?: string;
  sharedBy: string;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  lastAccessedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole | 'SYSTEM';
  action: string;
  details: string;
  timestamp: string;
}

// NER Regional & Cultural Context Model
export interface RegionalCulturalContext {
  state: string; // e.g. "Assam"
  region: string; // e.g. "Upper Assam / Brahmaputra Valley"
  preferredLanguage: string; // e.g. "Assamese"
  otherLanguages: string[]; // e.g. ["Hindi", "English"]
  homeTown: string; // e.g. "Nagaon"
  familiarPlaces: string[]; // e.g. ["Guwahati", "Village Home", "Tezpur"]
  familiarMusic: string[]; // e.g. ["Assamese folk music", "Bihu songs", "Borgeet"]
  importantCelebrations: string[]; // e.g. ["Rongali Bihu", "Bhogali Bihu", "Durga Puja"]
  familiarPeople: string[]; // e.g. ["Son (Rahul)", "Daughter (Sunita)", "Grandfather (Tea planter)"]
  childhoodMemories: string[]; // e.g. ["Grandmother making pitha", "Playing near village paddy fields"]
}

export interface CulturalSuggestion {
  id: string;
  category: 'Festival' | 'Food' | 'Music' | 'Place' | 'Tradition' | 'Clothing';
  title: string;
  description: string;
  approved: boolean; // Caregiver approval toggle
}

export interface RegionalMusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  region: string;
  language: string;
  duration: string;
  albumArt: string;
  memoryAssociation?: string;
  audioToneFrequency?: number;
  approved: boolean;
}

export interface PlaceMemory {
  id: string;
  title: string;
  period: string; // e.g. "Childhood • 1950s"
  category: 'Childhood' | 'Education' | 'Work' | 'Present' | 'Family';
  location: string;
  imageUrl: string;
  description: string;
  relatedPeople: string[];
}

export interface LifeJourneyStep {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  correctOrder: number;
}

export interface DailyTaskStep {
  stepNumber: number;
  totalSteps: number;
  instruction: string;
  illustrationUrl?: string;
  voicePrompt: string;
}

export interface DailyTaskItem {
  id: string;
  title: string;
  category: 'Morning Routine' | 'Getting Ready' | 'Brushing Teeth' | 'Taking a Bath' | 'Getting Dressed' | 'Making Tea' | 'Simple Cooking' | 'Medication Reminder' | 'Bedtime Routine';
  icon: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: DailyTaskStep[];
  completed: boolean;
  adaptedMode?: boolean;
}

export interface OfflineSyncStatus {
  isOffline: boolean;
  lastSyncedAt: string;
  pendingItemsCount: number;
  cachedPhotosCount: number;
  cachedActivitiesCount: number;
}
