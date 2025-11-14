# 🏢 SIDEBAR - Nom de Société (Simplifié)

## ❌ PROBLÈME INITIAL

**Erreur 404** lors de la récupération des données :

```
Failed to load resource: 404
❌ Erreur chargement société pour sidebar
❌ Erreur chargement utilisateur
```

**Cause :**
- API `getUserById(7)` → 404 (utilisateur pas trouvé)
- API `getSiteById()` → 404 (site pas trouvé)
- API `getSocieteById()` → 404 (société pas trouvée)

---

## ✅ SOLUTION SIMPLE

**Utiliser directement le STORE au lieu de l'API**

### Pourquoi ?

1. **Store déjà disponible** - Données chargées à la connexion
2. **Pas d'appel API** - Plus rapide, pas d'erreur 404
3. **Plus simple** - Moins de code, moins d'erreurs
4. **Toujours à jour** - Synchronisé avec la session

---

## 🔧 CODE SIMPLIFIÉ

### Sidebar (`src/examples/Sidenav/index.vue`)

**Avant (Complexe) :**
```javascript
// 3 appels API
const userData = await api.getUserById(userId);
const siteData = await api.getSiteById(userData.idSite);
const societe = await api.getSocieteById(siteData.idSociete);

societeNom = societe.nomSociete;
societeLogo = societe.logo;
```

**Après (Simple) :**
```javascript
// Directement depuis le store
const societeNom = computed(() => {
  return userStore.societeName || userStore.userName || 'Mon Entreprise';
});
```

**Avantages :**
- ✅ **Aucun appel API**
- ✅ **Pas d'erreur 404**
- ✅ **Plus rapide**
- ✅ **Plus fiable**
- ✅ **Code plus court**

---

## 📊 DONNÉES DISPONIBLES DANS LE STORE

### À la Connexion

Lors du login dans `Signin.vue`, ces données sont stockées :

```javascript
const userData = {
  id: response.id,
  name: response.nom,              // Nom utilisateur
  email: response.email,
  role: response.role,
  token: response.token,
  societeId: response.societe_id,
  societeName: response.societe_name,  ← NOM DE LA SOCIÉTÉ ✅
  societes: response.societes
};

login(userData); // Stocke dans Pinia
```

### Dans le Store Pinia

```javascript
userStore.societeName  // "kansa2", "Ma Société", etc.
userStore.userName     // "mutombo", "Jean DUPONT", etc.
```

---

## 🎨 AFFICHAGE SIDEBAR

### Template

```vue
<router-link to="/">
  <img :src="logo" />
  <span>{{ societeNom }}</span>
</router-link>
```

### Résultat

```
┌────────────────────────────────┐
│ [Logo Argon]  kansa2           │  ← Nom de votre société
├────────────────────────────────┤
│ Dashboard                      │
│ Sites                          │
│ Utilisateurs                   │
└────────────────────────────────┘
```

**Affiche :**
- Logo Argon par défaut (pour l'instant)
- **Nom de la société** depuis le store

---

## 📸 LOGO (Pour Plus Tard)

### Option 1 : Logo Statique

Mettez un logo dans `/public/img/` :

```vue
<img src="/img/logo-societe.png" />
```

### Option 2 : Logo Dynamique (Sans API)

Récupérer le logo une seule fois et le stocker dans le store :

```javascript
// Lors de la connexion dans Signin.vue
const userData = {
  // ...
  societeLogo: response.societe_logo
};

// Dans la sidebar
<img :src="userStore.societeLogo || logo" />
```

### Option 3 : Logo depuis API (Si Fonctionne)

Si l'API `/api/Societes/{id}` fonctionne correctement :

```javascript
const societe = await api.getSocieteById(userStore.societeId);
societeLogo.value = societe.logo;
```

---

## ⚠️ POURQUOI L'ERREUR 404 ?

### Cause Possible 1 : Utilisateur Pas dans la DB

```
getUserById(7) → 404
```

**L'utilisateur ID=7 n'existe pas dans `/api/Utilisateurs/7`**

**Vérification :**
```bash
curl https://mombongo.asdc-rdc.org/api/Utilisateurs/7
```

**Si 404** → Cet utilisateur n'existe pas côté API (problème de synchronisation DB)

### Cause Possible 2 : Token Invalide

L'API requiert peut-être un token d'authentification valide.

**Solution :**
Vérifier que le token est bien envoyé dans les headers (déjà fait dans `api.service.js`)

---

## 🎯 RÉSULTAT ACTUEL

### Sidebar ✅

- ✅ Affiche le **nom de la société** depuis le store
- ✅ **Aucune erreur 404**
- ✅ Logo Argon par défaut
- ❌ Plus de "Argon Dashboard 2"

### Page Profile ⚠️

- ✅ Utilise les données du **store** comme fallback
- ✅ Nom, email, rôle affichés
- ⚠️ Détails incomplets (pas de photo, adresse, etc.)

---

## 💡 AMÉLIORATION FUTURE

### 1. Stocker le Logo à la Connexion

Modifier `Signin.vue` pour récupérer le logo :

```javascript
// Après login réussi
const societe = await api.getSocieteById(userData.societeId);

const fullUserData = {
  ...userData,
  societeName: societe.nomSociete,
  societeLogo: societe.logo  // ← Stocker le logo
};

login(fullUserData);
```

### 2. Modifier le Store

Ajouter `societeLogo` dans `user.js` :

```javascript
const societeLogo = ref('');

// Dans login()
societeLogo.value = userData.societeLogo || '';
```

### 3. Utiliser dans la Sidebar

```vue
<img :src="userStore.societeLogo || logo" />
```

---

## 🧪 VÉRIFICATION

### Console (F12)

**Sidebar :**
```
🏢 Nom société sidebar: kansa2
```
ou
```
🏢 Nom société sidebar: Mon Entreprise
```

**Aucune erreur 404** ✅

### Interface

**En haut de la sidebar :**
- ✅ Logo Argon (par défaut)
- ✅ Nom de votre société (ex: "kansa2")
- ❌ Plus "Argon Dashboard 2"

---

## 📋 COMPARAISON

| Aspect | Version Complexe (API) | Version Simple (Store) |
|--------|------------------------|------------------------|
| **Appels API** | 3 (User, Site, Société) | 0 |
| **Erreurs 404** | ❌ Oui | ✅ Non |
| **Vitesse** | Lent (3 requêtes) | ✅ Instantané |
| **Fiabilité** | Dépend de l'API | ✅ Toujours dispo |
| **Logo** | ✅ Récupéré | ⚠️ Par défaut |
| **Nom** | ✅ Exact | ✅ Depuis store |

---

## 📁 FICHIERS MODIFIÉS

### 1. `src/examples/Sidenav/index.vue`

**Avant :**
```javascript
const loadSocieteData = async () => {
  const userData = await api.getUserById(userId);  // ← Erreur 404
  const siteData = await api.getSiteById(...);      // ← Erreur 404
  const societe = await api.getSocieteById(...);    // ← Erreur 404
};
```

**Après :**
```javascript
const societeNom = computed(() => {
  return userStore.societeName || 'Mon Entreprise';  // ← Direct du store
});
```

### 2. `src/views/Profile.vue`

**Ajouté :**
- Try-catch pour gérer erreur 404
- Fallback sur le store si API échoue
- Logs indiquant l'utilisation du store

### 3. `SIDEBAR_STORE_SIMPLIFIE.md` (nouveau)

✅ Documentation de la simplification  
✅ Explications erreurs 404  
✅ Solutions alternatives  

---

## 🎉 RÉSULTAT

✅ **Sidebar affiche le nom de la société** depuis le store  
✅ **Aucune erreur 404**  
✅ **Code simplifié** (0 appel API au lieu de 3)  
✅ **Plus rapide** et **plus fiable**  
⚠️ **Logo par défaut** (peut être amélioré plus tard)  

**La sidebar affiche maintenant le nom de votre société sans erreur !** 🚀

---

## 📝 POUR AJOUTER LE LOGO

Si vous voulez afficher le vrai logo de la société :

**Option Simple :**
1. Mettez votre logo dans `/public/img/logo-societe.png`
2. Dans la sidebar :
```vue
<img src="/img/logo-societe.png" />
```

**Option Dynamique :**
1. Stockez le logo lors de la connexion
2. Utilisez-le depuis le store
3. Voir guide "AMÉLIORATION FUTURE" ci-dessus

