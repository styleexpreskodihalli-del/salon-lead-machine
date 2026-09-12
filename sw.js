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
    data: { url: data.url || '/acquisition-command-center.html', phone: data.phone || '' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const d = event.notification.data || {};
  const target = d.phone ? `https://wa.me/${String(d.phone).replace(/\D/g,'')}` : d.url;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow(target);
  }));
});
