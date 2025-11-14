# 🛒 MODULE COMMANDES - Espace Gestionnaire

## 🎯 OBJECTIF

Permettre aux **gestionnaires** de gérer les commandes de leur entreprise.

**URL :** `/commandes`  
**Accès :** Tous les utilisateurs connectés (Gestionnaire, Caissier, Gérant)

---

## ✅ FONCTIONNALITÉS

### CRUD Complet

1. ✅ **Liste** des commandes de la société
2. ✅ **Recherche** (client, vendeur, statut)
3. ✅ **Créer** une nouvelle commande
4. ✅ **Modifier** une commande
5. ✅ **Supprimer** une commande

---

## 📋 FORMULAIRE COMMANDE

### Champs Obligatoires *

- **Client** - Dropdown avec liste des clients
- **Date de Commande** - Date et heure de la commande
- **Statut** - Dropdown avec statuts disponibles

### Statuts Disponibles

- 🟡 **En cours** (par défaut)
- 🔵 **Validée**
- 🟢 **Livrée**
- 🔴 **Annulée**

### Champs Automatiques

- **idUtilisateur** - Utilisateur connecté (vendeur)
- **dateCreation** - Date de création
- **dateLastModification** - Date de modification

---

## 📊 COLONNES DU TABLEAU

| Colonne | Description | Format |
|---------|-------------|--------|
| **N°** | Numéro commande | #1, #2, etc. |
| **Client** | Nom du client | Prénom Nom |
| **Vendeur** | Nom de l'utilisateur | Prénom Nom |
| **Date** | Date et heure | DD MMM YYYY HH:MM |
| **Statut** | État de la commande | Badge coloré |
| **Actions** | Modifier/Supprimer | Icônes |

---

## 🎨 INTERFACE

### Page Liste

```
╔══════════════════════════════════════════════════════╗
║  Gestion des Commandes       [➕ Nouvelle Commande]  ║
║  Commandes de votre entreprise                       ║
║  ──────────────────────────────────────────────      ║
║                                                      ║
║  N°  Client          Vendeur    Date      Statut    ║
║  ─────────────────────────────────────────────      ║
║  #1  OBED KANGUDJA   Jean M.    30 Oct    En cours  ║
║      [✏️] [🗑️]                                       ║
║                                                      ║
║  #2  OBED KANGUDJA   Jean M.    30 Oct    En cours  ║
║      [✏️] [🗑️]                                       ║
╚══════════════════════════════════════════════════════╝
```

### Modal

```
╔══════════════════════════════════╗
║  Nouvelle Commande         [X]   ║
╠══════════════════════════════════╣
║                                  ║
║  Client *                        ║
║  [Sélectionner un client ▼]     ║
║                                  ║
║  Date de Commande *   Statut *   ║
║  [Date+Heure]         [En cours] ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Enregistrer]     ║
╚══════════════════════════════════╝
```

---

## 🔌 API ENDPOINTS

| Action | Méthode | Endpoint | Description |
|--------|---------|----------|-------------|
| Lister | GET | `/api/Commande` | Toutes les commandes |
| Par ID | GET | `/api/Commande/{id}` | Une commande |
| Par Société | GET | `/api/Commande/societe/{id}` | Commandes d'une société |
| Rechercher | GET | `/api/Commande/search?idClient=&idUtilisateur=` | Recherche |
| Créer | POST | `/api/Commande` | Nouvelle commande |
| Modifier | PUT | `/api/Commande/{id}` | Modifier |
| Supprimer | DELETE | `/api/Commande/{id}` | Supprimer |

---

## 🏢 FILTRAGE PAR SOCIÉTÉ

### Gestionnaire

**Voit uniquement** les commandes de **sa société** :

```javascript
const societeId = userStore.societeId;
const commandes = await api.getCommandesBySociete(societeId);
```

---

## 📦 DONNÉES COMMANDES EXISTANTES

### 7 Commandes dans l'API

| ID | Client | Utilisateur | Date | Statut |
|----|--------|-------------|------|--------|
| 1 | Client 2 | User 2 | 30 Oct | En cours |
| 2 | Client 2 | User 2 | 30 Oct | En cours |
| 3 | Client 4 | User 2 | 30 Oct | En cours |
| 4 | Client 5 | User 2 | 31 Oct | En cours |
| 5 | Client 6 | User 2 | 31 Oct | En cours |
| 6 | Client 7 | User 1 | 31 Oct | En cours |
| 7 | Client 8 | User 1 | 31 Oct | En cours |

**Toutes** les commandes sont en statut "En cours"

---

## 🎨 BADGES PAR STATUT

| Statut | Couleur | Badge |
|--------|---------|-------|
| **En cours** | 🟡 Jaune | `bg-gradient-warning` |
| **Validée** | 🔵 Bleu | `bg-gradient-info` |
| **Livrée** | 🟢 Vert | `bg-gradient-success` |
| **Annulée** | 🔴 Rouge | `bg-gradient-danger` |

---

## 🔗 ENRICHISSEMENT DES DONNÉES

### Noms des Clients et Vendeurs

**Au chargement** :
```javascript
// Charger clients et utilisateurs
const [clients, users] = await Promise.all([
  api.getClients(),
  api.getUsers()
]);

// Créer maps pour matching
clientsMap[idClient] = "Prénom Nom";
usersMap[idUtilisateur] = "Prénom Nom";

// Enrichir chaque commande
commande.clientNom = clientsMap[commande.idClient];
commande.utilisateurNom = usersMap[commande.idUtilisateur];
```

**Résultat :**
- Affiche "OBED KANGUDJA" au lieu de "Client #2"
- Affiche "Jean MALONGA" au lieu de "User #2"

---

## 📁 FICHIERS CRÉÉS

### 1. Modal
✅ `src/components/modals/CommandeModal.vue`
- Dropdown Client (liste dynamique)
- Date et heure picker
- Dropdown Statut (4 choix)
- Taille md (520px)

### 2. Page Liste
✅ `src/views/Commandes.vue`
- DataTable avec 5 colonnes
- Enrichissement noms
- 2 actions par ligne

### 3. Configuration
✅ `src/config/api.js` - Endpoints commandes
✅ `src/services/api.service.js` - Fonctions CRUD
✅ `src/router/index.js` - Route `/commandes`
✅ `src/components/index.js` - Export CommandeModal
✅ `src/examples/Sidenav/SidenavList.vue` - Lien sidebar

### 4. Documentation
✅ `MODULE_COMMANDES_COMPLET.md` - Ce fichier

---

## 🎯 NAVIGATION SIDEBAR

### Section MON COMPTE

```
MON COMPTE
├── Dashboard 🏠
├── Profile 👤
├── Articles 📦
├── Clients 👥
├── Commandes 🛒 ← NOUVEAU !
└── Déconnexion 🚪
```

**Icône :** `ni ni-cart` (panier) en jaune

---

## 🧪 TESTER

### 1. Navigation

**Sidebar → Commandes** (icône panier 🛒 jaune)

### 2. Liste

Vous verrez les **7 commandes existantes** :
- Toutes en statut "En cours" (badge jaune)
- Noms des clients affichés
- Noms des vendeurs affichés
- Dates formatées

### 3. Créer une Commande

1. Cliquez "Nouvelle Commande"
2. Sélectionnez un client (dropdown)
3. Choisissez date et heure
4. Sélectionnez le statut
5. Enregistrez

### 4. Modifier une Commande

1. Cliquez sur ✏️ "Modifier"
2. Changez le statut (ex: "En cours" → "Validée")
3. Enregistrez
4. Badge change de couleur

---

## 🎊 RÉSUMÉ COMPLET DES MODULES

### Modules SuperAdmin

| Module | Status | Fonctionnalités |
|--------|--------|-----------------|
| **Sociétés** | ✅ 100% | CRUD + Logo + Toggle |
| **Sites** | ✅ 100% | CRUD + Toggle |
| **Utilisateurs** | ✅ 100% | CRUD + Photo + Toggle + Multi-rôles |

### Modules Gestionnaire

| Module | Status | Fonctionnalités |
|--------|--------|-----------------|
| **Articles** | ✅ 100% | CRUD + Toggle + TVA/Remise |
| **Clients** | ✅ 100% | CRUD + Toggle + Genre |
| **Commandes** | ✅ 100% | CRUD + Statuts + Enrichissement ⭐ |

---

## 🎉 MODULE COMMANDES TERMINÉ !

✅ **CRUD complet**  
✅ **DataTable** avec recherche  
✅ **Modal** avec dropdowns (Client, Statut)  
✅ **Date picker** (datetime-local)  
✅ **4 statuts** avec badges colorés  
✅ **Enrichissement** (noms clients et vendeurs)  
✅ **Filtrage par société** (gestionnaires)  
✅ **Route** protégée  
✅ **Lien sidebar** (icône panier 🛒)  
✅ **7 commandes** déjà en base  

**La page s'ouvrira automatiquement !** 🚀

