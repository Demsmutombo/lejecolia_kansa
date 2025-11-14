<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Commandes"
          subtitle="Commandes Lejecolia"
          :data="commandes"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['clientNom', 'utilisateurNom', 'statut']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des commandes..."
          empty-text="Aucune commande trouvée"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouvelle Commande
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <commande-modal
      :commande="selectedCommande"
      modal-id="commandeModal"
      @save="handleSave"
      ref="commandeModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import CommandeModal from '@/components/modals/CommandeModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const router = useRouter();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const commandes = ref([]);
const selectedCommande = ref(null);
const commandeModalRef = ref(null);

// Configuration des colonnes
const columns = [
  {
    key: 'idCommande',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'clientNom',
    label: 'Client',
    render: (value, row) => value || `Client #${row.idClient}`
  },
  {
    key: 'utilisateurNom',
    label: 'Vendeur',
    render: (value, row) => value || `User #${row.idUtilisateur}`
  },
  {
    key: 'dateCommande',
    label: 'Date',
    render: (value) => {
      if (!value) return '-';
      try {
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return value;
      }
    }
  },
  {
    key: 'statut',
    label: 'Statut',
    align: 'center',
    render: (value) => {
      const badges = {
        'En cours': '<span class="badge badge-sm bg-gradient-warning">En cours</span>',
        'Validée': '<span class="badge badge-sm bg-gradient-info">Validée</span>',
        'Livrée': '<span class="badge badge-sm bg-gradient-success">Livrée</span>',
        'Annulée': '<span class="badge badge-sm bg-gradient-danger">Annulée</span>'
      };
      return badges[value] || `<span class="badge badge-sm bg-gradient-secondary">${value}</span>`;
    }
  }
];

// Actions
const tableActions = [
  {
    name: 'view',
    label: 'Voir Détails',
    icon: 'fas fa-eye',
    class: 'text-dark',
    onClick: (row) => router.push(`/commandes/${row.idCommande}`)
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
    icon: 'fas fa-ban',
    class: 'text-warning',
    iconOnly: true,
    onClick: (row) => handleDelete(row)
  }
];

// Charger les commandes
const loadCommandes = async () => {
  isLoading.value = true;
  console.log('📡 Chargement commandes pour société:', userStore.societeId);
  
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getCommandesBySociete(societeId);

    if (Array.isArray(response)) {
      commandes.value = response;
    } else if (response?.data) {
      commandes.value = response.data;
    } else {
      commandes.value = [];
    }
    
    console.log('✅ Commandes chargées:', commandes.value.length);
    
    // Enrichir avec noms clients et utilisateurs
    await enrichWithNames();
    
  } catch (error) {
    console.error('❌ Erreur chargement commandes:', error);
    await showError('Erreur', 'Impossible de charger les commandes');
    commandes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec noms clients et utilisateurs
const enrichWithNames = async () => {
  try {
    const societeId = userStore.societeId || 3;
    const [clients, utilisateurs] = await Promise.all([
      api.getClientsParSiteBySociete(societeId),
      api.getUtilisateursVueBySociete(societeId)
    ]);
    
    const clientsMap = {};
    const utilisateursMap = {};
    
    (Array.isArray(clients) ? clients : []).forEach(client => {
      clientsMap[client.idClient] = `${client.prenom || ''} ${client.nom || ''}`.trim();
    });
    
    (Array.isArray(utilisateurs) ? utilisateurs : []).forEach(user => {
      const nomComplet = `${user.nomUtilisateur || ''} ${user.postNomUtilisateur || ''} ${user.prenomUtilisateur || ''}`.trim();
      utilisateursMap[user.idUtilisateur] = nomComplet || `Utilisateur #${user.idUtilisateur}`;
    });
    
    commandes.value = commandes.value.map(cmd => ({
      ...cmd,
      clientNom: clientsMap[cmd.idClient] || `Client #${cmd.idClient}`,
      utilisateurNom: utilisateursMap[cmd.idUtilisateur] || `Vendeur #${cmd.idUtilisateur}`
    }));
    
    console.log('✅ Noms enrichis:', commandes.value.length, 'commandes');
  } catch (error) {
    console.warn('⚠️ Impossible de charger les noms:', error);
  }
};

const openCreateModal = () => {
  selectedCommande.value = null;
  const modal = new Modal(document.getElementById('commandeModal'));
  modal.show();
};

const openEditModal = (commande) => {
  selectedCommande.value = { ...commande };
  const modal = new Modal(document.getElementById('commandeModal'));
  modal.show();
};

const handleSave = async (commandeData) => {
  showLoading('Enregistrement...');
  
  try {
    const dataToSave = {
      ...commandeData,
      idSociete: userStore.societeId || 3
    };

    if (commandeData.idCommande && commandeData.idCommande > 0) {
      await api.updateCommande(commandeData.idCommande, dataToSave);
      await showSuccess('Modifié !', 'Commande modifiée');
    } else {
      await api.createCommande(dataToSave);
      await showSuccess('Créé !', 'Commande créée');
    }
    
    const modal = Modal.getInstance(document.getElementById('commandeModal'));
    if (modal) modal.hide();
    
    await loadCommandes();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleDelete = async (commande) => {
  const result = await showConfirm(
    'Annuler cette commande ?',
    `La commande #${commande.idCommande} sera marquée comme "Annulée" (pas supprimée définitivement)`,
    { confirmButtonText: 'Oui, annuler', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Annulation...');
    
    try {
      console.log('❌ Annulation commande #', commande.idCommande);
      
      // Charger la commande complète
      const commandeComplete = await api.getCommandeById(commande.idCommande);
      
      // Mettre à jour le statut
      await api.updateCommande(commande.idCommande, {
        ...commandeComplete,
      idSociete: userStore.societeId || 3,
        statutCommande: 'Annulée',
        dateLastModification: new Date().toISOString()
      });
      
      close();
      await showSuccess('Annulée !', 'La commande a été marquée comme annulée');
      await loadCommandes();
    } catch (error) {
      close();
      console.error('❌ Erreur annulation:', error);
      await showError('Erreur', error.response?.data?.message || error.message || 'Impossible d\'annuler la commande');
    }
  }
};

onMounted(() => {
  loadCommandes();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}
</style>

