# 🔒 HOW TO CHECK & FIX FIRESTORE RULES

## 📋 STEP-BY-STEP GUIDE

### **Step 1: Open Firebase Console**

1. **Go to:** https://console.firebase.google.com
2. **Sign in** with your Google account
3. You should see your projects list

---

### **Step 2: Select Your Project**

1. Look for project: **"e-filing-31b48"** or **"E Filing"**
2. **Click on the project card** to open it
3. You'll see the project dashboard

---

### **Step 3: Navigate to Firestore Database**

1. On the left sidebar, find **"Build"** section
2. Click on **"Firestore Database"**
3. You'll see the Firestore Database page

**OR use direct link:**
https://console.firebase.google.com/project/e-filing-31b48/firestore

---

### **Step 4: Open Rules Tab**

1. At the top of the Firestore page, you'll see tabs:
   - Data
   - **Rules** ← Click this
   - Indexes
   - Usage

2. Click on **"Rules"** tab
3. You'll see a code editor with your current rules

---

### **Step 5: Check Current Rules**

Your rules editor will show something like this:

**❌ BAD (Too Restrictive):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
This blocks ALL access - won't work!

**⚠️ WARNING (Testing Mode - Insecure):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
This allows ANYONE to read/write - only for testing!

**✅ CORRECT (Production Safe):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Drafts collection - authenticated users only
    match /drafts/{draft} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Other collections can be added here
  }
}
```

---

### **Step 6: Update Rules (If Needed)**

1. **Select all text** in the rules editor (Ctrl+A)
2. **Delete** the old rules
3. **Copy and paste** the CORRECT rules from above
4. Click **"Publish"** button (top right)
5. Wait for "Rules published successfully" message

---

### **Step 7: Verify Rules Are Active**

After publishing:

1. Look for **green checkmark** ✅ next to "Rules"
2. Check timestamp shows **recent time** (just now)
3. Status should say **"Published"**

---

## 🎯 QUICK CHECKLIST

Before leaving Firebase Console:

- [ ] Project: "e-filing-31b48" selected
- [ ] Firestore Database opened
- [ ] Rules tab active
- [ ] Rules include `allow read, write: if request.auth != null`
- [ ] Rules published (green checkmark)
- [ ] No error messages

---

## 📸 WHAT YOU'LL SEE

### **Firebase Console Home:**
```
┌─────────────────────────────────────┐
│  Firebase Console                   │
├─────────────────────────────────────┤
│                                     │
│  Your Projects:                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  E Filing                      │ │ ← Click this
│  │  e-filing-31b48               │ │
│  │  Last used: Today             │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### **Firestore Database Page:**
```
┌──────────────────────────────────────────┐
│  Firestore Database                      │
├──────────────────────────────────────────┤
│  [Data]  [Rules]  [Indexes]  [Usage]    │
│           ^^^^^^^ Click here              │
├──────────────────────────────────────────┤
│  Rules Editor                             │
│  ┌────────────────────────────────────┐  │
│  │ rules_version = '2';               │  │
│  │ service cloud.firestore {          │  │
│  │   match /databases/{database}...   │  │
│  │ }                                  │  │
│  └────────────────────────────────────┘  │
│                                           │
│                      [Publish] ← Click    │
└──────────────────────────────────────────┘
```

---

## 🔍 TROUBLESHOOTING

### **Can't Find Project?**

1. Make sure you're signed in with correct Google account
2. Check project was created in this account
3. Look in "All projects" dropdown

### **Rules Tab Not Showing?**

1. Make sure Firestore is initialized
2. If not, click "Create database"
3. Choose "Start in test mode"
4. Select region (closest to you)
5. Click "Enable"

### **Publish Button Grayed Out?**

1. Make sure you made changes to rules
2. Check for syntax errors (red underlines)
3. Try clicking elsewhere in editor first

### **Error After Publishing?**

Common errors:

**"Invalid rules syntax"**
- Check for typos
- Make sure all brackets match
- Copy exact rules from above

**"Permission denied"**
- You're not project owner/editor
- Ask project owner to update rules

---

## ✅ CORRECT RULES FOR YOUR APP

**Copy this exactly:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Vakalath drafts - authenticated users can create/read their own
    match /drafts/{draftId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Anyone authenticated can create drafts
      allow create: if request.auth != null;
      
      // Only owner can update/delete their drafts
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
    
    // Add more collections as needed
  }
}
```

**Then click "Publish"!**

---

## 🎉 AFTER PUBLISHING

Your app should now work without permission errors!

### **Test It:**

1. Go to http://localhost:3000
2. Log in
3. Create new Vakalath draft
4. Submit form
5. Should save successfully! ✅

### **If Still Not Working:**

Check browser console (F12) for error messages:

**"Missing or insufficient permissions"**
- Rules not published correctly
- Go back and re-publish

**"PERMISSION_DENIED"**
- User not authenticated
- Try logging out and back in

**"Network error"**
- Check `.env.local` exists
- Restart dev server

---

## 📞 NEED HELP?

If you're stuck:

1. **Take a screenshot** of your Rules tab
2. **Copy the error message** from console
3. **Share:** What step you're on

I'll help you fix it! 🚀

---

## 🔗 USEFUL LINKS

**Direct Links for Your Project:**

- **Firebase Console:** https://console.firebase.google.com/project/e-filing-31b48
- **Firestore Rules:** https://console.firebase.google.com/project/e-filing-31b48/firestore/rules
- **Authentication:** https://console.firebase.google.com/project/e-filing-31b48/authentication/users
- **Project Settings:** https://console.firebase.google.com/project/e-filing-31b48/settings/general

**Documentation:**

- **Firestore Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Authentication:** https://firebase.google.com/docs/auth/web/start

---

**That's it! Follow these steps and your Firebase will be properly configured!** 🎯
