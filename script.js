// ==========================================
// 1. NAVIGATION
// ==========================================
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    const targetSection = document.getElementById(id);
    if (targetSection) targetSection.classList.add('active');
}

// ==========================================
// 2. GESTION DES CONTACTS (LocalStorage)
// ==========================================
function addContact() {
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
        alert("Veuillez saisir un nom et un numéro valides.");
        return;
    }

    let contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
    contacts.push({ name, phone });
    localStorage.setItem('pims_contacts', JSON.stringify(contacts));
    
    nameInput.value = '';
    phoneInput.value = '';
    
    renderContacts();
}

function renderContacts() {
    const list = document.getElementById('contactList');
    if (!list) return;
    
    const contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
    
    if (contacts.length === 0) {
        list.innerHTML = `<p style="font-size:0.9em; color:#7f8c8d; italic">Aucun contact enregistré.</p>`;
        return;
    }

    list.innerHTML = contacts.map((c, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f4f4f4; padding: 8px; margin-bottom: 5px; border-radius: 4px;">
            <span style="color: #333;">👤 ${c.name} : <a href="tel:${c.phone}" style="color:#2980b9; font-weight:bold; text-decoration:none;">${c.phone}</a></span>
            <button onclick="deleteContact(${index})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;" aria-label="Supprimer">
                🗑️
            </button>
        </div>
    `).join('');
}

function deleteContact(index) {
    if (confirm("Supprimer ce contact de votre liste d'urgence ?")) {
        let contacts = JSON.parse(localStorage.getItem('pims_contacts') || '[]');
        contacts.splice(index, 1);
        localStorage.setItem('pims_contacts', JSON.stringify(contacts));
        renderContacts();
    }
}

// ==========================================
// 3. GÉOLOCALISATION & ALERTE SMS
// ==========================================
function sendSOS() {
    const zone = document.getElementById('zoneRegroup').value.trim() || "Non spécifié";
    const sosBtn = document.querySelector('.btn-sos');
    const originalText = sosBtn ? sosBtn.innerText : "SIGNALER MA POSITION (SMS)";

    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
        return;
    }

    // Feedback visuel pendant la recherche du signal GNSS
    if (sosBtn) {
        sosBtn.innerText = "⏳ RECHERCHE GPS EN COURS...";
        sosBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Correction de la syntaxe de l'URL Google Maps
            const msg = `PIMS ANTILLES - URGENCE : Je suis sain et sauf. Ma position : https://www.google.com/maps?q=${lat},${lon} (Point de RDV : ${zone})`;
            
            // Restauration du bouton
            if (sosBtn) {
                sosBtn.innerText = originalText;
                sosBtn.disabled = false;
            }

            // Ouverture de l'app SMS
            window.location.href = `sms:?body=${encodeURIComponent(msg)}`;
        },
        error => {
            if (sosBtn) {
                sosBtn.innerText = originalText;
                sosBtn.disabled = false;
            }
            alert("Localisation impossible. Vérifiez que votre GPS (GNSS) est activé et que l'application a l'autorisation d'y accéder.");
        },
        { enableHighAccuracy: true, timeout: 10000 } // Force la haute précision
    );
}

// ==========================================
// 4. INITIALISATION & SERVICE WORKER
// ==========================================
document.addEventListener('DOMContentLoaded', renderContacts);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker enregistré !', reg.scope))
            .catch(err => console.log('Échec enregistrement SW :', err));
    });
}