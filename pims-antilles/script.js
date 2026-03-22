// Navigation simple
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Gestion des contacts (LocalStorage pour le mode Hors-ligne)
function addContact() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    if(name && phone) {
        let contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
        contacts.push({name, phone});
        localStorage.setItem('pims_contacts', JSON.stringify(contacts));
        renderContacts();
    }
}

function renderContacts() {
    const list = document.getElementById('contactList');
    const contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
    list.innerHTML = contacts.map(c => `<p>👤 ${c.name} : <strong>${c.phone}</strong></p>`).join('');
}

// Géolocalisation et envoi SMS
function sendSOS() {
    const zone = document.getElementById('zoneRegroup').value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const msg = `PIMS ANTILLES: Je suis en sécurité. Ma position: https://maps.google.com/?q=${lat},${lon}. Point de regroupement: ${zone}`;
            
            // Ouvre l'application SMS par défaut
            window.location.href = `sms:?body=${encodeURIComponent(msg)}`;
        }, () => {
            alert("Localisation impossible. Vérifiez vos paramètres GNSS.");
        });
    }
}

// Initialisation au chargement
window.onload = renderContacts;

// Enregistrement du Service Worker pour le offline
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}