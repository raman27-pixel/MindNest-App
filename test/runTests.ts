import { sanitizeTextForSpeech, verifySpeechSanitizer } from '../src/services/speechSanitizer';
import { ActivityEngine } from '../src/services/activityEngine';
import { db } from '../src/services/db';
import { BaselineService } from '../src/services/baselineService';
import { ChangeDetectionService } from '../src/services/changeDetectionService';
import { EmergencyNotificationProvider } from '../src/services/emergencyProvider';
import { AiActivityGuardSchema, sanitizeTextContent } from '../server/safety/aiGuard';
import { AiReminiscenceResponseSchema } from '../server/services/reminiscenceService';

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  PASS: ${testName}`);
  } else {
    console.error(`  FAIL: ${testName}`);
    process.exit(1);
  }
}

console.log('=== RUNNING MINDNEST COMPREHENSIVE TEST SUITE ===\n');

// TEST 1: Mandatory Speech Sanitizer Unit Test
console.log('Test Suite 1: Speech Sanitizer & Emoji Removal');
const mandatoryInput = "Great job! 🎉👏 You remembered Grandpa ❤️.";
const expectedOutput = "Great job! You remembered Grandpa.";
const actualOutput = sanitizeTextForSpeech(mandatoryInput);

assert(actualOutput === expectedOutput, `Mandatory speech sanitizer check: "${actualOutput}" === "${expectedOutput}"`);

// TEST 2: Indian Language Script Preservation with Emojis
const hindiInput = "बहुत बढ़िया! 🌸 आपने अपने बगीचे के गुलाब याद रखे ❤️.";
const expectedHindi = "बहुत बढ़िया! आपने अपने बगीचे के गुलाब याद रखे.";
const actualHindi = sanitizeTextForSpeech(hindiInput);
assert(actualHindi === expectedHindi, `Hindi script preserved without emojis: "${actualHindi}"`);

// TEST 3: Quiz Engine Minimum 4 Choices & 7 Questions Session
console.log('\nTest Suite 2: Cognitive Quiz Engine (4+ Choices & 7 Questions)');
const approvedMemories = db.getAiApprovedMemories();
const activity = ActivityEngine.generateActivity(approvedMemories, 'photo_recognition', 'EASY', 7, 'en');

assert(activity.questions.length === 7, `Activity question count is exactly 7 (got ${activity.questions.length})`);

activity.questions.forEach((q, idx) => {
  assert(q.choices.length >= 4, `Question ${idx + 1} has at least 4 options (got ${q.choices.length})`);
  assert(q.choices.some(c => c.isCorrect), `Question ${idx + 1} contains a correct answer`);
});

// TEST 4: Randomized Option Order Verification
const optionAIsAlwaysCorrect = activity.questions.every(q => q.choices[0].isCorrect);
assert(!optionAIsAlwaysCorrect, 'Correct answer is randomized and not always Option A');

// TEST 5: AI Activity Guard Schema (Strict min 4 options, non-diagnostic)
console.log('\nTest Suite 3: AI Safety & Zod Guardrails');
const validAiActivity = {
  title: 'Morning Garden Recall',
  instructions: 'Touch the picture of the pink flower.',
  type: 'picture_matching' as const,
  difficulty: 'EASY' as const,
  estimatedDurationMinutes: 3,
  prompt: 'Which flower is the pink rose?',
  choices: [
    { id: '1', text: 'Pink Rose', isCorrect: true },
    { id: '2', text: 'Yellow Sunflower', isCorrect: false },
    { id: '3', text: 'Green Fern', isCorrect: false },
    { id: '4', text: 'Purple Lavender', isCorrect: false }
  ],
  correctChoiceId: '1'
};
const guardResult = AiActivityGuardSchema.safeParse(validAiActivity);
assert(guardResult.success, 'AI Activity Guard validates 4-choice activity successfully');

const invalidTwoChoiceActivity = {
  ...validAiActivity,
  choices: [
    { id: '1', text: 'Rose', isCorrect: true },
    { id: '2', text: 'Sunflower', isCorrect: false }
  ]
};
const invalidGuardResult = AiActivityGuardSchema.safeParse(invalidTwoChoiceActivity);
assert(!invalidGuardResult.success, 'AI Activity Guard strictly rejects activities with only 2 choices');

// TEST 6: Medical Diagnostic Text Replacement
const unsafeText = "The patient's dementia is worsening and Alzheimer's stage is progressing.";
const cleanedText = sanitizeTextContent(unsafeText);
assert(!cleanedText.toLowerCase().includes('worsening'), 'Diagnostic "worsening" language sanitized');
assert(cleanedText.toLowerCase().includes('supportive') || cleanedText.toLowerCase().includes('variation'), 'Safe supportive phrasing substituted');

// TEST 7: Reminiscence Schema Validation
const validReminiscence = {
  message: 'It is so nice to remember your balcony roses.',
  sourceMemoryIds: ['mem-2'],
  topic: 'Balcony Roses',
  confidence: 0.95,
  safetyStatus: 'safe' as const,
  followUpAllowed: true
};
const remResult = AiReminiscenceResponseSchema.safeParse(validReminiscence);
assert(remResult.success, 'Reminiscence response validates against Zod schema');

// TEST 8: Family Member Management CRUD
console.log('\nTest Suite 4: Family Care Team Management');
const initialFamilyCount = db.getFamilyMembers().length;
const newMember = db.addFamilyMember({
  patientId: 'patient-anita-123',
  name: 'Kavita Sharma',
  relationship: 'Cousin',
  phoneNumber: '+91 98333 44556',
  priority: 4,
  isPrimaryCaregiver: false,
  isEmergencyContact: true,
  canReceiveAlerts: true,
  canReceiveReports: false,
  canContactPatient: true
});
assert(db.getFamilyMembers().length === initialFamilyCount + 1, 'Family member added successfully');

db.updateFamilyMember(newMember.id, { notes: 'Verified phone contact' });
const updated = db.getFamilyMembers().find(f => f.id === newMember.id);
assert(updated?.notes === 'Verified phone contact', 'Family member updated');

db.deleteFamilyMember(newMember.id);
assert(db.getFamilyMembers().length === initialFamilyCount, 'Family member deleted successfully');

// TEST 9: SOS Emergency Dispatch & Logging
console.log('\nTest Suite 5: SOS Emergency Dispatching');
const initialSOSEvents = db.getSOSEvents().length;
const patient = db.getPatientProfile();
const family = db.getFamilyMembers();
const dispatch = EmergencyNotificationProvider.dispatchEmergency(patient, family);

assert(dispatch.success, 'Emergency dispatch completed');
assert(dispatch.telLink.startsWith('tel:'), `Telephone link formatted correctly (${dispatch.telLink})`);
assert(dispatch.smsLink.startsWith('sms:'), `SMS link formatted correctly (${dispatch.smsLink})`);
assert(db.getSOSEvents().length === initialSOSEvents + 1, 'SOS event recorded in database');

// TEST 10: Approved Memory AI Boundary
console.log('\nTest Suite 6: Approved Memory Boundary');
const allMemories = db.getMemories();
const aiMemories = db.getAiApprovedMemories();
assert(aiMemories.every(m => m.approved && m.approvedForAI), 'AI memory query strictly filters to approved && approvedForAI memories');

console.log('\n========================================');
console.log('ALL 10 TEST SUITES PASSED SUCCESSFULLY!');
console.log('========================================');
