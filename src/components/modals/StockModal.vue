<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouveau'} Stock`"
    size="md"
    confirm-text="Enregistrer"
    confirm-icon="fas fa-save"
    confirm-color="success"
    :is-loading="isSaving"
    loading-text="Enregistrement..."
    @confirm="handleSubmit"
    ref="modalRef"
  >
    <template #body>
      <div class="modal-body-scrollable">
        <form @submit.prevent="handleSubmit">
          
          <!-- Article et Site -->
          <h6 class="text-sm mt-0 mb-2">Références</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Article *</label>
              <argon-select
                v-model="formData.idArticle"
                :options="articles"
                placeholder="Sélectionner un article"
                :disabled="isLoadingArticles || isEditMode"
                id="idArticle"
                name="idArticle"
              />
              <small v-if="isEditMode" class="text-muted">Non modifiable en édition</small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Site *</label>
              <argon-select
                v-model="formData.idSite"
                :options="sites"
                placeholder="Sélectionner un site"
                :disabled="isLoadingSites || isEditMode"
                id="idSite"
                name="idSite"
              />
              <small v-if="isEditMode" class="text-muted">Non modifiable en édition</small>
            </div>
          </div>

          <!-- Stock -->
          <h6 class="text-sm mt-3 mb-2">Quantité</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Quantité en Stock *</label>
              <argon-input
                v-model="formData.quantiteStock"
                type="number"
                step="0.01"
                placeholder="0.00"
                :is-required="true"
                id="quantiteStock"
                name="quantiteStock"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Seuil d'Alerte</label>
              <argon-input
                v-model="formData.seuilAlerte"
                type="number"
                step="1"
                placeholder="10"
                id="seuilAlerte"
                name="seuilAlerte"
              />
              <small class="text-muted">Alerte si stock < seuil</small>
            </div>
          </div>

          <!-- Prix -->
          <h6 class="text-sm mt-3 mb-2">Tarification</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Prix d'Achat</label>
              <argon-input
                v-model="formData.prixAchat"
                type="number"
                step="0.01"
                placeholder="0.00"
                id="prixAchat"
                name="prixAchat"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Prix de Vente HT *</label>
              <argon-input
                v-model="formData.prixVentHT"
                type="number"
                step="0.01"
                placeholder="0.00"
                :is-required="true"
                id="prixVentHT"
                name="prixVentHT"
              />
            </div>
          </div>

          <!-- Marge calculée -->
          <div class="row" v-if="margeCalculee !== null">
            <div class="col-12 mb-3">
              <div class="alert alert-info py-2 mb-0">
                <strong>Marge:</strong> 
                {{ margeCalculee.montant.toFixed(2) }} FC 
                ({{ margeCalculee.pourcentage.toFixed(1) }}%)
                <span v-if="margeCalculee.pourcentage < 0" class="text-danger"> ⚠️ Perte !</span>
              </div>
            </div>
          </div>

          <!-- Statut -->
          <div class="row">
            <div class="col-12 mb-3">
              <argon-switch
                v-model="formData.statut"
                id="stockStatut"
                name="statut"
              >
                Actif
              </argon-switch>
            </div>
          </div>

        </form>
      </div>
    </template>
  </generic-modal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import GenericModal from '@/components/GenericModal.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';
import api from '@/services/api.service';

const userStore = useUserStore();

const props = defineProps({
  stock: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'stockModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);
const articles = ref([]);
const sites = ref([]);
const isLoadingArticles = ref(false);
const isLoadingSites = ref(false);

const isEditMode = computed(() => props.stock !== null);

// Calculer la marge
const margeCalculee = computed(() => {
  const achat = parseFloat(formData.value.prixAchat) || 0;
  const vente = parseFloat(formData.value.prixVentHT) || 0;
  
  if (achat === 0 || vente === 0) return null;
  
  const montant = vente - achat;
  const pourcentage = (montant / achat) * 100;
  
  return { montant, pourcentage };
});

// Formulaire
const formData = ref({
  idStock: 0,
  idArticle: '',
  idSite: '',
  quantiteStock: 0,
  prixAchat: 0,
  prixVentHT: 0,
  seuilAlerte: 10,
  statut: true
});

// Charger les articles
const loadArticles = async () => {
  isLoadingArticles.value = true;
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getArticlesBySociete(societeId);
    
    articles.value = (Array.isArray(response) ? response : []).map(article => ({
      value: parseInt(article.idArticle, 10),
      label: article.libelle
    }));
    console.log('✅ Articles chargés:', articles.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement articles:', error);
    articles.value = [];
  } finally {
    isLoadingArticles.value = false;
  }
};

// Charger les sites (filtrés par société de l'utilisateur)
const loadSites = async () => {
  isLoadingSites.value = true;
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getSitesBySociete(societeId);
    const filteredSites = Array.isArray(response) ? response : [];
    
    sites.value = filteredSites.map(site => ({
      value: parseInt(site.idSite, 10),
      label: site.nomSite
    }));
    console.log('✅ Sites chargés:', sites.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    sites.value = [];
  } finally {
    isLoadingSites.value = false;
  }
};

// Charger les données si mode édition
watch(() => props.stock, (newVal) => {
  if (newVal) {
    formData.value = { 
      idStock: newVal.idStock || 0,
      idArticle: newVal.idArticle ? parseInt(newVal.idArticle, 10) : '',
      idSite: newVal.idSite ? parseInt(newVal.idSite, 10) : '',
      quantiteStock: newVal.quantiteStock || 0,
      prixAchat: newVal.prixAchat || 0,
      prixVentHT: newVal.prixVentHT || 0,
      seuilAlerte: newVal.seuilAlerte || 10,
      statut: newVal.statut !== undefined ? newVal.statut : true
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idStock: 0,
    idArticle: '',
    idSite: '',
    quantiteStock: 0,
    prixAchat: 0,
    prixVentHT: 0,
    seuilAlerte: 10,
    statut: true
  };
};

// Validation
const validate = () => {
  if (!formData.value.idArticle) {
    return { valid: false, message: 'L\'article est obligatoire' };
  }
  if (!formData.value.idSite) {
    return { valid: false, message: 'Le site est obligatoire' };
  }
  if (formData.value.quantiteStock === '' || formData.value.quantiteStock === null || formData.value.quantiteStock === undefined) {
    return { valid: false, message: 'La quantité en stock est obligatoire' };
  }
  if (!formData.value.prixVentHT || formData.value.prixVentHT <= 0) {
    return { valid: false, message: 'Le prix de vente HT doit être supérieur à 0' };
  }
  return { valid: true };
};

// Soumettre le formulaire
const handleSubmit = async () => {
  const validation = validate();
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  isSaving.value = true;
  try {
    emit('save', formData.value);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

// Charger données au montage
onMounted(() => {
  loadArticles();
  loadSites();
});

// Exposer les méthodes
defineExpose({
  resetForm,
  show: () => modalRef.value?.show(),
  hide: () => modalRef.value?.hide(),
  close: () => modalRef.value?.hide()
});
</script>

<style scoped>
.modal-body-scrollable {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-body-scrollable::-webkit-scrollbar {
  width: 6px;
}

.modal-body-scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-scrollable::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.modal-body-scrollable::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #344767;
  margin-bottom: 0.5rem;
}

.alert {
  font-size: 0.875rem;
}
</style>

