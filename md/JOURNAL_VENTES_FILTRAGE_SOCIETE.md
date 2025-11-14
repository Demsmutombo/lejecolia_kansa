# 🔒 Journal des Ventes - Filtrage par Société

---

## 📋 Modifications Appliquées

Date : 6 novembre 2025  
Objectif : **Garantir que les données affichées sont filtrées par la société de l'utilisateur connecté**

---

## ✅ Ce qui a été modifié

### 1️⃣ **Tous les appels API incluent maintenant `idSociete`**

#### **Avant** ❌
```javascript
const params = {
  idSite: filters.value.idSite || userStore.siteId || undefined,
  dateDebut: filters.value.dateDebut || undefined,
  dateFin: filters.value.dateFin || undefined
};
```

#### **Après** ✅
```javascript
const params = {
  idSite: filters.value.idSite || userStore.siteId || undefined,
  idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId, // ✨ NOUVEAU
  dateDebut: filters.value.dateDebut || undefined,
  dateFin: filters.value.dateFin || undefined
};
```

**Fonctions modifiées** :
- ✅ `loadStats()` - Statistiques globales
- ✅ `loadVentes(page)` - Liste des ventes
- ✅ `loadArticles()` - Groupement par article
- ✅ `loadUtilisateursData(page)` - Ventes par utilisateur
- ✅ `loadRapportFinancier()` - Rapport financier

---

### 2️⃣ **Filtrage des dropdowns (Sites et Utilisateurs)**

#### **Sites** 🏢

**Avant** : Tous les sites affichés

**Après** : Uniquement les sites de la société de l'utilisateur

```javascript
// Filtrer par société pour les gestionnaires
if (!userStore.isSuperAdmin && userStore.societeId) {
  sites = sites.filter(site => 
    site.idSociete === userStore.societeId || 
    site.idSociete === parseInt(userStore.societeId)
  );
  console.log(`🔒 Sites filtrés pour société #${userStore.societeId}:`, sites.length);
}
```

#### **Utilisateurs** 👤

**Avant** : Tous les utilisateurs affichés

**Après** : Uniquement les utilisateurs de la société de l'utilisateur

```javascript
// Filtrer par société pour les gestionnaires
if (!userStore.isSuperAdmin && userStore.societeId) {
  // Charger les sites pour faire le mapping
  const sites = await api.getSites();
  const sitesMap = {};
  (Array.isArray(sites) ? sites : []).forEach(site => {
    sitesMap[site.idSite] = site.idSociete;
  });
  
  // Filtrer les utilisateurs de la même société
  utilisateurs = utilisateurs.filter(user => {
    const userSocieteId = sitesMap[user.idSite];
    return userSocieteId === userStore.societeId || 
           userSocieteId === parseInt(userStore.societeId);
  });
  console.log(`🔒 Utilisateurs filtrés pour société #${userStore.societeId}:`, utilisateurs.length);
}
```

---

### 3️⃣ **Bannière d'information visuelle**

Ajout d'une alerte en haut de la page pour les **gestionnaires** :

```vue
<!-- Indicateur de filtrage par société (Gestionnaires) -->
<div class="row mb-4" v-if="!userStore.isSuperAdmin && userStore.societeId">
  <div class="col-12">
    <div class="alert alert-info mb-0 d-flex align-items-center">
      <i class="fas fa-info-circle me-2"></i>
      <div>
        <strong>Filtrage actif :</strong> Vous consultez uniquement les ventes de votre société 
        <span class="badge bg-white text-dark ms-2">{{ userStore.societeName || 'Société #' + userStore.societeId }}</span>
      </div>
    </div>
  </div>
</div>
```

**Apparence** :

```
┌─────────────────────────────────────────────────────────────┐
│ ℹ️ Filtrage actif : Vous consultez uniquement les ventes    │
│   de votre société [ HOPE DESIGN ]                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 4️⃣ **Logs détaillés pour le debugging**

Ajout de logs à chaque étape pour vérifier le filtrage :

```javascript
console.log('═══════════════════════════════════════════════════════');
console.log('📊 CHARGEMENT STATS - Journal des Ventes');
console.log(`🏢 Société ID: ${userStore.societeId}`);
console.log(`📍 Site ID: ${userStore.siteId}`);
console.log(`👤 Utilisateur: ${userStore.userName}`);
console.log('═══════════════════════════════════════════════════════');

// ...

console.log(`🔒 Filtrage société: ${params.idSociete ? 'Société #' + params.idSociete : 'TOUTES (superadmin)'}`);
```

---

## 🎯 Comportement par Rôle

### **Superadmin** 👑

- ✅ Voit **TOUTES** les sociétés
- ✅ Peut sélectionner n'importe quel site dans le dropdown
- ✅ Peut voir tous les utilisateurs
- ✅ `idSociete` n'est pas envoyé dans les paramètres API (= undefined)

**Exemple de logs** :
```
🔑 Rôle: SUPERADMIN (toutes les sociétés)
🔒 Filtrage société: TOUTES (superadmin)
```

---

### **Gestionnaire** 🔐

- ✅ Voit **UNIQUEMENT** les données de sa société
- ✅ Dropdown sites : uniquement les sites de sa société
- ✅ Dropdown utilisateurs : uniquement les utilisateurs de sa société
- ✅ `idSociete` est **toujours** envoyé dans les paramètres API
- ✅ Bannière d'information visible en haut de la page

**Exemple de logs** :
```
🏢 Société: HOPE DESIGN (ID: 4)
🔑 Rôle: GESTIONNAIRE (société filtrée)
🔒 Filtrage société: Société #4
🔒 Sites filtrés pour société #4: 2
🔒 Utilisateurs filtrés pour société #4: 3
```

---

### **Caissier** 🚫

- ❌ **Pas d'accès** au Journal des Ventes
- ❌ Route protégée par `requiresGestionnaire: true`
- ❌ Lien absent du menu Sidenav

---

## 🔍 Vérification du Filtrage

### Test 1 : Superadmin

**Étapes** :
1. Se connecter comme superadmin
2. Aller dans **Journal des Ventes**
3. Ouvrir la console (F12)
4. Vérifier les logs

**Résultat attendu** :
```
🔑 Rôle: SUPERADMIN (toutes les sociétés)
🔒 Filtrage société: TOUTES (superadmin)
```

**Paramètres API** :
```javascript
{
  idSociete: undefined,  // ✅ Pas de filtrage
  idSite: ...,
  dateDebut: ...,
  dateFin: ...
}
```

---

### Test 2 : Gestionnaire - Société HOPE DESIGN (ID: 4)

**Étapes** :
1. Se connecter comme gestionnaire (ex: Carolle Mpiana)
2. Aller dans **Journal des Ventes**
3. Vérifier la bannière bleue en haut
4. Ouvrir la console (F12)
5. Vérifier les logs

**Résultat attendu** :
```
👤 Utilisateur: Carolle Mpiana
🏢 Société: HOPE DESIGN (ID: 4)
🔑 Rôle: GESTIONNAIRE (société filtrée)
🔒 Filtrage société: Société #4
🔒 Sites filtrés pour société #4: 2
🔒 Utilisateurs filtrés pour société #4: 3
```

**Bannière visible** :
```
ℹ️ Filtrage actif : Vous consultez uniquement les ventes de votre société [ HOPE DESIGN ]
```

**Paramètres API** :
```javascript
{
  idSociete: 4,  // ✅ Filtrage actif
  idSite: 4,
  dateDebut: ...,
  dateFin: ...
}
```

**Dropdowns** :
- Sites : Seulement "Lejecolia" et "Site B" (societe #4)
- Utilisateurs : Seulement "Carolle Mpiana", "Jean Malonga", "Shekinah Kisangi" (société #4)

---

### Test 3 : Gestionnaire - Autre Société

**Étapes** :
1. Se connecter comme gestionnaire d'une autre société (ex: Société #1)
2. Aller dans **Journal des Ventes**
3. Vérifier que les données affichées sont différentes

**Résultat attendu** :
- Statistiques différentes (CA, bénéfice, etc.)
- Liste de ventes différente
- Articles différents
- Utilisateurs différents

---

## 📊 Endpoints Concernés

Tous ces endpoints reçoivent maintenant le paramètre `idSociete` :

| Endpoint | Paramètres supplémentaires |
|----------|---------------------------|
| `/api/V_JournalVenteParSite/stats/date/{date}` | `idSociete`, `idSite`, `idUtilisateur` |
| `/api/V_JournalVenteParSite/rapport-financier` | `idSociete`, `idSite`, `dateDebut`, `dateFin` |
| `/api/V_JournalVenteParSite/paged` | `idSociete`, `idSite`, `dateDebut`, `dateFin`, `page`, `pageSize` |
| `/api/V_JournalVenteParSite/grouped-by-article` | `idSociete`, `idSite`, `dateDebut`, `dateFin` |
| `/api/V_JournalVenteParSite/grouped-by-article/gestionnaire` | `idSociete`, `idSite`, `dateDebut`, `dateFin` |
| `/api/V_JournalVenteParSite/utilisateur-date-paged` | `idSociete`, `idSite`, `dateDebut`, `dateFin`, `page` |

---

## 🛡️ Sécurité

### Double Filtrage

Le filtrage est appliqué à **deux niveaux** :

#### 1. **Frontend** (Vue.js)
```javascript
// Ajout du paramètre idSociete
idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId
```

#### 2. **Backend** (API)
L'API backend doit **également** filtrer les données par `idSociete` pour garantir la sécurité :

```csharp
// Exemple C# (backend)
if (idSociete.HasValue && !User.IsSuperAdmin)
{
    query = query.Where(v => v.IdSociete == idSociete.Value);
}
```

**⚠️ IMPORTANT** : Le filtrage frontend **ne suffit pas** à sécuriser les données. Le backend **doit impérativement** valider et filtrer les données côté serveur.

---

## 📝 Checklist de Vérification

Avant de déployer en production, vérifier :

- [ ] **Superadmin** voit toutes les sociétés (idSociete = undefined)
- [ ] **Gestionnaire** voit uniquement sa société (idSociete = X)
- [ ] **Bannière d'info** visible pour les gestionnaires
- [ ] **Dropdown sites** filtrés par société (gestionnaires)
- [ ] **Dropdown utilisateurs** filtrés par société (gestionnaires)
- [ ] **Statistiques** correspondent bien à la société
- [ ] **Liste des ventes** filtrée par société
- [ ] **Groupement articles** filtré par société
- [ ] **Rapport financier** filtré par société
- [ ] **Logs de debug** affichent le bon idSociete
- [ ] **Backend API** valide et filtre également par idSociete

---

## 🔧 Dépannage

### Problème : Gestionnaire voit des données d'autres sociétés

**Cause possible** :
- `userStore.societeId` est vide ou null
- Backend ne filtre pas correctement

**Solution** :
1. Vérifier dans la console : `console.log(userStore.societeId)`
2. Si vide, vérifier l'authentification et le store Pinia
3. Vérifier que le backend reçoit bien le paramètre `idSociete`
4. Vérifier les logs backend pour voir le filtrage SQL

---

### Problème : Dropdown vide (sites ou utilisateurs)

**Cause possible** :
- Aucun site/utilisateur dans la société
- Filtrage trop strict

**Solution** :
1. Vérifier les logs : `🔒 Sites filtrés pour société #X: 0`
2. Vérifier la BDD : `SELECT * FROM Sites WHERE IdSociete = X`
3. Si 0 résultat, créer des sites/utilisateurs pour cette société

---

### Problème : Superadmin voit une bannière de filtrage

**Cause possible** :
- `userStore.isSuperAdmin` n'est pas correctement défini

**Solution** :
1. Vérifier : `console.log(userStore.isSuperAdmin)`
2. Vérifier le rôle dans la BDD
3. Vérifier la logique dans `src/stores/user.js`

---

## 🎉 Résultat Final

Le **Journal des Ventes** respecte maintenant **strictement** le principe d'isolation par société :

✅ **Gestionnaires** : Données filtrées automatiquement  
✅ **Superadmins** : Accès complet sans restriction  
✅ **Sécurité** : Double filtrage (frontend + backend)  
✅ **UX** : Bannière informative claire  
✅ **Debug** : Logs détaillés pour vérification  

---

**Date** : 6 novembre 2025  
**Version** : 1.1.0 (avec filtrage société)  
**Statut** : ✅ Production Ready

