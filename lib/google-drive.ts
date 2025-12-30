/**
 * Google Drive Integration for Vakalath Documents
 * 
 * This module handles uploading DOCX files directly to Google Drive
 * and opening them in Google Docs for editing.
 */

// Google API Configuration
// NOTE: You need to set up a Google Cloud Project and enable Drive API
// Then add your credentials to .env.local:
// NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
// NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

/**
 * Load the Google API client library
 */
export function loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if running in browser
        if (typeof window === 'undefined') {
            reject(new Error('Google API can only be loaded in browser'));
            return;
        }

        // Check if already loaded
        if (window.gapi && window.gapi.client) {
            resolve();
            return;
        }

        // Load the API
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('client:auth2', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        clientId: GOOGLE_CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES,
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

/**
 * Sign in to Google Account using redirect (avoids popup blockers)
 */
export async function signInToGoogle(): Promise<boolean> {
    try {
        await loadGoogleAPI();
        const auth = window.gapi.auth2.getAuthInstance();

        if (auth.isSignedIn.get()) {
            return true;
        }

        // Use signIn with redirect instead of popup to avoid CORS
        await auth.signIn({
            prompt: 'select_account',
            ux_mode: 'redirect',
            redirect_uri: window.location.origin + '/vakalath/preview'
        });

        return auth.isSignedIn.get();
    } catch (error) {
        console.error('Error signing in to Google:', error);
        return false;
    }
}

/**
 * Upload a DOCX blob to Google Drive and open in Google Docs
 */
export async function uploadToGoogleDrive(
    blob: Blob,
    fileName: string,
    openInDocs: boolean = true
): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
        // Ensure user is signed in
        const isSignedIn = await signInToGoogle();
        if (!isSignedIn) {
            return { success: false, error: 'User not signed in to Google' };
        }

        // Prepare file metadata
        const metadata = {
            name: fileName,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };

        // Create form data for upload
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', blob);

        // Upload to Google Drive
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file to Google Drive');
        }

        const result = await response.json();
        const fileId = result.id;

        // Open in Google Docs if requested
        if (openInDocs && fileId) {
            // Open the file in Google Docs editor
            window.open(`https://docs.google.com/document/d/${fileId}/edit`, '_blank');
        }

        return { success: true, fileId };
    } catch (error: any) {
        console.error('Error uploading to Google Drive:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if Google API is configured
 */
export function isGoogleAPIConfigured(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(GOOGLE_CLIENT_ID && GOOGLE_API_KEY);
}

/**
 * Simple upload without OAuth (using Google Picker)
 * This is a fallback method that doesn't require OAuth setup
 */
export async function openInGoogleDocsSimple(blob: Blob, fileName: string): Promise<void> {
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Show instructions
    const instructions = `
📄 Document Downloaded: ${fileName}

To edit in Google Docs:
1. Go to docs.google.com
2. Click the folder icon (📁) or File → Open
3. Click the "Upload" tab
4. Select the downloaded file: ${fileName}
5. The document will open in Google Docs editor

The file has been downloaded to your Downloads folder.
    `.trim();

    alert(instructions);

    // Optional: Open Google Docs in a new tab
    window.open('https://docs.google.com', '_blank');
}
