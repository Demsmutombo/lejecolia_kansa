# 📅 MODULE RÉSERVATIONS - Espace Gestionnaire

## 🎯 OBJECTIF

Permettre aux **gestionnaires** de gérer les réservations d'articles/chambres.

**URL :** `/reservations`  
**Accès :** Tous les utilisateurs connectés (Gestionnaire, Caissier, Gérant)

---

## ✅ FONCTIONNALITÉS

### CRUD Complet

1. ✅ **Liste** des réservations
2. ✅ **Recherche** (client, téléphone, article, statut)
3. ✅ **Créer** une nouvelle réservation
4. ✅ **Modifier** une réservation
5. ✅ **Supprimer** une réservation
6. ✅ **Calcul automatique** montant total
7. ✅ **Filtrage par société**

---

## 📋 FORMULAIRE RÉSERVATION

### Champs Obligatoires *

**Client :**
- **Nom Client** - Nom du client
- **Téléphone Client** - Téléphone

**Réservation :**
- **Article** - Dropdown avec articles disponibles
- **Quantité** - Nombre d'articles/chambres
- **Date Début** - Date et heure de début
- **Date Fin** - Date et heure de fin

### Champs Optionnels

**Client :**
- Adresse Client

**Détails :**
- Date Réservation (date de la réservation)
- Prix Unitaire (par jour/article)
- Montant Total (calculé automatiquement)
- Montant Avancé (acompte)
- Mode Paiement (Espèces, Carte, Virement, Mobile Money)
- Statut (En attente, Confirmée, En cours, Terminée, Annulée)
- Commentaire (notes)

### Champs Automatiques

- **dateCreation** - Date de création
- **dateLastModification** - Date de modification

---

## 📊 COLONNES DU TABLEAU

| Colonne | Description | Format |
|---------|-------------|--------|
| **N°** | Numéro réservation | #1, #2, etc. |
| **Client** | Nom + Téléphone | Nom (ligne 1), Tél (ligne 2) |
| **Article** | Article réservé | Nom article |
| **Période** | Dates début → fin | DD MMM → DD MMM |
| **Montant** | Montant total | $X,XXX.XX |
| **Avancé** | Montant avancé | $XXX.XX ou "-" |
| **Statut** | État réservation | Badge coloré |
| **Actions** | Modifier/Supprimer | Icônes |

---

## 🎨 INTERFACE

### Page Liste

```
╔══════════════════════════════════════════════════════╗
║  Gestion des Réservations  [➕ Nouvelle Réservation] ║
║  Réservations de votre entreprise                    ║
║  ──────────────────────────────────────────────      ║
║                                                      ║
║  [🔍 Rechercher...]                                  ║
║                                                      ║
║  N°  Client         Article    Période    Montant   ║
║  ─────────────────────────────────────────────      ║
║  (Aucune réservation pour l'instant)                 ║
╚══════════════════════════════════════════════════════╝
```

### Modal

```
╔══════════════════════════════════╗
║  Nouvelle Réservation      [X]   ║
╠══════════════════════════════════╣
║  ─── Client ───                  ║
║  Nom *          Téléphone *      ║
║  [______]       [______]         ║
║  Adresse                         ║
║  [___________________________]   ║
║                                  ║
║  ─── Détails Réservation ───     ║
║  Article *      Quantité *       ║
║  [Select ▼]     [1]              ║
║                                  ║
║  Date Début *   Date Fin *       ║
║  [DateTime]     [DateTime]       ║
║                                  ║
║  ─── Montants ───                ║
║  Prix Unit.     Montant Total    ║
║  [0.00]         [0.00] (auto)    ║
║                                  ║
║  Avancé         Mode Paiement    ║
║  [0.00]         [Select ▼]       ║
║                                  ║
║  Statut         Date Réservation ║
║  [En attente]   [DateTime]       ║
║                                  ║
║  Commentaire                     ║
║  [___________________________]   ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Enregistrer]     ║
╚══════════════════════════════════╝
```

---

## 🔌 API ENDPOINTS

| Action | Méthode | Endpoint | Description |
|--------|---------|----------|-------------|
| Lister | GET | `/api/Reservations` | Toutes |
| Par ID | GET | `/api/Reservations/{id}` | Une réservation |
| Par Société | GET | `/api/Reservations/societe/{id}` | D'une société |
| Rechercher | GET | `/api/Reservations/search` | Recherche |
| Créer | POST | `/api/Reservations` | Nouvelle |
| Modifier | PUT | `/api/Reservations/{id}` | Modifier |
| Supprimer | DELETE | `/api/Reservations/{id}` | Supprimer |

---

## 🎨 STATUTS ET BADGES

| Statut | Couleur | Badge | Utilisation |
|--------|---------|-------|-------------|
| **En attente** | 🟡 Jaune | `bg-gradient-warning` | Pas encore confirmée |
| **Confirmée** | 🔵 Bleu | `bg-gradient-info` | Confirmée par le client |
| **En cours** | 🟣 Violet | `bg-gradient-primary` | Client présent |
| **Terminée** | 🟢 Vert | `bg-gradient-success` | Client parti |
| **Annulée** | 🔴 Rouge | `bg-gradient-danger` | Annulée |

---

## 💰 CALCUL AUTOMATIQUE

### Montant Total

```javascript
montantTotal = prixUnitaire × quantite
```

**Le montant total se calcule automatiquement** quand vous modifiez :
- Prix unitaire
- Quantité

**Exemple :**
- Prix unitaire : 50.00 $ (par jour)
- Quantité : 3 jours
- **Montant total = 150.00 $** (calculé automatiquement)

### Montant Avancé (Acompte)

**Saisi manuellement**

**Exemple :**
- Montant total : 150.00 $
- Avancé : 50.00 $
- **Reste à payer : 100.00 $**

---

## 📁 FICHIERS CRÉÉS

### 1. Modal
✅ `src/components/modals/ReservationModal.vue`
- Formulaire complet (14 champs)
- Dropdown Article
- Dropdown Statut et Mode Paiement
- Date pickers (3)
- Calcul automatique montant
- Textarea commentaire

### 2. Page Liste
✅ `src/views/Reservations.vue`
- DataTable avec 7 colonnes
- Enrichissement noms articles
- 2 actions par ligne
- Filtrage par société

### 3. Page Détails Commande
✅ `src/views/CommandeDetail.vue`
- Informations commande
- Tableau lignes commande
- Calculs totaux

### 4. Configuration
✅ `src/config/api.js` - Endpoints réservations
✅ `src/services/api.service.js` - Fonctions CRUD
✅ `src/router/index.js` - Route `/reservations` + `/commandes/:id`
✅ `src/components/index.js` - Export ReservationModal
✅ `src/examples/Sidenav/SidenavList.vue` - Lien sidebar

### 5. Documentation
✅ `MODULE_RESERVATIONS_COMPLET.md` - Ce fichier
✅ `MODULE_LIGNES_COMMANDE.md` - Détails commandes

---

## 🎯 NAVIGATION SIDEBAR

### Section MON COMPTE (Complète)

```
MON COMPTE
├── Dashboard 🏠
├── Profile 👤
├── Articles 📦
├── Clients 👥
├── Commandes 🛒
├── Réservations 📅 ← NOUVEAU !
└── Déconnexion 🚪
```

**Icône :** `ni ni-calendar-grid-58` (calendrier) en rouge

---

## 🧪 TESTER

### 1. Navigation

**Sidebar → Réservations** (icône calendrier 📅 rouge)

### 2. Liste

**Actuellement : 0 réservations**

Liste vide avec message : "Aucune réservation trouvée"

### 3. Créer une Réservation

1. Cliquez "Nouvelle Réservation"
2. Remplissez :
   - Nom client : "Jean DUPONT"
   - Téléphone : "+243 123 456 789"
   - Article : Sélectionnez un article
   - Quantité : 3
   - Date début : Choisissez
   - Date fin : Choisissez
   - Prix unitaire : 50.00
   - → Montant total calculé automatiquement : 150.00 $
3. Enregistrez

### 4. Vérifier

- ✅ Réservation créée
- ✅ Affichée dans la liste
- ✅ Badge "En attente"
- ✅ Période affichée
- ✅ Montant formaté en USD

---

## 🎊 APPLICATION FINALE

### 7 MODULES COMPLETS !

**SuperAdmin :**
1. ✅ Sociétés (5)
2. ✅ Sites (5)
3. ✅ Utilisateurs (3)

**Gestionnaire :**
4. ✅ Articles (2)
5. ✅ Clients (8)
6. ✅ Commandes (7) + Détails
7. ✅ **Réservations** (0) ⭐

### 8 APIs Configurées

✅ Sociétés, Sites, Utilisateurs, Rôles, Articles, Clients, Commandes, **Réservations**

(+ LignesCommande pour détails)

---

## 🎉 MODULE RÉSERVATIONS TERMINÉ !

✅ **CRUD complet**  
✅ **DataTable** avec recherche  
✅ **Modal** avec 14 champs  
✅ **Dropdown Article** dynamique  
✅ **3 date pickers** (Début, Fin, Réservation)  
✅ **Calcul automatique** montant total  
✅ **5 statuts** avec badges colorés  
✅ **4 modes de paiement**  
✅ **Commentaire** (textarea)  
✅ **Filtrage par société**  
✅ **Route** protégée  
✅ **Lien sidebar** (icône calendrier 📅)  

**La page s'ouvrira automatiquement !** 📅🚀

