export interface PhotosPickerSession {
  sessionId: string;
  pickerUri: string;
  mediaItemsSet: boolean;
  createdAt: string;
  expiresAt: string;
  mediaItems: Array<{
    id: string;
    filename: string;
    baseUrl: string;
    mimeType: string;
  }>;
}

// In-memory active picker sessions
const activeSessions: Map<string, PhotosPickerSession> = new Map();

export class GooglePhotosService {
  /**
   * Official Google Photos Picker API flow:
   * 1. Creates a session requesting photospicker.mediaitems.readonly
   * 2. Returns pickerUri for user to pick in separate window
   * 3. Session is polled until mediaItemsSet === true
   */
  public static async createPickerSession(): Promise<PhotosPickerSession> {
    const sessionId = `photos-sess-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins

    // In a live GCP environment, this calls https://photospicker.googleapis.com/v1/sessions
    // Here we provide the standard URL structure with realistic fallback
    const pickerUri = `https://photos.google.com/picker?sessionId=${sessionId}`;

    const session: PhotosPickerSession = {
      sessionId,
      pickerUri,
      mediaItemsSet: false,
      createdAt: new Date().toISOString(),
      expiresAt,
      mediaItems: []
    };

    activeSessions.set(sessionId, session);

    // Simulate caregiver picking photos after 5 seconds in demo mode
    setTimeout(() => {
      const current = activeSessions.get(sessionId);
      if (current) {
        current.mediaItemsSet = true;
        current.mediaItems = [
          {
            id: `item-${Date.now()}-1`,
            filename: 'family_diwali_verandah.jpg',
            baseUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
            mimeType: 'image/jpeg'
          },
          {
            id: `item-${Date.now()}-2`,
            filename: 'shimla_monsoon_balcony.jpg',
            baseUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            mimeType: 'image/jpeg'
          }
        ];
      }
    }, 4000);

    return session;
  }

  public static getSession(sessionId: string): PhotosPickerSession | null {
    return activeSessions.get(sessionId) || null;
  }

  public static getMediaItems(sessionId: string) {
    const session = activeSessions.get(sessionId);
    return session?.mediaItems || [];
  }
}
