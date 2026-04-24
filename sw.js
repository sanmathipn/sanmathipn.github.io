const CACHE = 'stride-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) {
        if (c.url.includes('index.html') || c.url.endsWith('/')) { c.focus(); return; }
      }
      return clients.openWindow('/');
    })
  );
});

const timers = {};
const GOAL_NAMES = { workout:'Workout', reading:'Read a book', mom:'Call mom', bills:'Bill payments', tech:'Learn tech', expenses:'Daily expenses', custom:'Reminder' };
const GOAL_ICONS = { workout:'💪', reading:'📖', mom:'📞', bills:'💳', tech:'💻', expenses:'💰', custom:'✨' };
const REPEAT_DAYS = { daily:[0,1,2,3,4,5,6], weekdays:[1,2,3,4,5], weekends:[0,6], sunday:[0], monday:[1] };
const BODIES = {
  workout:  "15 mins today keeps your streak alive. Let's go!",
  reading:  "Log today's pages and keep your reading streak going.",
  mom:      "Time to call mom. She'll love hearing from you.",
  bills:    "Review your bills and mark what's been paid.",
  tech:     "Log what you learned today. Every hour counts!",
  expenses: "Take 2 mins to log today's spending.",
};

function msUntilNext(hour, min, days) {
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(hour, min, 0, 0);
    if (d > now && days.includes(d.getDay())) return d - now;
  }
  return 24 * 60 * 60 * 1000;
}

function fireNotification(r) {
  const icon = GOAL_ICONS[r.goal] || '🎯';
  self.registration.showNotification(icon + ' ' + r.label, {
    body: BODIES[r.goal] || r.label,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: r.id,
    renotify: true,
    vibrate: [200, 100, 200],
  });
}

function scheduleOne(r) {
  if (timers[r.id]) { clearTimeout(timers[r.id]); delete timers[r.id]; }
  const [hour, min] = r.time.split(':').map(Number);
  const days = REPEAT_DAYS[r.repeat] || REPEAT_DAYS.daily;
  const delay = msUntilNext(hour, min, days);
  timers[r.id] = setTimeout(() => { fireNotification(r); scheduleOne(r); }, delay);
}

function scheduleAll(reminders) {
  const newIds = new Set(reminders.map(r => r.id));
  Object.keys(timers).forEach(id => { if (!newIds.has(id)) { clearTimeout(timers[id]); delete timers[id]; } });
  reminders.forEach(r => scheduleOne(r));
}

self.addEventListener('message', e => {
  if (e.data?.type === 'SET_REMINDERS') scheduleAll(e.data.reminders || []);
});
