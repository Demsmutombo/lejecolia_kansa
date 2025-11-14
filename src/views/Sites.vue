<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <!-- DataTable avec toutes les fonctionnalités -->
        <data-table
          title="Gestion des Sites"
          subtitle="Liste complète de tous vos sites"
          :data="sites"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['nomSite', 'contact', 'ville', 'commune']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des sites..."
          empty-text="Aucun site trouvé"
        >
          <!-- Bouton Nouveau Site -->
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouveau Site
            </argon-button>
          </template>

          <!-- Cellule Téléphone cliquable -->
          <template #cell-contact="{ value }">
            <a :href="`tel:${value}`" class="text-dark text-decoration-none">
              <i class="fas fa-phone me-1 text-secondary"></i>
              {{ value }}
            </a>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <site-modal
      :site="selectedSite"
      modal-id="siteModal"
      size="md"
      @save="handleSave"
      ref="siteModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import SiteModal from '@/components/modals/SiteModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const router = useRouter();
const { requireSuperAdmin } = useAuth();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

// Vérifier l'accès SuperAdmin
requireSuperAdmin();

// État
const isLoading = ref(false);
const sites = ref([]);
const selectedSite = ref(null);
const siteModalRef = ref(null);

// Configuration des colonnes du tableau
const columns = [
  {
    key: 'idSite',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'nomSite',
    label: 'Site',
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
    key: 'contact',
    label: 'Contact'
  },
  {
    key: 'societeName',
    label: 'Société',
    render: (value, row) => {
      return row.societeName || `Société #${row.idSociete}`;
    }
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
    label: 'Créé le',
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
    onClick: (row) => router.push(`/sites/${row.idSite}`)
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

// Charger les sites
const loadSites = async () => {
  isLoading.value = true;
  console.log('📡 Chargement des sites depuis l\'API...');
  
  try {
    const response = await api.getSites();
    
    // Gérer différents formats de réponse
    if (Array.isArray(response)) {
      sites.value = response;
      console.log('✅ Sites chargés:', response.length);
      console.log('📊 Données:', response);
    } else if (response?.data && Array.isArray(response.data)) {
      sites.value = response.data;
      console.log('✅ Sites chargés:', response.data.length);
      console.log('📊 Données:', response.data);
    } else {
      console.warn('⚠️ Format de réponse inattendu:', response);
      sites.value = [];
    }
    
    // Charger les noms de sociétés
    await enrichSitesWithSocietes();
    
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    console.error('❌ Détails:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    await showError(
      'Erreur de chargement', 
      error.response?.data?.message || 'Impossible de charger les sites. Vérifiez votre connexion.'
    );
    sites.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Enrichir les sites avec les noms de sociétés
const enrichSitesWithSocietes = async () => {
  try {
    const societes = await api.getSocietes();
    const societesMap = {};
    
    (Array.isArray(societes) ? societes : []).forEach(societe => {
      societesMap[societe.idSociete] = societe.nomSociete;
    });
    
    sites.value = sites.value.map(site => ({
      ...site,
      societeName: societesMap[site.idSociete] || ''
    }));
  } catch (error) {
    console.warn('⚠️ Impossible de charger les noms de sociétés:', error);
  }
};

// Ouvrir modal création
const openCreateModal = () => {
  selectedSite.value = null;
  const modal = new Modal(document.getElementById('siteModal'));
  modal.show();
};

// Ouvrir modal édition
const openEditModal = (site) => {
  selectedSite.value = { ...site };
  const modal = new Modal(document.getElementById('siteModal'));
  modal.show();
};

// Sauvegarder (créer ou modifier)
const handleSave = async (siteData) => {
  console.log('💾 Tentative de sauvegarde site...');
  console.log('📦 Données envoyées:', siteData);
  
  showLoading('Enregistrement...', 'Veuillez patienter');
  
  try {
    if (siteData.idSite && siteData.idSite > 0) {
      // Modifier
      console.log('✏️ Mode MODIFICATION - ID:', siteData.idSite);
      await api.updateSite(siteData.idSite, siteData);
      await showSuccess('Modifié !', `${siteData.nomSite} a été modifié avec succès`);
    } else {
      // Créer
      console.log('➕ Mode CRÉATION');
      await api.createSite(siteData);
      await showSuccess('Créé !', `${siteData.nomSite} a été créé avec succès`);
    }
    
    // Fermer le modal
    const modal = Modal.getInstance(document.getElementById('siteModal'));
    if (modal) modal.hide();
    
    // Recharger les données
    await loadSites();
    
  } catch (error) {
    close();
    console.error('❌ Erreur sauvegarde site:', error);
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

// Activer/Désactiver un site
const handleToggleStatus = async (site) => {
  const newStatus = !site.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} ce site ?`,
    `Voulez-vous ${action} "${site.nomSite}" ?`,
    {
      confirmButtonText: `Oui, ${action}`,
      confirmButtonColor: newStatus ? '#2dce89' : '#f5365c'
    }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`, 'Veuillez patienter');
    
    try {
      const updatedData = { ...site, statut: newStatus };
      await api.updateSite(site.idSite, updatedData);
      close();
      
      const statusText = newStatus ? 'activé' : 'désactivé';
      await showSuccess('Statut modifié !', `${site.nomSite} a été ${statusText} avec succès`);
      
      await loadSites();
    } catch (error) {
      close();
      console.error('❌ Erreur changement statut:', error);
      await showError('Erreur', 'Impossible de modifier le statut du site');
    }
  }
};

// Supprimer un site
const handleDelete = async (site) => {
  const result = await showConfirm(
    'Supprimer ce site ?',
    `Êtes-vous sûr de vouloir supprimer "${site.nomSite}" ? Cette action est irréversible.`,
    {
      confirmButtonText: 'Oui, supprimer',
      confirmButtonColor: '#d33'
    }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...', 'Veuillez patienter');
    
    try {
      await api.deleteSite(site.idSite);
      close();
      await showSuccess('Supprimé !', `${site.nomSite} a été supprimé avec succès`);
      await loadSites();
    } catch (error) {
      close();
      console.error('❌ Erreur suppression:', error);
      await showError('Erreur', 'Impossible de supprimer le site');
    }
  }
};

// Charger au montage
onMounted(() => {
  loadSites();
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

