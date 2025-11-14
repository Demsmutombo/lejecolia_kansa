<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Clients"
          :subtitle="tableSubtitle"
          :data="clients"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['nomComplet', 'telephone', 'email', 'nomSite']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des clients..."
          empty-text="Aucun client trouvé pour votre société"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-user-plus me-2"></i>
              Nouveau Client
            </argon-button>
          </template>

          <!-- Cellule Nom complet -->
          <template #cell-nomComplet="{ value }">
            <div>
              <h6 class="mb-0 text-sm font-weight-bold">{{ value }}</h6>
            </div>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <client-modal
      :client="selectedClient"
      modal-id="clientModal"
      @save="handleSave"
      ref="clientModalRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ClientModal from '@/components/modals/ClientModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth(); // Accessible aux gestionnaires

const isLoading = ref(false);
const clients = ref([]);
const selectedClient = ref(null);
const clientModalRef = ref(null);

// Sous-titre dynamique avec compteur
const tableSubtitle = computed(() => {
  const count = clients.value.length;
  return `${count} client${count > 1 ? 's' : ''} - Lejecolia`;
});

// Configuration des colonnes
const columns = [
  {
    key: 'idClient',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'nomComplet',
    label: 'Client',
    render: (value, row) => {
      // Essayer d'abord nomComplet de la vue, sinon nom + prenom
      if (value && value !== '-') return value;
      const nom = row.nom || '';
      const prenom = row.prenom || '';
      return `${nom} ${prenom}`.trim() || '-';
    }
  },
  {
    key: 'genre',
    label: 'Genre',
    align: 'center',
    render: (value) => {
      if (value === 'Masculin') return '<span class="badge badge-sm bg-gradient-info">M</span>';
      if (value === 'Féminin') return '<span class="badge badge-sm bg-gradient-danger">F</span>';
      return '<span class="badge badge-sm bg-gradient-secondary">-</span>';
    }
  },
  {
    key: 'email',
    label: 'Email',
    render: (value) => value || '-'
  },
  {
    key: 'telephone',
    label: 'Téléphone',
    render: (value) => value || '-'
  },
  {
    key: 'adresse',
    label: 'Adresse',
    render: (value, row) => {
      // Essayer d'abord adresseClient de la vue, sinon commune + ville
      const adresse = row.adresseClient || value;
      if (adresse && adresse !== '-') return adresse;
      
      const parts = [];
      if (row.commune) parts.push(row.commune);
      if (row.ville) parts.push(row.ville);
      return parts.length > 0 ? parts.join(', ') : '-';
    }
  },
  {
    key: 'nomSite',
    label: 'Site',
    render: (value) => value || '-'
  }
];

// Actions
const tableActions = [
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

// Charger les clients (Vue optimisée)
const loadClients = async () => {
  isLoading.value = true;
  console.log('📡 Chargement des clients Lejecolia...');

  try {
    const societeId = userStore.societeId || 3;
    let clientsData = [];

    console.log(`📊 GET /api/V_ClientsParSite/societe/${societeId}`);

    try {
      clientsData = await api.getClientsParSiteBySociete(societeId);
      console.log(`✅ ${Array.isArray(clientsData) ? clientsData.length : 0} client(s) récupérés`);
    } catch (apiError) {
      console.warn('⚠️ Erreur avec la vue optimisée, fallback vers /api/Clients');
      console.error('Détails:', apiError);

      const allClients = await api.getClients();
      const sites = await api.getSitesBySociete(societeId);
      const authorizedSiteIds = new Set(
        (Array.isArray(sites) ? sites : []).map(site => parseInt(site.idSite, 10))
      );

      clientsData = (Array.isArray(allClients) ? allClients : []).filter(client => {
        const clientSiteId = parseInt(client.idSite, 10);
        return authorizedSiteIds.has(clientSiteId);
      });

      console.log(`✅ ${clientsData.length} client(s) après filtrage manuel`);
    }

    clients.value = Array.isArray(clientsData) ? clientsData : [];
  } catch (error) {
    console.error('❌ Erreur chargement clients:', error);
    await showError('Erreur', 'Impossible de charger les clients Lejecolia');
    clients.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedClient.value = null;
  const modal = new Modal(document.getElementById('clientModal'));
  modal.show();
};

const openEditModal = (client) => {
  selectedClient.value = { ...client };
  const modal = new Modal(document.getElementById('clientModal'));
  modal.show();
};

const handleSave = async (clientData) => {
  showLoading('Enregistrement...');
  
  try {
    // Les données client contiennent déjà idSite qui est filtré par société dans le modal
    const dataToSave = {
      ...clientData,
      idSociete: userStore.societeId || 3
    };
    
    console.log('💾 Données client à sauvegarder:', dataToSave);
    console.log('🏢 Site sélectionné:', dataToSave.idSite);
    
    const nomClient = `${dataToSave.prenom || ''} ${dataToSave.nom || ''}`.trim();
    
    if (dataToSave.idClient && dataToSave.idClient > 0) {
      await api.updateClient(dataToSave.idClient, dataToSave);
      await showSuccess('Modifié !', `Client ${nomClient} modifié avec succès`);
    } else {
      const result = await api.createClient(dataToSave);
      console.log('✅ Client créé:', result);
      await showSuccess('Créé !', `Client ${nomClient} ajouté à votre société`);
    }
    
    const modal = Modal.getInstance(document.getElementById('clientModal'));
    if (modal) modal.hide();
    
    await loadClients();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    console.error('❌ Détails de la réponse:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors 
      || error.response?.data 
      || 'Erreur de sauvegarde';
    
    await showError('Erreur', JSON.stringify(errorMessage));
  }
};

const handleToggleStatus = async (client) => {
  const newStatus = !client.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  const nomClient = client.nomComplet || `${client.prenom || ''} ${client.nom || ''}`.trim() || 'ce client';
  
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} ?`,
    `Voulez-vous ${action} ${nomClient} ?`,
    { confirmButtonText: `Oui, ${action}`, confirmButtonColor: newStatus ? '#2dce89' : '#f5365c' }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`);
    
    try {
      const updatedData = { ...client, statut: newStatus };
      await api.updateClient(client.idClient, updatedData);
      close();
      await showSuccess('Statut modifié !', `${nomClient} est maintenant ${newStatus ? 'actif' : 'inactif'}`);
      await loadClients();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de modifier le statut');
    }
  }
};

const handleDelete = async (client) => {
  const nomClient = client.nomComplet || `${client.prenom || ''} ${client.nom || ''}`.trim() || 'ce client';
  
  const result = await showConfirm(
    'Supprimer ?',
    `Supprimer ${nomClient} définitivement ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deleteClient(client.idClient);
      close();
      await showSuccess('Supprimé !', `${nomClient} a été supprimé`);
      await loadClients();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer ce client');
    }
  }
};

onMounted(() => {
  loadClients();
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

