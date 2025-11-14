<template>
  <div 
    class="modal fade" 
    :id="modalId" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-dialog-centered" :class="modalSize">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Modifier' : 'Nouveau' }} Site</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body modal-body-scrollable">
          <form @submit.prevent="handleSubmit">
            
            <!-- Informations principales -->
            <div class="row">
              <div class="col-12 mb-3">
                <label class="form-label">Nom du Site *</label>
                <argon-input
                  v-model="formData.nomSite"
                  placeholder="Ex: Boutique Centre-Ville"
                  :is-required="true"
                  id="nomSite"
                  name="nomSite"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Contact *</label>
                <argon-input
                  v-model="formData.contact"
                  placeholder="+243 123 456 789"
                  :is-required="true"
                  id="contact"
                  name="contact"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Société *</label>
                <argon-select
                  v-model="formData.idSociete"
                  :options="societes"
                  placeholder="Sélectionner une société"
                  :disabled="isLoadingSocietes"
                  id="idSociete"
                  name="idSociete"
                  value-key="value"
                  label-key="label"
                />
              </div>
            </div>

            <!-- Adresse -->
            <h6 class="text-sm mt-3 mb-2">Adresse</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Province</label>
                <argon-input
                  v-model="formData.province"
                  placeholder="Ex: Kinshasa"
                  id="province"
                  name="province"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Ville</label>
                <argon-input
                  v-model="formData.ville"
                  placeholder="Ex: Kinshasa"
                  id="ville"
                  name="ville"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Commune</label>
                <argon-input
                  v-model="formData.commune"
                  placeholder="Ex: Gombe"
                  id="commune"
                  name="commune"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Quartier</label>
                <argon-input
                  v-model="formData.quartier"
                  placeholder="Ex: Centre-ville"
                  id="quartier"
                  name="quartier"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Avenue</label>
                <argon-input
                  v-model="formData.avenue"
                  placeholder="Ex: Avenue de la Paix"
                  id="avenue"
                  name="avenue"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Numéro</label>
                <argon-input
                  v-model="formData.numero"
                  placeholder="Ex: 123"
                  id="numero"
                  name="numero"
                />
              </div>
            </div>

            <!-- Statut -->
            <div class="row">
              <div class="col-12 mb-3">
                <argon-switch 
                  v-model="formData.statut"
                  id="siteStatut"
                  name="statut"
                >
                  Site actif
                </argon-switch>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <argon-button 
            type="button" 
            color="secondary" 
            data-bs-dismiss="modal"
          >
            Annuler
          </argon-button>
          <argon-button 
            type="button"
            color="success" 
            @click="handleSubmit"
            :disabled="isSaving"
          >
            <span v-if="isSaving">
              <i class="fas fa-spinner fa-spin me-2"></i>
              Enregistrement...
            </span>
            <span v-else>
              <i class="fas fa-save me-2"></i>
              {{ isEditMode ? 'Modifier' : 'Créer' }}
            </span>
          </argon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';
import api from '@/services/api.service';

const props = defineProps({
  site: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'siteModal'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
});

const emit = defineEmits(['save', 'close']);

const modalElement = ref(null);
const isSaving = ref(false);
const societes = ref([]);
const isLoadingSocietes = ref(false);

const isEditMode = computed(() => props.site !== null);

const modalSize = computed(() => {
  const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-custom-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };
  return sizeMap[props.size] || 'modal-custom-md';
});

// Formulaire
const formData = ref({
  idSite: 0,
  nomSite: '',
  contact: '',
  idSociete: '',
  province: '',
  ville: '',
  commune: '',
  quartier: '',
  avenue: '',
  numero: '',
  statut: true
});

// Charger les sociétés pour le dropdown
const loadSocietes = async () => {
  isLoadingSocietes.value = true;
  try {
    const response = await api.getSocietes();
    societes.value = (Array.isArray(response) ? response : []).map(societe => ({
      value: parseInt(societe.idSociete, 10),
      label: societe.nomSociete
    }));
    console.log('✅ Sociétés chargées pour dropdown:', societes.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement sociétés:', error);
    societes.value = [];
  } finally {
    isLoadingSocietes.value = false;
  }
};

// Charger les données si mode édition
watch(() => props.site, (newVal) => {
  if (newVal) {
    formData.value = { 
      idSite: newVal.idSite || 0,
      nomSite: newVal.nomSite || '',
      contact: newVal.contact || '',
      idSociete: newVal.idSociete ? parseInt(newVal.idSociete, 10) : '',
      province: newVal.province || '',
      ville: newVal.ville || '',
      commune: newVal.commune || '',
      quartier: newVal.quartier || '',
      avenue: newVal.avenue || '',
      numero: newVal.numero || '',
      statut: newVal.statut !== undefined ? newVal.statut : true
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idSite: 0,
    nomSite: '',
    contact: '',
    idSociete: '',
    province: '',
    ville: '',
    commune: '',
    quartier: '',
    avenue: '',
    numero: '',
    statut: true
  };
};

// Validation
const validate = () => {
  if (!formData.value.nomSite) {
    return { valid: false, message: 'Le nom du site est obligatoire' };
  }
  if (!formData.value.contact) {
    return { valid: false, message: 'Le contact est obligatoire' };
  }
  if (!formData.value.idSociete) {
    return { valid: false, message: 'La société est obligatoire' };
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
    emit('save', { ...formData.value });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

// Charger les sociétés au montage
onMounted(() => {
  loadSocietes();
});

// Exposer les méthodes
defineExpose({
  resetForm,
  close: () => {
    if (modalElement.value) {
      const modal = Modal.getInstance(modalElement.value);
      if (modal) {
        modal.hide();
      }
    }
  }
});
</script>

<style scoped>
/* Taille personnalisée pour modal moyen */
.modal-custom-md {
  max-width: 520px;
}

/* Modal centré et responsive */
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 3.5rem);
}

.modal-content {
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: none;
}

/* Header */
.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem 1.5rem;
  background: #fff;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #344767;
  margin: 0;
}

.btn-close {
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 1;
}

/* Body scrollable */
.modal-body-scrollable {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding: 1.5rem;
}

/* Scrollbar personnalisée */
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

/* Footer */
.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
}

/* Labels */
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #344767;
  margin-bottom: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .modal-body-scrollable {
    max-height: calc(100vh - 180px);
    padding: 1rem;
  }
  
  .modal-header,
  .modal-footer {
    padding: 1rem;
  }
}
</style>

