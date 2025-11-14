# 👥 MODULE UTILISATEURS - En cours

## ✅ CONFIGURATION API TERMINÉE

### Endpoints Ajoutés

```javascript
// Dans src/config/api.js
USERS: '/api/Utilisateurs',
USER_BY_ID: (id) => `/api/Utilisateurs/${id}`,
USERS_SEARCH: '/api/Utilisateurs/search',
USER_CHANGE_PASSWORD: (id) => `/api/Utilisateurs/${id}/change-password`,
USER_TOGGLE_STATUS: (id) => `/api/Utilisateurs/${id}/statut`,
```

### Services API Créés

```javascript
// Dans src/services/api.service.js

// CRUD de base (déjà existants)
- getUsers()
- getUserById(id)
- createUser(userData)      // Override avec prepareUserData
- updateUser(id, userData)  // Override avec prepareUserData
- deleteUser(id)

// Fonctions spécifiques
- searchUsers(nom)
- changeUserPassword(id, currentPassword, newPassword, confirmNewPassword)
- toggleUserStatus(id, statut)
- prepareUserData(data, isUpdate)  // Fonction helper
```

---

## 📋 STRUCTURE D'UN UTILISATEUR

### Champs Obligatoires *

- **nomUtilisateur** - Nom
- **prenomUtilisateur** - Prénom
- **login** - Identifiant de connexion
- **motDePasse** - Mot de passe
- **email** - Email
- **numeroTelephone** - Téléphone
- **idSite** - Site (dropdown)
- **idRole** - Rôle (dropdown)

### Champs Optionnels

- postNomUtilisateur - Post-nom
- sexe - Sexe (dropdown: M/F/Autre)
- dateNaissance - Date de naissance
- photo - Photo (base64, upload)
- province, ville, commune, quartier, avenue, numero
- statut - Actif/Inactif
- isConnected - Connecté actuellement

### Champs Système

- idUtilisateur (généré auto)
- dateCreation (généré auto)
- dateLastModification (généré auto)

---

## 📊 DONNÉES DISPONIBLES

L'API contient actuellement **5 utilisateurs** :

1. **MUDISI ESPOIR JEAN**
   - Login: espoir
   - Role: ID 1
   - Site: ID 1
   - Email: johnespoir@gmail.com
   - Tél: +243812009007

2. **MALONGA JEAN**
   - Login: jean
   - Role: ID 3
   - Site: ID 1
   - Email: eljean.jm@gmail.com

3. **NGIELE KISANGI SHEKINAH**
   - Login: glory
   - Role: ID 3
   - Site: ID 1
   - Email: Glory@gmail.com
   - Photo: Oui (base64)

4. **Super-Admin System Administrator**
   - Login: Super-Admin
   - Role: ID 4
   - Site: ID 2
   - Email: superadmin@kansamombongo.com

5. **Admin System Administrator**
   - Login: Admin
   - Role: ID 5
   - Site: ID 2
   - Email: admin@kansamombongo.com

---

## 🚧 À CRÉER (Suite du travail)

### 1. Modal UtilisateurModal.vue

**Champs du formulaire :**
- Nom, Post-nom, Prénom
- Sexe (dropdown: Masculin/Féminin/Autre)
- Date de naissance (date picker)
- Téléphone, Email
- Login, Mot de passe
- Site (dropdown des sites)
- Rôle (dropdown des rôles)
- Photo (upload avec compression)
- Adresse complète
- Statut actif/inactif

### 2. Page Utilisateurs.vue

**Fonctionnalités :**
- Liste avec DataTable
- Colonnes: Photo, Nom complet, Email, Tél, Site, Rôle, Statut
- Recherche multi-champs
- Actions: Voir, Toggle Statut, Modifier, Supprimer
- Bouton "Nouvel Utilisateur"

### 3. Page UtilisateurDetail.vue

**Sections :**
- Header avec photo et nom complet
- Informations personnelles
- Contact (email, téléphone)
- Connexion (login, rôle, site)
- Adresse
- Dates (création, modification)
- Badge "Connecté" si isConnected = true

### 4. Routes

```javascript
// Dans src/router/index.js
{
  path: "/utilisateurs",
  name: "Utilisateurs",
  component: () => import("../views/Utilisateurs.vue"),
  meta: { requiresAuth: true, requiresSuperAdmin: true }
},
{
  path: "/utilisateurs/:id",
  name: "UtilisateurDetail",
  component: () => import("../views/UtilisateurDetail.vue"),
  meta: { requiresAuth: true, requiresSuperAdmin: true }
}
```

### 5. Sidebar

**Lien déjà existant !** ✅

Le lien "Utilisateurs" existe déjà dans la sidebar SuperAdmin.

---

## 🎯 FONCTIONNALITÉS SPÉCIALES

### 1. Toggle Statut

Endpoint spécial : `PUT /api/Utilisateurs/{id}/statut`

```javascript
// Envoie juste le boolean
await api.toggleUserStatus(userId, true);  // Activer
await api.toggleUserStatus(userId, false); // Désactiver
```

### 2. Changement de Mot de Passe

Endpoint: `PUT /api/Utilisateurs/{id}/change-password`

```javascript
await api.changeUserPassword(userId, {
  currentPassword: "ancien",
  newPassword: "nouveau",
  confirmNewPassword: "nouveau"
});
```

### 3. Photo Utilisateur

- Upload comme le logo des sociétés
- Compression automatique 300x300
- Format JPEG 80%
- Stockage en base64

### 4. Badge "Connecté"

Si `isConnected: true`, afficher un badge vert "En ligne"

---

## 📡 FORMAT API

### GET /api/Utilisateurs (Réponse)

```json
[
  {
    "idUtilisateur": "1",
    "nomUtilisateur": "MUDISI",
    "postNomUtilisateur": "ESPOIR",
    "prenomUtilisateur": "JEAN",
    "sexe": "M",
    "dateNaissance": "2002-10-30T10:22:58.936",
    "numeroTelephone": "+243812009007",
    "email": "johnespoir@gmail.com",
    "login": "espoir",
    "motDePasse": "123456",
    "photo": null,
    "isConnected": true,
    "idSite": "1",
    "idRole": "1",
    "province": "KINSHASA",
    "ville": "KINSHASA",
    "commune": "LEMBA",
    "quartier": "RIGHINI",
    "avenue": "UNIVERSITE",
    "numero": "210",
    "dateCreation": "2025-10-30T10:22:58.936",
    "dateLastModification": "2025-10-30T10:22:58.936",
    "statut": true
  }
]
```

### POST /api/Utilisateurs (Requête)

```json
{
  "nomUtilisateur": "DOE",
  "postNomUtilisateur": "MARIE",
  "prenomUtilisateur": "JANE",
  "sexe": "Féminin",
  "dateNaissance": "1995-05-15T00:00:00Z",
  "numeroTelephone": "+243 999 888 777",
  "email": "jane.doe@example.com",
  "login": "jane.doe",
  "motDePasse": "password123",
  "photo": null,
  "isConnected": false,
  "idSite": 2,
  "idRole": 3,
  "province": "Kinshasa",
  "ville": "Kinshasa",
  "commune": "Gombe",
  "statut": true,
  "dateCreation": "2025-11-01T22:00:00.000Z"
}
```

---

## 🎨 INTERFACE (Aperçu)

### Page Liste

```
╔══════════════════════════════════════════════╗
║  Gestion des Utilisateurs   [➕ Nouveau]    ║
║  ────────────────────────────────────        ║
║                                              ║
║  Photo  Nom            Email      Site      ║
║  ─────────────────────────────────────      ║
║  [📷]   MUDISI Espoir  john@...   Site 1    ║
║         Login: espoir  +243...    Rôle: 1   ║
║         [🟢 En ligne]  [👁️] [🔄] [✏️] [🗑️] ║
╚══════════════════════════════════════════════╝
```

### Modal

```
╔══════════════════════════════════╗
║  Nouvel Utilisateur        [X]   ║
╠══════════════════════════════════╣
║                                  ║
║  [Photo 70x70]  [Upload]         ║
║                                  ║
║  Nom *        Post-nom   Prénom *║
║  [______]     [______]   [_____] ║
║                                  ║
║  Sexe         Date Naissance     ║
║  [Select ▼]   [Date]             ║
║                                  ║
║  Email *            Téléphone *  ║
║  [____________]     [__________] ║
║                                  ║
║  Login *            Mot passe *  ║
║  [____________]     [__________] ║
║                                  ║
║  Site *             Rôle *       ║
║  [Select ▼]         [Select ▼]   ║
║                                  ║
║  ─── Adresse ───                 ║
║  Province  Ville    Commune      ║
║  [______]  [_____]  [______]     ║
║                                  ║
║  [☑️ Utilisateur actif]           ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Créer]           ║
╚══════════════════════════════════╝
```

---

## ⚠️ PARTICULARITÉS

### Nom Complet

Afficher : `nomUtilisateur + postNomUtilisateur + prenomUtilisateur`

Exemple : **MUDISI ESPOIR JEAN**

### Sexe (Dropdown)

Options :
- Masculin (M)
- Féminin (F)
- Autre

### Date de Naissance

Utiliser `<input type="date">` ou un date picker

### Photo

Upload avec compression (comme le logo des sociétés)

### isConnected

Badge "🟢 En ligne" si connecté

### Mot de Passe

- Ne jamais afficher en clair
- Input type="password"
- Pour modification : Option "Changer mot de passe" séparée

---

## 🎊 PROCHAINE ÉTAPE

**Créer les fichiers :**

1. `src/components/modals/UtilisateurModal.vue`
2. `src/views/Utilisateurs.vue`
3. `src/views/UtilisateurDetail.vue`

**Confirmez pour que je continue la création du module !** 🚀

---

**Les services API sont déjà prêts et configurés !** ✅

