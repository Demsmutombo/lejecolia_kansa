# 🔧 DEBUG - Photo et Rôle Profile

## ⚠️ PROBLÈMES SIGNALÉS

1. **Photo ne s'affiche pas**
2. **Rôle incorrect pour les gestionnaires**

---

## 🔍 CORRECTIONS APPLIQUÉES

### 1. Gestion Response Encapsulé

**Problème :** L'API peut retourner `{ data: {...} }` au lieu de `{...}` directement

**Solution :**
```javascript
// Avant
userData.value = response;

// Après
userData.value = response?.data || response;
```

### 2. Comparaison Type-Safe pour IDs

**Problème :** `idRole` peut être "3" (string) ou 3 (number)

**Solution :**
```javascript
// Avant
const role = roles.find(r => r.idRole == userData.value.idRole);

// Après
const role = roles.find(r => String(r.idRole) === String(userData.value.idRole));
```

### 3. Gestion Photos Volumineuses

**Problème :** Photos > 100KB peuvent causer des erreurs

**Solution :**
```javascript
photo: userData.value.photo && userData.value.photo.length < 100000 
  ? userData.value.photo 
  : null
```

### 4. Logs Détaillés

**Ajouté :**
- Type des IDs (string ou number)
- Nombre d'éléments dans les listes
- Champs disponibles dans userData
- Vérification format photo (base64)

---

## 🧪 INSTRUCTIONS DE DEBUG

### Étape 1 : Ouvrir la Console

1. **Allez sur** `/profile`
2. **Ouvrez la console** : F12 ou Cmd+Option+I
3. **Rechargez** la page

### Étape 2 : Vérifier les Logs

**Cherchez ces logs dans l'ordre :**

#### A. Chargement Utilisateur

```
🔍 Chargement pour userId: 1

✅ Données utilisateur chargées: {
  id: 1,
  nom: "DUPONT",
  idRole: 3,
  hasPhoto: true,     ← Doit être true si photo présente
  photoLength: 45678  ← Taille de la photo
}
```

**Si `hasPhoto: false` :**
- L'utilisateur n'a pas de photo dans la DB
- → C'est normal, photo par défaut sera affichée

#### B. Sites et Rôles

```
📋 Sites disponibles: 5 sites
📋 Rôles disponibles: [
  { id: 1, nom: "Administrateur" },
  { id: 3, nom: "Gestionnaire" }
]
```

**Vérifiez :**
- Nombre de sites > 0
- Nombre de rôles > 0
- Les rôles ont bien un `nom` ou `name`

#### C. Recherche

```
🔍 Recherche pour idSite: 1 (type: string)
🔍 Recherche pour idRole: 3 (type: string)
```

**Vérifiez :**
- Les IDs sont affichés
- Le type (string ou number) est montré

#### D. Résultats

```
✅ Site trouvé: Mon Site (id: 1)
✅ Rôle trouvé: Gestionnaire (id: 3)
```

**Si "Aucun" :**
- L'ID ne correspond à aucun élément dans la liste
- → Problème de correspondance

#### E. Photo

```
📸 Photo récupérée: {
  taille: "45.23 KB",
  format: "data:image/jpeg;base64,/9j...",
  isBase64: true
}
```

**ou**

```
⚠️ Aucune photo dans userData
📋 Champs disponibles: ["idUtilisateur", "nomUtilisateur", ...]
```

**Si aucune photo :**
- Vérifiez que "photo" est dans la liste des champs
- Si absent, l'API ne retourne pas la photo

---

## 🔧 RÉSOLUTION PAR PROBLÈME

### Problème 1 : Photo Ne S'affiche Pas

#### Cas A : Photo Trop Volumineuse

**Log attendu :**
```
✅ Données utilisateur chargées: {
  photoLength: 150000  ← > 100KB
}
```

**Solution :**
Photo filtrée pour éviter erreur 431. L'utilisateur doit uploader une photo plus petite (< 100KB).

#### Cas B : Photo Pas en Base64

**Log attendu :**
```
📸 Photo récupérée: {
  isBase64: false  ← Problème !
}
```

**Solution :**
La photo n'est pas au bon format. Doit commencer par `data:image/...`

#### Cas C : Aucune Photo dans l'API

**Log attendu :**
```
⚠️ Aucune photo dans userData
📋 Champs disponibles: ["idUtilisateur", "nomUtilisateur", ...]
                       ↑ "photo" absent
```

**Solution :**
L'utilisateur n'a pas de photo. Ajouter une photo via le module Utilisateurs.

### Problème 2 : Rôle Incorrect

#### Cas A : ID Ne Correspond Pas

**Logs attendus :**
```
📋 Rôles disponibles: [
  { id: 1, nom: "Admin" },
  { id: 2, nom: "Super-Admin" }
]

🔍 Recherche pour idRole: 3 (type: string)

✅ Rôle trouvé: Aucun  ← Problème !
```

**Solution :**
Le rôle ID=3 n'existe pas dans la liste. Vérifier la base de données.

#### Cas B : Type Incompatible

**Logs attendus :**
```
🔍 Recherche pour idRole: "3" (type: string)

Rôles: [{ idRole: 3 }]  ← number
```

**Solution :**
DÉJÀ CORRIGÉ - Conversion String() pour comparaison

#### Cas C : Champ `nom` Absent

**Logs attendus :**
```
📋 Rôles disponibles: [
  { id: 3, nom: undefined }  ← Problème !
]
```

**Solution :**
L'API ne retourne pas le champ `nom`. Utilise `name` en fallback.

---

## 📊 CHECKLIST DE VÉRIFICATION

### Pour la Photo

- [ ] Log "hasPhoto: true" présent
- [ ] photoLength < 100000
- [ ] format commence par "data:image"
- [ ] isBase64 = true
- [ ] Image visible dans le header

### Pour le Rôle

- [ ] Rôles disponibles > 0
- [ ] idRole affiché dans les logs
- [ ] Rôle trouvé avec un nom
- [ ] Badge coloré correct :
  - 🔴 Rouge = Super-Admin
  - 🟢 Vert = Gestionnaire
  - 🔵 Bleu = Admin

---

## 🎯 ACTIONS SELON LES LOGS

### Si Tout Est OK dans les Logs

```
✅ Photo: hasPhoto: true, isBase64: true
✅ Rôle: Gestionnaire (id: 3)
```

**Mais toujours pas affiché :**
- Vider le cache navigateur (Ctrl+Shift+R)
- Vérifier les erreurs réseau (onglet Network)

### Si Photo Manquante dans l'API

```
⚠️ Aucune photo dans userData
```

**Actions :**
1. Aller sur `/utilisateurs`
2. Modifier l'utilisateur
3. Ajouter une photo
4. Sauvegarder
5. Recharger `/profile`

### Si Rôle Non Trouvé

```
✅ Rôle trouvé: Aucun
```

**Actions :**
1. Noter l'idRole affiché (ex: 3)
2. Noter les rôles disponibles
3. Vérifier que l'ID existe dans la liste
4. Si absent, problème dans la base de données

---

## 📝 EXEMPLE DE LOGS CORRECTS

```
🔍 Chargement pour userId: 2

✅ Données utilisateur chargées: {
  id: 2,
  nom: "MALONGA",
  idRole: 3,
  hasPhoto: false,
  photoLength: 0
}

📋 Sites disponibles: 2 sites
📋 Rôles disponibles: [
  { id: 1, nom: "Administrateur" },
  { id: 3, nom: "Gestionnaire" },
  { id: 4, nom: "Super-Admin" }
]

🔍 Recherche pour idSite: 1 (type: string)
🔍 Recherche pour idRole: 3 (type: string)

✅ Site trouvé: HOPE DESIGN SERVICES (id: 1)
✅ Rôle trouvé: Gestionnaire (id: 3)

⚠️ Aucune photo dans userData - Vérifier la réponse API
📋 Champs disponibles: ["idUtilisateur", "nomUtilisateur", "prenomUtilisateur", ...]
```

**Résultat attendu :**
- ✅ Photo par défaut affichée (car pas de photo)
- ✅ Rôle "Gestionnaire" avec badge vert
- ✅ Site "HOPE DESIGN SERVICES"

---

## 🚀 PROCHAINES ÉTAPES

1. **Recharger** `/profile`
2. **Ouvrir la console** (F12)
3. **Copier TOUS les logs** qui apparaissent
4. **Vérifier** chaque étape A→E
5. **Identifier** quel cas s'applique
6. **Appliquer** la solution correspondante

---

## 📞 SI PROBLÈME PERSISTE

**Partagez ces informations :**
1. Screenshot des logs console
2. Réponse de `api.getUserById()` (onglet Network)
3. Réponse de `api.getRoles()` (onglet Network)
4. Quel utilisateur est connecté (nom, rôle attendu)

**Les logs détaillés permettront de diagnostiquer le problème exact !** 🔍

