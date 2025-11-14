<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouvelle'} Réservation`"
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
          
          <!-- Client -->
          <h6 class="text-sm mt-0 mb-2">Client</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nom *</label>
              <argon-input
                v-model="formData.nomClient"
                placeholder="Nom du client"
                :is-required="true"
                id="nomClient"
                name="nomClient"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Téléphone *</label>
              <argon-input
                v-model="formData.telephoneClient"
                placeholder="+243 123 456 789"
                :is-required="true"
                id="telephoneClient"
                name="telephoneClient"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Adresse</label>
              <argon-input
                v-model="formData.adresseClient"
                placeholder="Adresse du client"
                id="adresseClient"
                name="adresseClient"
              />
            </div>
          </div>

          <!-- Réservation -->
          <h6 class="text-sm mt-3 mb-2">Détails Réservation</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Article *</label>
              <argon-select
                v-model="formData.idArticle"
                :options="articles"
                placeholder="Sélectionner un article"
                :disabled="isLoadingArticles"
                id="idArticle"
                name="idArticle"
                @update:modelValue="handleArticleChange"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Quantité *</label>
              <argon-input
                v-model="formData.quantite"
                type="number"
                step="1"
                placeholder="1"
                :is-required="true"
                id="quantite"
                name="quantite"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Date Début *</label>
              <input
                v-model="formData.dateDebut"
                type="datetime-local"
                class="form-control"
                required
                id="dateDebut"
                name="dateDebut"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Date Fin *</label>
              <input
                v-model="formData.dateFin"
                type="datetime-local"
                class="form-control"
                required
                id="dateFin"
                name="dateFin"
              />
            </div>
          </div>

          <!-- Montants -->
          <h6 class="text-sm mt-3 mb-2">💰 Montants (en Franc Congolais)</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Prix Unitaire (FC) *</label>
              <div 
                v-if="formData.prixUnitaire > 0"
                class="p-3 bg-gradient-info text-white rounded-3 text-center"
              >
                <h5 class="mb-0 text-white">{{ formatMontant(formData.prixUnitaire) }} FC</h5>
                <small class="opacity-8">🔄 Récupéré automatiquement</small>
              </div>
              <div 
                v-else
                class="p-3 bg-light text-secondary rounded-3 text-center"
              >
                <h6 class="mb-0 text-secondary">
                  <i class="fas fa-arrow-up me-2"></i>
                  Sélectionnez un article
                </h6>
                <small class="text-xs">Le prix sera chargé automatiquement</small>
              </div>
              <small class="text-muted d-block mt-2">
                <i class="fas fa-info-circle me-1"></i>
                Le prix est automatiquement chargé depuis l'article sélectionné
              </small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Montant Total</label>
              <div class="p-3 bg-gradient-success text-white rounded-3 text-center">
                <h5 class="mb-0 text-white">{{ formatMontant(formData.montantTotal) }} FC</h5>
                <small class="opacity-8">Prix × Quantité</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Montant Avancé (FC)</label>
              <argon-input
                v-model="formData.montantAvance"
                type="number"
                step="0.01"
                placeholder="0.00"
                id="montantAvance"
                name="montantAvance"
              />
              <small class="text-muted">Acompte versé par le client</small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Mode Paiement</label>
              <argon-select
                v-model="formData.modePaiement"
                :options="modePaiementOptions"
                placeholder="Sélectionner"
                id="modePaiement"
                name="modePaiement"
              />
            </div>
          </div>

          <!-- Autres -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Statut</label>
              <argon-select
                v-model="formData.statut"
                :options="statutOptions"
                placeholder="Sélectionner"
                id="statut"
                name="statut"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Date Réservation</label>
              <input
                v-model="formData.dateReservation"
                type="datetime-local"
                class="form-control"
                id="dateReservation"
                name="dateReservation"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Commentaire</label>
              <textarea
                v-model="formData.commentaire"
                class="form-control"
                rows="3"
                placeholder="Commentaire ou notes..."
                id="commentaire"
                name="commentaire"
              ></textarea>
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
import api from '@/services/api.service';

const userStore = useUserStore();

const props = defineProps({
  reservation: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'reservationModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);
const articles = ref([]);
const articlesData = ref([]); // Stocker tous les articles avec leurs détails
const isLoadingArticles = ref(false);

const isEditMode = computed(() => props.reservation !== null);

const statutOptions = [
  { value: 'En attente', label: 'En attente' },
  { value: 'Confirmée', label: 'Confirmée' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Terminée', label: 'Terminée' },
  { value: 'Annulée', label: 'Annulée' }
];

const modePaiementOptions = [
  { value: 'Espèces', label: 'Espèces' },
  { value: 'Carte bancaire', label: 'Carte bancaire' },
  { value: 'Virement', label: 'Virement' },
  { value: 'Mobile Money', label: 'Mobile Money' }
];

// Formulaire
const formData = ref({
  idReservation: 0,
  idArticle: '',
  nomClient: '',
  telephoneClient: '',
  adresseClient: '',
  dateDebut: '',
  dateFin: '',
  dateReservation: '',
  prixUnitaire: 0,
  quantite: '1', // String pour éviter warning Vue avec ArgonInput
  montantTotal: 0,
  montantAvance: '0', // String pour éviter warning Vue avec ArgonInput
  commentaire: '',
  modePaiement: '',
  statut: 'En attente'
});

// Charger les articles
const loadArticles = async () => {
  isLoadingArticles.value = true;
  try {
    const societeId = userStore.societeId;
    let response;
    
    if (societeId) {
      response = await api.getArticlesBySociete(societeId);
    } else {
      response = await api.getArticles();
    }
    
    // Stocker les articles complets avec tous leurs détails
    articlesData.value = Array.isArray(response) ? response : [];
    console.log('📋 Articles complets chargés:', articlesData.value.length);
    console.log('🔍 TOUS les articles:', articlesData.value);
    
    // Formater pour le dropdown
    articles.value = articlesData.value.map(article => {
      console.log('📝 Formatage article:', article);
      return {
        value: parseInt(article.idArticle, 10),
        label: article.libelle || article.nom || `Article #${article.idArticle}`,
        // Stocker aussi le prix directement dans l'option
        prix: article.prix || article.prixVente || article.prixUnitaire || article.prixVentHT || 0
      };
    });
    console.log('✅ Articles formatés pour dropdown:', articles.value);
  } catch (error) {
    console.error('❌ Erreur chargement articles:', error);
    articles.value = [];
    articlesData.value = [];
  } finally {
    isLoadingArticles.value = false;
  }
};

// Récupérer le prix de l'article sélectionné
const getPrixArticle = async (idArticle) => {
  if (!idArticle) {
    console.warn('⚠️ Aucun article sélectionné');
    return;
  }
  
  try {
    const idArticleNum = parseInt(idArticle, 10);
    console.log('💰 === RÉCUPÉRATION PRIX ARTICLE #' + idArticleNum + ' ===');
    
    // 1. Chercher d'abord dans les articles déjà chargés (articlesData)
    const article = articlesData.value.find(a => parseInt(a.idArticle, 10) === idArticleNum);
    console.log('🔍 Article trouvé dans articlesData:', article);
    
    if (article) {
      console.log('🔍 Structure complète de l\'article:', article);
      
      // Essayer toutes les propriétés possibles pour le prix
      const prixPossibles = [
        article.prix,
        article.prixVente,
        article.prixUnitaire,
        article.prixVentHT,
        article.tarif,
        article.montant,
        article.prixBase
      ];
      
      console.log('🔍 Prix possibles dans article:', {
        prix: article.prix,
        prixVente: article.prixVente,
        prixUnitaire: article.prixUnitaire,
        prixVentHT: article.prixVentHT,
        tarif: article.tarif,
        montant: article.montant,
        prixBase: article.prixBase
      });
      
      // Prendre le premier prix non null/undefined et > 0
      const prix = prixPossibles.find(p => p !== null && p !== undefined && parseFloat(p) > 0);
      
      if (prix) {
        formData.value.prixUnitaire = parseFloat(prix);
        console.log('✅ Prix récupéré depuis article:', prix, 'FC');
        calculerMontantTotal();
        return;
      }
    }
    
    // 2. Si pas de prix dans l'article, chercher dans les stocks (Vue optimisée)
    console.log('🔍 Recherche prix dans V_StockArticleSite...');
    const societeId = userStore.societeId;
    const stocks = societeId 
      ? await api.getStocksVueBySociete(societeId)
      : await api.getStocksVue();
    console.log('📋 Stocks chargés (Vue):', stocks?.length || 0);
    
    if (Array.isArray(stocks)) {
      console.log('🔍 Liste de tous les idArticle dans stocks:', stocks.map(s => s.idArticle));
      const stock = stocks.find(s => parseInt(s.idArticle, 10) === idArticleNum);
      console.log('🔍 Stock trouvé pour article #' + idArticleNum + ':', stock);
      
      if (stock) {
        console.log('📦 Structure complète du stock:', stock);
        const prixStock = stock.prixVentHT || stock.prixVente || stock.prix || stock.prixUnitaire;
        console.log('🔍 Prix dans stock:', prixStock);
        
        if (prixStock && parseFloat(prixStock) > 0) {
          formData.value.prixUnitaire = parseFloat(prixStock);
          console.log('✅ Prix récupéré depuis stock:', prixStock, 'FC');
          calculerMontantTotal();
          return;
        }
      } else {
        console.error('❌ Aucun stock trouvé pour l\'article #' + idArticleNum);
        console.log('💡 L\'article existe mais n\'a pas de stock dans cette société');
      }
    }
    
    // 3. Si toujours pas de prix trouvé
    console.error('❌ AUCUN PRIX TROUVÉ pour article #' + idArticleNum);
    console.warn('💡 Vérifiez que l\'article a un prix défini dans la base de données');
    formData.value.prixUnitaire = 0;
    calculerMontantTotal();
    
  } catch (error) {
    console.error('❌ Erreur récupération prix:', error);
    formData.value.prixUnitaire = 0;
    calculerMontantTotal();
  }
};

// Gérer le changement d'article
const handleArticleChange = (value) => {
  console.log('🔄 Article changé:', value);
  // Convertir en number si c'est une string
  const idArticle = typeof value === 'string' ? parseInt(value, 10) : value;
  console.log('🔄 ID Article converti:', idArticle);
  
  if (idArticle && idArticle > 0) {
    formData.value.idArticle = idArticle;
    
    // D'abord essayer de récupérer le prix depuis l'option du select
    const articleOption = articles.value.find(a => a.value === idArticle);
    console.log('🔍 Option article trouvée:', articleOption);
    
    if (articleOption && articleOption.prix && articleOption.prix > 0) {
      formData.value.prixUnitaire = parseFloat(articleOption.prix);
      console.log('✅ Prix récupéré depuis dropdown:', articleOption.prix, 'FC');
      calculerMontantTotal();
    } else {
      // Sinon, lancer la recherche complète
      console.log('⚠️ Pas de prix dans dropdown, recherche dans les données...');
      getPrixArticle(idArticle);
    }
  }
};

// Calculer montant total
const calculerMontantTotal = () => {
  const prix = parseFloat(formData.value.prixUnitaire) || 0;
  const qte = parseFloat(formData.value.quantite) || 0;
  formData.value.montantTotal = prix * qte;
  console.log(`💰 Calcul: ${prix} FC × ${qte} = ${formData.value.montantTotal} FC`);
};

// Formater le montant pour l'affichage
const formatMontant = (montant) => {
  const value = parseFloat(montant) || 0;
  return value.toLocaleString('fr-CD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Charger les données si mode édition
watch(() => props.reservation, (newVal) => {
  if (newVal) {
    formData.value = { 
      idReservation: newVal.idReservation || 0,
      idArticle: newVal.idArticle ? parseInt(newVal.idArticle, 10) : '',
      nomClient: newVal.nomClient || '',
      telephoneClient: newVal.telephoneClient || '',
      adresseClient: newVal.adresseClient || '',
      dateDebut: newVal.dateDebut ? new Date(newVal.dateDebut).toISOString().slice(0, 16) : '',
      dateFin: newVal.dateFin ? new Date(newVal.dateFin).toISOString().slice(0, 16) : '',
      dateReservation: newVal.dateReservation ? new Date(newVal.dateReservation).toISOString().slice(0, 16) : '',
      prixUnitaire: newVal.prixUnitaire || 0,
      quantite: String(newVal.quantite || 1), // String pour ArgonInput
      montantTotal: newVal.montantTotal || 0,
      montantAvance: String(newVal.montantAvance || 0), // String pour ArgonInput
      commentaire: newVal.commentaire || '',
      modePaiement: newVal.modePaiement || '',
      statut: newVal.statut || 'En attente'
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  const now = new Date().toISOString().slice(0, 16);
  
  formData.value = {
    idReservation: 0,
    idArticle: '',
    nomClient: '',
    telephoneClient: '',
    adresseClient: '',
    dateDebut: now,
    dateFin: '',
    dateReservation: now,
    prixUnitaire: 0,
    quantite: '1', // String pour ArgonInput
    montantTotal: 0,
    montantAvance: '0', // String pour ArgonInput
    commentaire: '',
    modePaiement: '',
    statut: 'En attente'
  };
};

// Validation
const validate = () => {
  if (!formData.value.nomClient) {
    return { valid: false, message: 'Le nom du client est obligatoire' };
  }
  if (!formData.value.telephoneClient) {
    return { valid: false, message: 'Le téléphone est obligatoire' };
  }
  if (!formData.value.idArticle) {
    return { valid: false, message: 'L\'article est obligatoire' };
  }
  if (!formData.value.dateDebut) {
    return { valid: false, message: 'La date de début est obligatoire' };
  }
  if (!formData.value.dateFin) {
    return { valid: false, message: 'La date de fin est obligatoire' };
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

// Charger articles au montage
onMounted(() => {
  loadArticles();
});

// Watch article pour récupérer automatiquement le prix
watch(() => formData.value.idArticle, (newIdArticle) => {
  if (newIdArticle) {
    getPrixArticle(newIdArticle);
  }
});

// Watch quantité et prix pour recalculer le total
watch([() => formData.value.quantite, () => formData.value.prixUnitaire], () => {
  calculerMontantTotal();
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

.form-control {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: #5e72e4;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.1);
}

textarea.form-control {
  resize: vertical;
}
</style>

