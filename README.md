# Stride — small steps, big goals

Your personal daily tracker for all 6 goals with reminders.

---

## What's inside

| File | Purpose |
|---|---|
| `index.html` | The full app (all screens, all logic) |
| `sw.js` | Service worker — offline + reminders |
| `manifest.json` | Makes it installable on Android & Windows |
| `icons/` | App icons for all screen sizes |

---

## Reminders configured

| Goal | Time | Every |
|---|---|---|
| Workout nudge | 6:00 AM | Daily |
| Call mom — morning | 11:30 AM | Daily |
| Call mom — evening | 5:00 PM | Daily |
| Daily expenses | 8:00 PM | Daily |
| Read a book | 9:00 PM | Daily |
| Learn tech EOD | 9:00 PM | Daily |
| Bill review | 9:00 AM | Sundays |

---

## How to host for free (GitHub Pages — recommended)

1. Go to **github.com** → Sign up free if needed
2. Click **New repository** → name it `stride`
3. Upload ALL files (keep the `icons/` folder)
4. Go to **Settings → Pages → Branch: main → Save**
5. Your app URL: `https://YOUR-USERNAME.github.io/stride`

---

## Install on Android

1. Open Chrome on your phone
2. Go to your app URL
3. Tap the **three-dot menu (⋮)** → **"Add to Home Screen"**
4. Tap **Add** → it appears like a native app on your home screen
5. Open it → tap **"Enable reminders"** when prompted → tap Allow

---

## Install on Windows

1. Open Chrome or Edge on your laptop
2. Go to your app URL
3. Look for the **install icon** in the address bar (looks like a monitor with a + sign)
4. Click it → click **Install**
5. The app opens in its own window from your Start menu / taskbar

---

## Data storage

All your data is saved **locally on your device** using `localStorage`.
- Nothing is sent to any server
- Data stays on your phone / laptop separately
- Works fully offline once installed

---

## Alternative: serve locally (no hosting needed)

If you have Python installed:
```
cd stride-pwa
python3 -m http.server 8080
```
Then open `http://localhost:8080` in Chrome.

---

Built for: Android Chrome + Windows Chrome/Edge
