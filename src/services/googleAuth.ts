import { db } from './db';

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

export class GoogleAuthService {
  private static CLIENT_ID_KEY = 'mindnest_google_client_id';
  private static API_KEY_KEY = 'mindnest_google_api_key';
  private static ACCESS_TOKEN_KEY = 'mindnest_google_access_token';

  public static getClientId(): string {
    const local = localStorage.getItem(this.CLIENT_ID_KEY);
    if (local && local.trim().length > 0) return local.trim();
    return ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '').trim();
  }

  public static setClientId(clientId: string): void {
    localStorage.setItem(this.CLIENT_ID_KEY, clientId.trim());
  }

  public static getApiKey(): string {
    const local = localStorage.getItem(this.API_KEY_KEY);
    if (local && local.trim().length > 0) return local.trim();
    return ((import.meta as any).env?.VITE_GOOGLE_API_KEY || '').trim();
  }

  public static setApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_KEY, apiKey.trim());
  }

  public static getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public static setAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  public static isConfigured(): boolean {
    const cid = this.getClientId();
    return Boolean(cid && cid.includes('.apps.googleusercontent.com'));
  }

  /**
   * Load Google Identity Services SDK
   */
  public static async loadGsiScript(): Promise<void> {
    if (window.google?.accounts?.oauth2) return;

    return new Promise((resolve, reject) => {
      const existing = document.getElementById('google-gsi-script');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  /**
   * Request Google OAuth 2.0 Access Token with Drive & Photos scopes
   */
  public static async requestAccessToken(): Promise<string> {
    const clientId = this.getClientId();

    if (!clientId) {
      // Mock / Simulated connection for instant zero-config testing
      const mockToken = `mock-token-${Date.now()}`;
      this.setAccessToken(mockToken);
      db.updateGoogleConnection({
        accountConnected: true,
        googleEmail: 'caregiver.mindnest@gmail.com',
        googleDisplayName: 'Caregiver Account',
        photosConnected: true,
        driveConnected: true
      });
      return mockToken;
    }

    await this.loadGsiScript();

    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/photoslibrary.readonly'
          ].join(' '),
          callback: (response: any) => {
            if (response.error) {
              console.error('Google OAuth Error:', response);
              reject(new Error(response.error_description || response.error));
              return;
            }

            const token = response.access_token;
            this.setAccessToken(token);

            // Fetch user info with token
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(user => {
                db.updateGoogleConnection({
                  accountConnected: true,
                  googleEmail: user.email || 'connected.user@gmail.com',
                  googleDisplayName: user.name || 'Google User',
                  photosConnected: true,
                  driveConnected: true
                });
                resolve(token);
              })
              .catch(() => {
                db.updateGoogleConnection({
                  accountConnected: true,
                  googleEmail: 'connected.user@gmail.com',
                  googleDisplayName: 'Google User',
                  photosConnected: true,
                  driveConnected: true
                });
                resolve(token);
              });
          }
        });

        client.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  }
}
