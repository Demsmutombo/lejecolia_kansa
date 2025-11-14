# 👥 MODULE CLIENTS - Espace Gestionnaire

## 🎯 OBJECTIF

Permettre aux **gestionnaires** de gérer les clients de leur entreprise.

**URL :** `/clients`  
**Accès :** Tous les utilisateurs connectés (Gestionnaire, Caissier, Gérant)

---

## ✅ FONCTIONNALITÉS

### CRUD Complet

1. ✅ **Liste** des clients
2. ✅ **Recherche** (nom, prénom, téléphone, email)
3. ✅ **Créer** un nouveau client
4. ✅ **Modifier** un client
5. ✅ **Activer/Désactiver** un client
6. ✅ **Supprimer** un client

---

## 📋 FORMULAIRE CLIENT

### Champs Obligatoires *

- **Nom** - Nom du client
- **Prénom** - Prénom du client
- **Téléphone** - Numéro de téléphone

### Champs Optionnels

**Identité :**
- Genre (dropdown: Masculin/Féminin/Non précisé)
- Pièce d'Identité (ex: Passeport, CNI...)

**Contact :**
- Email

**Adresse :**
- Province, Ville, Commune
- Quartier, Avenue, Numéro

**Statut :**
- Client actif (switch oui/non)

### Champs Automatiques

- **idSite** - Site du gestionnaire connecté
- **dateCreation** - Date de création
- **dateLastModification** - Date de modification

---

## 📊 COLONNES DU TABLEAU

| Colonne | Description | Format |
|---------|-------------|--------|
| **Client** | Nom Prénom + Téléphone | Texte + sous-texte |
| **Genre** | M/F/- | Badge bleu/rose/gris |
| **Email** | Email cliquable | Lien mailto: ou "-" |
| **Pièce ID** | N° pièce identité | Texte ou "-" |
| **Adresse** | Commune, Ville | Texte ou "-" |
| **Statut** | Actif/Inactif | Badge vert/gris |
| **Actions** | Toggle/Modifier/Supprimer | Icônes |

---

## 🎨 INTERFACE

### Page Liste

```
╔══════════════════════════════════════════════════════╗
║  Gestion des Clients             [➕ Nouveau Client] ║
║  Clients de votre entreprise                         ║
║  ──────────────────────────────────────────────      ║
║                                                      ║
║  [🔍 Rechercher...]                                  ║
║                                                      ║
║  Client           Genre  Email     Adresse           ║
║  ─────────────────────────────────────────────      ║
║  OBED KANGUDJA      M    -        -                 ║
║  📞 0986543456                                        ║
║  [🔄] [✏️] [🗑️]                                      ║
╚══════════════════════════════════════════════════════╝
```

### Modal

```
╔══════════════════════════════════╗
║  Nouveau Client            [X]   ║
╠══════════════════════════════════╣
║  ─── Identité ───                ║
║  Nom *          Prénom *         ║
║  [______]       [______]         ║
║                                  ║
║  Genre          Pièce ID         ║
║  [Select ▼]     [______]         ║
║                                  ║
║  ─── Contact ───                 ║
║  Téléphone *    Email            ║
║  [______]       [______]         ║
║                                  ║
║  ─── Adresse ───                 ║
║  Province  Ville    Commune      ║
║  [_____]   [_____]  [_____]      ║
║                                  ║
║  [☑ Client actif]                ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Enregistrer]     ║
╚══════════════════════════════════╝
```

---

## 🔌 API ENDPOINTS

| Action | Méthode | Endpoint | Description |
|--------|---------|----------|-------------|
| Lister | GET | `/api/Clients` | Tous les clients |
| Par ID | GET | `/api/Clients/{id}` | Un client |
| Rechercher | GET | `/api/Clients/search?nom=&email=` | Recherche |
| Créer | POST | `/api/Clients` | Nouveau client |
| Modifier | PUT | `/api/Clients/{id}` | Modifier |
| Supprimer | DELETE | `/api/Clients/{id}` | Supprimer |

---

## ⚠️ FORMAT API SPÉCIAL

### Création (POST)

**L'API demande les données encapsulées** :

```json
{
  "client": {
    "nom": "DUPONT",
    "prenom": "Jean",
    "telephone": "+243...",
    ...
  }
}
```

**Erreur si non encapsulé :**
```
400 Bad Request: "The client field is required."
```

**Solution appliquée :**
```javascript
const payload = { client: preparedData };
await apiClient.post('/api/Clients', payload);
```

### Modification (PUT)

**Format normal (non encapsulé)** :

```json
{
  "idClient": 1,
  "nom": "DUPONT",
  ...
}
```

---

## 👥 DONNÉES CLIENTS EXISTANTES

### 8 Clients dans l'API

| ID | Nom | Prénom | Téléphone | Site |
|----|-----|--------|-----------|------|
| 1 | OBED | KANGUDJA | 0986543456 | null |
| 2 | OBED | KANGUDJA | 0987654345 | null |
| 3 | OBED | KANGUDJA | 0987654345 | null |
| 4 | jean | malongi | 0813456787 | null |
| 5 | Client | Standard | Non renseigné | 1 |
| 6 | Client | Standard | Non renseigné | 1 |
| 7 | ABRAHAM | TENDAYO | 0898765434 | null |
| 8 | OBED | TENDAYO | 0823456789 | null |

**Notes :**
- Certains clients n'ont pas d'email
- Certains n'ont pas d'adresse
- idSite peut être null
- Genre = "Non précisé" par défaut

---

## 📁 FICHIERS CRÉÉS

### 1. Modal
✅ `src/components/modals/ClientModal.vue`
- Formulaire complet (13 champs)
- Dropdown Genre
- Validation
- Taille md (520px)

### 2. Page Liste
✅ `src/views/Clients.vue`
- DataTable avec 6 colonnes
- Recherche multi-champs
- 3 actions par ligne

### 3. Configuration
✅ `src/config/api.js` - Endpoints clients
✅ `src/services/api.service.js` - Fonctions CRUD
✅ `src/router/index.js` - Route `/clients`
✅ `src/components/index.js` - Export ClientModal
✅ `src/examples/Sidenav/SidenavList.vue` - Lien sidebar

### 4. Documentation
✅ `MODULE_CLIENTS_COMPLET.md` - Ce fichier

---

## 🎨 BADGES

### Genre

- 🔵 **M** (badge-info) - Masculin
- 🔴 **F** (badge-danger) - Féminin
- ⚪ **-** (badge-secondary) - Non précisé

### Statut

- 🟢 **Actif** (badge-success)
- ⚪ **Inactif** (badge-secondary)

---

## 🔄 ACTIONS

### 1. 🔄 **Toggle Statut**
- Active/Désactive le client
- Confirmation requise

### 2. ✏️ **Modifier**
- Ouvre le modal avec données pré-remplies
- Modification de tous les champs

### 3. 🗑️ **Supprimer**
- Confirmation requise
- Suppression définitive

---

## 🎯 NAVIGATION SIDEBAR

### Section MON COMPTE

```
MON COMPTE
├── Dashboard 🏠
├── Profile 👤
├── Articles 📦
├── Clients 👥 ← NOUVEAU !
└── Déconnexion 🚪
```

**Icône :** `ni ni-circle-08` (personne) en vert

---

## 🧪 TESTER

**La page sera ouverte automatiquement !**

### Vérifications

1. **Sidebar** :
   - Voir le lien "Clients" (icône 👥 verte)
   
2. **Page Liste** :
   - 8 clients affichés
   - Recherche fonctionne
   - Bouton "Nouveau Client"

3. **Créer un Client** :
   - Cliquez "Nouveau Client"
   - Remplissez Nom, Prénom, Téléphone
   - Enregistrez

4. **Console (F12)** :
   - Voir les logs de création
   - Vérifier le format `{ client: {...} }`

---

## 🎊 RÉSUMÉ DES MODULES

| Module | Status | Accès |
|--------|--------|-------|
| **Sociétés** | ✅ 100% | SuperAdmin |
| **Sites** | ✅ 100% | SuperAdmin |
| **Utilisateurs** | ✅ 100% | SuperAdmin |
| **Articles** | ✅ 100% | Gestionnaires |
| **Clients** | ✅ 100% | Gestionnaires ⭐ |

---

## 🎉 MODULE CLIENTS TERMINÉ !

✅ **CRUD complet**  
✅ **DataTable** avec recherche  
✅ **Modal** de création/modification  
✅ **Format API** correct (encapsulé pour POST)  
✅ **Route** protégée  
✅ **Lien sidebar**  
✅ **8 clients** déjà en base  

**Cliquez sur "Clients" dans la sidebar pour tester !** 🚀

