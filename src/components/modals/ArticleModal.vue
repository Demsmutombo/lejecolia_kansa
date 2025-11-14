<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouvel'} Article`"
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
          
          <!-- Informations générales -->
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Libellé *</label>
              <argon-input
                v-model="formData.libelle"
                placeholder="Ex: CONCEPTION LOGO"
                :is-required="true"
                id="libelle"
                name="libelle"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">TVA (%)</label>
              <argon-input
                v-model="formData.tva"
                type="number"
                step="0.01"
                placeholder="0.00"
                id="tva"
                name="tva"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Remise (%)</label>
              <argon-input
                v-model="formData.remise"
                type="number"
                step="0.01"
                placeholder="0.00"
                id="remise"
                name="remise"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Code Barre / QR</label>
              <argon-input
                v-model="formData.codeBarreQR"
                placeholder="Code barre ou QR (optionnel)"
                id="codeBarreQR"
                name="codeBarreQR"
              />
            </div>
          </div>

          <!-- Options -->
          <div class="row">
            <div class="col-md-4 mb-3">
              <argon-switch 
                v-model="formData.perissable"
                id="articlePerissable"
                name="perissable"
              >
                Périssable
              </argon-switch>
            </div>
            <div class="col-md-4 mb-3">
              <argon-switch 
                v-model="formData.withStock"
                id="articleWithStock"
                name="withStock"
              >
                Avec Stock
              </argon-switch>
            </div>
            <div class="col-md-4 mb-3">
              <argon-switch 
                v-model="formData.statut"
                id="articleStatut"
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
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import GenericModal from '@/components/GenericModal.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';

const userStore = useUserStore();

const props = defineProps({
  article: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'articleModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);

const isEditMode = computed(() => props.article !== null);

// Formulaire
const formData = ref({
  idArticle: 0,
  libelle: '',
  tva: 0,
  codeBarreQR: '',
  idSociete: 0,
  perissable: false,
  remise: 0,
  withStock: false,
  statut: true
});

// Charger les données si mode édition
watch(() => props.article, (newVal) => {
  if (newVal) {
    formData.value = { 
      idArticle: newVal.idArticle || 0,
      libelle: newVal.libelle || '',
      tva: newVal.tva || 0,
      codeBarreQR: newVal.codeBarreQR || '',
      idSociete: newVal.idSociete || userStore.societeId || 0,
      perissable: newVal.perissable || false,
      remise: newVal.remise || 0,
      withStock: newVal.withStock || false,
      statut: newVal.statut !== undefined ? newVal.statut : true
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idArticle: 0,
    libelle: '',
    tva: 0,
    codeBarreQR: '',
    idSociete: userStore.societeId || 0, // Société de l'utilisateur connecté
    perissable: false,
    remise: 0,
    withStock: false,
    statut: true
  };
};

// Validation
const validate = () => {
  if (!formData.value.libelle) {
    return { valid: false, message: 'Le libellé est obligatoire' };
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
    // S'assurer que idSociete est défini
    if (!formData.value.idSociete) {
      formData.value.idSociete = userStore.societeId;
    }
    
    emit('save', formData.value);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

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
</style>

