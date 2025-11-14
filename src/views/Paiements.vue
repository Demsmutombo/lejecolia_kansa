<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Paiements"
          subtitle="Paiements Lejecolia"
          :data="paiements"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['referencePaiemenet', 'modePaiement', 'statut', 'libelle']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des paiements..."
          empty-text="Aucun paiement trouvé"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouveau Paiement
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <paiement-modal
      :paiement="selectedPaiement"
      modal-id="paiementModal"
      @save="handleSave"
      ref="paiementModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import PaiementModal from '@/components/modals/PaiementModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const paiements = ref([]);
const selectedPaiement = ref(null);
const paiementModalRef = ref(null);

// Configuration des colonnes
const columns = [
  {
    key: 'idPaiement',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'referencePaiemenet',
    label: 'Référence',
    render: (value) => {
      return `<span class="badge badge-sm bg-gradient-secondary">${value || '-'}</span>`;
    }
  },
  {
    key: 'datePaiement',
    label: 'Date',
    render: (value) => {
      if (!value) return '-';
      return new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  {
    key: 'type',
    label: 'Type',
    render: (value, row) => {
      if (row.idCommande) {
        return `<span class="badge badge-sm bg-gradient-info">Commande #${row.idCommande}</span>`;
      } else if (row.idReservation) {
        return `<span class="badge badge-sm bg-gradient-warning">Réservation #${row.idReservation}</span>`;
      }
      return '-';
    }
  },
  {
    key: 'montant',
    label: 'Montant',
    align: 'end',
    render: (value) => {
      const amount = parseFloat(value) || 0;
      return `<strong class="text-success">${amount.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' })}</strong>`;
    }
  },
  {
    key: 'modePaiement',
    label: 'Mode',
    render: (value) => {
      const modes = {
        'Espèces': '<span class="badge badge-sm bg-gradient-success">💵 Espèces</span>',
        'Carte bancaire': '<span class="badge badge-sm bg-gradient-primary">💳 Carte</span>',
        'Virement': '<span class="badge badge-sm bg-gradient-info">🏦 Virement</span>',
        'Mobile Money': '<span class="badge badge-sm bg-gradient-warning">📱 Mobile</span>',
        'Chèque': '<span class="badge badge-sm bg-gradient-secondary">📄 Chèque</span>'
      };
      return modes[value] || `<span class="badge badge-sm bg-gradient-secondary">${value}</span>`;
    }
  },
  {
    key: 'statut',
    label: 'Statut',
    align: 'center',
    render: (value) => {
      const badges = {
        'Payé': '<span class="badge badge-sm bg-gradient-success">Payé</span>',
        'En attente': '<span class="badge badge-sm bg-gradient-warning">En attente</span>',
        'Remboursé': '<span class="badge badge-sm bg-gradient-info">Remboursé</span>',
        'Annulé': '<span class="badge badge-sm bg-gradient-danger">Annulé</span>'
      };
      return badges[value] || `<span class="badge badge-sm bg-gradient-secondary">${value}</span>`;
    }
  }
];

// Actions
const tableActions = [
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

// Charger les paiements
const loadPaiements = async () => {
  isLoading.value = true;
  console.log('📡 Chargement paiements...');
  
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getPaiementsBySociete(societeId);

    if (Array.isArray(response)) {
      paiements.value = response;
    } else if (response?.data) {
      paiements.value = response.data;
    } else {
      paiements.value = [];
    }
    
    console.log('✅ Paiements chargés:', paiements.value.length);
    
    // Calculer le total
    const total = paiements.value.reduce((sum, p) => sum + (parseFloat(p.montant) || 0), 0);
    console.log(`💰 Total encaissé: ${total.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' })}`);
    
  } catch (error) {
    console.error('❌ Erreur chargement paiements:', error);
    await showError('Erreur', 'Impossible de charger les paiements');
    paiements.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedPaiement.value = null;
  const modal = new Modal(document.getElementById('paiementModal'));
  modal.show();
};

const openEditModal = (paiement) => {
  selectedPaiement.value = { ...paiement };
  const modal = new Modal(document.getElementById('paiementModal'));
  modal.show();
};

const handleSave = async (paiementData) => {
  showLoading('Enregistrement...');
  
  try {
    const dataToSave = {
      ...paiementData,
      idSociete: userStore.societeId || 3
    };

    if (paiementData.idPaiement && paiementData.idPaiement > 0) {
      await api.updatePaiement(paiementData.idPaiement, dataToSave);
      await showSuccess('Modifié !', 'Paiement modifié');
    } else {
      await api.createPaiement(dataToSave);
      await showSuccess('Créé !', 'Paiement créé');
    }
    
    const modal = Modal.getInstance(document.getElementById('paiementModal'));
    if (modal) modal.hide();
    
    await loadPaiements();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleDelete = async (paiement) => {
  const result = await showConfirm(
    'Supprimer ?',
    `Supprimer le paiement ${paiement.referencePaiemenet} ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deletePaiement(paiement.idPaiement);
      close();
      await showSuccess('Supprimé !');
      await loadPaiements();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer');
    }
  }
};

onMounted(() => {
  loadPaiements();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}
</style>

