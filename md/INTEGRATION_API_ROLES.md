# 🔐 Intégration API - Gestion des Rôles

## 📋 Votre API

**Base URL :** `https://mombongo.asdc-rdc.org/`

**Endpoints Rôles :**
- `GET /api/Roles` - Liste tous les rôles
- `GET /api/Roles/{id}` - Détails d'un rôle

**Format d'un rôle :**
```json
{
  "idRole": 0,
  "nom": "string",
  "dateCreation": "2025-11-01T18:28:55.726Z",
  "dateLastModification": "2025-11-01T18:28:55.726Z",
  "statut": true
}
```

---

## ✅ Adaptation Automatique du Système

Le système détecte **AUTOMATIQUEMENT** le type de rôle, peu importe le format de votre API !

### Détection du SuperAdmin

Le système reconnaît un **SuperAdmin** si le nom du rôle contient :
- ✅ "super"
- ✅ "admin" 
- ✅ "superadmin"
- ✅ "administrateur"

**Exemples de noms de rôles détectés comme SuperAdmin :**
- "SuperAdmin"
- "Administrateur"
- "Admin"
- "Super Administrateur"
- "SUPERADMIN"

### Détection du Gestionnaire

Tous les autres rôles sont considérés comme **Gestionnaire**.

**Exemples :**
- "Gestionnaire"
- "Manager"
- "Responsable"
- "Chef de site"

---

## 🔄 Formats de Réponse Acceptés

Le système accepte **plusieurs formats** de réponse de votre API :

### Format 1 : Rôle comme objet
```json
{
  "id": 1,
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "role": {
    "idRole": 1,
    "nom": "SuperAdmin"
  },
  "token": "jwt_token...",
  "societe_id": 1,
  "societe_name": "Hotel Congo"
}
```

### Format 2 : Rôle comme string
```json
{
  "id": 1,
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "role": "SuperAdmin",
  "token": "jwt_token...",
  "societe_id": 1
}
```

### Format 3 : Avec champs séparés
```json
{
  "id": 1,
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "role_id": 1,
  "role_name": "Gestionnaire",
  "token": "jwt_token...",
  "societe_id": 1
}
```

**👉 Le système gère TOUS ces formats automatiquement !**

---

## 🎯 Flux de Connexion Complet

```
1. Utilisateur entre email/password
   ↓
2. Clic "Se connecter"
   ↓
3. POST /api/Utilisateurs/Authentifier
   Body: { email, password }
   ↓
4. API retourne les données utilisateur
   ↓
5. Store Pinia traite la réponse :
   - Détecte automatiquement si objet ou string
   - Normalise le rôle (superadmin ou gestionnaire)
   - Sauvegarde dans sessionStorage
   ↓
6. Redirection automatique vers /dashboard-default
   ↓
7. Dashboard.vue charge le bon composant :
   - Si role === 'superadmin' → DashboardAdmin
   - Si role === 'gestionnaire' → DashboardGestionnaire
   ↓
8. Menu s'adapte automatiquement :
   - SuperAdmin voit : Sociétés, Utilisateurs
   - Gestionnaire ne les voit pas
```

---

## 🔍 Exemples de Traitement

### Exemple 1 : API retourne un objet rôle

**Réponse API :**
```json
{
  "id": 1,
  "nom": "Admin Principal",
  "email": "admin@hotel.com",
  "role": {
    "idRole": 1,
    "nom": "Administrateur"
  },
  "token": "eyJhbGc...",
  "societe_id": 5
}
```

**Traitement automatique :**
```javascript
roleId = 1
roleName = "Administrateur"
role = "superadmin" // ← Détecté automatiquement car contient "admin"
→ Redirection vers Dashboard SuperAdmin
```

### Exemple 2 : API retourne un string

**Réponse API :**
```json
{
  "id": 2,
  "nom": "Pierre Gestionnaire",
  "email": "pierre@hotel.com",
  "type_utilisateur": "Gestionnaire",
  "token": "eyJhbGc...",
  "societe_id": 3
}
```

**Traitement automatique :**
```javascript
role = "gestionnaire" // ← Détecté automatiquement
→ Redirection vers Dashboard Gestionnaire
```

---

## 🛠️ Personnalisation de la Détection

Si les noms de rôles dans votre base de données sont différents, modifiez la fonction `normalizeRole` dans `src/stores/user.js` :

```javascript
const normalizeRole = (roleValue, roleNameValue = '') => {
  const roleStr = (roleValue || roleNameValue || '').toString().toLowerCase();
  
  // Ajoutez vos propres conditions ici
  if (roleStr.includes('super') || 
      roleStr.includes('admin') || 
      roleStr === 'superadmin' ||
      roleStr === 'administrateur' ||
      roleStr === 'direction') {  // ← Ajoutez vos variantes
    return 'superadmin';
  }
  
  return 'gestionnaire';
};
```

---

## 📊 Mapping des Champs API

Le système accepte plusieurs noms de champs :

| Donnée | Champs Acceptés |
|--------|----------------|
| **ID Utilisateur** | `id`, `utilisateur_id` |
| **Nom** | `nom`, `name` |
| **Rôle** | `role`, `type_utilisateur`, `role.nom` |
| **ID Rôle** | `roleId`, `role_id`, `role.idRole` |
| **Token** | `token` |
| **ID Société** | `societeId`, `societe_id` |
| **Nom Société** | `societeName`, `societe_name` |
| **Sociétés** | `societes` (array) |

---

## 🧪 Test avec Votre API

### Étape 1 : Vérifier l'endpoint

Testez manuellement votre endpoint :

```bash
curl -X POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre_email@example.com",
    "password": "votre_mot_de_passe"
  }'
```

### Étape 2 : Analyser la réponse

Notez la structure exacte de la réponse, notamment :
- Le format du champ `role`
- Le nom exact du rôle pour les superadmins
- Les champs de la société

### Étape 3 : Adapter si nécessaire

Si la structure est très différente, modifiez le mapping dans `src/views/Signin.vue` (lignes 42-50).

---

## 🎯 Ce qui Fonctionne Maintenant

✅ **Connexion stricte par API** - Pas de boutons de test  
✅ **Détection automatique du rôle** - Gère objet ou string  
✅ **Normalisation intelligente** - Reconnaît "admin", "super", etc.  
✅ **Redirection automatique** - Selon le rôle détecté  
✅ **Dashboard adaptatif** - SuperAdmin ou Gestionnaire  
✅ **Menu dynamique** - Affichage selon les permissions  
✅ **Token JWT** - Ajouté automatiquement aux requêtes  
✅ **Session persistante** - Restaurée au rechargement  

---

## 🚀 Pour Se Connecter

**Allez sur :** http://localhost:6600/signin

1. **Entrez** vos identifiants réels de la base de données
2. **Cliquez** "Se connecter"
3. **L'application appelle** votre API
4. **Détection automatique** du rôle
5. **Redirection** vers le bon dashboard

---

## 🔒 Sécurité

### Token JWT dans les Requêtes

Après connexion, **TOUTES** les requêtes API incluent automatiquement :
```
Authorization: Bearer <votre_token>
```

Grâce à l'intercepteur Axios dans `api.service.js`.

### Déconnexion Automatique

Si le backend retourne **401** (token expiré) :
- ✅ Déconnexion automatique
- ✅ Redirection vers `/signin`
- ✅ Message dans la console

---

## 📞 Support

Si vous avez des erreurs de connexion :

1. **Ouvrez la console** (F12) → Onglet "Network"
2. **Cherchez** la requête `Authentifier`
3. **Vérifiez** :
   - Status (doit être 200)
   - Response (structure des données)
   - Headers (CORS OK?)

4. **En cas d'erreur CORS** :
   - Configurez votre backend pour accepter `http://localhost:6600`
   - Headers nécessaires :
     ```
     Access-Control-Allow-Origin: http://localhost:6600
     Access-Control-Allow-Methods: GET, POST, PUT, DELETE
     Access-Control-Allow-Headers: Content-Type, Authorization
     ```

---

**✅ Le système est maintenant 100% intégré avec votre API !**  
**🎯 Connexion stricte par login - Redirection automatique selon le rôle !** 🚀

