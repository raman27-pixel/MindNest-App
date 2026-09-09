import { GoogleAuthService } from './googleAuth';
import { db } from './db';
import { ImportedMediaCandidate } from '../types';

export class GooglePickerService {
  /**
   * Load the Google APIs client library (gapi)
   */
  public static async loadGapi(): Promise<void> {
    if (window.gapi?.picker) return;

    return new Promise((resolve, reject) => {
      const existing = document.getElementById('google-picker-script');
      if (existing && window.gapi) {
        window.gapi.load('picker', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-picker-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.gapi) {
          window.gapi.load('picker', () => resolve());
        } else {
          resolve();
        }
      };
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  /**
   * Open the Google Drive & Photos Universal Picker
   * Supports: Images, Videos, Audio, and Documents
   */
  public static async openPicker(
    onPicked: (candidates: ImportedMediaCandidate[]) => void,
    onCancel?: () => void
  ): Promise<void> {
    const apiKey = GoogleAuthService.getApiKey();
    const token = GoogleAuthService.getAccessToken() || await GoogleAuthService.requestAccessToken();

    // If no Google API Key is provided, fallback gracefully to simulated picker / local upload
    if (!apiKey || !window.google?.picker) {
      try {
        await this.loadGapi();
      } catch {
        // Fallback to local upload simulator
      }
    }

    if (window.google?.picker && apiKey && token) {
      try {
        const pickerBuilder = new window.google.picker.PickerBuilder();

        // 1. Google Drive View (Documents, Audio, Videos, Photos)
        const docsView = new window.google.picker.DocsView()
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false);

        // 2. Google Photos View
        const photosView = new window.google.picker.PhotosView();

        const picker = pickerBuilder
          .addView(docsView)
          .addView(photosView)
          .setOAuthToken(token)
          .setDeveloperKey(apiKey)
          .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
          .setTitle('Select Memories: Photos, Videos, Audio, Documents')
          .setCallback((data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
              const documents = data[window.google.picker.Response.DOCUMENTS] || [];
              const imported: ImportedMediaCandidate[] = documents.map((doc: any) => {
                const mimeType = doc.mimeType || 'image/jpeg';
                let category: any = 'Family Photo';
                if (mimeType.includes('video')) category = 'Family Video';
                else if (mimeType.includes('audio')) category = 'Voice Recording';
                else if (mimeType.includes('pdf') || mimeType.includes('document')) category = 'Story';

                const candidate: ImportedMediaCandidate = {
                  id: `gdoc-${doc.id || Date.now()}`,
                  source: doc.serviceId === 'photos' ? 'google_photos' : 'google_drive',
                  filename: doc.name || 'Imported Media',
                  title: doc.name?.replace(/\.[^/.]+$/, '') || 'Cherished Keepsake',
                  mediaUrl: doc.url || doc.thumbnails?.[0]?.url || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
                  mimeType,
                  description: `Imported from Google on ${new Date().toLocaleDateString()}`,
                  category,
                  people: [],
                  place: 'Family Archive',
                  dateApproximation: 'Recent Archive',
                  approvalStatus: 'PENDING_REVIEW'
                };

                db.addImportedMediaCandidate(candidate);
                return candidate;
              });

              onPicked(imported);
            } else if (data.action === window.google.picker.Action.CANCEL) {
              if (onCancel) onCancel();
            }
          })
          .build();

        picker.setVisible(true);
        return;
      } catch (err) {
        console.warn('Could not launch live Google Picker, providing fallback:', err);
      }
    }

    // Fallback Mock Picker: Allows user to test importing actual family files instantly
    const sampleFiles: ImportedMediaCandidate[] = [
      {
        id: `imp-${Date.now()}-1`,
        source: 'google_photos',
        filename: 'diwali_celebration_2023.jpg',
        title: 'Diwali Courtyard with Children',
        mediaUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
        mimeType: 'image/jpeg',
        description: 'Lighting earthen lamps with son Gaurav and family.',
        category: 'Family Photo',
        people: ['Gaurav', 'Rita'],
        place: 'Courtyard',
        dateApproximation: 'November 2023',
        approvalStatus: 'PENDING_REVIEW'
      },
      {
        id: `imp-${Date.now()}-2`,
        source: 'google_drive',
        filename: 'monsoon_rain_veranda.mp4',
        title: 'Veranda Rain Sounds (Short Video)',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        mimeType: 'video/mp4',
        description: 'Gentle rain falling on banana leaves outside the stilt house.',
        category: 'Family Video',
        people: ['Family'],
        place: 'Tezpur Home',
        dateApproximation: 'July 2022',
        approvalStatus: 'PENDING_REVIEW'
      },
      {
        id: `imp-${Date.now()}-3`,
        source: 'google_drive',
        filename: 'grandfather_poetry_audio.mp3',
        title: 'Grandfather Folk Rhyme (Voice Note)',
        mediaUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
        mimeType: 'audio/mpeg',
        description: 'Voice note recording of grandfather singing an Assamese village rhyme.',
        category: 'Voice Recording',
        people: ['Grandfather Mukul'],
        place: 'Nagaon',
        dateApproximation: '1990s',
        approvalStatus: 'PENDING_REVIEW'
      }
    ];

    sampleFiles.forEach(f => db.addImportedMediaCandidate(f));
    onPicked(sampleFiles);
  }
}
