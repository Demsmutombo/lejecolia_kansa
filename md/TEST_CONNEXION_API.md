# 🧪 Test de Connexion avec l'API

## 📋 Configuration Actuelle

**API Backend :** `https://mombongo.asdc-rdc.org/`

**Endpoints configurés :**
- 🔐 Authentification : `POST /api/Utilisateurs/Authentifier`
- 👥 Utilisateurs : `GET /api/Utilisateurs`

---

## ✅ Flux de Connexion Strict

### 1. **Page de Connexion**
```
URL: http://localhost:6600/signin
```

L'utilisateur entre :
- Email
- Mot de passe
- Clic sur "Se connecter"

### 2. **Appel API Automatique**

```javascript
POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier

Headers:
  Content-Type: application/json

Body:
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

### 3. **Traitement de la Réponse**

#### ✅ **Si SuperAdmin (role: "superadmin")**
```
Réponse API → Store Pinia → Redirection /dashboard-default
                           ↓
                    DashboardAdmin.vue chargé
                           ↓
                    Menu affiche: Sociétés, Utilisateurs
```

#### ✅ **Si Gestionnaire (role: "gestionnaire")**
```
Réponse API → Store Pinia → Redirection /dashboard-default
                           ↓
                    DashboardGestionnaire.vue chargé
                           ↓
                    Menu masque: Sociétés, Utilisateurs
```

#### ❌ **Si Erreur**
```
401 → "Email ou mot de passe incorrect"
403 → "Accès refusé"
500 → "Erreur de connexion. Veuillez réessayer."
```

---

## 📊 Format de Réponse Attendu

Votre API doit retourner **exactement** ces champs (ou adapter le mapping) :

```json
{
  "id": 1,
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "role": "superadmin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "societe_id": 1,
  "societe_name": "Hotel Congo",
  "societes": [
    { "id": 1, "name": "Hotel Congo" },
    { "id": 2, "name": "Restaurant Le Saveur" }
  ]
}
```

### Variantes acceptées

Le code gère plusieurs formats de noms de champs :
```javascript
id → response.id OU response.utilisateur_id
nom → response.nom OU response.name
role → response.role OU response.type_utilisateur
societe_id → response.societe_id OU response.societeId
societe_name → response.societe_name OU response.societeName
```

---

## 🔍 Vérifications à Faire

### Test 1 : Connexion SuperAdmin

1. Allez sur http://localhost:6600/signin
2. Entrez les identifiants d'un superadmin
3. Cliquez "Se connecter"

**Vérifications :**
- [ ] Redirection vers `/dashboard-default`
- [ ] Message "Mode Super Administrateur" visible
- [ ] Menu contient "ADMINISTRATION" avec "Sociétés" et "Utilisateurs"
- [ ] Sélecteur de société visible (si plusieurs sociétés)
- [ ] Dashboard affiche les statistiques globales

### Test 2 : Connexion Gestionnaire

1. Allez sur http://localhost:6600/signin
2. Entrez les identifiants d'un gestionnaire
3. Cliquez "Se connecter"

**Vérifications :**
- [ ] Redirection vers `/dashboard-default`
- [ ] Nom de la société affiché en en-tête
- [ ] Menu NE contient PAS "Sociétés" et "Utilisateurs"
- [ ] Dashboard affiche les statistiques de SA société uniquement
- [ ] Tentative d'accès manuel à `/societes` → Redirection `/dashboard-default`

### Test 3 : Protection des Routes

**Test SuperAdmin :**
```
✅ /dashboard-default → Accès OK
✅ /societes → Accès OK
✅ /utilisateurs → Accès OK
✅ /profile → Accès OK
```

**Test Gestionnaire :**
```
✅ /dashboard-default → Accès OK
❌ /societes → Redirection vers /dashboard-default
❌ /utilisateurs → Redirection vers /dashboard-default
✅ /profile → Accès OK
```

**Test Non Connecté :**
```
❌ /dashboard-default → Redirection vers /signin
❌ /societes → Redirection vers /signin
✅ /signin → Accès OK
```

---

## 🛠️ Adapter le Mapping API

Si votre API retourne des champs différents, modifiez le fichier `src/views/Signin.vue` (lignes 42-50) :

```javascript
// Exemple si votre API retourne "type" au lieu de "role"
login({
  id: response.id,
  name: response.nom,
  email: response.email,
  role: response.type,  // ← Changez ici selon votre API
  token: response.token,
  societeId: response.societe_id,
  societeName: response.societe_name,
  societes: response.societes
});
```

---

## 🔍 Débogage en Direct

### 1. Voir l'appel API dans le Network Tab

Ouvrez les DevTools (F12) → Onglet "Network" → Filtrer "Fetch/XHR"

Au moment de la connexion, vous verrez :
```
POST /api/Utilisateurs/Authentifier
Status: 200 (ou erreur)
Response: {...}
```

### 2. Voir les erreurs console

Si erreur, regardez la console (F12) :
```javascript
// Erreur affichée automatiquement
console.error('Erreur de connexion:', error);
```

### 3. Vérifier le store après connexion

Dans la console :
```javascript
import { useUserStore } from './src/stores/user.js';
const userStore = useUserStore();
console.log('Connecté?', userStore.isLoggedIn);
console.log('Rôle:', userStore.role);
console.log('Token:', userStore.token);
```

---

## 🎯 Ce qui se Passe à la Connexion

```
1. Utilisateur remplit le formulaire
   ↓
2. handleSignIn() appelé
   ↓
3. Validation des champs
   ↓
4. apiLogin(email, password)
   ↓
5. POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier
   ↓
6. Réponse API reçue
   ↓
7. login() du composable useAuth
   ↓
8. Sauvegarde dans Pinia store + sessionStorage
   ↓
9. Redirection automatique vers /dashboard-default
   ↓
10. Router guard vérifie le rôle
   ↓
11. Dashboard.vue charge le bon composant :
    - DashboardAdmin si role === 'superadmin'
    - DashboardGestionnaire si role === 'gestionnaire'
```

---

## ⚠️ Points Importants

### Valeurs de rôle acceptées

Le système reconnaît :
- `"superadmin"` → Dashboard Admin + Accès complet
- `"gestionnaire"` → Dashboard Gestionnaire + Accès limité

**Assurez-vous que votre API retourne exactement ces valeurs !**

Si votre API retourne d'autres valeurs (ex: "admin", "manager"), modifiez :
```javascript
// Dans src/views/Signin.vue
role: response.role === 'admin' ? 'superadmin' : 'gestionnaire'
```

### Token JWT

Le token est automatiquement ajouté à tous les appels API suivants via l'intercepteur Axios :
```
Authorization: Bearer <votre_token>
```

### Session Persistante

La session est sauvegardée dans `sessionStorage` et restaurée automatiquement au rechargement de la page.

---

## 🚀 Prêt à Tester !

**Allez sur :** http://localhost:6600/signin

1. Entrez vos identifiants réels
2. Cliquez "Se connecter"
3. L'application appellera automatiquement votre API
4. Redirection automatique selon votre rôle !

---

## 📞 Support API

Si vous rencontrez des erreurs CORS ou de connexion :

1. **Vérifiez que le backend autorise les requêtes depuis localhost:6600**
2. **Configurez CORS** sur votre backend :
```
Access-Control-Allow-Origin: http://localhost:6600
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

3. **Testez l'endpoint manuellement** :
```bash
curl -X POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

✅ **La connexion passe maintenant STRICTEMENT par le login avec votre API !**  
🎯 **Redirection automatique selon le rôle** (superadmin → espace admin, gestionnaire → espace gestionnaire)

