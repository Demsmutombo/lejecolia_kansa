<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <!-- DataTable avec toutes les fonctionnalités -->
        <data-table
          title="Gestion des Sociétés"
          subtitle="Liste complète de toutes vos sociétés"
          :data="societes"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['nomSociete', 'email', 'contact', 'ville', 'secteurActivite']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des sociétés..."
          empty-text="Aucune société trouvée"
        >
          <!-- Bouton Nouvelle Société -->
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouvelle Société
            </argon-button>
          </template>

          <!-- Cellule Logo personnalisée -->
          <template #cell-logo="{ value, row }">
            <img 
              :src="value || '/img/logo-ct-dark.png'" 
              :alt="row.nomSociete"
              class="rounded-circle"
              style="width: 35px; height: 35px; object-fit: cover; border: 1px solid #e9ecef;"
            />
          </template>

          <!-- Cellule Téléphone cliquable -->
          <template #cell-contact="{ value }">
            <a :href="`tel:${value}`" class="text-dark text-decoration-none">
              <i class="fas fa-phone me-1 text-secondary"></i>
              {{ value }}
            </a>
          </template>

          <!-- Cellule Email cliquable -->
          <template #cell-email="{ value }">
            <a :href="`mailto:${value}`" class="text-dark text-decoration-none">
              <i class="fas fa-envelope me-1 text-secondary"></i>
              {{ value }}
            </a>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <societe-modal
      :societe="selectedSociete"
      modal-id="societeModal"
      size="md"
      @save="handleSave"
      ref="societeModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import SocieteModal from '@/components/modals/SocieteModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const router = useRouter();
const { requireSuperAdmin } = useAuth();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

// Vérifier l'accès SuperAdmin
requireSuperAdmin();

// État
const isLoading = ref(false);
const societes = ref([]);
const selectedSociete = ref(null);
const societeModalRef = ref(null);

// Configuration des colonnes du tableau
const columns = [
  {
    key: 'idSociete',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'logo',
    label: '',
    width: '60px'
  },
  {
    key: 'nomSociete',
    label: 'Société',
    render: (value, row) => {
      const adresse = [row.avenue, row.quartier, row.commune, row.ville]
        .filter(Boolean)
        .join(', ') || 'Adresse non renseignée';
      return `
        <div>
          <h6 class="mb-0 text-sm">${value}</h6>
          <p class="text-xs text-secondary mb-0">
            <i class="fas fa-map-marker-alt me-1"></i>${adresse}
          </p>
        </div>
      `;
    }
  },
  {
    key: 'email',
    label: 'Contact'
  },
  {
    key: 'contact',
    label: 'Téléphone'
  },
  {
    key: 'secteurActivite',
    label: 'Secteur',
    align: 'center',
    render: (value) => value ? `<span class="badge badge-sm bg-gradient-secondary">${value}</span>` : '-'
  },
  {
    key: 'statut',
    label: 'Statut',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value ? 'success' : 'secondary',
    render: (value) => value ? 'Actif' : 'Inactif'
  },
  {
    key: 'dateCreation',
    label: 'Créée le',
    type: 'date',
    align: 'center'
  }
];

// Actions du tableau
const tableActions = [
  {
    name: 'view',
    label: 'Voir',
    icon: 'fas fa-eye',
    class: 'text-dark',
    onClick: (row) => router.push(`/societes/${row.idSociete}`)
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

// Charger les sociétés
const loadSocietes = async () => {
  isLoading.value = true;
  console.log('📡 Chargement des sociétés depuis l\'API...');
  
  try {
    const response = await api.getSocietes();
    
    // Vérifier le format de la réponse
    if (Array.isArray(response)) {
      societes.value = response;
      console.log('✅ Sociétés chargées:', response.length);
      console.log('📊 Données:', response);
    } else if (response?.data && Array.isArray(response.data)) {
      societes.value = response.data;
      console.log('✅ Sociétés chargées:', response.data.length);
      console.log('📊 Données:', response.data);
    } else {
      console.warn('⚠️ Format de réponse inattendu:', response);
      societes.value = [];
    }
  } catch (error) {
    console.error('❌ Erreur chargement sociétés:', error);
    console.error('❌ Détails:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    await showError(
      'Erreur de chargement', 
      error.response?.data?.message || 'Impossible de charger les sociétés. Vérifiez votre connexion.'
    );
    societes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Ouvrir modal création
const openCreateModal = () => {
  selectedSociete.value = null;
  const modal = new Modal(document.getElementById('societeModal'));
  modal.show();
};

// Ouvrir modal édition
const openEditModal = (societe) => {
  selectedSociete.value = { ...societe };
  const modal = new Modal(document.getElementById('societeModal'));
  modal.show();
};

// Sauvegarder (créer ou modifier)
const handleSave = async (societeData, logoFile) => {
  console.log('💾 Tentative de sauvegarde...');
  console.log('📦 Données envoyées:', societeData);
  console.log('🖼️ Fichier logo:', logoFile);
  
  showLoading('Enregistrement...', 'Veuillez patienter');
  
  try {
    if (societeData.idSociete && societeData.idSociete > 0) {
      // Modifier
      console.log('✏️ Mode MODIFICATION - ID:', societeData.idSociete);
      await api.updateSociete(societeData.idSociete, societeData);
      await showSuccess('Modifié !', `${societeData.nomSociete} a été modifié avec succès`);
    } else {
      // Créer
      console.log('➕ Mode CRÉATION');
      await api.createSociete(societeData);
      await showSuccess('Créé !', `${societeData.nomSociete} a été créé avec succès`);
    }
    
    // Fermer le modal
    const modal = Modal.getInstance(document.getElementById('societeModal'));
    if (modal) modal.hide();
    
    // Recharger les données
    await loadSocietes();
    
  } catch (error) {
    close();
    console.error('❌ Erreur sauvegarde:', error);
    console.error('📋 Détails de l\'erreur:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    const errorMsg = error.response?.data?.message 
      || error.response?.data?.error
      || error.response?.data 
      || 'Une erreur est survenue lors de la sauvegarde';
    
    await showError('Erreur de sauvegarde', errorMsg);
  }
};

// Activer/Désactiver une société
const handleToggleStatus = async (societe) => {
  const newStatus = !societe.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} cette société ?`,
    `Voulez-vous ${action} "${societe.nomSociete}" ?`,
    {
      confirmButtonText: `Oui, ${action}`,
      confirmButtonColor: newStatus ? '#2dce89' : '#f5365c'
    }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`, 'Veuillez patienter');
    
    try {
      // Mettre à jour juste le statut
      const updatedData = {
        ...societe,
        statut: newStatus
      };
      
      await api.updateSociete(societe.idSociete, updatedData);
      close();
      
      const statusText = newStatus ? 'activée' : 'désactivée';
      await showSuccess(
        'Statut modifié !', 
        `${societe.nomSociete} a été ${statusText} avec succès`
      );
      
      await loadSocietes();
    } catch (error) {
      close();
      console.error('❌ Erreur changement statut:', error);
      await showError('Erreur', 'Impossible de modifier le statut de la société');
    }
  }
};

// Supprimer une société
const handleDelete = async (societe) => {
  const result = await showConfirm(
    'Supprimer cette société ?',
    `Êtes-vous sûr de vouloir supprimer "${societe.nomSociete}" ? Cette action est irréversible.`,
    {
      confirmButtonText: 'Oui, supprimer',
      confirmButtonColor: '#d33'
    }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...', 'Veuillez patienter');
    
    try {
      await api.deleteSociete(societe.idSociete);
      close();
      await showSuccess('Supprimé !', `${societe.nomSociete} a été supprimé avec succès`);
      await loadSocietes();
    } catch (error) {
      close();
      console.error('❌ Erreur suppression:', error);
      await showError('Erreur', 'Impossible de supprimer la société');
    }
  }
};

// Charger au montage
onMounted(() => {
  loadSocietes();
});
</script>

<style scoped>
/* Coller le contenu au sidebar */
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}

/* Liens sans soulignement au survol */
a.text-decoration-none:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}
</style>
