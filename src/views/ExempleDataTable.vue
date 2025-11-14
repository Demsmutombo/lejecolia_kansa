<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Exemple 1 : Table Utilisateurs -->
        <data-table
          title="Équipe - Utilisateurs"
          subtitle="Gestion des membres de l'équipe"
          :data="users"
          :columns="userColumns"
          :actions="userActions"
          :show-search="true"
          :search-fields="['name', 'email', 'function']"
          :loading="loadingUsers"
          class="mb-4"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="handleAddUser">
              <i class="fas fa-plus me-2"></i>
              Nouvel Utilisateur
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <!-- Exemple 2 : Table Sociétés -->
        <data-table
          title="Sociétés"
          :data="societes"
          :columns="societeColumns"
          :actions="societeActions"
          :show-search="true"
          :search-fields="['nom', 'adresse']"
          :items-per-page="5"
        >
          <!-- Cellule personnalisée pour le téléphone -->
          <template #cell-telephone="{ value }">
            <a :href="`tel:${value}`" class="text-primary">
              <i class="fas fa-phone me-1"></i>
              {{ value }}
            </a>
          </template>
          
          <template #actions>
            <argon-button color="primary" size="sm">
              <i class="fas fa-building me-2"></i>
              Nouvelle Société
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DataTable, ArgonButton } from '@/components';
import { useSweetAlert } from '@/composables';
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const { showConfirm, showSuccess, showError } = useSweetAlert();

// État
const loadingUsers = ref(false);

// ========== DONNÉES UTILISATEURS ==========
const users = ref([
  {
    id: 1,
    name: 'John Michael',
    email: 'john@example.com',
    avatar: plateformeLogo,
    function: 'Manager',
    department: 'Organization',
    status: 'Online',
    employed: '23/04/18'
  },
  {
    id: 2,
    name: 'Alexa Liras',
    email: 'alexa@example.com',
    avatar: plateformeLogo,
    function: 'Programator',
    department: 'Developer',
    status: 'Offline',
    employed: '11/01/19'
  },
  {
    id: 3,
    name: 'Laurent Perrier',
    email: 'laurent@example.com',
    avatar: plateformeLogo,
    function: 'Executive',
    department: 'Projects',
    status: 'Online',
    employed: '19/09/17'
  },
  {
    id: 4,
    name: 'Michael Levi',
    email: 'michael@example.com',
    avatar: plateformeLogo,
    function: 'Backend Developer',
    department: 'Development',
    status: 'Online',
    employed: '24/12/08'
  }
]);

// Colonnes pour les utilisateurs
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

// Actions pour les utilisateurs
const userActions = [
  {
    name: 'edit',
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    onClick: async (row) => {
      console.log('Modifier utilisateur:', row);
      await showSuccess('Modification', `Modifier ${row.name}`);
    }
  },
  {
    name: 'delete',
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    iconOnly: true,
    onClick: async (row) => {
      const result = await showConfirm(
        'Supprimer cet utilisateur ?',
        `Êtes-vous sûr de vouloir supprimer ${row.name} ?`
      );
      
      if (result.isConfirmed) {
        // Appel API de suppression ici
        await showSuccess('Supprimé !', `${row.name} a été supprimé`);
      }
    }
  }
];

// ========== DONNÉES SOCIÉTÉS ==========
const societes = ref([
  {
    id: 1,
    nom: 'Hotel Grand Palace',
    adresse: 'Kinshasa, Gombe, RDC',
    telephone: '+243 123 456 789',
    email: 'contact@grandpalace.cd',
    users: 25,
    statut: 'Actif',
    dateCreation: '2023-01-15'
  },
  {
    id: 2,
    nom: 'Restaurant Le Gourmet',
    adresse: 'Lubumbashi, Centre, RDC',
    telephone: '+243 987 654 321',
    email: 'info@legourmet.cd',
    users: 15,
    statut: 'Actif',
    dateCreation: '2023-03-20'
  },
  {
    id: 3,
    nom: 'Spa Wellness Center',
    adresse: 'Kinshasa, Ngaliema, RDC',
    telephone: '+243 555 123 456',
    email: 'contact@wellness.cd',
    users: 10,
    statut: 'Actif',
    dateCreation: '2023-06-10'
  }
]);

// Colonnes pour les sociétés
const societeColumns = [
  {
    key: 'nom',
    label: 'Société',
    render: (value, row) => `
      <div class="d-flex flex-column">
        <h6 class="mb-0 text-sm">${value}</h6>
        <p class="text-xs text-secondary mb-0"><i class="fas fa-map-marker-alt me-1"></i>${row.adresse}</p>
      </div>
    `
  },
  {
    key: 'telephone',
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

// Actions pour les sociétés
const societeActions = [
  {
    label: 'Détails',
    icon: 'fas fa-eye',
    class: 'text-primary',
    onClick: (row) => {
      console.log('Voir société:', row);
    }
  },
  {
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-info',
    iconOnly: true,
    onClick: (row) => {
      console.log('Modifier société:', row);
    }
  }
];

// Gestion des actions
const handleAddUser = () => {
  showSuccess('Ajouter un utilisateur', 'Cette fonctionnalité sera développée');
};
</script>

