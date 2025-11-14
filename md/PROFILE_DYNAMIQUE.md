# 👤 PAGE PROFIL DYNAMIQUE

## 🎯 OBJECTIF

Afficher **dynamiquement** toutes les informations de l'utilisateur connecté dans la page **Profile** en utilisant le **store Pinia** existant.

---

## ✅ MODIFICATIONS APPLIQUÉES

### Source des Données

**Store Pinia `useUserStore`** :
```javascript
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

// Données disponibles :
userStore.userName      // Nom complet
userStore.userEmail     // Email
userStore.role          // Rôle (ex: "superadmin")
userStore.roleName      // Nom du rôle
userStore.societeName   // Nom de la société
userStore.userId        // ID utilisateur
userStore.roleId        // ID du rôle
userStore.societeId     // ID de la société
userStore.isLoggedIn    // Statut de connexion
userStore.userSocietes  // Liste des sociétés (SuperAdmin)
```

---

## 🎨 SECTIONS DE LA PAGE

### 1. Header avec Photo de Profil

```
┌─────────────────────────────────┐
│  [IMAGE DE FOND]                │
│                                 │
│  📷 [Nom Utilisateur]           │
│     [Badge Rôle]                │
└─────────────────────────────────┘
```

**Affiche :**
- Photo de profil (par défaut)
- Nom complet de l'utilisateur
- Badge coloré selon le rôle

### 2. Informations Principales (Gauche)

**Informations utilisateur :**
- ✅ Nom complet
- ✅ Email

**Rôle et permissions :**
- ✅ Rôle (avec badge coloré)
- ✅ ID Rôle

**Société :**
- ✅ Nom de la société
- ✅ ID Société
- ✅ Sociétés gérées (si SuperAdmin)

### 3. Informations de Session (Droite)

**Détails de session :**
- ✅ ID Utilisateur
- ✅ Statut (Connecté/Déconnecté)
- ✅ Rôle ID
- ✅ Société ID

**Actions rapides :**
- ✅ Retour au Dashboard
- ✅ Gérer les utilisateurs (SuperAdmin uniquement)
- ✅ Gérer les sociétés (SuperAdmin uniquement)

---

## 🎨 BADGES COLORÉS PAR RÔLE

| Rôle | Couleur | Badge |
|------|---------|-------|
| **Super-Admin** | Rouge | 🔴 `bg-gradient-danger` |
| **Gestionnaire** | Vert | 🟢 `bg-gradient-success` |
| **Admin** | Bleu | 🔵 `bg-gradient-info` |
| **Autre** | Gris | ⚪ `bg-gradient-secondary` |

**Fonction de détection :**
```javascript
const roleBadgeColor = computed(() => {
  const role = user.value.role.toLowerCase();
  if (role.includes('superadmin')) return 'bg-gradient-danger';
  if (role.includes('gestionnaire')) return 'bg-gradient-success';
  if (role.includes('admin')) return 'bg-gradient-info';
  return 'bg-gradient-secondary';
});
```

---

## 📊 AFFICHAGE SELON LE RÔLE

### SuperAdmin

**Voit :**
- ✅ Toutes ses informations
- ✅ Liste des sociétés qu'il gère
- ✅ Bouton "Gérer les utilisateurs"
- ✅ Bouton "Gérer les sociétés"

```
┌─────────────────────────────────┐
│ 👤 Jean DUPONT                  │
│ 🔴 Super Administrateur          │
├─────────────────────────────────┤
│ Nom: Jean DUPONT                │
│ Email: jean@example.com         │
│ Rôle: Super Administrateur      │
│ Sociétés gérées:                │
│ [Société 1] [Société 2]         │
├─────────────────────────────────┤
│ [🏠 Dashboard]                  │
│ [👥 Gérer utilisateurs]         │
│ [🏢 Gérer sociétés]             │
└─────────────────────────────────┘
```

### Gestionnaire

**Voit :**
- ✅ Toutes ses informations
- ✅ Sa société
- ✅ Bouton "Retour au Dashboard"

```
┌─────────────────────────────────┐
│ 👤 Marie MARTIN                 │
│ 🟢 Gestionnaire                  │
├─────────────────────────────────┤
│ Nom: Marie MARTIN               │
│ Email: marie@example.com        │
│ Rôle: Gestionnaire              │
│ Société: Ma Société             │
├─────────────────────────────────┤
│ [🏠 Dashboard]                  │
└─────────────────────────────────┘
```

---

## 🔄 DONNÉES DYNAMIQUES

### Mise à Jour Automatique

Les données sont **réactives** grâce à Vue :
```javascript
const user = computed(() => ({
  nom: userStore.userName,
  email: userStore.userEmail,
  role: userStore.roleName || userStore.role,
  societe: userStore.societeName,
  // ...
}));
```

**Si l'utilisateur change de société** (SuperAdmin) :
- ✅ Le profil se met à jour automatiquement
- ✅ Le badge se met à jour
- ✅ Les informations restent synchronisées

---

## 🎯 NAVIGATION RAPIDE

### Boutons d'Action

**Retour au Dashboard :**
```javascript
@click="$router.push('/dashboard')"
```

**Gérer les utilisateurs :** (SuperAdmin uniquement)
```javascript
v-if="user.role.toLowerCase().includes('superadmin')"
@click="$router.push('/utilisateurs')"
```

**Gérer les sociétés :** (SuperAdmin uniquement)
```javascript
v-if="user.role.toLowerCase().includes('superadmin')"
@click="$router.push('/societes')"
```

---

## 📱 RESPONSIVE

### Desktop

```
┌─────────────────────────────────────────────┐
│  [Header Image]                             │
│  👤 Jean DUPONT - 🔴 Super Admin            │
├──────────────────────┬──────────────────────┤
│ Informations         │ Session              │
│ ----------------     │ ----------------     │
│ Nom: ...             │ ID: 1                │
│ Email: ...           │ Statut: Connecté     │
│ Rôle: ...            │ Rôle ID: 4           │
│                      │ [Actions]            │
└──────────────────────┴──────────────────────┘
```

### Mobile

```
┌─────────────────────┐
│ [Header Image]      │
│ 👤 Jean DUPONT      │
│ 🔴 Super Admin      │
├─────────────────────┤
│ Informations        │
│ ---------------     │
│ Nom: ...            │
│ Email: ...          │
├─────────────────────┤
│ Session             │
│ ---------------     │
│ ID: 1               │
│ Statut: Connecté    │
├─────────────────────┤
│ [Actions]           │
└─────────────────────┘
```

---

## 🔒 SÉCURITÉ

### Données Protégées

✅ **Aucune donnée sensible** affichée (pas de mot de passe)  
✅ **Données du store uniquement** (déjà authentifiées)  
✅ **Boutons adaptés au rôle** (SuperAdmin vs Gestionnaire)  

### Accès

- ✅ **Authentification requise** (`requiresAuth: true`)
- ✅ Chaque utilisateur voit **ses propres informations**
- ✅ Pas d'accès aux données d'autres utilisateurs

---

## 🧪 TESTER

**La page `/profile` est ouverte !**

### Vérifications

1. **Photo de profil** affichée en haut
2. **Nom** de l'utilisateur connecté
3. **Badge rôle** avec la bonne couleur :
   - 🔴 Rouge pour SuperAdmin
   - 🟢 Vert pour Gestionnaire
4. **Email** correct
5. **Société** correcte
6. **Boutons d'action** adaptés au rôle
7. **Statut** : Badge "Connecté" en vert

### Tester avec Différents Rôles

**SuperAdmin :**
- Voir "Gérer les utilisateurs"
- Voir "Gérer les sociétés"
- Badge rouge

**Gestionnaire :**
- Pas de boutons admin
- Badge vert
- Société affichée

---

## 📁 FICHIER MODIFIÉ

### `src/views/Profile.vue`

**Avant :**
```vue
<h5>Sayo Kravits</h5>
<p>Public Relations</p>
```
❌ Données statiques hardcodées

**Après :**
```vue
<h5>{{ user.nom }}</h5>
<span :class="`badge ${roleBadgeColor}`">
  {{ roleDisplay }}
</span>
```
✅ Données dynamiques du store

**Script :**
```javascript
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const user = computed(() => ({
  nom: userStore.userName,
  email: userStore.userEmail,
  role: userStore.roleName,
  // ... toutes les données disponibles
}));
```

---

## 🎯 DONNÉES AFFICHÉES

| Information | Source Store | Affichage |
|-------------|--------------|-----------|
| **Nom complet** | `userName` | Titre + Champ |
| **Email** | `userEmail` | Champ |
| **Rôle** | `roleName` / `role` | Badge coloré |
| **Société** | `societeName` | Champ |
| **ID Utilisateur** | `userId` | Sidebar |
| **ID Rôle** | `roleId` | Champs |
| **ID Société** | `societeId` | Champs |
| **Statut** | `isLoggedIn` | Badge |
| **Sociétés gérées** | `userSocietes` | Badges multiples |

---

## 🎊 AVANTAGES

### Pour l'Utilisateur

1. **Informations à jour** - Toujours synchronisées
2. **Interface claire** - Bien organisée
3. **Navigation rapide** - Boutons d'action
4. **Visuel adapté** - Couleurs selon le rôle

### Pour le Développeur

1. **Aucune création** - Réutilise l'existant
2. **Store Pinia** - Données centralisées
3. **Computed** - Mise à jour automatique
4. **Maintenable** - Un seul endroit à modifier

---

## 💡 AMÉLIORATIONS FUTURES

### Photos Personnalisées

Remplacer la photo par défaut :
```vue
<img :src="user.photo || '/img/team-2.jpg'" />
```

### Édition du Profil

Ajouter un bouton "Modifier le profil" :
```vue
<argon-button @click="openEditModal">
  <i class="fas fa-edit"></i>
  Modifier mon profil
</argon-button>
```

### Changement de Mot de Passe

Ajouter un bouton "Changer mot de passe" :
```vue
<argon-button @click="openPasswordModal">
  <i class="fas fa-key"></i>
  Changer mot de passe
</argon-button>
```

---

## 🎉 RÉSULTAT

✅ **Page Profile entièrement dynamique**  
✅ **Utilise le store Pinia existant**  
✅ **Affiche toutes les informations disponibles**  
✅ **Badges colorés selon le rôle**  
✅ **Boutons adaptés au rôle**  
✅ **Interface moderne et claire**  
✅ **Aucun fichier créé** (réutilisation de l'existant)  

**La page Profile affiche maintenant dynamiquement toutes les informations de l'utilisateur connecté !** 🚀

