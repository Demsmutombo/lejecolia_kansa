<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouveau'} Client`"
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
          
          <!-- Identité -->
          <h6 class="text-sm mt-0 mb-2">Identité</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nom *</label>
              <argon-input
                v-model="formData.nom"
                placeholder="Ex: DUPONT"
                :is-required="true"
                id="nom"
                name="nom"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Prénom *</label>
              <argon-input
                v-model="formData.prenom"
                placeholder="Ex: Jean"
                :is-required="true"
                id="prenom"
                name="prenom"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Site *</label>
              <argon-select
                v-model="formData.idSite"
                :options="sites"
                placeholder="Sélectionner un site"
                id="site"
                name="site"
                :is-required="true"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Genre</label>
              <argon-select
                v-model="formData.genre"
                :options="genreOptions"
                placeholder="Sélectionner"
                id="genre"
                name="genre"
              />
            </div>
          </div>

          <!-- Contact -->
          <h6 class="text-sm mt-3 mb-2">Contact</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Téléphone *</label>
              <argon-input
                v-model="formData.telephone"
                placeholder="+243 123 456 789"
                :is-required="true"
                id="telephone"
                name="telephone"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <argon-input
                v-model="formData.email"
                type="email"
                placeholder="email@example.com"
                id="email"
                name="email"
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
                id="clientStatut"
                name="statut"
              >
                Client actif
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
import * as api from '@/services/api.service';
import GenericModal from '@/components/GenericModal.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';

const userStore = useUserStore();
const societeId = computed(() => userStore.societeId);

const props = defineProps({
  client: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'clientModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);

const isEditMode = computed(() => props.client !== null);

const genreOptions = [
  { value: 'Masculin', label: 'Masculin' },
  { value: 'Féminin', label: 'Féminin' },
  { value: 'Non précisé', label: 'Non précisé' }
];

// Sites
const sites = ref([]);

// Charger les sites de la société de l'utilisateur
const loadSites = async () => {
  if (!societeId.value) {
    sites.value = [];
    return;
  }
  try {
    console.log('🏢 Chargement des sites pour ClientModal...');
    const response = await api.getSitesBySociete(societeId.value);
    
    let filteredSites = Array.isArray(response) ? response : [];
    console.log(`📋 ${filteredSites.length} site(s) reçus pour la société #${societeId.value}`);
    
    // Formater les sites pour ArgonSelect avec le bon nom de propriété
    sites.value = filteredSites.map(site => ({
      value: parseInt(site.idSite, 10),
      label: site.nomSite || site.nom || 'Site sans nom'
    }));
    
    console.log('✅ Sites formatés pour le select:', sites.value);
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    sites.value = [];
  }
};

watch(societeId, () => {
  loadSites();
}, { immediate: true });

// Formulaire
const formData = ref({
  idClient: 0,
  nom: '',
  prenom: '',
  genre: 'Non précisé',
  email: '',
  telephone: '',
  idSite: 0,
  province: '',
  ville: '',
  commune: '',
  quartier: '',
  avenue: '',
  numero: '',
  statut: true
});

// Charger les données si mode édition
watch(() => props.client, (newVal) => {
  if (newVal) {
    formData.value = { 
      idClient: newVal.idClient || 0,
      nom: newVal.nom || '',
      prenom: newVal.prenom || '',
      genre: newVal.genre || 'Non précisé',
      email: newVal.email || '',
      telephone: newVal.telephone || '',
      idSite: newVal.idSite ? parseInt(newVal.idSite, 10) : 0,
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
  
  // Recharger les sites à chaque ouverture du modal
  loadSites();
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    idClient: 0,
    nom: '',
    prenom: '',
    genre: 'Non précisé',
    email: '',
    telephone: '',
    idSite: sites.value.length ? sites.value[0].value : 0,
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
  if (!formData.value.nom || !formData.value.nom.trim()) {
    return { valid: false, message: 'Le nom est obligatoire' };
  }
  if (!formData.value.prenom || !formData.value.prenom.trim()) {
    return { valid: false, message: 'Le prénom est obligatoire' };
  }
  if (!formData.value.telephone || !formData.value.telephone.trim()) {
    return { valid: false, message: 'Le téléphone est obligatoire' };
  }
  if (!formData.value.idSite || parseInt(formData.value.idSite, 10) === 0) {
    return { valid: false, message: 'Le site est obligatoire' };
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
    emit('save', {
      ...formData.value,
      idSite: parseInt(formData.value.idSite, 10)
    });
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

