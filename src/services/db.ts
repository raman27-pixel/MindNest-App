import { 
  PatientProfile, 
  MemoryItem, 
  ActivitySession, 
  PersonalBaseline, 
  MeaningfulChangeAlert, 
  CaregiverReminder, 
  ConsentSettings, 
  AIActivityRecommendation, 
  AuditLog, 
  ActivityType, 
  ActivityDifficulty,
  FamilyMember,
  GoogleConnectionStatus,
  ImportedMediaCandidate,
  ActivityReport,
  SharedReportLink,
  SOSEvent,
  RegionalCulturalContext,
  CulturalSuggestion,
  RegionalMusicTrack,
  PlaceMemory,
  LifeJourneyStep,
  DailyTaskItem,
  OfflineSyncStatus
} from '../types';

import { 
  DEMO_PATIENT, 
  DEMO_MEMORIES, 
  DEMO_SESSIONS, 
  DEMO_BASELINE, 
  DEMO_CHANGE_ALERTS, 
  DEMO_RECOMMENDATIONS, 
  DEMO_REMINDERS, 
  DEMO_CONSENT, 
  DEMO_AUDIT_LOGS,
  DEMO_FAMILY_MEMBERS,
  DEMO_GOOGLE_CONNECTIONS,
  DEMO_IMPORTED_MEDIA,
  DEMO_REPORTS,
  DEMO_SOS_EVENTS,
  DEMO_REGIONAL_CONTEXT,
  DEMO_CULTURAL_SUGGESTIONS,
  DEMO_REGIONAL_MUSIC,
  STATE_CULTURAL_PRESETS,
  DEMO_PLACES,
  DEMO_JOURNEY_STEPS,
  DEMO_DAILY_TASKS
} from './demoData';

import { BaselineService } from './baselineService';
import { ChangeDetectionService } from './changeDetectionService';

type ChangeListener = () => void;

class DatabaseService {
  private patient: PatientProfile = { ...DEMO_PATIENT };
  private memories: MemoryItem[] = [...DEMO_MEMORIES];
  private sessions: ActivitySession[] = [...DEMO_SESSIONS];
  private baseline: PersonalBaseline = { ...DEMO_BASELINE };
  private alerts: MeaningfulChangeAlert[] = [...DEMO_CHANGE_ALERTS];
  private recommendations: AIActivityRecommendation[] = [...DEMO_RECOMMENDATIONS];
  private reminders: CaregiverReminder[] = [...DEMO_REMINDERS];
  private consent: ConsentSettings = { ...DEMO_CONSENT };
  private auditLogs: AuditLog[] = [...DEMO_AUDIT_LOGS];
  private familyMembers: FamilyMember[] = [...DEMO_FAMILY_MEMBERS];
  private googleConnections: GoogleConnectionStatus = { ...DEMO_GOOGLE_CONNECTIONS };
  private importedMedia: ImportedMediaCandidate[] = [...DEMO_IMPORTED_MEDIA];
  private reports: ActivityReport[] = [...DEMO_REPORTS];
  private sharedReports: SharedReportLink[] = [];
  private sosEvents: SOSEvent[] = [...DEMO_SOS_EVENTS];
  
  // NER & Cultural Personalization State
  private regionalContext: RegionalCulturalContext = { ...DEMO_REGIONAL_CONTEXT };
  private culturalSuggestions: CulturalSuggestion[] = [...DEMO_CULTURAL_SUGGESTIONS];
  private regionalMusic: RegionalMusicTrack[] = [...DEMO_REGIONAL_MUSIC];
  private places: PlaceMemory[] = [...DEMO_PLACES];
  private journeySteps: LifeJourneyStep[] = [...DEMO_JOURNEY_STEPS];
  private dailyTasks: DailyTaskItem[] = [...DEMO_DAILY_TASKS];
  private offlineStatus: OfflineSyncStatus = {
    isOffline: false,
    lastSyncedAt: 'Today, 10:42 AM',
    pendingItemsCount: 0,
    cachedPhotosCount: 18,
    cachedActivitiesCount: 12
  };

  private listeners: Set<ChangeListener> = new Set();

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Patient Profile
  public getPatientProfile(): PatientProfile {
    return { ...this.patient };
  }

  public updatePatientProfile(updated: Partial<PatientProfile>): PatientProfile {
    this.patient = { ...this.patient, ...updated, updatedAt: new Date().toISOString() };
    this.addAuditLog('CAREGIVER', 'PATIENT_PROFILE_UPDATED', 'Updated patient profile details');
    this.notify();
    return this.patient;
  }

  // Memories
  public getMemories(): MemoryItem[] {
    return [...this.memories];
  }

  /**
   * Only memories that are approved === true and consentStatus === 'GRANTED'
   */
  public getApprovedMemories(): MemoryItem[] {
    return this.memories.filter(m => m.approved && m.consentStatus === 'GRANTED');
  }

  /**
   * AI can ONLY use memories that have approvedForAI === true AND approved === true
   */
  public getAiApprovedMemories(): MemoryItem[] {
    return this.memories.filter(m => m.approved && m.approvedForAI && m.consentStatus === 'GRANTED');
  }

  public addMemory(memory: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): MemoryItem {
    const newMemory: MemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memories = [newMemory, ...this.memories];
    this.addAuditLog('CAREGIVER', 'MEMORY_ADDED', `Added memory: "${newMemory.title}"`);
    this.notify();
    return newMemory;
  }

  public toggleMemoryApproval(memoryId: string): MemoryItem | null {
    const mem = this.memories.find(m => m.id === memoryId);
    if (mem) {
      mem.approved = !mem.approved;
      mem.approvalStatus = mem.approved ? 'APPROVED' : 'REJECTED';
      mem.updatedAt = new Date().toISOString();
      this.addAuditLog('CAREGIVER', 'MEMORY_APPROVAL_TOGGLED', `Memory "${mem.title}" patient visibility set to ${mem.approved}`);
      this.notify();
      return mem;
    }
    return null;
  }

  public toggleMemoryAIApproval(memoryId: string): MemoryItem | null {
    const mem = this.memories.find(m => m.id === memoryId);
    if (mem) {
      mem.approvedForAI = !mem.approvedForAI;
      mem.updatedAt = new Date().toISOString();
      this.addAuditLog('CAREGIVER', 'MEMORY_AI_APPROVAL_TOGGLED', `Memory "${mem.title}" AI permission set to ${mem.approvedForAI}`);
      this.notify();
      return mem;
    }
    return null;
  }

  public deleteMemory(memoryId: string): boolean {
    const mem = this.memories.find(m => m.id === memoryId);
    if (mem) {
      this.memories = this.memories.filter(m => m.id !== memoryId);
      this.addAuditLog('CAREGIVER', 'MEMORY_DELETED', `Deleted memory: "${mem.title}"`);
      this.notify();
      return true;
    }
    return false;
  }

  // Family Members & Care Team
  public getFamilyMembers(): FamilyMember[] {
    return [...this.familyMembers];
  }

  public addFamilyMember(member: Omit<FamilyMember, 'id' | 'createdAt'>): FamilyMember {
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.familyMembers = [...this.familyMembers, newMember];
    this.addAuditLog('CAREGIVER', 'FAMILY_MEMBER_ADDED', `Added family member: ${newMember.name} (${newMember.relationship})`);
    this.notify();
    return newMember;
  }

  public updateFamilyMember(id: string, updates: Partial<FamilyMember>): FamilyMember | null {
    const idx = this.familyMembers.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.familyMembers[idx] = { ...this.familyMembers[idx], ...updates };
      this.addAuditLog('CAREGIVER', 'FAMILY_MEMBER_UPDATED', `Updated family member: ${this.familyMembers[idx].name}`);
      this.notify();
      return this.familyMembers[idx];
    }
    return null;
  }

  public deleteFamilyMember(id: string): boolean {
    const member = this.familyMembers.find(f => f.id === id);
    if (member) {
      this.familyMembers = this.familyMembers.filter(f => f.id !== id);
      this.addAuditLog('CAREGIVER', 'FAMILY_MEMBER_DELETED', `Removed member: ${member.name}`);
      this.notify();
      return true;
    }
    return false;
  }

  // Activity Sessions & Tracking
  public getSessions(): ActivitySession[] {
    return [...this.sessions];
  }

  public recordSession(sessionData: Omit<ActivitySession, 'id' | 'createdAt'>): ActivitySession {
    const newSession: ActivitySession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.sessions = [...this.sessions, newSession];
    
    // Recalculate baseline
    this.baseline = BaselineService.calculateBaseline(this.patient.id, this.sessions);
    
    // Run change detection
    const newAlert = ChangeDetectionService.evaluateChange(this.patient.id, this.sessions);
    if (newAlert) {
      const exists = this.alerts.some(a => a.type === newAlert.type && a.status === 'UNREVIEWED');
      if (!exists) {
        this.alerts = [newAlert, ...this.alerts];
        this.addAuditLog('SYSTEM', 'CHANGE_ALERT_CREATED', `Generated change alert: ${newAlert.signal}`);
      }
    }

    this.addAuditLog('PATIENT', 'ACTIVITY_COMPLETED', `Completed activity ${sessionData.activityType} (${sessionData.durationSeconds}s, ${sessionData.correctCount}/${sessionData.totalQuestions || 7} correct)`);
    this.notify();
    return newSession;
  }

  // Baseline & Alerts
  public getBaseline(): PersonalBaseline {
    return { ...this.baseline };
  }

  public getChangeAlerts(): MeaningfulChangeAlert[] {
    return [...this.alerts];
  }

  public updateAlertStatus(alertId: string, status: 'REVIEWED' | 'DISMISSED'): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      alert.reviewedAt = new Date().toISOString();
      alert.reviewedBy = 'Rahul Sharma';
      this.addAuditLog('CAREGIVER', 'ALERT_REVIEWED', `Alert ${alert.id} marked as ${status}`);
      this.notify();
    }
  }

  // Recommendations & Override
  public getRecommendations(): AIActivityRecommendation[] {
    return [...this.recommendations];
  }

  public overrideRecommendation(
    recommendationId: string, 
    chosenDifficulty: ActivityDifficulty, 
    chosenActivityType: ActivityType,
    reason?: string
  ): void {
    const rec = this.recommendations.find(r => r.id === recommendationId);
    if (rec) {
      rec.status = 'OVERRIDDEN';
      rec.overrideDetails = {
        chosenDifficulty,
        chosenActivityType,
        reason: reason || 'Caregiver manual preference override',
        overriddenBy: 'Rahul Sharma',
        overriddenAt: new Date().toISOString()
      };
      this.addAuditLog('CAREGIVER', 'AI_RECOMMENDATION_OVERRIDDEN', `Caregiver overridden AI recommendation #${rec.id}`);
      this.notify();
    }
  }

  // Reminders
  public getReminders(): CaregiverReminder[] {
    return [...this.reminders];
  }

  public toggleReminder(reminderId: string): void {
    const rem = this.reminders.find(r => r.id === reminderId);
    if (rem) {
      rem.active = !rem.active;
      this.notify();
    }
  }

  public addReminder(reminder: Omit<CaregiverReminder, 'id' | 'createdAt'>): CaregiverReminder {
    const newRem: CaregiverReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.reminders = [...this.reminders, newRem];
    this.notify();
    return newRem;
  }

  // Google Connections
  public getGoogleConnectionStatus(): GoogleConnectionStatus {
    return { ...this.googleConnections };
  }

  public updateGoogleConnection(status: Partial<GoogleConnectionStatus>): GoogleConnectionStatus {
    this.googleConnections = { ...this.googleConnections, ...status, lastSyncAt: new Date().toISOString() };
    this.addAuditLog('CAREGIVER', 'GOOGLE_CONNECTION_UPDATED', `Updated Google connection status`);
    this.notify();
    return this.googleConnections;
  }

  public disconnectGoogle(): void {
    this.googleConnections = {
      accountConnected: false,
      photosConnected: false,
      driveConnected: false
    };
    this.addAuditLog('CAREGIVER', 'GOOGLE_DISCONNECTED', 'Disconnected Google services');
    this.notify();
  }

  // Imported Media Pipeline
  public getImportedMedia(): ImportedMediaCandidate[] {
    return [...this.importedMedia];
  }

  public addImportedMedia(media: ImportedMediaCandidate): void {
    this.importedMedia = [media, ...this.importedMedia];
    this.notify();
  }

  public approveImportedMedia(id: string, category: any, title: string, people: string[], place: string): MemoryItem | null {
    const candidate = this.importedMedia.find(m => m.id === id);
    if (candidate) {
      candidate.approvalStatus = 'APPROVED';
      const newMemory = this.addMemory({
        patientId: this.patient.id,
        title: title || candidate.title,
        description: candidate.description || 'Imported memory verified by caregiver',
        imageUrl: candidate.mediaUrl,
        mediaUrl: candidate.mediaUrl,
        mediaType: candidate.mimeType?.startsWith('video') ? 'video' : 'image',
        people: people || candidate.people || [],
        place: place || candidate.place || 'Family Collection',
        dateApproximation: candidate.dateApproximation || 'Recent',
        category: category || candidate.category || 'Family Photo',
        tags: ['imported', candidate.source],
        approved: true,
        approvedForAI: true,
        approvalStatus: 'APPROVED',
        approvedBy: 'Rahul Sharma',
        approvedAt: new Date().toISOString(),
        consentStatus: 'GRANTED',
        source: candidate.source,
        createdBy: 'Rahul Sharma'
      });
      this.importedMedia = this.importedMedia.filter(m => m.id !== id);
      this.notify();
      return newMemory;
    }
    return null;
  }

  public rejectImportedMedia(id: string): void {
    this.importedMedia = this.importedMedia.filter(m => m.id !== id);
    this.notify();
  }

  // Activity Reports
  public getReports(): ActivityReport[] {
    return [...this.reports];
  }

  public saveReport(report: ActivityReport): void {
    this.reports = [report, ...this.reports];
    this.addAuditLog('CAREGIVER', 'REPORT_GENERATED', `Generated report for date range: ${report.reportDateRange}`);
    this.notify();
  }

  public getSharedReportLinks(): SharedReportLink[] {
    return [...this.sharedReports];
  }

  public createSharedReportLink(
    reportId: string, 
    recipientType: SharedReportLink['recipientType'], 
    recipientName: string, 
    recipientEmail?: string
  ): SharedReportLink {
    const token = `share-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days expiring URL
    const newLink: SharedReportLink = {
      id: `link-${Date.now()}`,
      reportId,
      shareToken: token,
      recipientType,
      recipientName,
      recipientEmail,
      sharedBy: 'Rahul Sharma',
      createdAt: new Date().toISOString(),
      expiresAt,
      accessCount: 0
    };
    this.sharedReports = [newLink, ...this.sharedReports];
    this.addAuditLog('CAREGIVER', 'REPORT_SHARED', `Created secure expiring share link for ${recipientName} (${recipientType})`);
    this.notify();
    return newLink;
  }

  // SOS Emergency Events
  public getSOSEvents(): SOSEvent[] {
    return [...this.sosEvents];
  }

  public recordSOSEvent(event: SOSEvent): void {
    this.sosEvents = [event, ...this.sosEvents];
    this.addAuditLog('PATIENT', 'SOS_TRIGGERED', `Emergency alert triggered. Contacts notified: ${event.contactsNotified.join(', ')}`);
    this.notify();
  }

  // Consent & Privacy
  public getConsent(): ConsentSettings {
    return { ...this.consent };
  }

  public updateConsent(updated: Partial<ConsentSettings>): ConsentSettings {
    this.consent = { ...this.consent, ...updated, updatedAt: new Date().toISOString() };
    this.addAuditLog('CAREGIVER', 'CONSENT_UPDATED', 'Updated privacy and consent preferences');
    this.notify();
    return this.consent;
  }

  public exportPatientData(): string {
    const exportObj = {
      exportTimestamp: new Date().toISOString(),
      patient: this.patient,
      memories: this.memories,
      sessions: this.sessions,
      baseline: this.baseline,
      alerts: this.alerts,
      familyMembers: this.familyMembers,
      reports: this.reports,
      consent: this.consent
    };
    this.addAuditLog('CAREGIVER', 'DATA_EXPORTED', 'Exported complete patient profile and memory record');
    return JSON.stringify(exportObj, null, 2);
  }

  public deletePatientData(): void {
    this.memories = [];
    this.sessions = [];
    this.alerts = [];
    this.recommendations = [];
    this.reports = [];
    this.importedMedia = [];
    this.addAuditLog('CAREGIVER', 'DATA_DELETED', 'Cleared memory and session history per consent request');
    this.notify();
  }

  public addImportedMediaCandidate(candidate: ImportedMediaCandidate): void {
    this.addImportedMedia(candidate);
  }

  public approveMediaAsMemory(id: string): void {
    const candidate = this.importedMedia.find(m => m.id === id);
    if (!candidate) return;
    this.approveImportedMedia(
      id,
      candidate.category || 'Family Photo',
      candidate.title,
      candidate.people || [],
      candidate.place || 'Home'
    );
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public addAuditLog(role: AuditLog['userRole'], action: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId: role === 'PATIENT' ? 'patient-anita' : 'caregiver-rahul',
      userRole: role,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [log, ...this.auditLogs];
  }

  // Regional Cultural Context Methods
  public getRegionalContext(): RegionalCulturalContext {
    return { ...this.regionalContext };
  }

  public switchStatePreset(stateName: string): RegionalCulturalContext {
    const preset = STATE_CULTURAL_PRESETS[stateName];
    if (preset) {
      this.regionalContext = { ...preset.regionalContext };
      this.culturalSuggestions = [...preset.culturalSuggestions];
      this.addAuditLog('CAREGIVER', 'STATE_PRESET_SWITCHED', `Switched regional cultural context to ${stateName}`);
      this.notify();
    }
    return this.regionalContext;
  }

  public updateRegionalContext(updated: Partial<RegionalCulturalContext>): RegionalCulturalContext {
    this.regionalContext = { ...this.regionalContext, ...updated };
    this.addAuditLog('CAREGIVER', 'REGIONAL_CONTEXT_UPDATED', `Updated regional context: ${this.regionalContext.state}`);
    this.notify();
    return this.regionalContext;
  }

  // Cultural Suggestions & Approval Loop
  public getCulturalSuggestions(): CulturalSuggestion[] {
    return [...this.culturalSuggestions];
  }

  public toggleCulturalSuggestion(id: string, approved: boolean): void {
    this.culturalSuggestions = this.culturalSuggestions.map(cs => 
      cs.id === id ? { ...cs, approved } : cs
    );
    this.addAuditLog('CAREGIVER', 'CULTURE_SUGGESTION_TOGGLED', `Suggestion ${id} approval set to ${approved}`);
    this.notify();
  }

  public approveAllCulturalSuggestions(): void {
    this.culturalSuggestions = this.culturalSuggestions.map(cs => ({ ...cs, approved: true }));
    this.addAuditLog('CAREGIVER', 'ALL_CULTURE_SUGGESTIONS_APPROVED', 'Approved all cultural suggestions');
    this.notify();
  }

  // Regional Music Methods
  public getRegionalMusic(): RegionalMusicTrack[] {
    return [...this.regionalMusic];
  }

  public addRegionalMusicTrack(track: Omit<RegionalMusicTrack, 'id'>): RegionalMusicTrack {
    const newTrack: RegionalMusicTrack = {
      ...track,
      id: `track-${Date.now()}`
    };
    this.regionalMusic = [newTrack, ...this.regionalMusic];
    this.addAuditLog('CAREGIVER', 'MUSIC_ADDED', `Added music: ${newTrack.title}`);
    this.notify();
    return newTrack;
  }

  // Places I Remember Methods
  public getPlaces(): PlaceMemory[] {
    return [...this.places];
  }

  public addPlace(place: Omit<PlaceMemory, 'id'>): PlaceMemory {
    const newPlace: PlaceMemory = {
      ...place,
      id: `pl-${Date.now()}`
    };
    this.places = [...this.places, newPlace];
    this.addAuditLog('CAREGIVER', 'PLACE_ADDED', `Added place: ${newPlace.title}`);
    this.notify();
    return newPlace;
  }

  // Cultural Life Journey Methods
  public getJourneySteps(): LifeJourneyStep[] {
    return [...this.journeySteps];
  }

  public setJourneySteps(steps: LifeJourneyStep[]): void {
    this.journeySteps = steps;
    this.notify();
  }

  // Step-by-Step Daily Tasks
  public getDailyTasks(): DailyTaskItem[] {
    return [...this.dailyTasks];
  }

  public advanceDailyTaskStep(taskId: string): void {
    this.dailyTasks = this.dailyTasks.map(task => {
      if (task.id === taskId) {
        const nextIndex = task.currentStepIndex + 1;
        const isFinished = nextIndex >= task.totalSteps;
        return {
          ...task,
          currentStepIndex: isFinished ? task.currentStepIndex : nextIndex,
          completed: isFinished
        };
      }
      return task;
    });
    this.notify();
  }

  public resetDailyTask(taskId: string): void {
    this.dailyTasks = this.dailyTasks.map(task => 
      task.id === taskId ? { ...task, currentStepIndex: 0, completed: false } : task
    );
    this.notify();
  }

  // Offline Sync Management
  public getOfflineStatus(): OfflineSyncStatus {
    return { ...this.offlineStatus };
  }

  public toggleOfflineMode(): void {
    this.offlineStatus = {
      ...this.offlineStatus,
      isOffline: !this.offlineStatus.isOffline,
      lastSyncedAt: !this.offlineStatus.isOffline ? 'Today, 10:42 AM' : this.offlineStatus.lastSyncedAt
    };
    this.notify();
  }

  public syncOfflineData(): void {
    this.offlineStatus = {
      ...this.offlineStatus,
      isOffline: false,
      pendingItemsCount: 0,
      lastSyncedAt: 'Just now'
    };
    this.notify();
  }
}

export const db = new DatabaseService();
