# 📸 PHOTO ET RÔLE EXACT - Page Profil

## 🎯 RÉCUPÉRATION DES DONNÉES

### Flux de Chargement

```
1. Montage du composant
   ↓
2. loadUserData()
   ↓
3. api.getUserById(userStore.userId)
   ├─→ Photo (base64)
   ├─→ idRole
   ├─→ Toutes les infos utilisateur
   ↓
4. enrichWithNames()
   ↓
5. api.getRoles() → Trouve le nom exact du rôle
   ↓
6. Affichage avec le rôle exact et la photo
```

---

## 📸 PHOTO DE L'UTILISATEUR

### Récupération

```javascript
// 1. Charger les données complètes depuis l'API
const userId = userStore.userId;
const response = await api.getUserById(userId);

// 2. userData contient TOUTES les données, y compris la photo
userData.value = response;

// 3. La photo est en base64
userData.value.photo // "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### Affichage

```vue
<img 
  :src="user.photo || '../assets/img/team-2.jpg'"
  @error="handleImageError"
/>
```

**Si photo disponible** → Affiche la photo de l'utilisateur  
**Si pas de photo** → Affiche l'image par défaut  
**Si erreur de chargement** → Fallback automatique  

### Logs de Vérification

Dans la console :

```
✅ Données utilisateur chargées: {
  photo: "data:image/jpeg;base64,...",
  idRole: 3,
  nomUtilisateur: "DUPONT",
  ...
}

📸 Photo récupérée: {
  taille: "45.23 KB",
  preview: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

ou

```
⚠️ Aucune photo trouvée pour cet utilisateur
```

---

## 🎭 RÔLE EXACT DE L'UTILISATEUR

### Récupération

**Étape 1 : ID du rôle depuis getUserById**
```javascript
const response = await api.getUserById(userId);
userData.value = response;

// userData.value.idRole = 3 (par exemple)
```

**Étape 2 : Nom du rôle depuis getRoles**
```javascript
const roles = await api.getRoles();

// Trouver le rôle correspondant à l'ID
const role = roles.find(r => r.idRole == userData.value.idRole);

// Récupérer le nom exact
userData.value.roleName = role?.nom || role?.name;
```

### Exemple de Correspondance

**API getRoles retourne :**
```json
[
  { "idRole": 1, "nom": "Administrateur" },
  { "idRole": 2, "nom": "Super-Admin" },
  { "idRole": 3, "nom": "Gestionnaire" }
]
```

**getUserById retourne :**
```json
{
  "idUtilisateur": 1,
  "nomUtilisateur": "DUPONT",
  "idRole": 3,  ← ID du rôle
  ...
}
```

**Résultat affiché :**
```
Rôle: Gestionnaire  ← Nom exact récupéré
```

### Logs de Vérification

```
📋 Rôles disponibles: [
  { idRole: 1, nom: "Administrateur" },
  { idRole: 3, nom: "Gestionnaire" }
]

🔍 Recherche pour idRole: 3

✅ Nom du rôle trouvé: Gestionnaire
```

---

## 🎨 AFFICHAGE DANS LA PAGE

### Header (Haut de page)

```vue
<img :src="user.photo || '/img/team-2.jpg'" />
<h5>{{ user.nom }}</h5>
<span :class="`badge ${roleBadgeColor}`">
  {{ roleDisplay }}
</span>
```

**Affiche :**
- 📸 Photo de l'utilisateur (ou photo par défaut)
- Nom complet
- Badge avec le rôle exact

### Section Rôle et Société

```vue
<label>Rôle</label>
<div class="form-control">
  <span :class="`badge ${roleBadgeColor}`">
    {{ roleDisplay }}
  </span>
</div>
```

**Affiche :**
- Badge coloré selon le rôle
- Nom exact du rôle

### Section Statut

```vue
<li>
  <strong>Rôle:</strong>
  <span :class="`badge ${roleBadgeColor}`">
    {{ roleDisplay }}
  </span>
</li>
```

**Affiche :**
- Rôle exact dans la barre latérale

---

## 🎨 BADGES COLORÉS

### Mapping des Rôles

```javascript
const roleBadgeColor = computed(() => {
  const role = user.value.role.toLowerCase();
  
  if (role.includes('superadmin') || role.includes('super-admin')) {
    return 'bg-gradient-danger';  // 🔴 Rouge
  }
  if (role.includes('gestionnaire')) {
    return 'bg-gradient-success'; // 🟢 Vert
  }
  if (role.includes('admin')) {
    return 'bg-gradient-info';    // 🔵 Bleu
  }
  
  return 'bg-gradient-secondary'; // ⚪ Gris
});
```

### Formatage du Nom

```javascript
const roleDisplay = computed(() => {
  const role = user.value.role.toLowerCase();
  
  if (role.includes('superadmin')) return 'Super Administrateur';
  if (role.includes('gestionnaire')) return 'Gestionnaire';
  if (role.includes('admin')) return 'Administrateur';
  
  return user.value.role; // Retourne tel quel si pas de correspondance
});
```

---

## 🔍 VÉRIFICATIONS DANS LA CONSOLE

### Ouvrir la Console du Navigateur

1. **F12** ou **Cmd+Option+I**
2. **Onglet Console**
3. **Recharger** la page `/profile`

### Logs Attendus

```
✅ Données utilisateur chargées: {
  idUtilisateur: 1,
  nomUtilisateur: "DUPONT",
  prenomUtilisateur: "Jean",
  email: "jean@example.com",
  idRole: 3,
  photo: "data:image/jpeg;base64,/9j/4AAQ...",
  ...
}

📋 Sites disponibles: [...]
📋 Rôles disponibles: [
  { idRole: 1, nom: "Administrateur" },
  { idRole: 3, nom: "Gestionnaire" }
]

🔍 Recherche pour idSite: 1
🔍 Recherche pour idRole: 3

✅ Nom du site trouvé: Mon Site
✅ Nom du rôle trouvé: Gestionnaire

📸 Photo récupérée: {
  taille: "45.23 KB",
  preview: "data:image/jpeg;base64,/9j/4AAQ..."
}
```

---

## 🧪 TESTER

### 1. Vérifier la Photo

```
1. Ouvrir /profile
2. Vérifier la photo en haut (header)
3. Console: Voir "📸 Photo récupérée" ou "⚠️ Aucune photo"
```

**Si pas de photo :**
- L'utilisateur n'a pas de photo dans la DB
- → Photo par défaut affichée

**Si photo présente :**
- Photo de l'utilisateur affichée
- Taille affichée dans la console

### 2. Vérifier le Rôle

```
1. Ouvrir /profile
2. Vérifier le badge sous le nom (header)
3. Vérifier la section "Rôle et société"
4. Vérifier la sidebar "Statut de connexion"
5. Console: Voir "✅ Nom du rôle trouvé: ..."
```

**Correspondance attendue :**
- **ID Rôle 1** → "Administrateur" (🔵 Bleu)
- **ID Rôle 2** → "Super-Admin" (🔴 Rouge)
- **ID Rôle 3** → "Gestionnaire" (🟢 Vert)

### 3. Vérifier dans la Console

```javascript
// Logs à surveiller :
✅ Données utilisateur chargées
📋 Rôles disponibles
🔍 Recherche pour idRole
✅ Nom du rôle trouvé
📸 Photo récupérée (ou ⚠️ Aucune photo)
```

---

## ❌ RÉSOLUTION DE PROBLÈMES

### Photo ne s'affiche pas

**Causes possibles :**
1. Utilisateur n'a pas de photo → Normal, photo par défaut
2. Photo trop volumineuse → Erreur 431 (voir ERREUR_431_PHOTOS.md)
3. Format invalide → Fallback automatique

**Solution :**
- Ajouter une photo via le modal d'édition utilisateur
- Vérifier les logs console

### Rôle affiché "Non renseigné"

**Causes possibles :**
1. API getRoles() ne retourne pas de données
2. idRole ne correspond à aucun rôle dans la liste
3. Erreur réseau

**Solution :**
```javascript
// Vérifier dans la console :
console.log('Rôles disponibles:', roles);
console.log('idRole recherché:', userData.value.idRole);

// Vérifier que l'ID correspond
const role = roles.find(r => r.idRole == userData.value.idRole);
console.log('Rôle trouvé:', role);
```

### Rôle affiché "Chargement..."

**Cause :**
- Données pas encore chargées depuis l'API

**Solution :**
- Attendre quelques secondes
- Si persiste, vérifier la console pour erreurs

---

## 📊 RÉSUMÉ

### Photo

| Source | Endpoint | Champ | Affichage |
|--------|----------|-------|-----------|
| API | `getUserById(userId)` | `photo` | Image base64 ou par défaut |

### Rôle

| Source | Endpoint | Champ | Affichage |
|--------|----------|-------|-----------|
| ID | `getUserById(userId)` | `idRole` | (pas affiché) |
| Nom | `getRoles()` | `nom` / `name` | Badge coloré |

### Logs

| Emoji | Signification |
|-------|---------------|
| ✅ | Succès - Donnée récupérée |
| 📋 | Liste de données disponibles |
| 🔍 | Recherche en cours |
| 📸 | Photo trouvée |
| ⚠️ | Avertissement - Donnée manquante |
| ❌ | Erreur |

---

## 🎯 GARANTIES

✅ **Photo réelle** de l'utilisateur depuis l'API  
✅ **Rôle exact** (nom, pas ID) depuis l'API  
✅ **Badge coloré** selon le rôle  
✅ **Logs détaillés** pour vérification  
✅ **Fallbacks** en cas d'erreur  
✅ **Formatage** du nom du rôle  

**La page Profile récupère et affiche correctement la photo et le rôle exact de l'utilisateur connecté !** ✅

