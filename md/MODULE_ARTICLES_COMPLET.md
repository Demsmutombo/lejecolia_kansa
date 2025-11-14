# 📦 MODULE ARTICLES - Espace Gestionnaire

## 🎯 OBJECTIF

Permettre aux **gestionnaires** de gérer les articles et produits de **leur société**.

**URL :** `/articles`  
**Accès :** Tous les utilisateurs connectés (Gestionnaire, Caissier, Gérant)

---

## ✅ FONCTIONNALITÉS

### CRUD Complet

1. ✅ **Liste** des articles de la société
2. ✅ **Recherche** (libellé, code barre)
3. ✅ **Créer** un nouvel article
4. ✅ **Modifier** un article
5. ✅ **Activer/Désactiver** un article
6. ✅ **Supprimer** un article

---

## 📋 FORMULAIRE ARTICLE

### Champs Obligatoires *

- **Libellé** - Nom de l'article (ex: "CONCEPTION LOGO")

### Champs Optionnels

- **TVA** - Pourcentage de TVA (décimal: 0.00%)
- **Remise** - Pourcentage de remise (décimal: 0.00%)
- **Code Barre / QR** - Code barre ou QR de l'article
- **Périssable** - Article périssable (switch oui/non)
- **Avec Stock** - Gestion du stock (switch oui/non)
- **Statut** - Actif/Inactif

### Champs Automatiques

- **idSociete** - Société du gestionnaire connecté
- **dateCreation** - Date de création
- **dateLastModification** - Date de modification

---

## 📊 COLONNES DU TABLEAU

| Colonne | Description | Format |
|---------|-------------|--------|
| **Article** | Libellé en gras | Texte |
| **TVA** | Pourcentage TVA | 0.00% |
| **Remise** | Pourcentage remise | 0.00% |
| **Code Barre** | Code barre/QR | Texte ou "-" |
| **Périssable** | Oui/Non | Badge jaune/gris |
| **Stock** | Oui/Non | Badge bleu/gris |
| **Statut** | Actif/Inactif | Badge vert/gris |
| **Actions** | Toggle/Modifier/Supprimer | Icônes |

---

## 🎨 INTERFACE

### Page Liste

```
╔══════════════════════════════════════════════════════╗
║  Gestion des Articles            [➕ Nouvel Article] ║
║  Articles et produits de votre société               ║
║  ──────────────────────────────────────────────      ║
║                                                      ║
║  [🔍 Rechercher...]                                  ║
║                                                      ║
║  Article         TVA    Remise  Périss. Stock       ║
║  ─────────────────────────────────────────────      ║
║  CONCEPTION LOGO 0.00%  0.00%   Non     Non         ║
║  [🔄] [✏️] [🗑️]                                      ║
║                                                      ║
║  FARDE CHEMISE   0.00%  0.00%   Non     Oui         ║
║  [🔄] [✏️] [🗑️]                                      ║
╚══════════════════════════════════════════════════════╝
```

### Modal

```
╔══════════════════════════════════╗
║  Nouvel Article            [X]   ║
╠══════════════════════════════════╣
║                                  ║
║  Libellé *                       ║
║  [___________________________]   ║
║                                  ║
║  TVA (%)        Remise (%)       ║
║  [______]       [______]         ║
║                                  ║
║  Code Barre / QR                 ║
║  [___________________________]   ║
║                                  ║
║  [☑ Périssable]                  ║
║  [☑ Avec Stock]                  ║
║  [☑ Actif]                       ║
║                                  ║
╠══════════════════════════════════╣
║  [Annuler]  [✓ Enregistrer]     ║
╚══════════════════════════════════╝
```

---

## 🔌 API ENDPOINTS

| Action | Méthode | Endpoint | Description |
|--------|---------|----------|-------------|
| Lister tous | GET | `/api/Articles` | Tous les articles |
| Par ID | GET | `/api/Articles/{id}` | Un article |
| Par Société | GET | `/api/Articles/societe/{idSociete}` | Articles d'une société |
| Créer | POST | `/api/Articles` | Nouvel article |
| Modifier | PUT | `/api/Articles/{id}` | Modifier |
| Supprimer | DELETE | `/api/Articles/{id}` | Supprimer |

---

## 🏢 FILTRAGE PAR SOCIÉTÉ

### Gestionnaire

**Voit uniquement** les articles de **sa société** :

```javascript
const societeId = userStore.societeId; // ID de sa société
const articles = await api.getArticlesBySociete(societeId);
```

**Exemple :**
- Gestionnaire de la société ID=1
- Voit articles avec `idSociete: 1`
- Ne voit PAS les articles des autres sociétés

### SuperAdmin

**Peut voir** :
- Tous les articles (via `/api/Articles`)
- ou Articles d'une société spécifique

---

## 📦 DONNÉES ARTICLES

### Schéma

```json
{
  "idArticle": 1,
  "libelle": "CONCEPTION LOGO",
  "tva": 0.00,
  "remise": 0.00,
  "codeBarreQR": null,
  "idSociete": 1,
  "perissable": false,
  "withStock": false,
  "statut": true,
  "dateCreation": "2025-10-30T10:21:21.31",
  "dateLastModification": "2025-10-30T10:21:21.31"
}
```

### Types de Champs

- `idArticle`: number
- `libelle`: string
- `tva`: decimal (0.00)
- `remise`: decimal (0.00)
- `codeBarreQR`: string (peut être null)
- `idSociete`: number
- `perissable`: boolean
- `withStock`: boolean
- `statut`: boolean
- `dateCreation`: datetime
- `dateLastModification`: datetime

---

## 🎨 BADGES

### Périssable

- 🟡 **Oui** (badge-warning) - Article périssable
- ⚪ **Non** (badge-secondary) - Article non périssable

### Avec Stock

- 🔵 **Oui** (badge-info) - Stock géré
- ⚪ **Non** (badge-secondary) - Pas de stock

### Statut

- 🟢 **Actif** (badge-success) - Article actif
- ⚪ **Inactif** (badge-secondary) - Article désactivé

---

## 📁 FICHIERS CRÉÉS

### 1. Configuration
- `src/config/api.js` - Endpoints articles

### 2. API Service
- `src/services/api.service.js` - Fonctions CRUD articles

### 3. Modal
- `src/components/modals/ArticleModal.vue` - Formulaire création/modification

### 4. Pages
- `src/views/Articles.vue` - Liste des articles avec DataTable

### 5. Router
- `src/router/index.js` - Route `/articles`

### 6. Navigation
- `src/examples/Sidenav/SidenavList.vue` - Lien "Articles"

### 7. Export
- `src/components/index.js` - Export ArticleModal

### 8. Documentation
- `MODULE_ARTICLES_COMPLET.md` - Ce fichier

---

## 🔄 ACTIONS DISPONIBLES

### 1. 🔄 **Toggle Statut** (Vert/Gris)
- **Si actif** → "Désactiver" (vert)
- **Si inactif** → "Activer" (gris)
- Change le statut sans supprimer

### 2. ✏️ **Modifier** (Gris)
- Ouvre le modal avec données pré-remplies
- Modification de tous les champs

### 3. 🗑️ **Supprimer** (Rouge)
- Confirmation requise
- Suppression définitive

---

## 🧪 TESTER

### 1. Navigation

**Sidebar → Articles** (nouvelle icône 📦)

### 2. Liste

Vous verrez les articles de **votre société** uniquement :
- CONCEPTION LOGO (Société 1)
- FARDE CHEMISE (Société 1)

### 3. Créer un Article

1. Cliquez "Nouvel Article"
2. Remplissez le libellé
3. Définissez TVA/Remise (optionnel)
4. Cochez Périssable/Stock (optionnel)
5. Enregistrez

### 4. Modifier un Article

1. Cliquez sur ✏️ "Modifier"
2. Changez les valeurs
3. Enregistrez

### 5. Toggle Statut

1. Cliquez sur 🔄 "Activer" ou "Désactiver"
2. Confirmez
3. Le statut change

---

## 🎯 NAVIGATION SIDEBAR

### Gestionnaires (Caissier, Gérant)

```
MON COMPTE
├── Dashboard 🏠
├── Profile 👤
├── Articles 📦 ← NOUVEAU !
└── Déconnexion 🚪
```

### SuperAdmin

```
ADMINISTRATION
├── Sociétés 🏢
├── Sites 📍
└── Utilisateurs 👥

MON COMPTE
├── Dashboard 🏠
├── Profile 👤
├── Articles 📦 ← NOUVEAU !
└── Déconnexion 🚪
```

---

## 🔒 SÉCURITÉ

### Filtrage Société

```javascript
// Gestionnaire voit SEULEMENT ses articles
const articles = await api.getArticlesBySociete(userStore.societeId);
```

**Garanties :**
- ✅ Gestionnaire voit uniquement les articles de sa société
- ✅ Ne peut pas créer d'articles pour d'autres sociétés
- ✅ idSociete automatiquement défini

---

## 📊 EXEMPLE DE DONNÉES

### Société 1 (HOPE DESIGN SERVICES)

**2 articles :**

| ID | Libellé | TVA | Remise | Stock | Statut |
|----|---------|-----|--------|-------|--------|
| 1 | CONCEPTION LOGO | 0% | 0% | Non | Actif |
| 2 | FARDE CHEMISE | 0% | 0% | Oui | Actif |

### Société 2 (Kansa Mombongo)

**0 articles** (pour l'instant)

---

## 🎊 RÉSULTAT FINAL

**MODULE ARTICLES 100% OPÉRATIONNEL !**

✅ **CRUD complet** (Create, Read, Update, Delete)  
✅ **DataTable** avec recherche et pagination  
✅ **Modal** de création/modification  
✅ **Filtrage par société** (gestionnaires)  
✅ **Toggle statut** (activer/désactiver)  
✅ **3 switches** (Périssable, Stock, Statut)  
✅ **Route** protégée (auth requise)  
✅ **Lien sidebar** visible pour tous  
✅ **Format API** correct (camelCase)  
✅ **Gestion décimaux** (TVA, Remise)  

---

## 🚀 CLIQUEZ SUR "ARTICLES" DANS LA SIDEBAR !

**Le module est prêt à être testé !** 📦🎉

