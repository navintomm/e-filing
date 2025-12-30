# 🔍 DRAFT SAVE ISSUES - DIAGNOSTIC & FIX

## ⚠️ PROBLEM: Drafts Not Showing Up

**Symptoms:**
- Drafts created but not visible in dashboard
- Previous drafts missing after re-login
- "No drafts" message even after creating drafts

---

## ✅ FIXES APPLIED

### **1. Success Confirmation** 
Now shows clear message when draft saves:
```
✅ Draft saved successfully!

Draft ID: abc123xyz

Redirecting to preview...
```

### **2. Better Error Messages**
Clear feedback if save fails:
```
❌ Failed to save draft

Error: [specific error]

Please check your connection and try again.
```

### **3. Local Backup**
Every draft now saves to:
- **sessionStorage** - for preview
- **localStorage** - as backup

### **4. Console Logging**
Check browser console (F12) to see:
- ✅ "Draft saved successfully! ID: ..."
- ❌ "Error creating draft: ..."

---

## 🔍 DIAGNOSTIC STEPS

### **Step 1: Check Browser Console**
1. Open browser DevTools: **F12**
2. Go to **Console** tab
3. Look for messages:
   - ✅ Green checkmark = Saved successfully
   - ❌ Red X = Save failed

### **Step 2: Check Firebase Console**
1. Go to **Firebase Console**
2. Navigate to **Firestore Database**
3. Look for **"drafts"** collection
4. Check if documents exist with your userId

### **Step 3: Check localStorage**
1. Open DevTools: **F12**
2. Go to **Application** tab
3. Expand **Local Storage**
4. Look for keys starting with `draft_backup_`
5. If you see them, drafts were created but maybe not synced

### **Step 4: Check Network**
1. Open DevTools: **F12**
2. Go to **Network** tab
3. Filter by **"firestore"**
4. Try saving a draft
5. Look for:
   - **Red entries** = Failed requests
   - **200 status** = Successful requests

---

## 🎯 COMMON CAUSES & SOLUTIONS

### **Cause 1: Firebase Connection Timeout**
**Solution:** 
- Check internet connection
- Wait for timeout (60 seconds)
- Try submitting again

### **Cause 2: Authentication Issue**
**Solution:**
- Log out and log back in
- Check console for auth errors
- Verify Firebase Auth is enabled

### **Cause 3: Firestore Rules**
**Solution:**
Check your Firestore security rules allow writes:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /drafts/{draft} {
      // Allow authenticated users to create drafts
      allow create: if request.auth != null;
      
      // Allow users to read their own drafts
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
    }
  }
}
```

### **Cause 4: Wrong Collection Name**
**Solution:**
- App saves to: `drafts` collection
- Dashboard reads from: `drafts` collection
- Verify both use same collection name

### **Cause 5: userId Mismatch**
**Solution:**
- Drafts saved with current user's UID
- Dashboard filters by current user's UID
- If you logged in with different account, drafts won't show

---

## 🛠️ MANUAL VERIFICATION

### **Test Save Process:**
1. Open browser console (F12)
2. Fill out Vakalath form
3. Click "Submit Draft"
4. Watch console for messages:
   ```
   Starting to save draft to Firebase...
   ✅ Draft saved successfully! ID: xyz123
   ```
5. If you see ✅, draft was saved
6. If you see ❌, check the error message

### **Test Dashboard Load:**
1. Open console (F12)
2. Go to dashboard
3. Look for:
   ```
   Fetching drafts for user: [userId]
   Found X drafts
   ```

---

## 📊 WHAT TO CHECK IN FIREBASE CONSOLE

### **Firestore Database:**
```
Vakalath App
└── drafts/
    ├── [draft-id-1]
    │   ├── userId: "abc123"
    │   ├── status: "draft"
    │   ├── draftType: "vakalath"
    │   ├── createdAt: [timestamp]
    │   └── [other data...]
    ├── [draft-id-2]
    └── ...
```

### **What to verify:**
- ✅ Collection named "drafts" exists
- ✅ Documents have userId field
- ✅ userId matches your logged-in user
- ✅ createdAt timestamp is recent

---

## 🚨 IMMEDIATE ACTION STEPS

### **If draft isn't saving:**

1. **Check console immediately after submit:**
   - Look for the Draft ID in success message
   - Check if error appears

2. **Verify you're logged in:**
   ```javascript
   // In console, type:
   firebase.auth().currentUser
   // Should show user object, not null
   ```

3. **Check internet:**
   - Open Network tab
   - Look for failed requests (red)

4. **Try incognito mode:**
   - Rules out browser extension issues
   - Fresh localStorage/sessionStorage

---

## ✅ EXPECTED BEHAVIOR NOW

### **Successful Save:**
```
1. User fills form
2. Clicks "Submit Draft"
3. Button shows "Submitting..."
4. Console: "✅ Draft saved successfully! ID: xyz"
5. Alert: "✅ Draft saved successfully!"
6. Redirects to preview
7. Draft appears in dashboard
```

### **Failed Save:**
```
1. User fills form
2. Clicks "Submit Draft"  
3. Button shows "Submitting..."
4. After 60s timeout OR immediate error:
5. Console: "❌ Error creating draft: [details]"
6. Alert: "❌ Failed to save draft..."
7. User stays on form (data preserved)
8. Can try again
```

---

## 🎯 NEXT STEPS

1. **Create a test draft:**
   - Fill minimal form
   - Submit
   - Watch for success message

2. **Check if it appears:**
   - Go to dashboard
   - Look for the draft
   - Verify Draft ID matches

3. **If still not working:**
   - Check all diagnostic steps above
   - Share console error messages
   - Check Firebase Console

---

## 💡 PRO TIP

**Enable verbose logging temporarily:**

Add to `lib/firebase.ts`:
```typescript
import { setLogLevel } from 'firebase/firestore';

// Add this line for debugging
setLogLevel('debug');
```

This will show detailed Firebase operations in console!

---

**Status:** ✅ Better error handling + success confirmation added  
**Next:** Try creating a draft and watch for the success message!
