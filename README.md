# Stride v3 — small steps, big goals

Cross-device sync · Google Sheets database · History · Reminders manager

---

## What's new in v3

- ✅ **Google Sheets sync** — all data stored in your own Google Sheet
- ✅ **Cross-device** — phone and laptop always in sync
- ✅ **History tab** — last 8 weeks per goal with visual bar chart
- ✅ **Reminders manager** — add/delete reminders from inside the app
- ✅ **Data safe forever** — nothing lost even if you reinstall

---

## Files in this zip

| File | Purpose |
|---|---|
| `index.html` | Full Stride app |
| `sw.js` | Service worker — offline + push reminders |
| `manifest.json` | PWA installability |
| `icons/` | App icons |
| `google-apps-script.js` | Paste this into Google Sheets (see setup below) |

---

## Step 1 — Deploy your Google Sheet backend (one time, ~15 mins)

### 1a. Create the sheet
Go to **sheets.new** → name it **Stride Data**

### 1b. Open Apps Script
In your sheet: **Extensions → Apps Script**
Delete all existing code. Paste the full contents of `google-apps-script.js`. Click **Save (💾)**.

### 1c. Deploy as Web App
- Click **Deploy → New deployment**
- Click the gear icon → select **Web app**
- Set **Execute as** → Me
- Set **Who has access** → Anyone
- Click **Deploy**
- Click **Authorize access** → choose your Google account → Allow
- Copy the **Web app URL** (starts with `https://script.google.com/macros/s/...`)

### 1d. Connect Stride
Open the Stride app → it will show a Setup screen after 2 seconds.
Paste your Web app URL → tap **Connect & test**.
You should see "Connected!" ✅

---

## Step 2 — Upload to GitHub & enable Pages

1. Go to `https://github.com/sanmathipn/stride`
2. Click **Add file → Upload files**
3. Drag in ALL files from this zip (keep icons/ folder)
4. Click **Commit changes**
5. Go to **Settings → Pages → Branch: main → Save**
6. Wait 2 minutes → open `https://sanmathipn.github.io/stride`

---

## Step 3 — Install on devices

**Android Chrome:**
Menu (⋮) → Add to Home Screen → Add → Open app → Enable reminders

**Windows Chrome/Edge:**
Install icon in address bar → Install → Open from Start menu

---

## Reminder schedule (pre-loaded)

| Goal | Time | Repeat |
|---|---|---|
| Workout nudge | 6:00 AM | Daily |
| Call mom — morning | 11:30 AM | Daily |
| Call mom — evening | 5:00 PM | Daily |
| Daily expenses | 8:00 PM | Daily |
| Read a book | 9:00 PM | Daily |
| Learn tech EOD | 9:00 PM | Daily |
| Bill payments | 9:00 AM | Sundays |

Add or delete reminders anytime from the **Remind** tab inside the app.

---

## How sync works

Every time you log data → it saves locally AND writes to your Google Sheet.
When you open the app on another device → it reads from the same sheet.
Works offline too — syncs automatically when back online.

Your Google Sheet will have tabs:
`Workout | Reading | CallMom | Bills | TechLearning | Expenses | WeeklyHistory | Reminders`
