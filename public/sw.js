const CACHE_NAME = 'selah-v11';

// Install
self.addEventListener('install', () => { self.skipWaiting(); });

// Activate — clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, cache only icons
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('api.anthropic.com')) return;
  if (event.request.url.includes('/api/')) return;
  const shouldCache = event.request.url.includes('icon-') || event.request.url.includes('manifest.json');
  if (shouldCache) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
  }
});

// Listen for schedule message from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_VERSES') {
    scheduleVerseNotifications();
  }
  if (event.data && event.data.type === 'SCHEDULE_RECAP') {
    scheduleSundayRecap();
  }
});

// Schedule Sunday 6pm weekly recap notification
function scheduleSundayRecap() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const sunday6pm = new Date(now);

  if (dayOfWeek === 0 && now.getHours() < 18) {
    // It's Sunday but before 6pm
    sunday6pm.setHours(18, 0, 0, 0);
  } else if (dayOfWeek === 0 && now.getHours() >= 18) {
    // It's Sunday after 6pm — schedule for next Sunday
    sunday6pm.setDate(sunday6pm.getDate() + 7);
    sunday6pm.setHours(18, 0, 0, 0);
  } else {
    // Not Sunday — calculate next Sunday
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    sunday6pm.setDate(sunday6pm.getDate() + daysUntilSunday);
    sunday6pm.setHours(18, 0, 0, 0);
  }

  const delay = sunday6pm - now;
  if (delay > 0) {
    setTimeout(() => {
      self.registration.showNotification('Selah — Your Weekly Recap 📊', {
        body: 'Your week in review is ready. See how you showed up this week.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'selah-recap-' + sunday6pm.toISOString().split('T')[0],
        data: { url: '/' }
      });
    }, delay);
  }
}

// Schedule morning (8am) and afternoon (2pm) — Proverbs 27:17
function scheduleVerseNotifications() {
  const now = new Date();
  const morning = new Date(now); morning.setHours(8, 0, 0, 0);
  const afternoon = new Date(now); afternoon.setHours(16, 0, 0, 0);
  const dayKey = now.toISOString().split('T')[0];

  if (now < morning) {
    setTimeout(() => {
      self.registration.showNotification('Selah — Morning Anchor ✦', {
        body: 'Proverbs 27:17\n"As iron sharpens iron, so one person sharpens another."',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'selah-morning-' + dayKey,
        data: { url: '/' }
      });
    }, morning - now);
  }

  if (now < afternoon) {
    setTimeout(() => {
      self.registration.showNotification('Selah — Afternoon Anchor ✦', {
        body: 'Proverbs 27:17\n"As iron sharpens iron, so one person sharpens another."',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'selah-afternoon-' + dayKey,
        data: { url: '/' }
      });
    }, afternoon - now);
  }
}

// Open app on notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes(self.location.origin) && 'focus' in c) return c.focus();
      }
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});

