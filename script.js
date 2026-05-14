// Navigation simple
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Gestion des contacts (LocalStorage pour le mode Hors-ligne)
function addContact() {
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const name = nameInput.value;
    const phone = phoneInput.value;

    if(name && phone) {
        let contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
        contacts.push({name, phone});
        localStorage.setItem('pims_contacts', JSON.stringify(contacts));
        
        // Réinitialisation des champs après ajout
        nameInput.value = '';
        phoneInput.value = '';
        
        renderContacts();
    }
}

// Rendu de la liste avec bouton de suppression (Corbeille)
function renderContacts() {
    const list = document.getElementById('contactList');
    const contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
    
    // On utilise map avec l'index pour savoir quel élément supprimer
    list.innerHTML = contacts.map((c, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f4f4f4; padding: 8px; margin-bottom: 5px; border-radius: 4px;">
            <span>👤 ${c.name} : <strong>${c.phone}</strong></span>
            <button onclick="deleteContact(${index})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">
                🗑️
            </button>
        </div>
    `).join('');
}

// Fonction pour supprimer un contact spécifique
function deleteContact(index) {
    if (confirm("Supprimer ce contact de votre liste d'urgence ?")) {
        let contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
        contacts.splice(index, 1); // Supprime 1 élément à l'indice 'index'
        localStorage.setItem('pims_contacts', JSON.stringify(contacts));
        renderContacts(); // Actualise l'affichage
    }
}

// Géolocalisation et envoi SMS
function sendSOS() {
    const zone = document.getElementById('zoneRegroup').value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const msg = `PIMS ANTILLES: Je suis en sécurité. Ma position: https://www.google.com/maps?q=${lat},${lon}. Point de regroupement: ${zone}`;
            
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