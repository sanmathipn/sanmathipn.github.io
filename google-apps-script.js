// ─────────────────────────────────────────────────────────────────────────────
// STRIDE — Google Apps Script Backend
// Paste this entire file into your Google Sheet's Apps Script editor
// Extensions → Apps Script → paste → Save → Deploy → Web App
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAMES = {
  workout:  'Workout',
  reading:  'Reading',
  mom:      'CallMom',
  bills:    'Bills',
  tech:     'TechLearning',
  expenses: 'Expenses',
  history:  'WeeklyHistory',
  reminders:'Reminders',
};

// ── CORS + Router ─────────────────────────────────────────────────────────────
function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  const params = e.parameter || {};
  const body   = parseBody(e);
  const action = params.action || body.action;
  let result;
  try {
    switch(action) {
      case 'read':        result = readGoal(params.goal); break;
      case 'write':       result = writeEntry(body); break;
      case 'weekSummary': result = getWeekSummary(params.goal, params.week); break;
      case 'history':     result = getHistory(params.goal); break;
      case 'saveHistory': result = saveWeekHistory(body); break;
      case 'getBills':    result = getBills(); break;
      case 'addBill':     result = addBill(body); break;
      case 'getExpenses': result = getExpenses(params.date); break;
      case 'addExpense':  result = addExpense(body); break;
      case 'getReminders':  result = getReminders(); break;
      case 'saveReminders': result = saveReminders(body); break;
      case 'ping':        result = { ok: true, message: 'Stride backend live!' }; break;
      default:            result = { error: 'Unknown action: ' + action };
    }
  } catch(err) {
    result = { error: err.toString() };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  try { return JSON.parse(e.postData?.contents || '{}'); } catch(_) { return {}; }
}

// ── Sheet helpers ─────────────────────────────────────────────────────────────
function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers) sheet.appendRow(headers);
  }
  return sheet;
}

function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

// ── Workout ───────────────────────────────────────────────────────────────────
function readGoal(goal) {
  const name = SHEET_NAMES[goal];
  if (!name) return { error: 'Unknown goal' };
  const sheet = getOrCreateSheet(name, ['date', 'weekKey', 'value', 'note', 'timestamp']);
  return { rows: sheetToObjects(sheet) };
}

function writeEntry(body) {
  const { goal, date, weekKey, value, note } = body;
  const name = SHEET_NAMES[goal];
  if (!name) return { error: 'Unknown goal' };
  const sheet = getOrCreateSheet(name, ['date', 'weekKey', 'value', 'note', 'timestamp']);
  const data  = sheet.getDataRange().getValues();
  // Update existing row for same date if exists
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(date)) {
      sheet.getRange(i+1, 3).setValue(value);
      sheet.getRange(i+1, 4).setValue(note || '');
      sheet.getRange(i+1, 5).setValue(new Date().toISOString());
      return { ok: true, updated: true };
    }
  }
  sheet.appendRow([date, weekKey, value, note || '', new Date().toISOString()]);
  return { ok: true, inserted: true };
}

// ── Bills ─────────────────────────────────────────────────────────────────────
function getBills() {
  const sheet = getOrCreateSheet(SHEET_NAMES.bills, ['id','name','amount','status','due','addedOn']);
  return { bills: sheetToObjects(sheet) };
}

function addBill(body) {
  const sheet = getOrCreateSheet(SHEET_NAMES.bills, ['id','name','amount','status','due','addedOn']);
  const data  = sheet.getDataRange().getValues();
  // Update status if same id
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) {
      sheet.getRange(i+1, 4).setValue(body.status || data[i][3]);
      return { ok: true, updated: true };
    }
  }
  sheet.appendRow([body.id, body.name, body.amount, body.status, body.due, new Date().toISOString()]);
  return { ok: true, inserted: true };
}

// ── Expenses ──────────────────────────────────────────────────────────────────
function getExpenses(date) {
  const sheet = getOrCreateSheet(SHEET_NAMES.expenses, ['id','date','category','amount','note','timestamp']);
  const all   = sheetToObjects(sheet);
  return { expenses: date ? all.filter(r => r.date === date) : all };
}

function addExpense(body) {
  const sheet = getOrCreateSheet(SHEET_NAMES.expenses, ['id','date','category','amount','note','timestamp']);
  sheet.appendRow([body.id || Date.now(), body.date, body.category, body.amount, body.note||'', new Date().toISOString()]);
  return { ok: true };
}

// ── Weekly history ────────────────────────────────────────────────────────────
function getHistory(goal) {
  const sheet = getOrCreateSheet(SHEET_NAMES.history, ['goal','weekKey','weekLabel','pct','value','target','summary']);
  const all   = sheetToObjects(sheet);
  return { history: goal ? all.filter(r => r.goal === goal) : all };
}

function saveWeekHistory(body) {
  const sheet = getOrCreateSheet(SHEET_NAMES.history, ['goal','weekKey','weekLabel','pct','value','target','summary']);
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === body.goal && data[i][1] === body.weekKey) {
      sheet.getRange(i+1, 4).setValue(body.pct);
      sheet.getRange(i+1, 5).setValue(body.value);
      sheet.getRange(i+1, 7).setValue(body.summary||'');
      return { ok: true, updated: true };
    }
  }
  sheet.appendRow([body.goal, body.weekKey, body.weekLabel, body.pct, body.value, body.target, body.summary||'']);
  return { ok: true, inserted: true };
}

function getWeekSummary(goal, weekKey) {
  const name = SHEET_NAMES[goal];
  if (!name) return { error: 'Unknown goal' };
  const sheet = getOrCreateSheet(name, ['date','weekKey','value','note','timestamp']);
  const all   = sheetToObjects(sheet).filter(r => r.weekKey === weekKey);
  return { rows: all, count: all.length };
}

// ── Reminders ─────────────────────────────────────────────────────────────────
function getReminders() {
  const sheet = getOrCreateSheet(SHEET_NAMES.reminders, ['id','goal','label','time','repeat']);
  return { reminders: sheetToObjects(sheet) };
}

function saveReminders(body) {
  const sheet = getOrCreateSheet(SHEET_NAMES.reminders, ['id','goal','label','time','repeat']);
  // Full replace
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  (body.reminders || []).forEach(r => {
    sheet.appendRow([r.id, r.goal, r.label, r.time, r.repeat]);
  });
  return { ok: true };
}
