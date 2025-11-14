# 📊 Guide DataTable - Tableau Réutilisable

## 🎯 Vue d'ensemble

Le composant `DataTable` est un tableau générique et réutilisable qui remplace `AuthorsTable` et peut être utilisé partout dans votre application.

## ✨ Fonctionnalités

- ✅ **Configuration flexible** par props
- ✅ **Recherche** intégrée
- ✅ **Pagination** automatique
- ✅ **Actions** personnalisables (Edit, Delete, View, etc.)
- ✅ **Types de données** (texte, badge, avatar, date, currency)
- ✅ **Slots** pour personnalisation avancée
- ✅ **Responsive**
- ✅ **États** (loading, empty)

---

## 🚀 Utilisation Basique

### Import
```javascript
import { DataTable } from '@/components';
```

### Exemple Simple
```vue
<template>
  <data-table
    title="Liste des Utilisateurs"
    :data="users"
    :columns="columns"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DataTable } from '@/components';

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
]);

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' }
];
</script>
```

---

## 📋 Configuration des Colonnes

### Props de Colonne

```javascript
{
  key: 'name',           // Clé dans les données (obligatoire)
  label: 'Nom',          // Texte de l'en-tête (obligatoire)
  type: 'text',          // Type: text, badge, avatar, date, currency
  align: 'left',         // Alignement: left, center, right
  width: '200px',        // Largeur fixe
  className: 'custom',   // Classes CSS personnalisées
  render: (val, row) => `<strong>${val}</strong>`,  // Fonction de rendu personnalisée
  
  // Pour type 'avatar'
  nameKey: 'name',       // Clé pour le nom
  emailKey: 'email',     // Clé pour l'email
  avatarKey: 'photo',    // Clé pour l'image
  
  // Pour type 'badge'
  badgeColor: 'success', // ou fonction: (val, row) => val ? 'success' : 'danger'
}
```

### Types de Colonnes

#### 1. **Type: avatar** (avec photo + nom + email)
```javascript
{
  key: 'user',
  label: 'Utilisateur',
  type: 'avatar',
  nameKey: 'nom',
  emailKey: 'email',
  avatarKey: 'photo'
}
```

#### 2. **Type: badge** (statut coloré)
```javascript
{
  key: 'status',
  label: 'Statut',
  type: 'badge',
  align: 'center',
  badgeColor: (value) => value === 'Actif' ? 'success' : 'secondary'
}
```

#### 3. **Type: date** (formatage automatique)
```javascript
{
  key: 'dateCreation',
  label: 'Date',
  type: 'date',
  align: 'center'
}
```

#### 4. **Type: currency** (€)
```javascript
{
  key: 'montant',
  label: 'Montant',
  type: 'currency',
  align: 'right'
}
```

---

## 🔧 Actions

### Configuration des Actions

```javascript
const actions = [
  {
    name: 'edit',
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    onClick: (row) => editItem(row)
  },
  {
    name: 'delete',
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    iconOnly: true,  // Afficher seulement l'icône
    onClick: (row) => deleteItem(row)
  }
];
```

### Utilisation
```vue
<data-table
  :data="items"
  :columns="columns"
  :actions="actions"
/>
```

---

## 🔍 Recherche

```vue
<data-table
  :data="users"
  :columns="columns"
  :show-search="true"
  :search-fields="['name', 'email', 'role']"
/>
```

---

## 📄 Pagination

```vue
<data-table
  :data="largeDataset"
  :columns="columns"
  :show-pagination="true"
  :items-per-page="15"
/>
```

Pour désactiver la pagination :
```vue
<data-table
  :data="smallDataset"
  :columns="columns"
  :show-pagination="false"
/>
```

---

## 💡 Exemples Complets

### Exemple 1 : Table Utilisateurs (Remplace AuthorsTable)

```vue
<template>
  <data-table
    title="Équipe"
    subtitle="Gestion des membres de l'équipe"
    :data="users"
    :columns="userColumns"
    :actions="userActions"
    :show-search="true"
    :search-fields="['name', 'email', 'function']"
    :loading="isLoading"
  >
    <!-- Bouton d'ajout -->
    <template #actions>
      <argon-button color="success" size="sm" @click="addUser">
        <i class="fas fa-plus me-2"></i>
        Nouveau
      </argon-button>
    </template>
  </data-table>
</template>

<script setup>
import { ref } from 'vue';
import { DataTable, ArgonButton } from '@/components';
import { useSweetAlert } from '@/composables';

const { showConfirm, showSuccess } = useSweetAlert();
const isLoading = ref(false);

const users = ref([
  {
    id: 1,
    name: 'John Michael',
    email: 'john@example.com',
    avatar: '/img/team-2.jpg',
    function: 'Manager',
    department: 'Organization',
    status: 'Online',
    employed: '23/04/18'
  },
  {
    id: 2,
    name: 'Alexa Liras',
    email: 'alexa@example.com',
    avatar: '/img/team-3.jpg',
    function: 'Programator',
    department: 'Developer',
    status: 'Offline',
    employed: '11/01/19'
  }
]);

const userColumns = [
  {
    key: 'name',
    label: 'Utilisateur',
    type: 'avatar',
    nameKey: 'name',
    emailKey: 'email',
    avatarKey: 'avatar'
  },
  {
    key: 'function',
    label: 'Fonction',
    render: (value, row) => `
      <p class="text-xs font-weight-bold mb-0">${value}</p>
      <p class="text-xs text-secondary mb-0">${row.department}</p>
    `
  },
  {
    key: 'status',
    label: 'Statut',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value === 'Online' ? 'success' : 'secondary'
  },
  {
    key: 'employed',
    label: 'Embauché le',
    align: 'center'
  }
];

const userActions = [
  {
    name: 'edit',
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    onClick: (row) => console.log('Modifier', row)
  },
  {
    name: 'delete',
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    iconOnly: true,
    onClick: async (row) => {
      const result = await showConfirm('Supprimer ?', `Supprimer ${row.name} ?`);
      if (result.isConfirmed) {
        showSuccess('Supprimé !');
      }
    }
  }
];

const addUser = () => {
  console.log('Ajouter un utilisateur');
};
</script>
```

### Exemple 2 : Table Sociétés

```vue
<template>
  <data-table
    title="Sociétés"
    :data="societes"
    :columns="societeColumns"
    :actions="societeActions"
    :show-search="true"
    :search-fields="['nom', 'adresse', 'email']"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DataTable } from '@/components';

const societes = ref([
  {
    id: 1,
    nom: 'Hotel Grand Palace',
    adresse: 'Kinshasa, RDC',
    email: 'contact@grandpalace.cd',
    telephone: '+243 123 456 789',
    statut: 'Actif',
    users: 25,
    dateCreation: '2023-01-15'
  },
  {
    id: 2,
    nom: 'Restaurant Le Gourmet',
    adresse: 'Lubumbashi, RDC',
    email: 'info@legourmet.cd',
    telephone: '+243 987 654 321',
    statut: 'Actif',
    users: 15,
    dateCreation: '2023-03-20'
  }
]);

const societeColumns = [
  {
    key: 'nom',
    label: 'Société',
    render: (value, row) => `
      <div class="d-flex flex-column">
        <h6 class="mb-0 text-sm">${value}</h6>
        <p class="text-xs text-secondary mb-0">${row.adresse}</p>
      </div>
    `
  },
  {
    key: 'email',
    label: 'Contact'
  },
  {
    key: 'users',
    label: 'Utilisateurs',
    align: 'center',
    render: (value) => `<span class="badge badge-sm bg-gradient-primary">${value}</span>`
  },
  {
    key: 'statut',
    label: 'Statut',
    type: 'badge',
    align: 'center',
    badgeColor: 'success'
  },
  {
    key: 'dateCreation',
    label: 'Créée le',
    type: 'date',
    align: 'center'
  }
];

const societeActions = [
  {
    label: 'Voir',
    icon: 'fas fa-eye',
    class: 'text-primary',
    onClick: (row) => router.push(`/societes/${row.id}`)
  },
  {
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    iconOnly: true,
    onClick: (row) => editSociete(row)
  }
];
</script>
```

### Exemple 3 : Table Clients avec Slots Personnalisés

```vue
<template>
  <data-table
    title="Clients"
    :data="clients"
    :columns="clientColumns"
    :show-search="true"
    :search-fields="['nom', 'telephone']"
  >
    <!-- Slot pour personnaliser une cellule -->
    <template #cell-telephone="{ value, row }">
      <a :href="`tel:${value}`" class="text-primary">
        <i class="fas fa-phone me-1"></i>
        {{ value }}
      </a>
    </template>
    
    <!-- Slot pour actions personnalisées -->
    <template #row-actions="{ row }">
      <argon-button size="xs" color="info" @click="viewClient(row)">
        Détails
      </argon-button>
    </template>
  </data-table>
</template>
```

---

## 🎨 Slots Disponibles

### 1. **#header** - En-tête personnalisé
```vue
<data-table :data="data" :columns="columns">
  <template #header>
    <div>
      <h6>Mon Titre Personnalisé</h6>
      <p class="text-sm">Description</p>
    </div>
  </template>
</data-table>
```

### 2. **#actions** - Boutons en haut à droite
```vue
<data-table :data="data" :columns="columns">
  <template #actions>
    <argon-button color="success" @click="create">
      Nouveau
    </argon-button>
  </template>
</data-table>
```

### 3. **#cell-{key}** - Cellule personnalisée
```vue
<data-table :data="data" :columns="columns">
  <template #cell-status="{ value, row }">
    <span :class="value === 'actif' ? 'text-success' : 'text-danger'">
      {{ value }}
    </span>
  </template>
</data-table>
```

### 4. **#row-actions** - Actions personnalisées
```vue
<data-table :data="data" :columns="columns">
  <template #row-actions="{ row, index }">
    <button @click="edit(row)">Modifier</button>
    <button @click="delete(row)">Supprimer</button>
  </template>
</data-table>
```

---

## 📊 Props Complètes

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `data` | Array | [] | Données du tableau |
| `columns` | Array | required | Configuration des colonnes |
| `actions` | Array | [] | Actions disponibles |
| `title` | String | '' | Titre du tableau |
| `subtitle` | String | '' | Sous-titre |
| `loading` | Boolean | false | État de chargement |
| `loadingText` | String | 'Chargement...' | Texte pendant le chargement |
| `emptyText` | String | 'Aucune donnée' | Texte si vide |
| `showSearch` | Boolean | false | Afficher la recherche |
| `searchFields` | Array | [] | Champs à rechercher |
| `showPagination` | Boolean | true | Afficher la pagination |
| `itemsPerPage` | Number | 10 | Éléments par page |
| `cardClass` | String | '' | Classes CSS de la card |
| `rowClass` | String | '' | Classes CSS des lignes |
| `rowKey` | String | 'id' | Clé unique des lignes |

---

## 🎯 Exemples d'Utilisation Réels

### Remplacer AuthorsTable

**Avant (AuthorsTable) :**
```vue
<authors-table />
```

**Après (DataTable) :**
```vue
<template>
  <data-table
    title="Authors table"
    :data="authors"
    :columns="authorColumns"
    :actions="authorActions"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DataTable } from '@/components';

const authors = ref([
  {
    id: 1,
    name: 'John Michael',
    email: 'john@example.com',
    avatar: '/img/team-2.jpg',
    function: 'Manager',
    organization: 'Organization',
    status: 'Online',
    employed: '23/04/18'
  },
  // ... autres auteurs
]);

const authorColumns = [
  {
    key: 'name',
    label: 'Author',
    type: 'avatar',
    avatarKey: 'avatar',
    nameKey: 'name',
    emailKey: 'email'
  },
  {
    key: 'function',
    label: 'Function',
    render: (value, row) => `
      <p class="text-xs font-weight-bold mb-0">${value}</p>
      <p class="text-xs text-secondary mb-0">${row.organization}</p>
    `
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    align: 'center',
    badgeColor: (val) => val === 'Online' ? 'success' : 'secondary'
  },
  {
    key: 'employed',
    label: 'Employed',
    align: 'center'
  }
];

const authorActions = [
  {
    label: 'Edit',
    class: 'text-secondary',
    onClick: (row) => console.log('Edit', row)
  }
];
</script>
```

---

## 💼 Cas d'Usage dans Votre Application

### Table Sociétés (SuperAdmin)

```vue
<data-table
  title="Gestion des Sociétés"
  :data="societes"
  :columns="[
    { key: 'nom', label: 'Société' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'users', label: 'Utilisateurs', align: 'center' },
    { key: 'statut', label: 'Statut', type: 'badge', badgeColor: 'success' }
  ]"
  :actions="[
    { label: 'Voir', icon: 'fas fa-eye', onClick: (row) => viewSociete(row) },
    { label: 'Modifier', icon: 'fas fa-edit', onClick: (row) => editSociete(row) }
  ]"
  :show-search="true"
  :search-fields="['nom', 'adresse']"
>
  <template #actions>
    <argon-button color="success" @click="createSociete">
      <i class="fas fa-plus me-2"></i>
      Nouvelle Société
    </argon-button>
  </template>
</data-table>
```

### Table Clients

```vue
<data-table
  title="Liste des Clients"
  :data="clients"
  :columns="[
    { key: 'nom', label: 'Client', type: 'avatar' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'montantTotal', label: 'Total', type: 'currency', align: 'right' },
    { key: 'statut', label: 'Statut', type: 'badge', badgeColor: getClientStatusColor }
  ]"
  :show-search="true"
  :search-fields="['nom', 'telephone', 'email']"
/>
```

### Table Commandes

```vue
<data-table
  title="Commandes"
  :data="commandes"
  :columns="[
    { key: 'numero', label: 'N°' },
    { key: 'client', label: 'Client' },
    { key: 'montant', label: 'Montant', type: 'currency' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'statut', label: 'Statut', type: 'badge' }
  ]"
  :items-per-page="20"
/>
```

---

## 🎨 Personnalisation Avancée

### Cellule avec HTML complexe

```javascript
{
  key: 'details',
  label: 'Détails',
  render: (value, row) => `
    <div class="d-flex align-items-center">
      <img src="${row.icon}" width="20" class="me-2" />
      <div>
        <strong>${row.title}</strong><br>
        <small class="text-muted">${row.description}</small>
      </div>
    </div>
  `
}
```

### Badge Conditionnel

```javascript
{
  key: 'status',
  label: 'Statut',
  type: 'badge',
  badgeColor: (value, row) => {
    if (value === 'Actif') return 'success';
    if (value === 'En attente') return 'warning';
    if (value === 'Inactif') return 'secondary';
    return 'danger';
  }
}
```

---

## 🔄 Charger des Données depuis l'API

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { DataTable } from '@/components';
import api from '@/services/api.service';
import { useAuth } from '@/composables';

const { societeId } = useAuth();
const isLoading = ref(false);
const users = ref([]);

const loadUsers = async () => {
  isLoading.value = true;
  try {
    const response = await api.getUsers({ societe_id: societeId.value });
    users.value = response;
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <data-table
    :data="users"
    :columns="columns"
    :loading="isLoading"
    :show-search="true"
  />
</template>
```

---

## ✅ Avantages

1. **Un seul composant** pour toutes les tables
2. **Configuration simple** par props
3. **Recherche** et **pagination** intégrées
4. **Actions** réutilisables
5. **Types de données** gérés automatiquement
6. **Slots** pour personnalisation avancée
7. **Responsive** par défaut

---

## 📚 Résumé

```javascript
// Import
import { DataTable } from '@/components';

// Utilisation minimale
<data-table :data="myData" :columns="myColumns" />

// Utilisation complète
<data-table
  title="Mon Tableau"
  :data="myData"
  :columns="myColumns"
  :actions="myActions"
  :show-search="true"
  :search-fields="['field1', 'field2']"
  :loading="isLoading"
  @action="handleAction"
  @row-click="handleRowClick"
/>
```

---

**✅ DataTable est maintenant disponible et réutilisable partout dans votre application !** 🚀

