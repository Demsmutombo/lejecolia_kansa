# 🔄 Migration vers DataTable - Guide Rapide

## ✅ Ce qui a été créé

**Composant DataTable** - `src/components/DataTable.vue`
- Tableau générique et réutilisable
- Remplace AuthorsTable et tous vos autres tableaux
- Recherche, pagination, actions intégrées

---

## 🚀 Utilisation Immédiate

### Import Simple
```javascript
import { DataTable } from '@/components';
```

### Exemple Minimal (3 lignes)
```vue
<data-table
  :data="myData"
  :columns="[
    { key: 'nom', label: 'Nom' },
    { key: 'email', label: 'Email' }
  ]"
/>
```

---

## 📝 Exemples Prêts à l'Emploi

### 1. Table Utilisateurs Simple

```vue
<template>
  <data-table
    title="Utilisateurs"
    :data="users"
    :columns="columns"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DataTable } from '@/components';

const users = ref([
  { id: 1, nom: 'Jean Dupont', email: 'jean@test.com', role: 'Admin' },
  { id: 2, nom: 'Marie Martin', email: 'marie@test.com', role: 'User' }
]);

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' }
];
</script>
```

### 2. Table avec Recherche

```vue
<data-table
  title="Clients"
  :data="clients"
  :columns="columns"
  :show-search="true"
  :search-fields="['nom', 'telephone', 'email']"
/>
```

### 3. Table avec Actions

```vue
<template>
  <data-table
    :data="items"
    :columns="columns"
    :actions="actions"
  />
</template>

<script setup>
const actions = [
  {
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    onClick: (row) => console.log('Modifier', row)
  },
  {
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    onClick: (row) => console.log('Supprimer', row)
  }
];
</script>
```

### 4. Table avec Avatar

```vue
const columns = [
  {
    key: 'user',
    label: 'Utilisateur',
    type: 'avatar',
    nameKey: 'name',
    emailKey: 'email',
    avatarKey: 'photo'
  },
  { key: 'fonction', label: 'Fonction' }
];
```

### 5. Table avec Badge (Statut)

```vue
const columns = [
  { key: 'nom', label: 'Nom' },
  {
    key: 'statut',
    label: 'Statut',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value === 'Actif' ? 'success' : 'danger'
  }
];
```

### 6. Table avec Date et Montant

```vue
const columns = [
  { key: 'facture', label: 'N° Facture' },
  { key: 'montant', label: 'Montant', type: 'currency', align: 'right' },
  { key: 'date', label: 'Date', type: 'date', align: 'center' }
];
```

---

## 🔄 Remplacement d'AuthorsTable

### Avant
```vue
<authors-table />
```

### Après
```vue
<data-table
  title="Authors table"
  :data="authors"
  :columns="authorColumns"
  :actions="authorActions"
/>

<script setup>
const authors = ref([...]);  // Vos données
const authorColumns = [...]; // Configuration colonnes
const authorActions = [...]; // Actions Edit/Delete
</script>
```

---

## 💡 Recettes Rapides

### Tableau avec Bouton "Nouveau"
```vue
<data-table :data="data" :columns="columns">
  <template #actions>
    <argon-button color="success" @click="create">
      <i class="fas fa-plus me-2"></i>
      Nouveau
    </argon-button>
  </template>
</data-table>
```

### Tableau avec Confirmation de Suppression
```javascript
import { useSweetAlert } from '@/composables';
const { showConfirm, showSuccess } = useSweetAlert();

const actions = [
  {
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    onClick: async (row) => {
      const result = await showConfirm('Supprimer ?', `Supprimer ${row.nom} ?`);
      if (result.isConfirmed) {
        // Appel API de suppression
        await api.delete(row.id);
        await showSuccess('Supprimé !');
        // Recharger les données
        loadData();
      }
    }
  }
];
```

### Tableau avec Chargement API
```vue
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.service';

const data = ref([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    data.value = await api.getUsers();
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadData());
</script>

<template>
  <data-table
    :data="data"
    :columns="columns"
    :loading="loading"
  />
</template>
```

---

## 🎨 Types de Colonnes Disponibles

| Type | Description | Exemple |
|------|-------------|---------|
| `text` | Texte simple (défaut) | Nom, Description |
| `avatar` | Photo + Nom + Email | Utilisateur |
| `badge` | Badge coloré | Statut, Rôle |
| `date` | Date formatée | Date création |
| `currency` | Montant en € | Prix, Total |

---

## ⚡ Avantages

✅ **Un seul composant** pour tous les tableaux  
✅ **Configuration simple** en quelques lignes  
✅ **Recherche intégrée** - Activée en 1 ligne  
✅ **Pagination automatique** - Gère tout seul  
✅ **Actions réutilisables** - Edit, Delete, View, etc.  
✅ **Responsive** - Fonctionne sur mobile  
✅ **États gérés** - Loading, Empty  

---

## 📚 Documentation Complète

Voir **`GUIDE_DATATABLE.md`** pour :
- Toutes les props
- Tous les slots
- Exemples avancés
- Personnalisation CSS
- Integration API

---

## 🎯 Exemple Complet pour Sociétés (SuperAdmin)

```vue
<template>
  <div class="py-4 container-fluid">
    <data-table
      title="Gestion des Sociétés"
      subtitle="Toutes vos sociétés"
      :data="societes"
      :columns="columns"
      :actions="actions"
      :show-search="true"
      :search-fields="['nom', 'adresse', 'email']"
      :loading="loading"
    >
      <template #actions>
        <argon-button color="success" size="sm" @click="createSociete">
          <i class="fas fa-plus me-2"></i>
          Nouvelle Société
        </argon-button>
      </template>
      
      <template #cell-telephone="{ value }">
        <a :href="`tel:${value}`" class="text-primary">
          <i class="fas fa-phone me-1"></i>
          {{ value }}
        </a>
      </template>
    </data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DataTable, ArgonButton } from '@/components';
import { useSweetAlert } from '@/composables';
import { useAuth } from '@/composables';
import api from '@/services/api.service';

const { showConfirm, showSuccess } = useSweetAlert();
const { societeId } = useAuth();

const loading = ref(false);
const societes = ref([]);

const columns = [
  {
    key: 'nom',
    label: 'Société',
    render: (value, row) => `
      <h6 class="mb-0 text-sm">${value}</h6>
      <p class="text-xs text-secondary mb-0">${row.adresse}</p>
    `
  },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'users', label: 'Users', align: 'center' },
  { 
    key: 'statut', 
    label: 'Statut', 
    type: 'badge', 
    badgeColor: 'success',
    align: 'center' 
  }
];

const actions = [
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
    onClick: (row) => editSociete(row)
  }
];

const loadSocietes = async () => {
  loading.value = true;
  try {
    societes.value = await api.getSocietes();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadSocietes());
</script>
```

---

**✅ DataTable est prêt ! Utilisez-le pour tous vos tableaux !** 🚀

**Pour voir un exemple complet :** Consultez `src/views/ExempleDataTable.vue`

