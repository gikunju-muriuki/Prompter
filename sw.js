const CACHE_NAME = 'blog-god-prompt-cache-v5';
let savedCryptoSelection = '';

// Handle UI caching & background state preservation tasks
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Listen to messaging communications from script.js
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SAVE_SELECTION') {
        savedCryptoSelection = event.data.coin;
    }
});

// Automatically push state configuration back to the window context upon refresh cycles
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate' && savedCryptoSelection) {
        event.waitUntil(
            self.clients.matchAll().then((allClients) => {
                allClients.forEach((client) => {
                    client.postMessage({
                        type: 'RESTORE_SELECTION',
                        coin: savedCryptoSelection
                    });
                });
            })
        );
    }
});
