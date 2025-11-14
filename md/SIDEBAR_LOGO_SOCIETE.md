# 🏢 SIDEBAR - Logo et Nom de Société

## 🎯 OBJECTIF

Afficher le **logo et le nom de la société** de l'utilisateur connecté dans la sidebar, à la place de "Argon Dashboard 2".

---

## ✅ MODIFICATIONS APPLIQUÉES

### Récupération des Données

**Flux :**
```
1. getUserById(userId) → Récupère idSite
   ↓
2. getSiteById(idSite) → Récupère idSociete
   ↓
3. getSocieteById(idSociete) → Récupère logo + nomSociete
   ↓
4. Affichage dans la sidebar
```

### Code Ajouté

```javascript
// Charger les données de la société
const loadSocieteData = async () => {
  const userId = userStore.userId;
  const userData = await api.getUserById(userId);
  const siteData = await api.getSiteById(userData.idSite);
  const societe = await api.getSocieteById(siteData.idSociete);
  
  societeData.value = societe; // Contient logo + nom
};

// Logo avec fallback
const societeLogo = computed(() => {
  const logo = societeData.value?.logo;
  if (logo && logo.length < 100000) {
    return logo; // Logo de la société
  }
  return null; // Logo par défaut Argon
});

// Nom de la société
const societeNom = computed(() => {
  return societeData.value?.nomSociete || 
         userStore.societeName || 
         'Mon Entreprise';
});
```

---

## 🎨 AFFICHAGE

### Avant ❌

```
┌────────────────────────────────┐
│ [Logo Argon]  Argon Dashboard 2│
├────────────────────────────────┤
│ Dashboard                      │
│ Sociétés                       │
│ ...                            │
└────────────────────────────────┘
```

### Après ✅

```
┌────────────────────────────────┐
│ [Logo Société]  Nom de Société │
├────────────────────────────────┤
│ Dashboard                      │
│ Sociétés                       │
│ ...                            │
└────────────────────────────────┘
```

**Exemple :**
```
┌────────────────────────────────┐
│ [🏢]  Kansa Mombongo           │
├────────────────────────────────┤
│ Dashboard                      │
│ Sites                          │
│ Utilisateurs                   │
└────────────────────────────────┘
```

---

## 🔄 LOGIQUE

### Logo

**Si société a un logo :**
```vue
<img :src="societeData.logo" />
```
→ Affiche le logo de la société

**Si pas de logo :**
```vue
<img :src="logoWhite ou logo" />
```
→ Affiche le logo Argon par défaut

**Filtrage :**
- Logo < 100KB → Affiché
- Logo > 100KB → Logo par défaut (évite erreur 431)

### Nom

**Sources (par priorité) :**
1. `societeData.nomSociete` → Nom depuis l'API
2. `userStore.societeName` → Nom du store
3. `'Mon Entreprise'` → Fallback par défaut

---

## 📊 EXEMPLES SELON LE RÔLE

### SuperAdmin (Plusieurs Sociétés)

**Peut changer de société** via `changeSociete()`

```
Société 1 sélectionnée:
┌────────────────────────────────┐
│ [Logo 1]  Société ABC          │
└────────────────────────────────┘

Société 2 sélectionnée:
┌────────────────────────────────┐
│ [Logo 2]  Société XYZ          │
└────────────────────────────────┘
```

→ Logo et nom changent dynamiquement

### Gestionnaire (Une Société)

**Société fixe**

```
┌────────────────────────────────┐
│ [Logo]  Ma Société             │
├────────────────────────────────┤
│ Dashboard                      │
│ Profil                         │
│ ...                            │
└────────────────────────────────┘
```

→ Logo et nom fixes

---

## 🎨 STYLES

### Logo

```css
max-height: 50px;
object-fit: contain;
```

**Caractéristiques :**
- Hauteur max 50px
- Proportions conservées
- Centré verticalement

### Nom

```html
<span class="ms-2 font-weight-bold me-2">
  {{ societeNom }}
</span>
```

**Caractéristiques :**
- Margin gauche 2
- Texte en gras
- Tronqué si trop long (CSS existant)

---

## 🔄 RÉACTIVITÉ

### Changement de Société (SuperAdmin)

```javascript
// Quand le SuperAdmin change de société
userStore.changeSociete(nouvelleSocieteId);

// La sidebar se met à jour automatiquement
onMounted(() => {
  loadSocieteData();
});
```

**Problème :** Pour l'instant, la sidebar ne se recharge pas automatiquement.

**Solution future :**
```javascript
// Watcher sur societeName
watch(() => userStore.societeName, () => {
  loadSocieteData();
});
```

---

## 📋 LOGS DE VÉRIFICATION

### Console

Quand vous chargez l'application :

```
✅ Société chargée pour sidebar: {
  nom: "Kansa Mombongo",
  hasLogo: true,
  logoSize: 45678
}
```

**ou**

```
✅ Société chargée pour sidebar: {
  nom: "Ma Société",
  hasLogo: false,
  logoSize: 0
}
```

**Interprétation :**
- `hasLogo: true` → Logo affiché
- `hasLogo: false` → Logo par défaut
- `logoSize > 0` → Photo présente

---

## 🧪 TESTER

### 1. Rechargez l'Application

```bash
Ctrl+R ou Cmd+R
```

### 2. Vérifiez la Sidebar

**En haut à gauche :**
- ✅ Logo de votre société (ou logo Argon par défaut)
- ✅ Nom de votre société (ex: "kansa2")
- ❌ Plus de "Argon Dashboard 2"

### 3. Console

**Cherchez :**
```
✅ Société chargée pour sidebar: {...}
```

### 4. Testez avec Différents Utilisateurs

**Utilisateur avec société qui a un logo :**
- ✅ Voit le logo de sa société

**Utilisateur avec société sans logo :**
- ✅ Voit le logo Argon par défaut

---

## 📁 FICHIER MODIFIÉ

### `src/examples/Sidenav/index.vue`

**Script :**
```javascript
// Import
import { useUserStore } from "@/stores/user";
import api from "@/services/api.service";

// Variables
const societeData = ref(null);

// Fonction de chargement
const loadSocieteData = async () => { /* ... */ };

// Computed properties
const societeLogo = computed(() => { /* ... */ });
const societeNom = computed(() => { /* ... */ });

// Chargement au montage
onMounted(() => {
  if (userStore.isLoggedIn) {
    loadSocieteData();
  }
});
```

**Template :**
```vue
<!-- Avant -->
<img :src="logo" />
<span>Argon Dashboard 2</span>

<!-- Après -->
<img :src="societeLogo || logo" />
<span>{{ societeNom }}</span>
```

---

## 💡 AMÉLIORATIONS FUTURES

### 1. Watcher pour Changement de Société

```javascript
watch(() => userStore.societeId, (newId) => {
  if (newId) {
    loadSocieteData();
  }
});
```

### 2. Cache des Sociétés

Pour éviter de recharger à chaque fois :

```javascript
const societesCache = ref({});

const loadSocieteData = async () => {
  if (societesCache.value[idSociete]) {
    societeData.value = societesCache.value[idSociete];
    return;
  }
  
  // Charger et mettre en cache
  const societe = await api.getSocieteById(idSociete);
  societesCache.value[idSociete] = societe;
  societeData.value = societe;
};
```

### 3. Loading State

Afficher un skeleton pendant le chargement :

```vue
<div v-if="isLoadingSociete" class="skeleton-logo"></div>
<img v-else :src="societeLogo || logo" />
```

---

## 🎯 RÉSULTAT

### Avant ❌

- Logo Argon générique
- Titre "Argon Dashboard 2"
- Pas d'identification de la société

### Après ✅

- ✅ **Logo de la société** (ou Argon par défaut)
- ✅ **Nom de la société** (dynamique)
- ✅ **Identification claire** de la société
- ✅ **Personnalisation** par société
- ✅ **Branding** de l'entreprise

---

## 🏢 CHAÎNE DE RÉCUPÉRATION

```
Utilisateur (ID=7)
  ↓ getUserById
idSite (ID=5)
  ↓ getSiteById
idSociete (ID=2)
  ↓ getSocieteById
Société {
  nomSociete: "Kansa Mombongo",
  logo: "data:image/...",
  ...
}
  ↓
Sidebar affiche:
[Logo Kansa] Kansa Mombongo
```

---

## 🎉 RÉSUMÉ

✅ **Logo de la société** affiché dans la sidebar  
✅ **Nom de la société** affiché au lieu de "Argon Dashboard 2"  
✅ **Récupération dynamique** depuis l'API  
✅ **Fallback** sur logo Argon si pas de logo  
✅ **Filtrage** photos > 100KB  
✅ **Logs** pour vérification  

**La sidebar affiche maintenant le logo et le nom de VOTRE société !** 🚀

