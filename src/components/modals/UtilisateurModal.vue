<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouvel'} Utilisateur`"
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
            
            <!-- Photo -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="upload-photo-section">
                  <label class="form-label d-block text-center mb-3">
                    <i class="fas fa-user-circle me-2"></i>Photo
                  </label>
                <div class="text-center">
                    <div class="mb-3">
                      <img 
                      :src="photoPreview || plateformeLogo"
                        alt="Photo"
                        class="img-fluid rounded-circle photo-preview"
                        style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #e9ecef; cursor: pointer;"
                        @click="photoInput.click()"
                        title="Cliquez pour changer la photo"
                      />
                    </div>
                    <input
                      type="file"
                      ref="photoInput"
                      @change="handlePhotoChange"
                      accept="image/*"
                      class="d-none"
                    />
                    <argon-button 
                      type="button"
                      color="info" 
                      size="sm"
                      @click="photoInput.click()"
                    >
                      <i class="fas fa-upload me-2"></i>
                      {{ photoPreview ? 'Changer Photo' : 'Choisir Photo' }}
                    </argon-button>
                    <p class="text-xs text-secondary mt-2 mb-0">
                      JPG, PNG, GIF (max. 2MB)<br>
                      <small class="text-muted">Redimensionné 150x150 pour performance</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Identité -->
            <h6 class="text-sm mt-3 mb-2">Identité</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Nom *</label>
                <argon-input
                  v-model="formData.nomUtilisateur"
                  placeholder="Ex: DUPONT"
                  :is-required="true"
                  id="nom"
                  name="nom"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Post-nom</label>
                <argon-input
                  v-model="formData.postNomUtilisateur"
                  placeholder="Ex: MARIE"
                  id="postnom"
                  name="postnom"
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Prénom *</label>
                <argon-input
                  v-model="formData.prenomUtilisateur"
                  placeholder="Ex: Jean"
                  :is-required="true"
                  id="prenom"
                  name="prenom"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Sexe</label>
                <argon-select
                  v-model="formData.sexe"
                  :options="sexeOptions"
                  placeholder="Sélectionner"
                  id="sexe"
                  name="sexe"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Date de Naissance</label>
                <input
                  v-model="formData.dateNaissance"
                  type="date"
                  class="form-control"
                  id="dateNaissance"
                  name="dateNaissance"
                />
              </div>
            </div>

            <!-- Contact -->
            <h6 class="text-sm mt-3 mb-2">Contact</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <argon-input
                  v-model="formData.email"
                  type="email"
                  placeholder="email@example.com"
                  :is-required="true"
                  id="email"
                  name="email"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Téléphone *</label>
                <argon-input
                  v-model="formData.numeroTelephone"
                  placeholder="+243 123 456 789"
                  :is-required="true"
                  id="telephone"
                  name="telephone"
                />
              </div>
            </div>

            <!-- Connexion -->
            <h6 class="text-sm mt-3 mb-2">Connexion</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Login *</label>
                <argon-input
                  v-model="formData.login"
                  placeholder="login"
                  :is-required="true"
                  id="login"
                  name="login"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Mot de passe *</label>
                <argon-input
                  v-model="formData.motDePasse"
                  type="password"
                  placeholder="••••••"
                  :is-required="!isEditMode"
                  id="password"
                  name="password"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Site *</label>
                <argon-select
                  v-model="formData.idSite"
                  :options="sites"
                  placeholder="Sélectionner un site"
                  :disabled="isLoadingSites"
                  id="idSite"
                  name="idSite"
                  value-key="value"
                  label-key="label"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Rôle *</label>
                <argon-select
                  v-model="formData.idRole"
                  :options="roles"
                  placeholder="Sélectionner un rôle"
                  :disabled="isLoadingRoles"
                  id="idRole"
                  name="idRole"
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
                  id="utilisateurStatut"
                  name="statut"
                >
                  Utilisateur actif
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
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';
import api from '@/services/api.service';
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const userStore = useUserStore();

const props = defineProps({
  utilisateur: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'utilisateurModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const photoInput = ref(null);
const isSaving = ref(false);
const photoPreview = ref('');
const sites = ref([]);
const roles = ref([]);
const isLoadingSites = ref(false);
const isLoadingRoles = ref(false);

const isEditMode = computed(() => props.utilisateur !== null);

const sexeOptions = [
  { value: 'Masculin', label: 'Masculin' },
  { value: 'Féminin', label: 'Féminin' },
  { value: 'Autre', label: 'Autre' }
];

// Formulaire
const formData = ref({
  idUtilisateur: 0,
  nomUtilisateur: '',
  postNomUtilisateur: '',
  prenomUtilisateur: '',
  sexe: '',
  dateNaissance: '',
  numeroTelephone: '',
  email: '',
  login: '',
  motDePasse: '',
  photo: '',
  idSite: 0,
  idRole: 0,
  province: '',
  ville: '',
  commune: '',
  quartier: '',
  avenue: '',
  numero: '',
  statut: true,
  isConnected: false
});

// Charger les sites pour le dropdown
const loadSites = async () => {
  if (!userStore.societeId) {
    sites.value = [];
    return;
  }
  isLoadingSites.value = true;
  try {
    const response = await api.getSitesBySociete(userStore.societeId);
    const filteredSites = Array.isArray(response) ? response : [];
    
    sites.value = filteredSites.map(site => ({
      value: parseInt(site.idSite, 10),
      label: site.nomSite || site.nom || `Site #${site.idSite}`
    }));
    console.log(`✅ ${sites.value.length} site(s) chargés pour la société #${userStore.societeId}`);

    if (!formData.value.idSite && sites.value.length) {
      formData.value.idSite = sites.value[0].value;
    }
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    sites.value = [];
  } finally {
    isLoadingSites.value = false;
  }
};

// Charger les rôles pour le dropdown (Gestionnaire, Caissier, Gerant)
const loadRoles = async () => {
  isLoadingRoles.value = true;
  try {
    const response = await api.getRoles();
    
    // Rôles acceptés pour les gestionnaires de société
    const ROLES_ACCEPTES = ['gestionnaire', 'caissier', 'gerant'];
    
    // Filtrer pour ne garder QUE les rôles gestionnaires
    const allRoles = Array.isArray(response) ? response : [];
    const gestionnaireRoles = allRoles.filter(role => {
      const roleName = (role.nom || role.name || '').toLowerCase();
      return ROLES_ACCEPTES.some(r => roleName.includes(r));
    });
    
    roles.value = gestionnaireRoles.map(role => ({
      value: parseInt(role.idRole, 10),
      label: role.nom || role.name || `Rôle ${role.idRole}`
    }));
    
    console.log('✅ Rôles filtrés (Gestionnaire/Caissier/Gerant):', roles.value.length);
    console.log('📋 Rôles disponibles:', roles.value);
    
    // Pré-sélectionner le rôle "GESTIONNAIRE" par défaut si disponible
    if (!formData.value.idRole && roles.value.length > 0) {
      const gestionnaireRole = roles.value.find(r => 
        r.label.toLowerCase().includes('gestionnaire')
      );
      if (gestionnaireRole) {
        formData.value.idRole = gestionnaireRole.value;
        console.log('✅ Rôle GESTIONNAIRE pré-sélectionné:', gestionnaireRole.label);
      } else {
        formData.value.idRole = roles.value[0].value;
        console.log('✅ Premier rôle pré-sélectionné:', roles.value[0].label);
      }
    }
  } catch (error) {
    console.error('❌ Erreur chargement rôles:', error);
    roles.value = [];
  } finally {
    isLoadingRoles.value = false;
  }
};

// Gérer le changement de photo avec compression
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Vérifier la taille du fichier (max 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('Le fichier est trop volumineux. Taille maximum : 2 MB');
    event.target.value = '';
    return;
  }
  
  // Créer une image pour la compression
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Définir la taille max (150x150 pour les photos utilisateurs - plus petit pour éviter erreur 431)
      const maxDimension = 150;
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
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir en base64 avec compression forte (50% pour réduire taille)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
      
      photoPreview.value = compressedBase64;
      formData.value.photo = compressedBase64;
      
      console.log('✅ Photo compressée:', {
        original: `${(file.size / 1024).toFixed(2)} KB`,
        compressed: `${(compressedBase64.length / 1024).toFixed(2)} KB`,
        dimensions: `${width}x${height}`
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Charger les données si mode édition
watch(() => props.utilisateur, (newVal) => {
  if (newVal) {
    formData.value = { 
      idUtilisateur: newVal.idUtilisateur || 0,
      nomUtilisateur: newVal.nomUtilisateur || '',
      postNomUtilisateur: newVal.postNomUtilisateur || '',
      prenomUtilisateur: newVal.prenomUtilisateur || '',
      sexe: newVal.sexe || '',
      dateNaissance: newVal.dateNaissance ? newVal.dateNaissance.split('T')[0] : '',
      numeroTelephone: newVal.numeroTelephone || '',
      email: newVal.email || '',
      login: newVal.login || '',
      motDePasse: '', // Ne pas pré-remplir le mot de passe
      photo: newVal.photo || '',
      idSite: newVal.idSite ? parseInt(newVal.idSite, 10) : '',
      idRole: newVal.idRole ? parseInt(newVal.idRole, 10) : '',
      province: newVal.province || '',
      ville: newVal.ville || '',
      commune: newVal.commune || '',
      quartier: newVal.quartier || '',
      avenue: newVal.avenue || '',
      numero: newVal.numero || '',
      statut: newVal.statut !== undefined ? newVal.statut : true,
      isConnected: newVal.isConnected || false
    };
    photoPreview.value = newVal.photo || '';
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idUtilisateur: 0,
    nomUtilisateur: '',
    postNomUtilisateur: '',
    prenomUtilisateur: '',
    sexe: '',
    dateNaissance: '',
    numeroTelephone: '',
    email: '',
    login: '',
    motDePasse: '',
    photo: '',
    idSite: sites.value.length ? sites.value[0].value : 0,
    idRole: roles.value.length ? roles.value[0].value : 0,
    province: '',
    ville: '',
    commune: '',
    quartier: '',
    avenue: '',
    numero: '',
    statut: true,
    isConnected: false
  };
  photoPreview.value = '';
};

// Validation
const validate = () => {
  if (!formData.value.nomUtilisateur) {
    return { valid: false, message: 'Le nom est obligatoire' };
  }
  if (!formData.value.prenomUtilisateur) {
    return { valid: false, message: 'Le prénom est obligatoire' };
  }
  if (!formData.value.email) {
    return { valid: false, message: 'L\'email est obligatoire' };
  }
  if (!formData.value.numeroTelephone) {
    return { valid: false, message: 'Le téléphone est obligatoire' };
  }
  if (!formData.value.login) {
    return { valid: false, message: 'Le login est obligatoire' };
  }
  if (!isEditMode.value && !formData.value.motDePasse) {
    return { valid: false, message: 'Le mot de passe est obligatoire' };
  }
  if (!formData.value.idSite || parseInt(formData.value.idSite, 10) === 0) {
    return { valid: false, message: 'Le site est obligatoire' };
  }
  if (!formData.value.idRole || parseInt(formData.value.idRole, 10) === 0) {
    return { valid: false, message: 'Le rôle est obligatoire' };
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
    // Si modification et pas de nouveau mot de passe, supprimer le champ
    const dataToSend = { ...formData.value };
    if (isEditMode.value && !dataToSend.motDePasse) {
      delete dataToSend.motDePasse;
    }
    
    emit('save', {
      ...dataToSend,
      idSite: parseInt(dataToSend.idSite, 10),
      idRole: parseInt(dataToSend.idRole, 10),
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

watch(() => userStore.societeId, () => {
  loadSites();
}, { immediate: true });

watch(() => userStore.role, () => {
  loadRoles();
}, { immediate: true });

// Exposer les méthodes
defineExpose({
  resetForm,
  show: () => modalRef.value?.show(),
  hide: () => modalRef.value?.hide(),
  close: () => modalRef.value?.hide()
});
</script>

<style scoped>
/* Scrollable body */
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

/* Section Upload Photo */
.upload-photo-section {
  background: #f8f9fa;
  border: 2px dashed #d2d6da;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.upload-photo-section:hover {
  border-color: #5e72e4;
  background: #f0f4ff;
}

.photo-preview {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.photo-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
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

