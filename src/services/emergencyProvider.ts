import { SOSEvent, FamilyMember, PatientProfile } from '../types';
import { db } from './db';

export interface EmergencyDispatchResult {
  success: boolean;
  telLink: string;
  smsLink: string;
  event: SOSEvent;
  message: string;
}

export class EmergencyNotificationProvider {
  /**
   * Dispatches emergency notification flow:
   * 1. Prepares tel: URI to call primary emergency contact or configured emergency number
   * 2. Prepares sms: URI to text family emergency contacts
   * 3. Logs SOS event in the database
   */
  public static dispatchEmergency(
    patient: PatientProfile,
    familyMembers: FamilyMember[],
    locationCoordinates?: { latitude: number; longitude: number }
  ): EmergencyDispatchResult {
    // 1. Identify primary emergency contact
    const emergencyContact = familyMembers.find(f => f.isEmergencyContact && f.isPrimaryCaregiver)
      || familyMembers.find(f => f.isEmergencyContact)
      || familyMembers[0];

    const phoneNumber = emergencyContact?.phoneNumber || patient.emergencyNumber || '112';

    // 2. Format customizable SOS message
    const defaultMessage = `Emergency alert from MindNest. ${patient.preferredName || patient.name} may need assistance. Please check on them immediately.`;
    const message = patient.emergencyCustomMessage || defaultMessage;

    // 3. Create native deep links for web and mobile browsers
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    const telLink = `tel:${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    const smsLink = `sms:${cleanPhone}?body=${encodedMessage}`;

    // 4. Record SOS event
    const event: SOSEvent = {
      id: `sos-${Date.now()}`,
      patientId: patient.id,
      triggeredAt: new Date().toISOString(),
      triggeredBy: 'PATIENT',
      location: locationCoordinates ? {
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude,
        timestamp: new Date().toISOString()
      } : undefined,
      contactsNotified: emergencyContact ? [emergencyContact.name] : ['Emergency Dispatch (112)'],
      callAttempted: true,
      smsAttempted: true,
      status: 'DISPATCHED',
      notes: `Triggered by patient from companion interface. Target: ${phoneNumber}`
    };

    db.recordSOSEvent(event);

    return {
      success: true,
      telLink,
      smsLink,
      event,
      message
    };
  }
}
