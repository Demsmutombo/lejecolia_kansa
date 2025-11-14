<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Stocks"
          subtitle="Inventaire et tarification des articles"
          :data="stocks"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['articleNom', 'siteNom']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des stocks..."
          empty-text="Aucun stock trouvé"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouveau Stock
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <stock-modal
      :stock="selectedStock"
      modal-id="stockModal"
      @save="handleSave"
      ref="stockModalRef"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { useUserStore } from '@/stores/user';
import DataTable from '@/components/DataTable.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import StockModal from '@/components/modals/StockModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const stocks = ref([]);
const selectedStock = ref(null);
const stockModalRef = ref(null);

// Configuration des colonnes
const columns = [
  {
    key: 'numero',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'articleNom',
    label: 'Article',
    render: (value, row) => row.articleNom || `Article #${row.idArticle}`
  },
  {
    key: 'siteNom',
    label: 'Site',
    render: (value, row) => row.siteNom || `Site #${row.idSite}`
  },
  {
    key: 'categorieNom',
    label: 'Catégorie',
    render: (value, row) => row.categorieNom || '-'
  },
  {
    key: 'quantiteStock',
    label: 'Quantité',
    align: 'center',
    render: (value, row) => {
      const qte = parseFloat(value) || 0;
      const seuil = parseInt(row.seuilAlerte, 10) || 0;
      
      if (qte === 0) {
        return '<span class="badge badge-sm bg-gradient-danger">0 - Rupture</span>';
      } else if (seuil > 0 && qte <= seuil) {
        return `<span class="badge badge-sm bg-gradient-warning">${qte.toFixed(2)} - Alerte !</span>`;
      } else {
        return `<span class="badge badge-sm bg-gradient-success">${qte.toFixed(2)}</span>`;
      }
    }
  },
  {
    key: 'seuilAlerte',
    label: 'Seuil',
    align: 'center',
    render: (value) => {
      const seuil = parseInt(value, 10) || 0;
      return seuil > 0 ? seuil : '-';
    }
  },
  {
    key: 'prix',
    label: 'Prix Achat / Vente',
    render: (value, row) => {
      const achat = parseFloat(row.prixAchat) || 0;
      const vente = parseFloat(row.prixVentHT) || 0;
      return `
        <div style="font-size: 0.75rem;">
          <span class="text-secondary">${achat.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' })}</span> /
          <strong class="text-success">${vente.toLocaleString('fr-CD', { style: 'currency', currency: 'CDF' })}</strong>
        </div>
      `;
    }
  },
  {
    key: 'marge',
    label: 'Marge',
    align: 'end',
    render: (value, row) => {
      const achat = parseFloat(row.prixAchat) || 0;
      const vente = parseFloat(row.prixVentHT) || 0;
      
      if (achat === 0) return '-';
      
      const montant = vente - achat;
      const pourcentage = (montant / achat) * 100;
      
      if (pourcentage < 0) {
        return `<span class="text-danger">${pourcentage.toFixed(1)}%</span>`;
      } else if (pourcentage < 20) {
        return `<span class="text-warning">${pourcentage.toFixed(1)}%</span>`;
      } else {
        return `<span class="text-success font-weight-bold">${pourcentage.toFixed(1)}%</span>`;
      }
    }
  },
  {
    key: 'statut',
    label: 'Statut',
    align: 'center',
    render: (value) => {
      return value 
        ? '<span class="badge badge-sm bg-gradient-success">Actif</span>'
        : '<span class="badge badge-sm bg-gradient-secondary">Inactif</span>';
    }
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

// Charger les stocks
const loadStocks = async () => {
  isLoading.value = true;
  console.log('📦 Chargement des stocks...');
  
  try {
    await enrichWithNames();
    
    // Compter les alertes
    const alertes = stocks.value.filter(s => {
      const qte = parseFloat(s.quantiteStock) || 0;
      const seuil = parseInt(s.seuilAlerte, 10) || 0;
      return qte === 0 || (seuil > 0 && qte <= seuil);
    });
    
    if (alertes.length > 0) {
      console.warn(`⚠️ ${alertes.length} stock(s) en alerte !`);
    }
    
  } catch (error) {
    console.error('❌ Erreur chargement stocks:', error);
    await showError('Erreur', 'Impossible de charger les stocks');
    stocks.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec noms et filtrer par société
const enrichWithNames = async () => {
  try {
    const societeId = userStore.societeId || 3;
    console.log(`📦 Chargement des stocks optimisés pour Lejecolia (#${societeId})`);

    const stocksData = await api.getStocksVueBySociete(societeId);
    stocks.value = (Array.isArray(stocksData) ? stocksData : []).map((stock) => {
      const articleName =
        stock.articleNom ||
        stock.nomArticle ||
        stock.libelleArticle ||
        stock.libelle ||
        stock.descriptionArticle ||
        stock.article ||
        stock.designation ||
        `Article #${stock.idArticle}`;

      const siteName =
        stock.siteNom ||
        stock.nomSite ||
        stock.siteName ||
        stock.site ||
        `Site #${stock.idSite}`;

      const categorieName =
        stock.categorieNom ||
        stock.nomCategorie ||
        stock.categorie ||
        stock.libelleCategorie ||
        '';

      return {
        ...stock,
        articleNom: articleName,
        siteNom: siteName,
        categorieNom: categorieName,
      };
    });
    console.log(`✅ ${stocks.value.length} stock(s) trouvés pour la société`);
  } catch (error) {
    console.warn('⚠️ Impossible de charger les stocks:', error);
    throw error;
  }
};

const openCreateModal = () => {
  selectedStock.value = null;
  const modal = new Modal(document.getElementById('stockModal'));
  modal.show();
};

const openEditModal = (stock) => {
  selectedStock.value = { ...stock };
  const modal = new Modal(document.getElementById('stockModal'));
  modal.show();
};

const handleToggleStatus = async (stock) => {
  const newStatus = !stock.statut;
  const action = newStatus ? 'activer' : 'désactiver';

  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} ?`,
    `Voulez-vous ${action} le stock de ${stock.articleNom} ?`,
    {
      confirmButtonText: `Oui, ${action}`,
      confirmButtonColor: newStatus ? '#2dce89' : '#f5365c'
    }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`);
    
    try {
      const updatedData = {
        ...stock,
        statut: newStatus,
        idSociete: userStore.societeId || 3
      };
      await api.updateStock(stock.idStock, updatedData);
      close();
      await showSuccess('Modifié !', `Stock ${newStatus ? 'activé' : 'désactivé'}`);
      await loadStocks();
    } catch (error) {
      close();
      console.error('❌ Erreur:', error);
      await showError('Erreur', 'Impossible de modifier le statut');
    }
  }
};

const handleSave = async (stockData) => {
  showLoading('Enregistrement...');
  
  try {
    const dataToSave = {
      ...stockData,
      idSociete: userStore.societeId || 3
    };

    if (stockData.idStock && stockData.idStock > 0) {
      await api.updateStock(stockData.idStock, dataToSave);
      await showSuccess('Modifié !', 'Stock modifié');
    } else {
      await api.createStock(dataToSave);
      await showSuccess('Créé !', 'Stock créé');
    }
    
    const modal = Modal.getInstance(document.getElementById('stockModal'));
    if (modal) modal.hide();
    
    await loadStocks();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleDelete = async (stock) => {
  const result = await showConfirm(
    'Supprimer ?',
    `Supprimer le stock de ${stock.articleNom} au site ${stock.siteNom} ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deleteStock(stock.idStock);
      close();
      await showSuccess('Supprimé !');
      await loadStocks();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer');
    }
  }
};

onMounted(() => {
  loadStocks();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}
</style>

