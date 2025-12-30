# Google Drive Integration Setup Guide

This guide will help you set up Google Drive API integration so users can open Vakalath documents directly in Google Docs for editing.

## Prerequisites
- A Google Cloud Platform account
- Admin access to your project

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name: "Vakalath Drafting"
4. Click "Create"

### 2. Enable Google Drive API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: "Vakalath Drafting & e-Filing"
   - User support email: your email
   - Developer contact: your email
   - Click **Save and Continue**
   - Scopes: Add `https://www.googleapis.com/auth/drive.file`
   - Test users: Add your email (for testing)
   - Click **Save and Continue**

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Vakalath Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `https://your-domain.com`
   - Click **Create**

5. Copy the **Client ID** (it will look like: `xxxxx.apps.googleusercontent.com`)

### 4. Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API key**
3. Copy the API key
4. Click **Edit API key** (optional but recommended)
   - Application restrictions: **HTTP referrers**
   - Website restrictions:
     - `http://localhost:3000/*`
     - `https://your-domain.com/*`
   - API restrictions: **Restrict key** → Select "Google Drive API"
   - Click **Save**

### 5. Add Credentials to Your Project

1. Create/Edit `.env.local` in your project root:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
```

2. Restart your development server:
```bash
npm run dev
```

### 6. Test the Integration

1. Fill out a Vakalath form
2. Go to the preview page
3. Click "Open in Google Docs" button
4. You should be prompted to sign in to Google
5. Grant permissions to upload files to Drive
6. The document should upload and open in Google Docs

## Troubleshooting

### "Access blocked: Authorization Error"
- Make sure your email is added to the test users list in the OAuth consent screen
- Wait a few minutes for changes to propagate

### "Invalid Client ID"
- Double-check the Client ID in `.env.local`
- Ensure there are no extra spaces or quotes
- Restart your development server

### "CORS Error"
- Make sure your domain is listed in "Authorized JavaScript origins"
- Check that you're using the correct protocol (http vs https)

### Button doesn't work
- Open browser console (F12) and check for errors
- Ensure `.env.local` file has both variables set correctly
- Make sure you restarted the dev server after adding the env variables

## Fallback Mode

If Google Drive API is not configured, the system automatically falls back to:
1. Downloading the DOCX file
2. Showing instructions to manually upload to Google Drive
3. Opening docs.google.com in a new tab

This ensures the feature works even without API configuration!

## Production Deployment

For production (e.g., Vercel, Netlify):

1. Add environment variables in your hosting platform:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_GOOGLE_API_KEY`

2. Update OAuth consent screen:
   - Change to "Internal" if you have a Google Workspace
   - Or submit for verification for "External" apps

3. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
   - API key restrictions

## Security Notes

- ✅ API key is restricted to Google Drive API only
- ✅ OAuth scope is limited to `drive.file` (only files created by the app)
- ✅ Client ID is restricted to your domains only
- ✅ Environment variables are properly prefixed with `NEXT_PUBLIC_`

## User Privacy

The app only requests access to:
- Create new files in user's Drive
- Files created by this app only (not all Drive files)

Users can revoke access anytime from their [Google Account settings](https://myaccount.google.com/permissions).
