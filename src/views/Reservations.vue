<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Réservations"
          subtitle="Réservations de votre entreprise"
          :data="reservations"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['nomClient', 'telephoneClient', 'articleNom', 'statut']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des réservations..."
          empty-text="Aucune réservation trouvée"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-calendar-plus me-2"></i>
              Nouvelle Réservation
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <reservation-modal
      :reservation="selectedReservation"
      modal-id="reservationModal"
      @save="handleSave"
      ref="reservationModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ReservationModal from '@/components/modals/ReservationModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const reservations = ref([]);
const selectedReservation = ref(null);
const reservationModalRef = ref(null);

// Configuration des colonnes
const columns = [
  {
    key: 'idReservation',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'nomClient',
    label: 'Client',
    render: (value, row) => {
      return `<div>
        <p class="mb-0 text-sm font-weight-bold">${value}</p>
        <p class="mb-0 text-xs text-secondary">${row.telephoneClient || '-'}</p>
      </div>`;
    }
  },
  {
    key: 'articleNom',
    label: 'Article',
    render: (value, row) => value || `Article #${row.idArticle}`
  },
  {
    key: 'periode',
    label: 'Période',
    render: (value, row) => {
      const debut = row.dateDebut ? new Date(row.dateDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '';
      const fin = row.dateFin ? new Date(row.dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '';
      return `${debut} → ${fin}`;
    }
  },
  {
    key: 'montantTotal',
    label: 'Montant',
    align: 'end',
    render: (value) => {
      const amount = parseFloat(value) || 0;
      return `<strong>${amount.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' })}</strong>`;
    }
  },
  {
    key: 'montantAvance',
    label: 'Avancé',
    align: 'end',
    render: (value) => {
      const amount = parseFloat(value) || 0;
      if (amount > 0) {
        return amount.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' });
      }
      return '-';
    }
  },
  {
    key: 'statut',
    label: 'Statut',
    align: 'center',
    render: (value) => {
      const badges = {
        'En attente': '<span class="badge badge-sm bg-gradient-warning">En attente</span>',
        'Confirmée': '<span class="badge badge-sm bg-gradient-info">Confirmée</span>',
        'En cours': '<span class="badge badge-sm bg-gradient-primary">En cours</span>',
        'Terminée': '<span class="badge badge-sm bg-gradient-success">Terminée</span>',
        'Annulée': '<span class="badge badge-sm bg-gradient-danger">Annulée</span>'
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

// Charger les réservations
const loadReservations = async () => {
  isLoading.value = true;
  console.log('📡 Chargement réservations...');
  
  try {
    const societeId = userStore.societeId;
    
    let response;
    if (societeId) {
      response = await api.getReservationsBySociete(societeId);
    } else {
      response = await api.getReservations();
    }
    
    if (Array.isArray(response)) {
      reservations.value = response;
    } else if (response?.data) {
      reservations.value = response.data;
    } else {
      reservations.value = [];
    }
    
    console.log('✅ Réservations chargées:', reservations.value.length);
    
    // Enrichir avec noms articles
    await enrichWithArticleNames();
    
  } catch (error) {
    console.error('❌ Erreur chargement réservations:', error);
    await showError('Erreur', 'Impossible de charger les réservations');
    reservations.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec noms articles
const enrichWithArticleNames = async () => {
  try {
    const societeId = userStore.societeId;
    const articles = societeId 
      ? await api.getArticlesBySociete(societeId)
      : await api.getArticles();
    
    const articlesMap = {};
    (Array.isArray(articles) ? articles : []).forEach(article => {
      articlesMap[article.idArticle] = article.libelle;
    });
    
    reservations.value = reservations.value.map(res => ({
      ...res,
      articleNom: articlesMap[res.idArticle] || ''
    }));
  } catch (error) {
    console.warn('⚠️ Impossible de charger les articles:', error);
  }
};

const openCreateModal = () => {
  selectedReservation.value = null;
  const modal = new Modal(document.getElementById('reservationModal'));
  modal.show();
};

const openEditModal = (reservation) => {
  selectedReservation.value = { ...reservation };
  const modal = new Modal(document.getElementById('reservationModal'));
  modal.show();
};

const handleSave = async (reservationData) => {
  showLoading('Enregistrement...');
  
  try {
    if (reservationData.idReservation && reservationData.idReservation > 0) {
      await api.updateReservation(reservationData.idReservation, reservationData);
      await showSuccess('Modifié !', 'Réservation modifiée');
    } else {
      await api.createReservation(reservationData);
      await showSuccess('Créé !', 'Réservation créée');
    }
    
    const modal = Modal.getInstance(document.getElementById('reservationModal'));
    if (modal) modal.hide();
    
    await loadReservations();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleDelete = async (reservation) => {
  const result = await showConfirm(
    'Supprimer ?',
    `Supprimer la réservation de ${reservation.nomClient} ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deleteReservation(reservation.idReservation);
      close();
      await showSuccess('Supprimé !');
      await loadReservations();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer');
    }
  }
};

onMounted(() => {
  loadReservations();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}
</style>

