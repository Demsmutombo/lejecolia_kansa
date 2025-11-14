# 🏢 SIDEBAR - Logo de Société (Version Finale)

## 🎯 OBJECTIF

Afficher le **logo de la société** de l'utilisateur connecté dans la sidebar.

---

## ✅ SOLUTION APPLIQUÉE

### Récupération du Logo

**API utilisée :** `/api/Societes` (celle qui fonctionne ✅)

**Flux :**
```
1. userStore.societeId (depuis la connexion)
   ↓
2. api.getSocietes() → Liste de toutes les sociétés
   ↓
3. Trouver la société avec idSociete = userStore.societeId
   ↓
4. Extraire le logo de cette société
   ↓
5. Afficher dans la sidebar
```

### Code

```javascript
const loadSocieteLogo = async () => {
  // Récupérer toutes les sociétés
  const societes = await api.getSocietes();
  
  // Trouver notre société
  const maSociete = societes.find(s => 
    String(s.idSociete) === String(userStore.societeId)
  );
  
  // Extraire le logo (si < 150KB pour éviter erreur 431)
  if (maSociete?.logo && maSociete.logo.length < 150000) {
    societeLogo.value = maSociete.logo;
  }
  
  societeNomAPI.value = maSociete?.nomSociete;
};
```

### Affichage

```vue
<img :src="logoUrl" />

// logoUrl = computed
const logoUrl = computed(() => {
  // Si logo société disponible
  if (societeLogo.value) {
    return societeLogo.value;  // Logo de la société
  }
  // Sinon logo Argon par défaut
  return darkMode ? logoWhite : logo;
});
```

---

## 🎨 AFFICHAGE

### Avec Logo

```
┌────────────────────────────────┐
│ [🏢 Logo Société]  Kansa       │ ← Logo de votre société
├────────────────────────────────┤
│ Dashboard                      │
│ Sites                          │
│ Utilisateurs                   │
└────────────────────────────────┘
```

### Sans Logo (Fallback)

```
┌────────────────────────────────┐
│ [🎨 Logo Argon]  Kansa         │ ← Logo par défaut
├────────────────────────────────┤
│ Dashboard                      │
│ Sites                          │
│ Utilisateurs                   │
└────────────────────────────────┘
```

---

## 🔄 LOGIQUE

### Priorité du Logo

1. **Logo de la société** (si disponible et < 150KB)
2. **Logo Argon dark** (si darkMode)
3. **Logo Argon light** (par défaut)

### Priorité du Nom

1. **Nom depuis l'API** (`societeNomAPI`)
2. **Nom du store** (`userStore.societeName`)
3. **Nom utilisateur** (`userStore.userName`)
4. **Fallback** ('Mon Entreprise')

---

## 📋 LOGS DE VÉRIFICATION

### Au Chargement

```
🔍 Chargement logo société ID: 2

✅ Société trouvée: {
  nom: "Kansa Mombongo",
  hasLogo: true,
  logoSize: 87654
}

✅ Logo chargé: 85.60 KB
```

### Si Logo Trop Grand

```
✅ Société trouvée: {
  hasLogo: true,
  logoSize: 250000  ← > 150KB
}

⚠️ Logo trop volumineux - Utilisation logo par défaut
```

### Si Pas de Logo

```
✅ Société trouvée: {
  nom: "Ma Société",
  hasLogo: false,
  logoSize: 0
}

⚠️ Pas de logo - Logo Argon par défaut
```

### Si Société Non Trouvée

```
⚠️ Société non trouvée dans la liste
⚠️ Logo par défaut
```

---

## 🧪 TESTER

### 1. Rechargez l'Application

```
Ctrl+R ou Cmd+R
```

### 2. Vérifiez la Sidebar

**En haut à gauche :**
- Logo de votre société (si elle a un logo)
- ou Logo Argon (si pas de logo)
- Nom de votre société

### 3. Console (F12)

**Cherchez :**
```
🔍 Chargement logo société ID: 2
✅ Société trouvée: {...}
✅ Logo chargé: XX.XX KB
```

---

## 🎯 CAS D'USAGE

### Société Avec Logo

**Exemple : Kansa Mombongo (ID=2)**

Si cette société a un logo dans la DB :
- ✅ Logo affiché dans la sidebar
- ✅ Nom "Kansa Mombongo" affiché

### Société Sans Logo

**Exemple : Autre société**

Si pas de logo :
- ✅ Logo Argon affiché
- ✅ Nom de la société affiché quand même

---

## 📊 AVANTAGES

| Aspect | Avantage |
|--------|----------|
| **Fiabilité** | ✅ Utilise API qui fonctionne (`/api/Societes`) |
| **Performance** | ✅ 1 seul appel API (au lieu de 3) |
| **Erreurs** | ✅ Gestion des erreurs avec fallback |
| **Logo** | ✅ Filtrage < 150KB (évite erreur 431) |
| **Nom** | ✅ Nom exact de l'API |
| **Fallback** | ✅ Logo + nom par défaut si erreur |

---

## 🔒 SÉCURITÉ

### Filtrage de Taille

```javascript
if (logo.length < 150000) {  // < 150KB
  societeLogo.value = logo;
}
```

**Évite :**
- Erreur 431 (headers trop larges)
- Chargement lent
- Problèmes d'affichage

---

## 🔄 RÉACTIVITÉ

### Watcher sur isLoggedIn

```javascript
watch(() => userStore.isLoggedIn, (newVal) => {
  if (newVal) {
    loadSocieteLogo();
  }
});
```

**Si l'utilisateur se connecte :**
- Logo chargé automatiquement
- Sidebar mise à jour

**Si l'utilisateur se déconnecte :**
- Retour à "Mon Entreprise"
- Logo Argon par défaut

---

## 📁 FICHIERS MODIFIÉS

### `src/examples/Sidenav/index.vue`

**Script :**
```javascript
// Import API
import api from "@/services/api.service";

// Variables
const societeLogo = ref(null);
const societeNomAPI = ref('');

// Fonction de chargement
const loadSocieteLogo = async () => { /* ... */ };

// Computed pour logo et nom
const logoUrl = computed(() => { /* ... */ });
const societeNom = computed(() => { /* ... */ });

// Charger au montage
onMounted(() => { loadSocieteLogo(); });

// Watcher
watch(() => userStore.isLoggedIn, () => { /* ... */ });
```

**Template :**
```vue
<img :src="logoUrl" />  <!-- Logo dynamique -->
<span>{{ societeNom }}</span>  <!-- Nom dynamique -->
```

---

## 🎊 RÉSULTAT

### Avant ❌

```
[Logo Argon]  Argon Dashboard 2
```

### Après ✅

**Si société a un logo :**
```
[Logo Société]  Kansa Mombongo
```

**Si société sans logo :**
```
[Logo Argon]  Kansa Mombongo
```

---

## 💡 AMÉLIORATION FUTURE

### Cache du Logo

Pour éviter de recharger à chaque montage :

```javascript
const logosCache = ref({});

const loadSocieteLogo = async () => {
  // Si déjà en cache
  if (logosCache.value[societeId]) {
    societeLogo.value = logosCache.value[societeId];
    return;
  }
  
  // Charger et mettre en cache
  const logo = await fetchLogo();
  logosCache.value[societeId] = logo;
  societeLogo.value = logo;
};
```

---

## 🧪 TESTEZ MAINTENANT

**Rechargez le dashboard !**

### Vérifications

1. **Sidebar en haut à gauche** :
   - Logo de votre société (si elle en a un)
   - Nom de votre société
   - Plus de "Argon Dashboard 2"

2. **Console (F12)** :
   ```
   🔍 Chargement logo société ID: 2
   ✅ Société trouvée: {nom, hasLogo, logoSize}
   ✅ Logo chargé: XX.XX KB
   ```

3. **Vérifier le logo** :
   - Si votre société (ID=2) a un logo → Logo affiché
   - Si pas de logo → Logo Argon

---

## 📝 NOTES

### SocieteId dans le Store

Le `societeId` doit être stocké lors de la connexion.

**Vérifier dans la console à la connexion :**
```
📋 Données extraites pour le store: {
  societeId: "2",  ← Doit être présent
  ...
}
```

**Si `societeId` est null/undefined :**
- Logo ne pourra pas être chargé
- Fallback sur logo Argon

---

## 🎉 TERMINÉ !

✅ **Logo de la société** affiché dans la sidebar  
✅ **Nom de la société** affiché  
✅ **Récupération via API** `/api/Societes`  
✅ **Fallback automatique** si erreur  
✅ **Filtrage taille** < 150KB  
✅ **Watcher** pour rechargement automatique  
✅ **Logo par défaut** si pas de logo  

**La sidebar affiche maintenant le logo et le nom de VOTRE société !** 🏢🚀

