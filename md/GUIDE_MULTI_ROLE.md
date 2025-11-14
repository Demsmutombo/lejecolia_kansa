# 🔐 Guide Système Multi-Rôle

## Vue d'ensemble

Ce système permet de gérer deux types d'utilisateurs dans l'application :
- **Super Admin** : Crée et gère plusieurs sociétés, accède à toutes les fonctionnalités
- **Gestionnaire** : Gère uniquement sa propre société

## 📋 Ce qui a été implémenté

### ✅ 1. Store Pinia (stores/user.js)

Le store gère toutes les informations utilisateur :

```javascript
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// Propriétés disponibles
userStore.isLoggedIn      // boolean
userStore.role            // 'superadmin' | 'gestionnaire'
userStore.token           // string
userStore.societeId       // number/string
userStore.societeName     // string
userStore.isSuperAdmin    // computed boolean
userStore.isGestionnaire  // computed boolean
```

**Méthodes disponibles :**
- `login(userData)` - Connexion
- `logout()` - Déconnexion
- `changeSociete(id, name)` - Changer de société (superadmin)
- `canAccess(role)` - Vérifier les permissions

### ✅ 2. Router avec Guards (router/index.js)

Toutes les routes sont protégées automatiquement :

```javascript
// Route accessible à tous les utilisateurs connectés
{
  path: "/dashboard",
  component: Dashboard,
  meta: { requiresAuth: true }
}

// Route réservée au superadmin
{
  path: "/societes",
  component: Societes,
  meta: { 
    requiresAuth: true,
    requiresSuperAdmin: true 
  }
}
```

**Le guard vérifie automatiquement :**
1. Si l'utilisateur est connecté
2. Si l'utilisateur a le bon rôle
3. Redirige vers `/signin` ou `/dashboard` si nécessaire

### ✅ 3. Dashboard Dynamique

Le dashboard principal (`views/Dashboard.vue`) charge automatiquement le bon composant :

```vue
<template>
  <dashboard-admin v-if="isSuperAdmin" />
  <dashboard-gestionnaire v-else-if="isGestionnaire" />
</template>
```

**Deux dashboards différents :**
- `DashboardAdmin.vue` - Vue d'ensemble de toutes les sociétés
- `DashboardGestionnaire.vue` - Vue de sa propre société

### ✅ 4. Menu Adaptatif (Sidenav)

Le menu latéral s'adapte automatiquement au rôle :

```vue
<!-- Visible uniquement pour le superadmin -->
<li v-if="isSuperAdmin">
  <router-link to="/societes">Sociétés</router-link>
</li>

<!-- Visible pour tous les utilisateurs connectés -->
<li v-if="isLoggedIn">
  <a @click="handleLogout">Déconnexion</a>
</li>
```

### ✅ 5. Composable useAuth

Simplifie l'utilisation de l'authentification :

```javascript
import { useAuth } from '@/composables';

const { 
  isLoggedIn, 
  isSuperAdmin, 
  login, 
  logout 
} = useAuth();
```

## 🚀 Comment utiliser

### Connexion d'un utilisateur

```javascript
import { useAuth } from '@/composables';

const { login } = useAuth();

// Exemple de connexion
login({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'superadmin', // ou 'gestionnaire'
  token: 'jwt_token_here',
  societeId: 1,
  societeName: 'Ma Société',
  societes: [
    { id: 1, name: 'Société 1' },
    { id: 2, name: 'Société 2' }
  ]
});
```

### Vérifier le rôle dans un composant

```vue
<script setup>
import { useAuth } from '@/composables';

const { isSuperAdmin, isGestionnaire, canAccess } = useAuth();

// Vérifier si superadmin
if (isSuperAdmin.value) {
  console.log('Utilisateur est superadmin');
}

// Vérifier l'accès à une fonctionnalité
if (canAccess('superadmin')) {
  // Afficher fonctionnalité réservée
}
</script>

<template>
  <div>
    <button v-if="isSuperAdmin">Gérer les sociétés</button>
    <button v-if="isGestionnaire">Gérer mon équipe</button>
  </div>
</template>
```

### Changer de société (Superadmin)

```javascript
import { useAuth } from '@/composables';

const { changeSociete } = useAuth();

// Le superadmin change de société active
changeSociete(2, 'Société 2');

// Les données du dashboard se rechargeront pour cette société
```

### Protéger une page

```vue
<script setup>
import { useAuth } from '@/composables';

const { requireAuth, requireSuperAdmin } = useAuth();

// Méthode 1: Vérifier l'authentification
requireAuth(); // Redirige vers /signin si pas connecté

// Méthode 2: Vérifier le rôle superadmin
requireSuperAdmin(); // Redirige si pas superadmin
</script>
```

### Afficher du contenu conditionnel

```vue
<template>
  <!-- Section superadmin -->
  <div v-if="isSuperAdmin">
    <h3>Gestion globale</h3>
    <mini-statistics-card
      title="Toutes les sociétés"
      :value="totalSocietes"
    />
  </div>

  <!-- Section gestionnaire -->
  <div v-if="isGestionnaire">
    <h3>{{ societeName }}</h3>
    <mini-statistics-card
      title="Mon équipe"
      :value="myTeamSize"
    />
  </div>
</template>

<script setup>
import { useAuth } from '@/composables';
import { MiniStatisticsCard } from '@/examples';

const { isSuperAdmin, isGestionnaire, societeName } = useAuth();
</script>
```

## 🔧 Intégration avec une API

### Exemple de connexion avec API

```vue
<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables';
import axios from 'axios';

const { login } = useAuth();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    // Appel API
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    });

    // Connexion avec les données de l'API
    login({
      id: response.data.user.id,
      name: response.data.user.nom,
      email: response.data.user.email,
      role: response.data.user.role, // 'superadmin' ou 'gestionnaire'
      token: response.data.token,
      societeId: response.data.user.societe_id,
      societeName: response.data.user.societe_name,
      societes: response.data.user.societes || []
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};
</script>
```

### Exemple de requête avec filtre société

```javascript
import { useAuth } from '@/composables';
import axios from 'axios';

const { societeId, isSuperAdmin } = useAuth();

// Charger les données selon le rôle
const loadData = async () => {
  if (isSuperAdmin.value) {
    // Superadmin : charger toutes les données ou filtrées par société active
    const response = await axios.get('/api/data', {
      params: { societe_id: societeId.value }
    });
  } else {
    // Gestionnaire : charger uniquement les données de sa société
    const response = await axios.get('/api/data', {
      params: { societe_id: societeId.value }
    });
  }
};
```

## 📁 Structure des fichiers

```
src/
├── stores/
│   └── user.js                    ← Store Pinia multi-rôle
├── composables/
│   ├── useAuth.js                 ← Composable authentification
│   └── index.js                   ← Export des composables
├── components/
│   └── dashboard/
│       ├── DashboardAdmin.vue     ← Dashboard superadmin
│       └── DashboardGestionnaire.vue ← Dashboard gestionnaire
├── views/
│   ├── Dashboard.vue              ← Dashboard principal (dynamique)
│   ├── Societes.vue               ← Page sociétés (superadmin)
│   └── Utilisateurs.vue           ← Page utilisateurs (superadmin)
├── examples/
│   └── Sidenav/
│       └── SidenavList.vue        ← Menu adaptatif
└── router/
    └── index.js                   ← Router avec guards
```

## 🎯 Cas d'usage courants

### 1. Créer une nouvelle page réservée au superadmin

```javascript
// router/index.js
{
  path: "/nouvelle-page",
  name: "NouvellePage",
  component: () => import("../views/NouvellePage.vue"),
  meta: { 
    requiresAuth: true,
    requiresSuperAdmin: true 
  }
}
```

```vue
<!-- SidenavList.vue -->
<li class="nav-item" v-if="isSuperAdmin">
  <sidenav-item to="/nouvelle-page" navText="Nouvelle Page">
    <template v-slot:icon>
      <i class="ni ni-planet text-primary"></i>
    </template>
  </sidenav-item>
</li>
```

### 2. Afficher des statistiques différentes selon le rôle

```vue
<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables';

const { isSuperAdmin, societeId } = useAuth();
const stats = ref({});

// Charger les bonnes statistiques
const loadStats = async () => {
  if (isSuperAdmin.value) {
    // Stats globales ou par société active
    stats.value = await fetchAdminStats(societeId.value);
  } else {
    // Stats de la société du gestionnaire
    stats.value = await fetchGestionnaireStats(societeId.value);
  }
};
</script>
```

### 3. Bouton d'action selon le rôle

```vue
<template>
  <!-- Superadmin peut tout faire -->
  <argon-button 
    v-if="isSuperAdmin" 
    @click="deleteItem"
    color="danger"
  >
    Supprimer
  </argon-button>

  <!-- Gestionnaire peut seulement modifier -->
  <argon-button 
    v-else 
    @click="editItem"
    color="info"
  >
    Modifier
  </argon-button>
</template>
```

## ⚠️ Points importants

1. **Session persistante** : Les données utilisateur sont sauvegardées dans `sessionStorage`
2. **Restauration automatique** : La session est restaurée au rechargement de la page
3. **Token JWT** : Utilisez le `token` pour les appels API authentifiés
4. **Société active** : Pour le superadmin, `societeId` indique la société en cours de gestion

## 🔒 Sécurité

**Frontend** (déjà implémenté) :
- ✅ Guards de navigation
- ✅ Affichage conditionnel
- ✅ Protection des routes

**Backend** (à implémenter) :
- ⚠️ Toujours valider le rôle côté serveur
- ⚠️ Ne pas faire confiance au token côté client
- ⚠️ Filtrer les données selon la société de l'utilisateur

```javascript
// Exemple de validation backend
app.get('/api/data', authenticate, (req, res) => {
  const { role, societeId } = req.user;
  
  if (role === 'gestionnaire') {
    // Ne retourner QUE les données de sa société
    return Data.findBySociete(societeId);
  } else if (role === 'superadmin') {
    // Peut voir toutes les sociétés
    return Data.findAll();
  }
});
```

## 📖 Exemples complets

Consultez les fichiers suivants pour des exemples complets :
- `src/components/dashboard/DashboardAdmin.vue`
- `src/components/dashboard/DashboardGestionnaire.vue`
- `src/views/Dashboard.vue`
- `src/examples/Sidenav/SidenavList.vue`

## 🐛 Débogage

```javascript
import { useAuth } from '@/composables';

const auth = useAuth();

// Afficher les informations de l'utilisateur
console.log('Utilisateur connecté:', auth.isLoggedIn.value);
console.log('Rôle:', auth.role.value);
console.log('Société active:', auth.societeId.value, auth.societeName.value);
console.log('Est superadmin?', auth.isSuperAdmin.value);
```

---

**✅ Le système multi-rôle est maintenant opérationnel !**

Toutes les fonctionnalités sont en place et prêtes à être utilisées. Il ne reste qu'à :
1. Connecter votre API backend
2. Ajouter les pages spécifiques à vos besoins
3. Implémenter la logique métier selon vos sociétés

**Note** : Pour tester, vous pouvez simuler une connexion dans la console du navigateur :
```javascript
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
userStore.login({
  id: 1,
  name: 'Test User',
  role: 'superadmin',
  societeId: 1,
  societeName: 'Test Corp'
});
```

