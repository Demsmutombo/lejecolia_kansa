<template>
  <generic-modal
    :modal-id="modalId"
    :title="`${isEditMode ? 'Modifier' : 'Nouvelle'} Commande`"
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
          
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Client *</label>
              <argon-select
                v-model="formData.idClient"
                :options="clients"
                placeholder="Sélectionner un client"
                :disabled="isLoadingClients"
                id="idClient"
                name="idClient"
                value-key="value"
                label-key="label"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Date de Commande *</label>
              <input
                v-model="formData.dateCommande"
                type="datetime-local"
                class="form-control"
                id="dateCommande"
                name="dateCommande"
                required
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

        </form>
      </div>
    </template>
  </generic-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import GenericModal from '@/components/GenericModal.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import api from '@/services/api.service';

const userStore = useUserStore();

const props = defineProps({
  commande: {
    type: Object,
    default: null
  },
  modalId: {
    type: String,
    default: 'commandeModal'
  }
});

const emit = defineEmits(['save', 'close']);

const modalRef = ref(null);
const isSaving = ref(false);
const clients = ref([]);
const isLoadingClients = ref(false);
const societeId = computed(() => userStore.societeId);

const isEditMode = computed(() => props.commande !== null);

const statutOptions = [
  { value: 'En cours', label: 'En cours' },
  { value: 'Validée', label: 'Validée' },
  { value: 'Livrée', label: 'Livrée' },
  { value: 'Annulée', label: 'Annulée' }
];

// Formulaire
const formData = ref({
  idCommande: 0,
  idClient: '',
  idUtilisateur: 0,
  dateCommande: '',
  statut: 'En cours'
});

// Charger les clients pour le dropdown (filtrés par société)
const formatClientLabel = (client = {}) => {
  const fullName =
    client.nomComplet ||
    `${client.prenomClient || client.prenom || ''} ${client.nomClient || client.nom || ''}`.trim();
  const contact = client.telephone || client.numeroTelephone || client.contact || '';
  const site = client.nomSite || client.siteName || '';

  let label = fullName || `Client #${client.idClient}`;
  if (site) label += ` – ${site}`;
  if (contact) label += ` (${contact})`;
  return label;
};

const loadClients = async () => {
  if (!societeId.value) {
    clients.value = [];
    return;
  }

  isLoadingClients.value = true;
  try {
    const allClients = await api.getClientsParSiteBySociete(societeId.value);
    console.log(
      `📋 ${Array.isArray(allClients) ? allClients.length : 0} client(s) filtrés pour la société #${societeId.value}`
    );

    const mapped = (Array.isArray(allClients) ? allClients : []).map((client) => ({
      value: parseInt(client.idClient, 10),
      label: formatClientLabel(client),
      raw: client,
    }));

    clients.value = mapped;
    console.log('✅ Clients chargés pour dropdown:', clients.value.length);

    if (!formData.value.idClient && clients.value.length) {
      formData.value.idClient = clients.value[0].value;
    }
  } catch (error) {
    console.error('❌ Erreur chargement clients:', error);
    clients.value = [];
  } finally {
    isLoadingClients.value = false;
  }
};

// Charger les données si mode édition
watch(() => props.commande, (newVal) => {
  if (newVal) {
    // Formater la date pour datetime-local
    let dateFormatted = '';
    if (newVal.dateCommande) {
      try {
        const date = new Date(newVal.dateCommande);
        dateFormatted = date.toISOString().slice(0, 16);
      } catch (e) {
        dateFormatted = '';
      }
    }
    
    formData.value = { 
      idCommande: newVal.idCommande || 0,
      idClient: newVal.idClient ? parseInt(newVal.idClient, 10) : '',
      idUtilisateur: newVal.idUtilisateur || userStore.userId || 0,
      dateCommande: dateFormatted,
      statut: newVal.statut || 'En cours'
    };
  } else {
    resetForm();
  }
}, { immediate: false });

// Réinitialiser le formulaire
const resetForm = () => {
  // Date et heure actuelles
  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 16);
  
  formData.value = {
    idCommande: 0,
    idClient: clients.value.length ? clients.value[0].value : '',
    idUtilisateur: userStore.userId || 0,
    dateCommande: dateFormatted,
    statut: 'En cours'
  };
};

// Validation
const validate = () => {
  if (!formData.value.idClient) {
    return { valid: false, message: 'Le client est obligatoire' };
  }
  if (!formData.value.dateCommande) {
    return { valid: false, message: 'La date de commande est obligatoire' };
  }
  if (!formData.value.statut) {
    return { valid: false, message: 'Le statut est obligatoire' };
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
    // S'assurer que idUtilisateur est défini
    if (!formData.value.idUtilisateur) {
      formData.value.idUtilisateur = userStore.userId;
    }
    
    emit('save', formData.value);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    isSaving.value = false;
  }
};

watch(societeId, () => {
  loadClients();
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

