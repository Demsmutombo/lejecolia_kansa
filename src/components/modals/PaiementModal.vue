<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouveau'} Paiement`"
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
          
          <!-- Type de transaction -->
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Type de Transaction *</label>
              <argon-select
                v-model="formData.typeTransaction"
                :options="typeTransactionOptions"
                placeholder="Sélectionner"
                :disabled="isEditMode"
                id="typeTransaction"
                name="typeTransaction"
                @update:modelValue="handleTypeChange"
              />
            </div>
          </div>

          <!-- Commande OU Réservation (selon le type) -->
          <div class="row" v-if="formData.typeTransaction === 'commande'">
            <div class="col-12 mb-3">
              <label class="form-label">Commande *</label>
              <argon-select
                v-model="formData.idCommande"
                :options="commandes"
                placeholder="Sélectionner une commande"
                :disabled="isLoadingCommandes"
                id="idCommande"
                name="idCommande"
              />
            </div>
          </div>

          <div class="row" v-if="formData.typeTransaction === 'reservation'">
            <div class="col-12 mb-3">
              <label class="form-label">Réservation *</label>
              <argon-select
                v-model="formData.idReservation"
                :options="reservations"
                placeholder="Sélectionner une réservation"
                :disabled="isLoadingReservations"
                id="idReservation"
                name="idReservation"
              />
            </div>
          </div>

          <!-- Détails paiement -->
          <h6 class="text-sm mt-3 mb-2">Détails du Paiement</h6>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Date Paiement *</label>
              <input
                v-model="formData.datePaiement"
                type="datetime-local"
                class="form-control"
                required
                id="datePaiement"
                name="datePaiement"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Montant *</label>
              <argon-input
                v-model="formData.montant"
                type="number"
                step="0.01"
                placeholder="0.00"
                :is-required="true"
                id="montant"
                name="montant"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Mode de Paiement *</label>
              <argon-select
                v-model="formData.modePaiement"
                :options="modePaiementOptions"
                placeholder="Sélectionner"
                id="modePaiement"
                name="modePaiement"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Statut *</label>
              <argon-select
                v-model="formData.statut"
                :options="statutOptions"
                placeholder="Sélectionner"
                id="statut"
                name="statut"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Référence Paiement</label>
              <argon-input
                v-model="formData.referencePaiemenet"
                placeholder="REF-XXXXX"
                id="referencePaiemenet"
                name="referencePaiemenet"
              />
              <small class="text-muted">Générée automatiquement si vide</small>
            </div>
          </div>

          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Libellé</label>
              <argon-input
                v-model="formData.libelle"
                placeholder="Description du paiement"
                id="libelle"
                name="libelle"
              />
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
  paiement: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'paiementModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);
const commandes = ref([]);
const reservations = ref([]);
const isLoadingCommandes = ref(false);
const isLoadingReservations = ref(false);

const isEditMode = computed(() => props.paiement !== null);

const typeTransactionOptions = [
  { value: 'commande', label: 'Paiement de Commande' },
  { value: 'reservation', label: 'Paiement de Réservation' }
];

const statutOptions = [
  { value: 'Payé', label: 'Payé' },
  { value: 'En attente', label: 'En attente' },
  { value: 'Remboursé', label: 'Remboursé' },
  { value: 'Annulé', label: 'Annulé' }
];

const modePaiementOptions = [
  { value: 'Espèces', label: 'Espèces' },
  { value: 'Carte bancaire', label: 'Carte bancaire' },
  { value: 'Virement', label: 'Virement' },
  { value: 'Mobile Money', label: 'Mobile Money' },
  { value: 'Chèque', label: 'Chèque' }
];

// Formulaire
const formData = ref({
  idPaiement: 0,
  typeTransaction: 'commande', // Par défaut
  idCommande: null,
  idReservation: null,
  datePaiement: '',
  modePaiement: '',
  montant: 0,
  referencePaiemenet: '',
  statut: 'Payé',
  libelle: ''
});

// Générer référence unique
const generateReference = () => {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 10000);
  return `PAY-${timestamp}-${random}`;
};

// Charger les commandes
const loadCommandes = async () => {
  isLoadingCommandes.value = true;
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getCommandesBySociete(societeId);
    
    commandes.value = (Array.isArray(response) ? response : []).map(cmd => ({
      value: parseInt(cmd.idCommande, 10),
      label: `Commande #${cmd.idCommande} - ${cmd.dateCommande ? new Date(cmd.dateCommande).toLocaleDateString('fr-FR') : ''}`
    }));
    console.log('✅ Commandes chargées:', commandes.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement commandes:', error);
    commandes.value = [];
  } finally {
    isLoadingCommandes.value = false;
  }
};

// Charger les réservations
const loadReservations = async () => {
  isLoadingReservations.value = true;
  try {
    const societeId = userStore.societeId || 3;
    const response = await api.getReservationsBySociete(societeId);
    
    reservations.value = (Array.isArray(response) ? response : []).map(res => ({
      value: parseInt(res.idReservation, 10),
      label: `Réservation #${res.idReservation} - ${res.nomClient}`
    }));
    console.log('✅ Réservations chargées:', reservations.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement réservations:', error);
    reservations.value = [];
  } finally {
    isLoadingReservations.value = false;
  }
};

// Gérer changement de type
const handleTypeChange = (newType) => {
  if (newType === 'commande') {
    formData.value.idReservation = null;
  } else if (newType === 'reservation') {
    formData.value.idCommande = null;
  }
};

// Charger les données si mode édition
watch(() => props.paiement, (newVal) => {
  if (newVal) {
    formData.value = { 
      idPaiement: newVal.idPaiement || 0,
      typeTransaction: newVal.idCommande ? 'commande' : 'reservation',
      idCommande: newVal.idCommande ? parseInt(newVal.idCommande, 10) : null,
      idReservation: newVal.idReservation ? parseInt(newVal.idReservation, 10) : null,
      datePaiement: newVal.datePaiement ? new Date(newVal.datePaiement).toISOString().slice(0, 16) : '',
      modePaiement: newVal.modePaiement || '',
      montant: newVal.montant || 0,
      referencePaiemenet: newVal.referencePaiemenet || '',
      statut: newVal.statut || 'Payé',
      libelle: newVal.libelle || ''
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  const now = new Date().toISOString().slice(0, 16);
  
  formData.value = {
    idPaiement: 0,
    typeTransaction: 'commande',
    idCommande: null,
    idReservation: null,
    datePaiement: now,
    modePaiement: '',
    montant: 0,
    referencePaiemenet: '',
    statut: 'Payé',
    libelle: ''
  };
};

// Validation
const validate = () => {
  if (!formData.value.typeTransaction) {
    return { valid: false, message: 'Le type de transaction est obligatoire' };
  }
  if (formData.value.typeTransaction === 'commande' && !formData.value.idCommande) {
    return { valid: false, message: 'La commande est obligatoire' };
  }
  if (formData.value.typeTransaction === 'reservation' && !formData.value.idReservation) {
    return { valid: false, message: 'La réservation est obligatoire' };
  }
  if (!formData.value.datePaiement) {
    return { valid: false, message: 'La date de paiement est obligatoire' };
  }
  if (!formData.value.montant || formData.value.montant <= 0) {
    return { valid: false, message: 'Le montant doit être supérieur à 0' };
  }
  if (!formData.value.modePaiement) {
    return { valid: false, message: 'Le mode de paiement est obligatoire' };
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

  // Générer référence si vide
  if (!formData.value.referencePaiemenet) {
    formData.value.referencePaiemenet = generateReference();
  }

  // Générer libellé par défaut si vide
  if (!formData.value.libelle) {
    formData.value.libelle = `Paiement ${formData.value.modePaiement} - ${formData.value.referencePaiemenet}`;
  }

  isSaving.value = true;
  try {
    // Préparer les données selon le type
    const dataToSend = {
      ...formData.value,
      idCommande: formData.value.typeTransaction === 'commande' ? formData.value.idCommande : null,
      idReservation: formData.value.typeTransaction === 'reservation' ? formData.value.idReservation : null,
      idSociete: userStore.societeId || 3
    };
    
    // Supprimer typeTransaction (champ UI uniquement)
    delete dataToSend.typeTransaction;
    
    emit('save', dataToSend);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

// Charger données au montage
onMounted(() => {
  loadCommandes();
  loadReservations();
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
</style>

