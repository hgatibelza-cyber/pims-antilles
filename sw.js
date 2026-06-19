const CACHE_NAME = 'pims-antilles-v1.4'; // Pense à changer cette version à chaque mise à jour !

// Liste complète des fichiers indispensables au fonctionnement 100% hors-ligne
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json?v=2',
    './icons/icon-512x512.png?v=2',
    './PIMS%20Antilles%20-%20Guide%20Utilisateur.pdf',
    './PIMS%20Antilles%20-%20Fiche%20Mémo.pdf'
];

// 1. INSTALLATION : Mise en cache des ressources d'urgence
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Pré-mise en cache des ressources d\'urgence réussie.');
                return cache.addAll(ASSETS);
            })
            // Suppression de self.skipWaiting() ici pour permettre la détection de la mise à jour par l'infobulle
    );
});

// 2. ACTIVATION : Nettoyage automatique des anciens caches obsolètes
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Prend immédiatement le contrôle des pages ouvertes
    );
});

// 3. INTERCEPTION DES REQUÊTES : Mode hors-ligne prioritaire (Cache-First)
self.addEventListener('fetch', e => {
    if (!e.request.url.startsWith(self.location.origin)) {
        return; 
    }

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(e.request).catch(() => {
                console.log('Ressource indisponible hors-ligne :', e.request.url);
            });
        })
    );
});

// 4. ÉCOUTE DU SIGNAL DE MISE À JOUR FORCEE
// Reçoit le message envoyé en arrière-plan lorsque l'utilisateur valide
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});