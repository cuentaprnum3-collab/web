// Service worker minimo de ReadTrack UTS.
// Su unico propósito es habilitar registration.showNotification(), que es
// obligatorio en Chrome para Android (el constructor new Notification()
// directo esta bloqueado ahi con "Illegal constructor"). No cachea nada
// ni intercepta peticiones de red: no cambia el comportamiento normal de
// la app, solo permite mostrar notificaciones locales disparadas por la
// propia pagina mientras esta abierta.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
      return null;
    })
  );
});