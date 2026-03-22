# 📍 PIMS Antilles (Position & Information Management System)

PIMS Antilles est une **Progressive Web App (PWA)** légère et sécurisée, conçue pour la navigation et la sécurité en mer dans la zone Antilles. Elle permet de consulter sa position GPS en temps réel et de la transmettre rapidement par SMS, même avec une connexion internet limitée.

## 🚀 Fonctionnalités Clés

* **Géolocalisation Précise :** Affichage des coordonnées (Latitude/Longitude) via l'API GNSS.
* **Mode Hors-Ligne (Offline) :** Grâce au Service Worker (`sw.js`), l'app reste accessible sans réseau.
* **Alerte SMS :** Bouton de partage rapide de la position pour prévenir les proches ou les secours.
* **Sécurité :** Déploiement obligatoire en HTTPS (via Vercel) pour l'accès au GPS.

## 🛠️ Structure du Projet

- `index.html` : Interface utilisateur.
- `style.css` : Design responsive mobile.
- `script.js` : Logique GPS et gestion des événements.
- `sw.js` : Gestion du cache pour le mode hors-ligne.
- `manifest.json` : Configuration pour l'installation sur smartphone.

## 📦 Déploiement

L'application est configurée pour être hébergée sur **Vercel**. 
> **Note :** Le HTTPS est activé par défaut sur Vercel, ce qui est indispensable au bon fonctionnement du GPS.

---
*Développé pour la communauté nautique antillaise.*