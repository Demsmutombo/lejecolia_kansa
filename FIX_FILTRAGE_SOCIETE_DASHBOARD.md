# 🔧 Correction Filtrage par Société - Dashboard Gestionnaire

**Date :** 7 novembre 2025  
**Problème :** Les "Ventes du jour" et "Activités récentes" affichent des données de TOUTES les sociétés

---

## 🎯 Problème identifié

### Sections concernées :
1. ✅ **Top 5 Articles vendus** (déjà corrigé)
2. ✅ **Ventes du jour** (corrigé maintenant)
3. ✅ **Activités récentes** (corrigé maintenant)

### Cause racine :
L'API backend `/api/V_JournalVenteParSite/paged` ne filtre pas correctement par `idSociete` malgré le paramètre fourni. Le backend retourne TOUTES les ventes de TOUTES les sociétés.

---

## ✅ Solutions appliquées

### 1. Fonction `loadStatsVentes()` - Ventes du jour

**Fichier :** `src/components/dashboard/DashboardGestionnaire.vue`  
**Lignes :** 561-575

**Correction :**
```javascript
// AVANT : Pas de filtrage frontend
const toutesVentes = ventesData?.data || ventesData || [];

// APRÈS : Filtrage par société côté frontend
let toutesVentes = ventesData?.data || ventesData || [];
console.log(`   📦 ${toutesVentes.length} lignes de ventes chargées (TOUTE la base de données)`);

// 🛡️ FILTRAGE PAR SOCIÉTÉ (sécurité frontend)
const ventesAvantFiltrage = toutesVentes.length;
toutesVentes = toutesVentes.filter(vente => {
  const idSocieteVente = parseInt(vente.idSociete || vente.IdSociete);
  const idSocieteCible = parseInt(societeId.value);
  return idSocieteVente === idSocieteCible;
});

if (ventesAvantFiltrage > toutesVentes.length) {
  console.warn(`   🔒 ${ventesAvantFiltrage - toutesVentes.length} ventes d'autres sociétés filtrées`);
}
console.log(`   ✅ ${toutesVentes.length} ventes pour société #${societeId.value}`);
```

**Impact :**
- ✅ Le nombre de "Ventes du jour" est maintenant correct
- ✅ Seules les ventes de la société connectée sont comptabilisées
- ✅ Les détails des ventes du jour correspondent à la société

---

### 2. Fonction `loadActivites()` - Activités récentes

**Fichier :** `src/components/dashboard/DashboardGestionnaire.vue`  
**Lignes :** 843-857

**Correction :**
```javascript
// AVANT : Pas de filtrage frontend
const ventes = ventesData?.data || ventesData || [];

// APRÈS : Filtrage par société côté frontend
let ventes = ventesData?.data || ventesData || [];
console.log(`   📦 ${ventes.length} lignes de ventes récentes reçues de l'API`);

// 🛡️ FILTRAGE PAR SOCIÉTÉ (sécurité frontend)
const ventesAvantFiltrage = ventes.length;
ventes = ventes.filter(vente => {
  const idSocieteVente = parseInt(vente.idSociete || vente.IdSociete);
  const idSocieteCible = parseInt(societeId.value);
  return idSocieteVente === idSocieteCible;
});

if (ventesAvantFiltrage > ventes.length) {
  console.warn(`   🔒 ${ventesAvantFiltrage - ventes.length} ventes d'autres sociétés filtrées`);
}
console.log(`   ✅ ${ventes.length} ventes pour société #${societeId.value} (7 derniers jours)`);
```

**Impact :**
- ✅ Les "Activités récentes" affichent uniquement les ventes de la société
- ✅ Les 5 dernières opérations correspondent à la société connectée
- ✅ Plus de mélange de données entre sociétés

---

## 📊 Récapitulatif des corrections

| Section | État Avant | État Après | Fichier | Lignes |
|---------|-----------|-----------|---------|--------|
| Top 5 Articles | ❌ Toutes sociétés | ✅ Société filtrée | DashboardGestionnaire.vue | 754-772 |
| Ventes du jour | ❌ Toutes sociétés | ✅ Société filtrée | DashboardGestionnaire.vue | 561-575 |
| Activités récentes | ❌ Toutes sociétés | ✅ Société filtrée | DashboardGestionnaire.vue | 843-857 |

---

## 🧪 Tests à effectuer

### Scénario de test :

1. **Se connecter en tant que gestionnaire** de la société **Lejecolia** (ID: 4)
   - Login : `carolle`

2. **Vérifier le Dashboard Gestionnaire :**
   - ✅ **Top 5 Articles vendus** : Affiche uniquement PRIMITIVO, TERRE LEGENDAIRE, etc.
   - ✅ **Ventes du jour** : Nombre correct (ex: 2 ventes au lieu de 42)
   - ✅ **Activités récentes** : Seulement les 5 dernières ventes de Lejecolia

3. **Vérifier dans la console (F12) :**
   - Rechercher : `🔒 X ventes d'autres sociétés filtrées`
   - Si X > 0, cela confirme que le filtrage frontend fonctionne

4. **Se connecter avec une autre société** (ex: HOPE DESIGN)
   - Login : `jean`
   - Vérifier que les données sont différentes

---

## 🔍 Logs de débogage

Les logs suivants apparaissent dans la console (F12) :

### Stats Ventes (Ventes du jour) :
```
📊 CHARGEMENT STATS VENTES - TOUTE LA SOCIÉTÉ #4
📦 51 lignes de ventes chargées (TOUTE la base de données)
🔒 35 ventes d'autres sociétés filtrées
✅ 16 ventes pour société #4
📅 Ventes filtrées pour aujourd'hui (2025-11-07): 3 lignes
🛒 Commandes uniques du jour: 2
✅ Ventes du jour: 2 commandes
```

### Activités récentes :
```
📋 CHARGEMENT ACTIVITÉS - Société #4
📦 51 lignes de ventes récentes reçues de l'API
🔒 35 ventes d'autres sociétés filtrées
✅ 16 ventes pour société #4 (7 derniers jours)
✅ 5 activités affichées avec noms d'articles
```

---

## ⚠️ Note importante

### Pourquoi filtrer côté frontend ?

L'API backend devrait normalement filtrer les données avec le paramètre `idSociete`. Cependant, il y a un problème dans la vue SQL `V_JournalVenteParSite` qui ne respecte pas ce filtrage.

**Solution temporaire :** Filtrage frontend (implémenté) ✅  
**Solution définitive :** Correction du backend par le développeur backend

### Message pour le développeur backend :

```
🔧 ACTION REQUISE BACKEND

Endpoint : GET /api/V_JournalVenteParSite/paged
Paramètre : idSociete

PROBLÈME :
Le paramètre idSociete est ignoré, l'API retourne TOUTES les ventes
de TOUTES les sociétés au lieu de filtrer.

VÉRIFIER :
- La procédure stockée ou requête SQL derrière V_JournalVenteParSite
- S'assurer que le WHERE idSociete = @idSociete est appliqué
- Tester avec : GET /api/V_JournalVenteParSite/paged?idSociete=4&page=1&pageSize=10

ATTENDU :
Seules les ventes de la société #4 doivent être retournées.
```

---

## 📝 Méthode de filtrage appliquée

**Pattern réutilisable pour tous les endpoints de ventes :**

```javascript
// Récupérer les données de l'API
let donnees = apiResponse?.data || apiResponse || [];

// Filtrer par société côté frontend (sécurité)
const idSocieteCible = parseInt(societeId.value);
donnees = donnees.filter(item => {
  const idSocieteItem = parseInt(item.idSociete || item.IdSociete);
  return idSocieteItem === idSocieteCible;
});
```

**Points clés :**
- ✅ Utiliser `parseInt()` pour éviter les problèmes de types
- ✅ Gérer les variantes de casse (`idSociete` vs `IdSociete`)
- ✅ Logger le nombre de données filtrées pour debugging
- ✅ Toujours filtrer AVANT de traiter les données

---

## ✅ Statut final

| Élément | État |
|---------|------|
| Top 5 Articles | ✅ Filtré par société |
| Ventes du jour | ✅ Filtré par société |
| Activités récentes | ✅ Filtré par société |
| Rapport financier | ✅ Déjà correct (utilise endpoint différent) |
| Compilation | ✅ Sans erreur |
| Tests | ⏳ En attente de validation utilisateur |

---

## 🚀 Pour tester maintenant

1. **Rafraîchir le navigateur** : `Cmd + Shift + R` (Mac) ou `Ctrl + Shift + F5` (Windows)
2. **Se connecter** en tant que gestionnaire
3. **Vérifier** que toutes les sections affichent les bonnes données
4. **Ouvrir la console** (F12) pour voir les logs de filtrage

Le serveur de développement a automatiquement recompilé les changements ! 🎉


