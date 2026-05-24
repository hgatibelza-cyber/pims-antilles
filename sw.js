const CACHE_NAME = 'pims-antilles-v1.3.1';

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

// 1. INSTALLATION : Mise en cache de toutes les ressources indispensables
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Pré-mise en cache des ressources d\'urgence réussie.');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting()) // Force le SW à s'activer immédiatement sans attendre la fermeture des onglets
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
    // Optionnel : Ne pas intercepter les requêtes de tracking Vercel ou externes
    if (!e.request.url.startsWith(self.location.origin)) {
        return; 
    }

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            // Si le fichier est dans le cache, on le retourne instantanément (idéal hors-ligne)
            if (cachedResponse) {
                return cachedResponse;
            }
            // Sinon, on va le chercher sur le réseau
            return fetch(e.request).catch(() => {
                // Si le réseau échoue et que c'est une page HTML demandée, on peut gérer
                console.log('Ressource indisponible hors-ligne :', e.request.url);
            });
        })
    );
});