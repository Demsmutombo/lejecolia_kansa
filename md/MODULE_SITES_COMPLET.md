# 📍 MODULE SITES - Complet

## ✅ MODULE CRÉÉ

Le module de gestion des **Sites** est maintenant opérationnel, avec le même pattern que les Sociétés !

**URL :** `/sites`  
**Accès :** SuperAdmin uniquement

---

## 🎯 FONCTIONNALITÉS

### CRUD Complet

1. ✅ **Liste des sites** avec DataTable
2. ✅ **Recherche** multi-champs en temps réel
3. ✅ **Créer** un nouveau site
4. ✅ **Modifier** un site existant
5. ✅ **Activer/Désactiver** un site
6. ✅ **Supprimer** un site
7. ✅ **Voir** les détails d'un site

---

## 📊 STRUCTURE D'UN SITE

### Champs Obligatoires *

- ✅ **nomSite** - Nom du site
- ✅ **contact** - Numéro de téléphone
- ✅ **idSociete** - Société parente (dropdown)

### Champs Optionnels

- Province
- Ville
- Commune
- Quartier
- Avenue
- Numéro
- Statut (actif/inactif)

### Champs Système

- idSite (généré automatiquement)
- dateCreation (généré automatiquement)
- dateLastModification (généré automatiquement)

---

## 🔌 API ENDPOINTS

| Action | Méthode | Endpoint | Paramètres |
|--------|---------|----------|------------|
| **Lister** | GET | `/api/Sites` | - |
| **Par ID** | GET | `/api/Sites/{id}` | id |
| **Par Société** | GET | `/api/Sites/societe/{id}` | societeId |
| **Rechercher** | GET | `/api/Sites/search?nom=...` | nom |
| **Créer** | POST | `/api/Sites` | Body: site data |
| **Modifier** | PUT | `/api/Sites/{id}` | id + Body |
| **Supprimer** | DELETE | `/api/Sites/{id}` | id |

---

## 📋 FORMAT API

### Réponse GET (Liste)

```json
[
  {
    "idSite": "1",
    "nomSite": "HOPE DESIGN SERVICES",
    "contact": "+24389900876",
    "idSociete": "1",
    "province": "KINSSHASA",
    "ville": "KINSHASA",
    "commune": "LEMBA",
    "quartier": "LIVULU",
    "avenue": "ELIMO SANTU",
    "numero": "50",
    "dateCreation": "2025-10-30T10:20:00.391",
    "dateLastModification": "2025-10-30T10:20:00.391",
    "statut": true
  }
]
```

### Requête POST (Création)

```json
{
  "nomSite": "Boutique Centre-Ville",
  "contact": "+243 123 456 789",
  "idSociete": 2,
  "province": "Kinshasa",
  "ville": "Kinshasa",
  "commune": "Gombe",
  "quartier": "Centre-Ville",
  "avenue": "Avenue Kasa-Vubu",
  "numero": "12",
  "statut": true,
  "dateCreation": "2025-11-01T22:00:00.000Z"
}
```

---

## 🎨 INTERFACE

### Page Liste (`/sites`)

```
╔══════════════════════════════════════════════╗
║  Gestion des Sites          [➕ Nouveau]    ║
║  ────────────────────────────────────        ║
║                                              ║
║  [🔍 Rechercher...]                          ║
║                                              ║
║  Site              Contact      Société     ║
║  ─────────────────────────────────────      ║
║  HOPE DESIGN       +243...      Société X   ║
║  Avenue ELIMO...                            ║
║  [👁️] [🔄] [✏️] [🗑️]                       ║
║                                              ║
║  Kansa Mombongo    +243...      Société Y   ║
║  Avenue Kasa-Vubu                           ║
║  [👁️] [🔄] [✏️] [🗑️]                       ║
╚══════════════════════════════════════════════╝
```

### Modal Création/Modification

```
╔══════════════════════════════════╗
║  Nouveau Site              [X]   ║
╠══════════════════════════════════╣
║                                  ║
║  Nom du Site *                   ║
║  [_____________________]         ║
║                                  ║
║  Contact *         Société *     ║
║  [__________]      [Select ▼]    ║
║                                  ║
║  ─── Adresse ───                 ║
║  Province  Ville     Commune     ║
║  [______]  [______]  [______]    ║
║                                  ║
║  Quartier  Avenue    Numéro      ║
║  [______]  [______]  [______]    ║
║                                  ║
║  [☑️ Site actif]                  ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Créer]           ║
╚══════════════════════════════════╝
```

---

## 🎯 ACTIONS DISPONIBLES

### 1. **👁️ Voir** (Noir)
- Affiche les détails du site
- Redirection vers `/sites/{id}`

### 2. **🔄 Toggle Statut** (Vert/Gris)
- **Si actif** → "Désactiver" (vert)
- **Si inactif** → "Activer" (gris)
- Change uniquement le statut
- **Ne supprime pas le site**

### 3. **✏️ Modifier** (Gris)
- Ouvre le modal avec données pré-remplies
- Modification complète

### 4. **🗑️ Supprimer** (Rouge)
- Confirmation requise
- Suppression définitive

---

## 🏗️ FICHIERS CRÉÉS

### 1. ✅ `src/views/Sites.vue`
- Liste des sites avec DataTable
- Recherche multi-champs
- Actions CRUD
- Toggle statut

### 2. ✅ `src/views/SiteDetail.vue`
- Page de détails d'un site
- Affichage toutes informations
- Lien vers la société parente

### 3. ✅ `src/components/modals/SiteModal.vue`
- Formulaire de création/modification
- Dropdown des sociétés
- Validation des champs
- Switch actif/inactif

### 4. ✅ `src/services/api.service.js` (mis à jour)
- `getSites()`
- `getSiteById(id)`
- `getSitesBySociete(societeId)`
- `searchSites(nom)`
- `createSite(data)`
- `updateSite(id, data)`
- `deleteSite(id)`
- `prepareSiteData()`

### 5. ✅ `src/config/api.js` (mis à jour)
- Endpoints Sites ajoutés

### 6. ✅ `src/router/index.js` (mis à jour)
- Route `/sites`
- Route `/sites/:id`

### 7. ✅ `src/examples/Sidenav/SidenavList.vue` (mis à jour)
- Lien "Sites" dans la sidebar (SuperAdmin)

### 8. ✅ `src/components/index.js` (mis à jour)
- Export SiteModal

---

## 🎨 CARACTÉRISTIQUES

### Dropdown Sociétés

Le modal charge automatiquement la liste des sociétés pour le dropdown :

```vue
<argon-select
  v-model="formData.idSociete"
  :options="societes"
  placeholder="Sélectionner une société"
/>
```

**Options :**
```javascript
[
  { value: 1, label: "cadolux" },
  { value: 2, label: "Hotel Palace" },
  ...
]
```

### Affichage Société dans le Tableau

La colonne "Société" affiche le nom de la société au lieu de l'ID :

```
Société
cadolux  ← Nom chargé automatiquement
```

### Lien vers la Société

Dans la page de détails, le nom de la société est cliquable :

```vue
<router-link :to="`/societes/${site.idSociete}`">
  {{ site.societeName }} 🔗
</router-link>
```

---

## 🔄 FLUX COMPLET

### Créer un Site

```
1. Page /sites
   ↓
2. Clic "Nouveau Site"
   ↓
3. Modal s'ouvre
   ↓
4. Chargement des sociétés dans le dropdown
   ↓
5. Remplissage du formulaire:
   - Nom: "Boutique Centre"
   - Contact: "+243 123 456"
   - Société: "cadolux" (dropdown)
   - Adresse: Province, Ville, etc.
   ↓
6. Clic "Créer"
   ↓
7. POST /api/Sites
   ↓
8. Message: "Créé avec succès"
   ↓
9. Modal se ferme
   ↓
10. Liste rafraîchie avec le nouveau site
```

---

## 🧪 TESTER MAINTENANT

### 1. Accéder à la Page

1. **Rechargez** la page
2. **Regardez la sidebar** → Vous verrez "Sites" 📍
3. **Cliquez** sur "Sites"
4. **Page `/sites`** s'ouvre

### 2. Voir la Liste

Vous verrez les 2 sites existants :
- HOPE DESIGN SERVICES
- Kansa Mombongo

### 3. Créer un Site

1. **Cliquez** "Nouveau Site"
2. **Remplissez** :
   - Nom: "Test Site"
   - Contact: "+243 999 888"
   - Société: Sélectionnez dans le dropdown
3. **Cliquez** "Créer"

### 4. Modifier un Site

1. **Cliquez** ✏️ sur un site
2. **Modifiez** les champs
3. **Sauvegardez**

### 5. Toggle Statut

1. **Cliquez** 🔄 "Désactiver"
2. **Confirmez**
3. **Badge** devient "Inactif" ⚫
4. **Re-cliquez** 🔄 "Activer"
5. **Badge** redevient "Actif" 🟢

---

## 📍 NAVIGATION

### Sidebar (SuperAdmin)

```
ADMINISTRATION
├── Sociétés 🏢
├── Sites 📍 ← NOUVEAU !
└── Utilisateurs 👥
```

### URLs

- `/sites` - Liste
- `/sites/1` - Détails du site 1
- `/sites/2` - Détails du site 2

---

## 🎊 RÉSULTAT

**MODULE SITES 100% OPÉRATIONNEL !**

✅ **CRUD complet** (Create, Read, Update, Delete)  
✅ **DataTable** avec recherche et pagination  
✅ **Modal** de création/modification  
✅ **Dropdown sociétés** dynamique  
✅ **Toggle statut** (activer/désactiver)  
✅ **Page de détails** complète  
✅ **Lien** vers la société parente  
✅ **Routes** protégées (SuperAdmin)  
✅ **Sidebar** mise à jour  
✅ **Format API** correct (camelCase)  

---

## 📁 FICHIERS CRÉÉS (8)

1. ✅ `src/views/Sites.vue`
2. ✅ `src/views/SiteDetail.vue`
3. ✅ `src/components/modals/SiteModal.vue`
4. ✅ `MODULE_SITES_COMPLET.md`
5. ✅ Configuration API (mis à jour)
6. ✅ Services API (mis à jour)
7. ✅ Routes (mis à jour)
8. ✅ Sidebar (mis à jour)

---

## 🚀 ACCÈS RAPIDE

**Dans la sidebar SuperAdmin :**

```
ADMINISTRATION
├── Sociétés
├── Sites ← Cliquez ici !
└── Utilisateurs
```

**Ou URL directe :**
```
http://localhost:6600/sites
```

---

## 📊 DONNÉES DISPONIBLES

Vous avez actuellement **2 sites** dans l'API :

1. **HOPE DESIGN SERVICES**
   - Contact: +24389900876
   - Adresse: N° 50, Avenue ELIMO SANTU, LIVULU, LEMBA, KINSHASA
   - Statut: Actif

2. **Kansa Mombongo**
   - Contact: +243 000 000 000
   - Adresse: N° 1, Avenue Kasa-Vubu, Centre-Ville, Gombe, Kinshasa
   - Statut: Actif

---

## 🎯 PROCHAINES ÉTAPES

Vous pouvez maintenant :

1. ✅ **Consulter** la liste des sites
2. ✅ **Créer** de nouveaux sites
3. ✅ **Modifier** les sites existants
4. ✅ **Activer/Désactiver** des sites
5. ✅ **Voir** les détails de chaque site
6. ✅ **Naviguer** entre sites et sociétés

---

**🎉 LE MODULE SITES EST PRÊT !**

**Cliquez sur "Sites" dans la sidebar pour commencer !** 🚀

