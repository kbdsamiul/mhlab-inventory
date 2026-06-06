# MH Lab Inventory System — Setup Guide

Complete guide to deploy your lab inventory on GitHub Pages with Firebase authentication and cloud data storage.

---

## What You Need

- A free [GitHub](https://github.com) account
- A free [Firebase](https://firebase.google.com) account (use your Google account)
- The `mh_lab_inventory.html` file

---

## PART 1 — Firebase Setup (5–7 minutes)

### Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it something like `mhlab-inventory`
4. Disable Google Analytics (not needed) → Click **"Create project"**
5. Wait ~30 seconds → Click **"Continue"**

---

### Step 2: Add a Web App

1. On your project dashboard, click the **`</>`** (Web) icon
2. Give it a nickname, e.g. `MH Lab Web`
3. **Do NOT** check "Also set up Firebase Hosting" (you'll use GitHub Pages instead)
4. Click **"Register app"**
5. You will see a block like this — **copy it carefully**:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mhlab-inventory.firebaseapp.com",
  projectId: "mhlab-inventory",
  storageBucket: "mhlab-inventory.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Click **"Continue to console"**

---

### Step 3: Enable Email/Password Authentication

1. In the left sidebar → click **"Authentication"**
2. Click **"Get started"**
3. Under **Sign-in method** → click **"Email/Password"**
4. Toggle **"Email/Password"** to **Enabled**
5. Leave "Email link (passwordless)" disabled
6. Click **"Save"**

---

### Step 4: Create Firestore Database

1. In the left sidebar → click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** → click **"Next"**
4. Choose a location (e.g. `asia-south1` for Bangladesh) → click **"Enable"**
5. Wait ~30 seconds for it to provision

> **Note:** Test mode allows read/write for 30 days. Before it expires, go to Firestore → Rules and replace with:
> ```
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /users/{userId} {
>       allow read, write: if request.auth != null && request.auth.uid == userId;
>     }
>     match /labdata/{userId} {
>       allow read, write: if request.auth != null && request.auth.uid == userId;
>     }
>   }
> }
> ```

---

### Step 5: Paste Firebase Config into the HTML File

1. Open `mh_lab_inventory.html` in **Notepad** (Windows) or **TextEdit** (Mac) or any text editor
2. Press **Ctrl+F** (Find) and search for:
   ```
   YOUR_API_KEY
   ```
3. Find this block near the top of the file:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Replace each placeholder with your actual values from Step 2
5. **Save the file**

---

## PART 2 — GitHub Pages Deployment (5 minutes)

### Step 6: Create a GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `mhlab-inventory` (or anything you like)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Click **"Create repository"**

---

### Step 7: Upload Your File

**Option A — Upload via browser (easiest):**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop `mh_lab_inventory.html` into the upload area
3. Also drag and drop this `README.md` file (optional)
4. Rename `mh_lab_inventory.html` to **`index.html`** before uploading
   - Or after uploading, click the file → Edit (pencil icon) → rename at the top
5. Scroll down → click **"Commit changes"**

**Option B — Using Git (if you have it installed):**

```bash
git clone https://github.com/YOUR_USERNAME/mhlab-inventory.git
cd mhlab-inventory
cp /path/to/mh_lab_inventory.html index.html
git add index.html
git commit -m "Add MH Lab Inventory app"
git push origin main
```

---

### Step 8: Enable GitHub Pages

1. In your repository → click **"Settings"** (top tab)
2. Scroll down to **"Pages"** in the left sidebar
3. Under **"Branch"** → select `main` → folder `/root`
4. Click **"Save"**
5. Wait 1–2 minutes
6. Refresh the page — you will see:
   > **Your site is live at `https://YOUR_USERNAME.github.io/mhlab-inventory/`**

---

### Step 9: Add Your GitHub Pages URL to Firebase (Important!)

Firebase blocks requests from unknown domains for security.

1. Go back to [Firebase Console](https://console.firebase.google.com)
2. Click **Authentication** → **Settings** tab → **Authorized domains**
3. Click **"Add domain"**
4. Enter your GitHub Pages URL: `YOUR_USERNAME.github.io`
5. Click **"Add"**

---

## PART 3 — First Login

1. Open your site: `https://YOUR_USERNAME.github.io/mhlab-inventory/`
2. Click **"Register"** tab
3. Enter your name, email, and password
4. Click **"Create Account"**
5. Check your email inbox for a verification link
6. Click the link in the email
7. Return to the site → click **"I've Verified — Continue"**
8. You are now logged in with all your lab data loaded!

---

## How Data Saving Works

| Action | What happens |
|--------|-------------|
| Add / Edit / Delete any item | Saved instantly to Firebase cloud |
| Close the browser window | Data is safe — stored in cloud |
| Open on a different device | Login with same account → data loads |
| No internet connection | Works from local cache; syncs when back online |

---

## How to Share With Lab Members

Each person creates their own account. Their data is **private to their account** (Firestore security rules enforce this). If you want everyone to share the same inventory data, let me know and I can modify the app for a shared "lab" data model instead.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Yellow "Firebase Setup Required" banner | You haven't replaced the config placeholders yet (Step 5) |
| Login says "auth/unauthorized-domain" | Add your GitHub Pages domain in Firebase → Authentication → Authorized domains (Step 9) |
| "Permission denied" error | Firestore test mode expired → update security rules (Step 4 note) |
| Verification email not arriving | Check spam folder; use "Resend verification email" button |
| Data not saving | Check browser console (F12) for errors; check Firestore rules |
| Site shows 404 on GitHub Pages | Make sure the file is named `index.html` not `mh_lab_inventory.html` |

---

## File Structure (what goes in your GitHub repo)

```
mhlab-inventory/
├── index.html       ← the main app (renamed from mh_lab_inventory.html)
└── README.md        ← this file (optional)
```

That's it — no build tools, no Node.js, no server required. Pure static HTML.

---

## Summary Checklist

- [ ] Firebase project created
- [ ] Web app registered, `firebaseConfig` copied
- [ ] Email/Password authentication enabled
- [ ] Firestore database created (test mode)
- [ ] Config pasted into `mh_lab_inventory.html`
- [ ] File renamed to `index.html`
- [ ] Uploaded to GitHub repository
- [ ] GitHub Pages enabled (Settings → Pages → main branch)
- [ ] GitHub Pages URL added to Firebase authorized domains
- [ ] Registered first account + verified email
- [ ] Logged in successfully ✓

---

*MH Lab Inventory System — Mirza Hasanuzzaman Plant Stress Physiology Laboratory, SAU*
