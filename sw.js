self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title = data.title || '🔔 STall — New Qualified Lead';
  const options = {
    body: data.body || 'A new qualified salon lead is ready.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'stall-qualified-lead',
    renotify: true,
    data: {
      url: data.url || '/acquisition-command-center.html',
      phone: data.phone || ''
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const d = event.notification.data || {};
  const phone = String(d.phone || '').replace(/\D/g, '');
  const target = phone
    ? `https://wa.me/${phone}`
    : (d.url || '/acquisition-command-center.html');

  event.waitUntil((async () => {
    // A lead notification with a phone number should always open WhatsApp directly.
    if (phone) return clients.openWindow(target);

    // Otherwise focus an existing dashboard, or open it if none is available.
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of list) {
      if ('focus' in client) return client.focus();
    }
    return clients.openWindow(target);
  })());
});
