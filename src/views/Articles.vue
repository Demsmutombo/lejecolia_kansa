<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <data-table
          title="Gestion des Articles"
          subtitle="Articles et produits de votre société"
          :data="articles"
          :columns="columns"
          :actions="tableActions"
          :show-search="true"
          :search-fields="['libelle', 'codeBarreQR']"
          :loading="isLoading"
          :items-per-page="10"
          loading-text="Chargement des articles..."
          empty-text="Aucun article trouvé"
        >
          <template #actions>
            <argon-button color="success" size="sm" @click="openCreateModal">
              <i class="fas fa-plus me-2"></i>
              Nouvel Article
            </argon-button>
          </template>
        </data-table>
      </div>
    </div>

    <!-- Modal Créer/Modifier -->
    <article-modal
      :article="selectedArticle"
      modal-id="articleModal"
      @save="handleSave"
      ref="articleModalRef"
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
import ArticleModal from '@/components/modals/ArticleModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const router = useRouter();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showConfirm, showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth(); // Accessible aux gestionnaires

const isLoading = ref(false);
const articles = ref([]);
const selectedArticle = ref(null);
const articleModalRef = ref(null);

// Configuration des colonnes
const columns = [
  {
    key: 'idArticle',
    label: 'N°',
    type: 'index',
    align: 'center'
  },
  {
    key: 'libelle',
    label: 'Article',
    render: (value) => `<strong>${value}</strong>`
  },
  {
    key: 'tva',
    label: 'TVA',
    align: 'center',
    render: (value) => `${parseFloat(value || 0).toFixed(2)}%`
  },
  {
    key: 'remise',
    label: 'Remise',
    align: 'center',
    render: (value) => `${parseFloat(value || 0).toFixed(2)}%`
  },
  {
    key: 'codeBarreQR',
    label: 'Code Barre',
    render: (value) => value || '-'
  },
  {
    key: 'perissable',
    label: 'Périssable',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value ? 'warning' : 'secondary',
    render: (value) => value ? 'Oui' : 'Non'
  },
  {
    key: 'withStock',
    label: 'Stock',
    type: 'badge',
    align: 'center',
    badgeColor: (value) => value ? 'info' : 'secondary',
    render: (value) => value ? 'Oui' : 'Non'
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

// Charger les articles de la société du gestionnaire
const loadArticles = async () => {
  isLoading.value = true;
  console.log('📡 Chargement articles pour société:', userStore.societeId);
  
  try {
    const societeId = userStore.societeId;
    
    if (societeId) {
      // Charger les articles de la société du gestionnaire
      const response = await api.getArticlesBySociete(societeId);
      
      if (Array.isArray(response)) {
        articles.value = response;
      } else if (response?.data) {
        articles.value = response.data;
      } else {
        articles.value = [];
      }
      
      console.log('✅ Articles chargés:', articles.value.length);
    } else {
      console.warn('⚠️ Pas de societeId - Chargement de tous les articles');
      const response = await api.getArticles();
      articles.value = Array.isArray(response) ? response : [];
    }
    
  } catch (error) {
    console.error('❌ Erreur chargement articles:', error);
    await showError('Erreur', 'Impossible de charger les articles');
    articles.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedArticle.value = null;
  const modal = new Modal(document.getElementById('articleModal'));
  modal.show();
};

const openEditModal = (article) => {
  selectedArticle.value = { ...article };
  const modal = new Modal(document.getElementById('articleModal'));
  modal.show();
};

const handleSave = async (articleData) => {
  showLoading('Enregistrement...');
  
  try {
    if (articleData.idArticle && articleData.idArticle > 0) {
      await api.updateArticle(articleData.idArticle, articleData);
      await showSuccess('Modifié !', `${articleData.libelle} modifié`);
    } else {
      await api.createArticle(articleData);
      await showSuccess('Créé !', `${articleData.libelle} créé`);
    }
    
    const modal = Modal.getInstance(document.getElementById('articleModal'));
    if (modal) modal.hide();
    
    await loadArticles();
    
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', error.response?.data?.message || 'Erreur de sauvegarde');
  }
};

const handleToggleStatus = async (article) => {
  const newStatus = !article.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} ?`,
    `Voulez-vous ${action} "${article.libelle}" ?`,
    { confirmButtonText: `Oui, ${action}`, confirmButtonColor: newStatus ? '#2dce89' : '#f5365c' }
  );

  if (result.isConfirmed) {
    showLoading(`${action.charAt(0).toUpperCase() + action.slice(1)}...`);
    
    try {
      const updatedData = { ...article, statut: newStatus };
      await api.updateArticle(article.idArticle, updatedData);
      close();
      await showSuccess('Statut modifié !');
      await loadArticles();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de modifier le statut');
    }
  }
};

const handleDelete = async (article) => {
  const result = await showConfirm(
    'Supprimer ?',
    `Supprimer "${article.libelle}" ?`,
    { confirmButtonText: 'Oui, supprimer', confirmButtonColor: '#d33' }
  );

  if (result.isConfirmed) {
    showLoading('Suppression...');
    
    try {
      await api.deleteArticle(article.idArticle);
      close();
      await showSuccess('Supprimé !');
      await loadArticles();
    } catch (error) {
      close();
      await showError('Erreur', 'Impossible de supprimer');
    }
  }
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}
</style>

