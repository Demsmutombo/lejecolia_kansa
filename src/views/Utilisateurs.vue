<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Utilisateurs"
          :subtitle="`${utilisateurs.length} utilisateur${utilisateurs.length > 1 ? 's' : ''} de votre société`"
          :data="utilisateurs"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['nomUtilisateur', 'prenomUtilisateur', 'email', 'login']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des utilisateurs..."
          empty-text="Aucun utilisateur trouvé"
        >
          <template #actions>
            <span class="badge bg-gradient-info me-2" v-if="!isSuperAdmin">
              <i class="fas fa-building me-1"></i>
              Société: {{ userStore.societeName }}
            </span>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-user-plus me-2"></i>
              Nouvel Utilisateur
            </argon-button>
          </template>

          <!-- Cellule Photo + Nom -->
          <template #cell-nomComplet="{ value, row }">
            <div class="d-flex align-items-center">
              <img 
                :src="getPhotoUrl(row)" 
                :alt="value"
                class="rounded-circle me-3"
                style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #e9ecef;"
                @error="handleImageError"
              />
              <div>
                <h6 class="mb-0 text-sm">{{ value }}</h6>
                <p class="text-xs text-secondary mb-0">
                  <i class="fas fa-user me-1"></i>{{ row.login }}
                </p>
              </div>
            </div>
          </template>

          <!-- Cellule Email -->
          <template #cell-email="{ value }">
            <a :href="`mailto:${value}`" class="text-dark text-decoration-none">
              <i class="fas fa-envelope me-1 text-secondary"></i>
              {{ value }}
            </a>
          </template>

          <!-- Cellule Téléphone -->
          <template #cell-numeroTelephone="{ value }">
            <a :href="`tel:${value}`" class="text-dark text-decoration-none">
              <i class="fas fa-phone me-1 text-secondary"></i>
              {{ value }}
            </a>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <utilisateur-modal
      :utilisateur="selectedUtilisateur"
      modal-id="utilisateurModal"
      @save="handleSave"
      ref="utilisateurModalRef"
    />

    <!-- Liste des sites de la société -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-0">Sites de la société</h6>
              <p class="text-sm text-muted mb-0">
                {{ siteCountLabel }}
              </p>
            </div>
            <div v-if="isLoadingSites" class="spinner-border text-primary spinner-border-sm" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">Site</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Adresse</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Contact</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!isLoadingSites && !sites.length">
                    <td colspan="4" class="text-center py-4 text-muted">
                      Aucun site associé n’a été trouvé pour votre société.
                    </td>
                  </tr>
                  <tr v-for="site in sites" :key="site.idSite">
                    <td class="ps-4">
                      <h6 class="mb-0 text-sm">
                        <i class="fas fa-store me-2 text-primary"></i>
                        {{ site.nomSite || `Site #${site.idSite}` }}
                      </h6>
                      <p class="text-xs text-muted mb-0" v-if="site.siteCode">
                        <i class="fas fa-hashtag me-1"></i>{{ site.siteCode }}
                      </p>
                    </td>
                    <td>
                      <p class="mb-0 text-sm">
                        <i class="fas fa-map-marker-alt me-1 text-secondary"></i>
                        {{ formatAdresseSite(site) }}
                      </p>
                    </td>
                    <td>
                      <p class="mb-0 text-sm">
                        <i class="fas fa-phone-alt me-1 text-secondary"></i>
                        {{ formatContactSite(site) }}
                      </p>
                      <p class="text-xs text-muted mb-0" v-if="site.email">
                        <i class="fas fa-envelope me-1"></i>{{ site.email }}
                      </p>
                    </td>
                    <td>
                      <span
                        class="badge badge-sm"
                        :class="site.statut ? 'bg-gradient-success' : 'bg-gradient-secondary'"
                      >
                        {{ site.statut ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import UtilisateurModal from '@/components/modals/UtilisateurModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const router = useRouter();
const userStore = useUserStore();
const { requireAuth, isLoggedIn, isSuperAdmin, societeId } = useAuth();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

// Gestionnaires ET superadmins peuvent accéder
requireAuth();

const isLoading = ref(false);
const utilisateurs = ref([]);
const utilisateursGestionnaires = ref([]); // Seulement les gestionnaires
const sites = ref([]);
const isLoadingSites = ref(false);
const selectedUtilisateur = ref(null);
const utilisateurModalRef = ref(null);

// Nom du rôle à filtrer (uniquement gestionnaires)
const ROLE_GESTIONNAIRE = 'gestionnaire';

const siteCountLabel = computed(() => {
  const count = sites.value.length;
  if (!count) return 'Aucun site associé';
  return `${count} site${count > 1 ? 's' : ''} associé${count > 1 ? 's' : ''} à votre société`;
});

const applySiteInfoToUsers = () => {
  if (!utilisateurs.value.length) return;
  const siteMap = {};
  sites.value.forEach((site) => {
    const id = Number(site.idSite);
    siteMap[id] = {
      name: site.nomSite || `Site #${site.idSite}`,
      code: site.codeSite || site.code || '',
    };
  });

  utilisateurs.value = utilisateurs.value.map((user) => {
    const info = siteMap[Number(user.idSite)] || null;
    return {
      ...user,
      siteName: user.nomSite || info?.name || `Site #${user.idSite}`,
      siteCode: user.codeSite || info?.code || '',
    };
  });
};

const loadSites = async () => {
  if (!societeId.value) {
    sites.value = [];
    applySiteInfoToUsers();
    return;
  }

  isLoadingSites.value = true;
  console.log(`🏬 Chargement sites pour société #${societeId.value}`);
  try {
    const response = await api.getSitesBySociete(societeId.value);
    sites.value = Array.isArray(response) ? response : [];
    console.log(`✅ ${sites.value.length} site(s) associé(s) chargé(s)`);
    applySiteInfoToUsers();
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    sites.value = [];
  } finally {
    isLoadingSites.value = false;
  }
};

const formatAdresseSite = (site = {}) => {
  const parts = [];
  if (site.numero) parts.push(`N° ${site.numero}`);
  if (site.avenue) parts.push(`Avenue ${site.avenue}`);
  if (site.quartier) parts.push(site.quartier);
  if (site.commune) parts.push(site.commune);
  if (site.ville) parts.push(site.ville);
  return parts.join(', ') || 'Adresse non renseignée';
};

const formatContactSite = (site = {}) => {
  return site.contact || site.telephone || site.numeroTelephone || 'Non renseigné';
};

// Configuration des colonnes
const columns = [
  {
    key: 'idUtilisateur',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'nomComplet',
    label: 'Gestionnaire',
    render: (value, row) => {
      const nomComplet = `${row.nomUtilisateur} ${row.postNomUtilisateur || ''} ${row.prenomUtilisateur}`.trim();
      return nomComplet;
    }
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'numeroTelephone',
    label: 'Téléphone'
  },
  {
    key: 'siteName',
    label: 'Site',
    render: (value, row) => row.siteName || `Site #${row.idSite}`
  },
  {
    key: 'roleName',
    label: 'Rôle',
    render: (value, row) => {
      const badge = row.roleName || `Rôle #${row.idRole}`;
      return `<span class="badge badge-sm bg-gradient-secondary">${badge}</span>`;
    }
  },
  {
    key: 'isConnected',
    label: 'Connexion',
    align: 'center',
    render: (value) => {
      if (value) {
        return '<span class="badge badge-sm bg-gradient-success"><i class="fas fa-circle me-1"></i>En ligne</span>';
      }
      return '<span class="badge badge-sm bg-gradient-secondary">Hors ligne</span>';
    }
  },
  {
    key: 'statut',
    label: 'Statut',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value ? 'success' : 'secondary',
    render: (value) => value ? 'Actif' : 'Inactif'
  }
];

// Actions
const tableActions = [
  {
    name: 'view',
    label: 'Voir',
    icon: 'fas fa-eye',
    class: 'text-dark',
    onClick: (row) => router.push(`/utilisateurs/${row.idUtilisateur}`)
  },
  {
    name: 'toggle',
    label: (row) => row.statut ? 'Désactiver' : 'Activer',
    icon: (row) => row.statut ? 'fas fa-toggle-on' : 'fas fa-toggle-off',
    class: (row) => row.statut ? 'text-success' : 'text-secondary',
    onClick: (row) => handleToggleStatus(row)
  },
  {
    name: 'edit',
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'text-secondary',
    onClick: (row) => openEditModal(row)
  },
  {
    name: 'delete',
    label: 'Supprimer',
    icon: 'fas fa-trash',
    class: 'text-danger',
    iconOnly: true,
    onClick: (row) => handleDelete(row)
  }
];

// Gérer les photos (éviter erreur 431 si photo trop volumineuse)
const getPhotoUrl = (user) => {
  // Si la photo est trop grande (>50KB base64), utiliser photo par défaut
  if (user.photo && user.photo.length < 50000) {
    return user.photo;
  }
  return plateformeLogo;
};

const handleImageError = (event) => {
  // Si l'image ne charge pas, utiliser la photo par défaut
  event.target.src = plateformeLogo;
};

// Charger les utilisateurs
// ⚡ OPTIMISÉ : Utiliser l'API V_Utilisateur (site/société déjà inclus !)
const loadUtilisateurs = async () => {
  isLoading.value = true;
  console.log('⚡ Chargement utilisateurs optimisé (API V_Utilisateur)...');
  
  try {
    let response;
    
    // Utiliser l'API optimisée V_Utilisateur
    if (!isSuperAdmin.value && societeId.value) {
      console.log(`⚡ Chargement utilisateurs pour société #${societeId.value}`);
      response = await api.getUtilisateursVueBySociete(societeId.value);
    } else {
      console.log('👑 SuperAdmin : chargement de tous les utilisateurs');
      response = await api.getUtilisateursVue();
    }
    
    const allUsers = Array.isArray(response) ? response : [];
    console.log(`✅ ${allUsers.length} utilisateur(s) chargé(s)`);
    
    // Nettoyer les photos trop volumineuses pour éviter erreur 431
    utilisateurs.value = allUsers.map(user => ({
      ...user,
      photo: user.photo && user.photo.length > 100000 ? null : user.photo
    }));
    
    await enrichWithNames();
    applySiteInfoToUsers();
    
  } catch (error) {
    console.error('❌ Erreur chargement:', error);
    
    // Si erreur 431, c'est probablement à cause des photos
    if (error.response?.status === 431) {
      await showError(
        'Photos trop volumineuses',
        'Les photos utilisateurs sont trop grandes. Utilisez des images plus petites (max 150x150).'
      );
    } else {
      await showError('Erreur', 'Impossible de charger les utilisateurs');
    }
    utilisateurs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec noms sites/rôles et filtrer les gestionnaires
// ⚡ OPTIMISÉ : Les noms de sites sont déjà dans l'API V_Utilisateur !
const enrichWithNames = async () => {
  try {
    // Charger seulement les rôles (les sites sont déjà inclus dans V_Utilisateur !)
    const roles = await api.getRoles();
    
    const rolesMap = {};
    (Array.isArray(roles) ? roles : []).forEach(role => {
      rolesMap[role.idRole] = role.nom || role.name;
    });
    
    // Enrichir avec les noms (nomSite déjà présent dans la réponse !)
    let enrichedUsers = utilisateurs.value.map(user => ({
      ...user,
      nomComplet: user.nomComplet || `${user.nomUtilisateur} ${user.postNomUtilisateur || ''} ${user.prenomUtilisateur}`.trim(),
      siteName: user.nomSite || '',  // ✨ Déjà fourni par V_Utilisateur !
      roleName: rolesMap[user.idRole] || user.role || ''
    }));
    
    // ✅ AFFICHER TOUS les utilisateurs de la société (Gestionnaires + Caissiers)
    utilisateurs.value = enrichedUsers;
    
    console.log('✅ Utilisateurs chargés:', utilisateurs.value.length);
    console.log('📋 Rôles présents:', [...new Set(utilisateurs.value.map(u => u.roleName))]);
    
  } catch (error) {
    console.warn('⚠️ Erreur noms:', error);
  }
};

const openCreateModal = () => {
  selectedUtilisateur.value = null;
  const modal = new Modal(document.getElementById('utilisateurModal'));
  modal.show();
};

const openEditModal = (user) => {
  selectedUtilisateur.value = { ...user };
  const modal = new Modal(document.getElementById('utilisateurModal'));
  modal.show();
};

const handleSave = async (userData) => {
  showLoading('Enregistrement...');
  
  try {
    // Construire le nom pour les messages
    const nomComplet = `${userData.prenomUtilisateur || ''} ${userData.nomUtilisateur || ''}`.trim() || 'l\'utilisateur';
    
    if (userData.idUtilisateur && userData.idUtilisateur > 0) {
      await api.updateUser(userData.idUtilisateur, userData);
      await showSuccess('Gestionnaire modifié !', `${nomComplet} a été modifié avec succès`);
    } else {
      await api.createUser(userData);
      await showSuccess('Gestionnaire créé !', `${nomComplet} a été créé avec succès`);
    }
    
    const modal = Modal.getInstance(document.getElementById('utilisateurModal'));
    if (modal) modal.hide();
    
    await loadUtilisateurs();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleToggleStatus = async (user) => {
  const newStatus = !user.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  
  // Construire le nom complet
  const nomComplet = user.nomComplet || `${user.nomUtilisateur || ''} ${user.postNomUtilisateur || ''} ${user.prenomUtilisateur || ''}`.trim() || 'cet utilisateur';
  
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} ?`,
    `Voulez-vous ${action} ${nomComplet} ?`,
    { confirmButtonText: `Oui, ${action}`, confirmButtonColor: newStatus ? '#2dce89' : '#f5365c' }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`);
    
    try {
      console.log(`🔄 Toggle statut utilisateur #${user.idUtilisateur} vers ${newStatus}`);
      // Utiliser l'endpoint dédié /api/Utilisateurs/{id}/statut qui attend un boolean
      await api.toggleUserStatus(user.idUtilisateur, newStatus);
      
      close();
      const statusText = newStatus ? 'activé' : 'désactivé';
      await showSuccess('Statut modifié !', `${nomComplet} a été ${statusText} avec succès`);
      
      // Attendre 500ms pour laisser la base de données se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadUtilisateurs();
    } catch (error) {
      close();
      console.error('❌ Erreur changement statut:', error);
      await showError('Erreur', 'Impossible de modifier le statut');
    }
  }
};

const handleDelete = async (user) => {
  // Construire le nom complet
  const nomComplet = user.nomComplet || `${user.nomUtilisateur || ''} ${user.postNomUtilisateur || ''} ${user.prenomUtilisateur || ''}`.trim() || 'cet utilisateur';
  
  const result = await showConfirm(
    'Supprimer le gestionnaire ?',
    `Voulez-vous vraiment supprimer ${nomComplet} ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deleteUser(user.idUtilisateur);
      close();
      await showSuccess('Gestionnaire supprimé !', `${nomComplet} a été supprimé avec succès`);
      await loadUtilisateurs();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer');
    }
  }
};

onMounted(() => {
  loadUtilisateurs();
  loadSites();
});

watch(societeId, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    loadUtilisateurs();
    loadSites();
  }
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}

a.text-decoration-none:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}
</style>
