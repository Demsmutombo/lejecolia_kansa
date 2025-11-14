# 🔐 Guide de Connexion - Système Multi-Rôle

## 🚀 Comment se connecter

### **Méthode 1 : Connexion avec votre API (RECOMMANDÉ)**

1. Allez sur http://localhost:6600/signin
2. Entrez vos identifiants (email et mot de passe)
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers le dashboard adapté à votre rôle

**L'application appelle automatiquement :**
```
POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier
Body: { email: "...", password: "..." }
```

**Réponse attendue de l'API :**
```json
{
  "id": 1,
  "nom": "John Doe",
  "email": "john@example.com",
  "role": "superadmin",  // ou "gestionnaire"
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "societe_id": 1,
  "societe_name": "Ma Société",
  "societes": [
    { "id": 1, "name": "Société 1" },
    { "id": 2, "name": "Société 2" }
  ]
}
```

### **Méthode 2 : Test rapide sans API**

Sur la page de connexion (http://localhost:6600/signin), vous verrez deux boutons :

1. **Bouton "Admin"** - Se connecter en tant que SuperAdmin
2. **Bouton "Gestionnaire"** - Se connecter en tant que Gestionnaire

Ces boutons permettent de tester le système sans appeler l'API réelle.

⚠️ **À supprimer en production** - Ces boutons sont uniquement pour le développement.

---

## 🎭 Les Deux Rôles

### 👑 **SuperAdmin**
**Accès à :**
- ✅ Dashboard avec vue d'ensemble de toutes les sociétés
- ✅ Gestion des sociétés (`/societes`)
- ✅ Gestion de tous les utilisateurs (`/utilisateurs`)
- ✅ Sélecteur de société pour changer la société active
- ✅ Toutes les fonctionnalités

**Menu visible :**
- Dashboard
- Tables
- Billing
- Profile
- **Sociétés** ← Uniquement SuperAdmin
- **Utilisateurs** ← Uniquement SuperAdmin

### 👔 **Gestionnaire**
**Accès à :**
- ✅ Dashboard avec données de SA société uniquement
- ✅ Gestion de son équipe
- ✅ Statistiques de sa société
- ❌ Ne peut PAS accéder aux pages Sociétés et Utilisateurs

**Menu visible :**
- Dashboard
- Tables
- Billing
- Profile

---

## 🔄 Flux de Connexion

### 1. **Utilisateur entre email/password**
```
Page: /signin
↓
Formulaire rempli
↓
Clic sur "Se connecter"
```

### 2. **Appel API**
```
POST https://mombongo.asdc-rdc.org/api/Utilisateurs/Authentifier
Headers: { Content-Type: application/json }
Body: { email: "...", password: "..." }
```

### 3. **Traitement de la réponse**
```javascript
// Si succès (200)
✅ Stockage des données dans Pinia store
✅ Sauvegarde dans sessionStorage
✅ Redirection vers /dashboard-default

// Si erreur (401)
❌ Affichage : "Email ou mot de passe incorrect"

// Si erreur (403)
❌ Affichage : "Accès refusé"

// Autre erreur
❌ Affichage : "Erreur de connexion"
```

### 4. **Protection automatique**
```
Router Guard (beforeEach)
↓
Vérification : isLoggedIn ?
↓
Vérification : role === superadmin ? (si route requiresSuperAdmin)
↓
Accès accordé ou redirection
```

---

## 🛠️ Structure Backend Attendue

### Endpoint d'authentification

**URL :** `POST /api/Utilisateurs/Authentifier`

**Request Body :**
```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

**Response (Success - 200) :**
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

**Response (Error - 401) :**
```json
{
  "error": "Identifiants incorrects"
}
```

### Autres endpoints protégés

Tous les endpoints nécessitant l'authentification doivent :
1. Vérifier le header `Authorization: Bearer <token>`
2. Valider le token JWT
3. Retourner 401 si token invalide/expiré
4. Filtrer les données selon la société de l'utilisateur

**Exemple :**
```javascript
// Backend - Filtrage automatique selon le rôle
if (user.role === 'gestionnaire') {
  // Retourner UNIQUEMENT les données de SA société
  return data.filter(item => item.societe_id === user.societe_id);
} else if (user.role === 'superadmin') {
  // Peut voir toutes les sociétés
  return data;
}
```

---

## 💡 Exemples d'Utilisation

### Connexion programmatique

```javascript
import { useAuth } from '@/composables';

const { login } = useAuth();

// Après avoir reçu les données de l'API
login({
  id: userData.id,
  name: userData.nom,
  email: userData.email,
  role: userData.role,
  token: userData.token,
  societeId: userData.societe_id,
  societeName: userData.societe_name,
  societes: userData.societes
});
```

### Vérification du rôle dans un composant

```vue
<script setup>
import { useAuth } from '@/composables';

const { isSuperAdmin, isGestionnaire, societeName } = useAuth();
</script>

<template>
  <div>
    <h3 v-if="isSuperAdmin">Dashboard Super Admin</h3>
    <h3 v-if="isGestionnaire">Dashboard - {{ societeName }}</h3>
  </div>
</template>
```

### Appel API avec filtre société

```javascript
import { useAuth } from '@/composables';
import api from '@/services/api.service';

const { societeId, isSuperAdmin } = useAuth();

// Charger les données
const loadData = async () => {
  const params = {};
  
  // Le gestionnaire voit uniquement sa société
  if (!isSuperAdmin.value) {
    params.societe_id = societeId.value;
  }
  
  const data = await api.getUsers(params);
};
```

---

## 🔒 Sécurité

### Frontend (✅ Déjà implémenté)
- ✅ Token stocké dans sessionStorage
- ✅ Routes protégées par guards
- ✅ Déconnexion automatique si token expiré (401)
- ✅ Menu adapté au rôle
- ✅ Composants dashboards différents selon le rôle

### Backend (⚠️ À implémenter côté serveur)
- Valider TOUJOURS le token JWT côté serveur
- Vérifier le rôle avant de retourner des données
- Filtrer les données selon la société de l'utilisateur
- Ne JAMAIS faire confiance aux données du frontend

---

## 🧪 Test de Connexion

### Test 1 : SuperAdmin

**Via les boutons de test :**
1. Allez sur http://localhost:6600/signin
2. Cliquez sur le bouton "Admin"
3. Vérifiez :
   - ✅ Redirection vers /dashboard-default
   - ✅ Menu affiche "Sociétés" et "Utilisateurs"
   - ✅ Dashboard affiche "Mode Super Administrateur"
   - ✅ Sélecteur de société visible (si plusieurs sociétés)

### Test 2 : Gestionnaire

**Via les boutons de test :**
1. Allez sur http://localhost:6600/signin
2. Cliquez sur le bouton "Gestionnaire"
3. Vérifiez :
   - ✅ Redirection vers /dashboard-default
   - ✅ Menu NE montre PAS "Sociétés" et "Utilisateurs"
   - ✅ Dashboard affiche le nom de la société
   - ✅ Tentative d'accès à /societes → Redirection vers /dashboard

### Test 3 : Connexion réelle avec API

1. Entrez un email et mot de passe valide de votre base de données
2. Cliquez sur "Se connecter"
3. L'application appelle votre API et se connecte

---

## 🐛 Débogage

### Voir les données utilisateur dans la console

```javascript
import { useAuth } from '@/composables';
const auth = useAuth();

console.log('Connecté?', auth.isLoggedIn.value);
console.log('Rôle:', auth.role.value);
console.log('Société:', auth.societeName.value);
console.log('Token:', auth.token?.value);
```

### Vérifier le sessionStorage

Ouvrez la console du navigateur :
```javascript
// Voir les données sauvegardées
console.log(JSON.parse(sessionStorage.getItem('user')));
```

### Forcer une déconnexion

```javascript
import { useAuth } from '@/composables';
const { logout } = useAuth();
logout();
```

---

## 📝 Checklist Déploiement

Avant de déployer en production :

- [ ] Supprimer les boutons "Admin" et "Gestionnaire" de test dans `Signin.vue`
- [ ] Configurer les vraies URLs d'API dans `src/config/api.js`
- [ ] Implémenter la validation backend des tokens
- [ ] Ajouter HTTPS pour les connexions
- [ ] Configurer CORS sur le backend
- [ ] Implémenter le refresh token
- [ ] Ajouter la page "Mot de passe oublié"
- [ ] Tester tous les scénarios de connexion/déconnexion

---

## 🎯 Prochaines Étapes

1. **Tester la connexion** avec les boutons rapides
2. **Vérifier la structure** de la réponse de votre API
3. **Adapter le mapping** des champs si nécessaire dans `Signin.vue` (lignes 42-50)
4. **Développer les pages** Sociétés et Utilisateurs
5. **Implémenter la logique métier** selon vos besoins

---

**✅ Tout est prêt ! Rendez-vous sur http://localhost:6600/signin pour vous connecter !** 🚀

