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
          <h5 class="modal-title">{{ isEditMode ? 'Modifier' : 'Nouvelle' }} Société</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body modal-body-scrollable">
          <form @submit.prevent="handleSubmit">
            <!-- Logo -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="upload-logo-section">
                  <label class="form-label d-block text-center mb-3">
                    <i class="fas fa-image me-2"></i>Logo de la Société
                  </label>
                  <div class="text-center">
                    <div class="mb-3">
                      <img 
                        :src="logoPreview || '/img/logo-ct-dark.png'" 
                        alt="Logo"
                        class="img-fluid rounded-circle logo-preview"
                        style="max-width: 70px; max-height: 70px; object-fit: cover; border: 2px solid #e9ecef; cursor: pointer;"
                        @click="logoInput.click()"
                        title="Cliquez pour changer le logo"
                      />
                    </div>
                    <input
                      type="file"
                      ref="logoInput"
                      @change="handleLogoChange"
                      accept="image/*"
                      class="d-none"
                    />
                    <argon-button 
                      type="button"
                      color="info" 
                      size="sm"
                      @click="logoInput.click()"
                    >
                      <i class="fas fa-upload me-2"></i>
                      {{ logoPreview ? 'Changer le Logo' : 'Choisir un Logo' }}
                    </argon-button>
                    <p class="text-xs text-secondary mt-2 mb-0">
                      JPG, PNG, GIF (max. 2MB)<br>
                      <small class="text-muted">Redimensionné automatiquement à 300x300</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations principales -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom de la Société *</label>
                <argon-input
                  v-model="formData.nomSociete"
                  placeholder="Ex: Hotel Grand Palace"
                  :is-required="true"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Type de Société</label>
                <argon-select
                  v-model="formData.type"
                  :options="typesSocietes"
                  placeholder="Sélectionner un type"
                  :disabled="isLoadingTypes"
                  id="typeSociete"
                  name="type"
                />
              </div>
            </div>

            <!-- Identifiants fiscaux -->
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">N° Impôt</label>
                <argon-input
                  v-model="formData.impot"
                  placeholder="Numéro d'impôt"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">RCCM</label>
                <argon-input
                  v-model="formData.rccm"
                  placeholder="Registre de commerce"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">ID National</label>
                <argon-input
                  v-model="formData.idNat"
                  placeholder="Identification nationale"
                />
              </div>
            </div>

            <!-- Contact -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <argon-input
                  v-model="formData.email"
                  type="email"
                  placeholder="contact@societe.com"
                  :is-required="true"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Contact *</label>
                <argon-input
                  v-model="formData.contact"
                  placeholder="+243 123 456 789"
                  :is-required="true"
                />
              </div>
            </div>

            <!-- Site web et secteur -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Site Web</label>
                <argon-input
                  v-model="formData.siteWeb"
                  placeholder="https://www.societe.com"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Secteur d'Activité</label>
                <argon-input
                  v-model="formData.secteurActivite"
                  placeholder="Ex: Hôtellerie, Restauration"
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
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Ville</label>
                <argon-input
                  v-model="formData.ville"
                  placeholder="Ex: Kinshasa"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Commune</label>
                <argon-input
                  v-model="formData.commune"
                  placeholder="Ex: Gombe"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Quartier</label>
                <argon-input
                  v-model="formData.quartier"
                  placeholder="Ex: Centre-ville"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Avenue</label>
                <argon-input
                  v-model="formData.avenue"
                  placeholder="Ex: Avenue de la Paix"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Numéro</label>
                <argon-input
                  v-model="formData.numero"
                  placeholder="Ex: 123"
                />
              </div>
            </div>

            <!-- Statut -->
            <div class="row">
              <div class="col-12 mb-3">
                <argon-switch 
                  v-model="formData.statut"
                  id="societeStatut"
                  name="statut"
                >
                  Société active
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
  modelValue: {
    type: Boolean,
    default: false
  },
  societe: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'societeModal'
  },
  size: {
    type: String,
    default: 'lg', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'close']);

const modalElement = ref(null);
const logoInput = ref(null);
const isSaving = ref(false);
const logoPreview = ref('');
const logoFile = ref(null);
const typesSocietes = ref([]);
const isLoadingTypes = ref(false);

const isEditMode = computed(() => props.societe !== null);

const modalSize = computed(() => {
  const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-custom-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };
  return sizeMap[props.size] || 'modal-lg';
});

// Formulaire
const formData = ref({
  idSociete: 0,
  nomSociete: '',
  type: '',
  impot: '',
  rccm: '',
  idNat: '',
  email: '',
  contact: '',
  siteWeb: '',
  logo: '',
  secteurActivite: '',
  province: '',
  ville: '',
  commune: '',
  quartier: '',
  avenue: '',
  numero: '',
  statut: true
});

// Charger les données si mode édition
watch(() => props.societe, (newVal) => {
  if (newVal) {
    formData.value = { 
      idSociete: newVal.idSociete || 0,
      nomSociete: newVal.nomSociete || '',
      type: newVal.type || '',
      impot: newVal.impot || '',
      rccm: newVal.rccm || '',
      idNat: newVal.idNat || '',
      email: newVal.email || '',
      contact: newVal.contact || '',
      siteWeb: newVal.siteWeb || '',
      logo: newVal.logo || '',
      secteurActivite: newVal.secteurActivite || '',
      province: newVal.province || '',
      ville: newVal.ville || '',
      commune: newVal.commune || '',
      quartier: newVal.quartier || '',
      avenue: newVal.avenue || '',
      numero: newVal.numero || '',
      statut: newVal.statut !== undefined ? newVal.statut : true
    };
    logoPreview.value = newVal.logo || '';
  } else {
    resetForm();
  }
}, { immediate: false });

// Gérer le changement de logo avec compression
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Vérifier la taille du fichier (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    alert('Le fichier est trop volumineux. Taille maximum : 2 MB');
    event.target.value = ''; // Réinitialiser l'input
    return;
  }
  
  logoFile.value = file;
  
  // Créer une image pour la compression
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Créer un canvas pour redimensionner
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Définir la taille max (300x300 pour les logos)
      const maxDimension = 300;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxDimension) {
          height = height * (maxDimension / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = width * (maxDimension / height);
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir en base64 avec compression (qualité 0.8)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      
      logoPreview.value = compressedBase64;
      formData.value.logo = compressedBase64;
      
      console.log('✅ Logo compressé:', {
        original: `${(file.size / 1024).toFixed(2)} KB`,
        compressed: `${(compressedBase64.length / 1024).toFixed(2)} KB`,
        dimensions: `${width}x${height}`
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idSociete: 0,
    nomSociete: '',
    type: '',
    impot: '',
    rccm: '',
    idNat: '',
    email: '',
    contact: '',
    siteWeb: '',
    logo: '',
    secteurActivite: '',
    province: '',
    ville: '',
    commune: '',
    quartier: '',
    avenue: '',
    numero: '',
    statut: true
  };
  logoPreview.value = '';
  logoFile.value = null;
};

// Validation
const validate = () => {
  if (!formData.value.nomSociete) {
    return { valid: false, message: 'Le nom de la société est obligatoire' };
  }
  if (!formData.value.email) {
    return { valid: false, message: 'L\'email est obligatoire' };
  }
  if (!formData.value.contact) {
    return { valid: false, message: 'Le contact est obligatoire' };
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
    emit('save', { ...formData.value }, logoFile.value);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

// Charger les types de société
const loadTypesSocietes = async () => {
  isLoadingTypes.value = true;
  try {
    const response = await api.getTypesSocietes();
    // Si la réponse est un tableau
    if (Array.isArray(response)) {
      typesSocietes.value = response.map(type => ({
        value: type.nomType || type.type || type,
        label: type.nomType || type.type || type
      }));
    } else {
      // Types par défaut si l'API ne répond pas
      typesSocietes.value = [
        { value: 'SARL', label: 'SARL - Société à Responsabilité Limitée' },
        { value: 'SA', label: 'SA - Société Anonyme' },
        { value: 'SPRL', label: 'SPRL - Société Privée à Responsabilité Limitée' },
        { value: 'SNC', label: 'SNC - Société en Nom Collectif' },
        { value: 'SCS', label: 'SCS - Société en Commandite Simple' },
        { value: 'ASBL', label: 'ASBL - Association Sans But Lucratif' },
        { value: 'Entreprise Individuelle', label: 'Entreprise Individuelle' },
        { value: 'Coopérative', label: 'Coopérative' },
        { value: 'ONG', label: 'ONG - Organisation Non Gouvernementale' },
        { value: 'Autre', label: 'Autre' }
      ];
    }
    console.log('✅ Types de sociétés chargés:', typesSocietes.value.length);
  } catch (error) {
    console.warn('⚠️ Erreur chargement types, utilisation des valeurs par défaut:', error);
    // Types par défaut en cas d'erreur
    typesSocietes.value = [
      { value: 'SARL', label: 'SARL - Société à Responsabilité Limitée' },
      { value: 'SA', label: 'SA - Société Anonyme' },
      { value: 'SPRL', label: 'SPRL - Société Privée à Responsabilité Limitée' },
      { value: 'SNC', label: 'SNC - Société en Nom Collectif' },
      { value: 'SCS', label: 'SCS - Société en Commandite Simple' },
      { value: 'ASBL', label: 'ASBL - Association Sans But Lucratif' },
      { value: 'Entreprise Individuelle', label: 'Entreprise Individuelle' },
      { value: 'Coopérative', label: 'Coopérative' },
      { value: 'ONG', label: 'ONG - Organisation Non Gouvernementale' },
      { value: 'Autre', label: 'Autre' }
    ];
  } finally {
    isLoadingTypes.value = false;
  }
};

// Charger les types au montage
onMounted(() => {
  loadTypesSocietes();
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

/* Section Upload Logo */
.upload-logo-section {
  background: #f8f9fa;
  border: 2px dashed #d2d6da;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.upload-logo-section:hover {
  border-color: #5e72e4;
  background: #f0f4ff;
}

/* Logo preview */
.logo-preview {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
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

