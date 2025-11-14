<template>
  <div class="container-fluid py-4">
    <!-- Loading -->
    <div v-if="isLoading" class="row">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement des informations...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="row">
      <div class="col-12">
        <div class="alert alert-danger">
          <strong>Erreur :</strong> {{ error }}
        </div>
        <router-link to="/societes">
          <argon-button color="secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Retour à la liste
          </argon-button>
        </router-link>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else-if="societe" class="row">
      <!-- Header avec logo et nom -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="d-flex align-items-center">
                <!-- Logo -->
                <div class="me-4">
                  <img 
                    :src="societe.logo || '/img/logo-ct-dark.png'" 
                    :alt="societe.nomSociete"
                    class="rounded-circle"
                    style="width: 100px; height: 100px; object-fit: cover; border: 3px solid #e9ecef;"
                  />
                </div>
                <!-- Infos principales -->
                <div>
                  <h3 class="mb-1">{{ societe.nomSociete }}</h3>
                  <p class="text-sm text-secondary mb-2">
                    <span v-if="societe.type" class="badge bg-gradient-secondary me-2">
                      {{ societe.type }}
                    </span>
                    <span v-if="societe.secteurActivite" class="badge bg-gradient-info">
                      {{ societe.secteurActivite }}
                    </span>
                  </p>
                  <p class="text-sm mb-0">
                    <span :class="societe.statut ? 'badge bg-gradient-success' : 'badge bg-gradient-secondary'">
                      {{ societe.statut ? 'Actif' : 'Inactif' }}
                    </span>
                  </p>
                </div>
              </div>
              <!-- Boutons d'action -->
              <div>
                <router-link to="/societes">
                  <argon-button color="secondary" size="sm" class="mb-2">
                    <i class="fas fa-arrow-left me-2"></i>
                    Retour
                  </argon-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations détaillées -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-info-circle me-2 text-primary"></i>Informations Générales</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Nom de la société</label>
              <p class="info-value">{{ societe.nomSociete || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Type</label>
              <p class="info-value">{{ societe.type || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Secteur d'activité</label>
              <p class="info-value">{{ societe.secteurActivite || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Site web</label>
              <p class="info-value">
                <a v-if="societe.siteWeb" :href="societe.siteWeb" target="_blank" class="text-primary">
                  {{ societe.siteWeb }}
                  <i class="fas fa-external-link-alt ms-1"></i>
                </a>
                <span v-else>-</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-address-book me-2 text-success"></i>Contact</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Email</label>
              <p class="info-value">
                <a v-if="societe.email" :href="`mailto:${societe.email}`" class="text-dark">
                  <i class="fas fa-envelope me-2 text-secondary"></i>
                  {{ societe.email }}
                </a>
                <span v-else>-</span>
              </p>
            </div>
            <div class="info-group">
              <label class="info-label">Téléphone</label>
              <p class="info-value">
                <a v-if="societe.contact" :href="`tel:${societe.contact}`" class="text-dark">
                  <i class="fas fa-phone me-2 text-secondary"></i>
                  {{ societe.contact }}
                </a>
                <span v-else>-</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Identifiants fiscaux -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-file-invoice me-2 text-warning"></i>Identifiants Fiscaux</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Numéro d'impôt</label>
              <p class="info-value">{{ societe.impot || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">RCCM</label>
              <p class="info-value">{{ societe.rccm || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">ID National</label>
              <p class="info-value">{{ societe.idNat || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Adresse -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-map-marker-alt me-2 text-danger"></i>Adresse</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Adresse complète</label>
              <p class="info-value">
                <span v-if="hasAddress">
                  <i class="fas fa-location-dot me-2"></i>
                  {{ formatAddress }}
                </span>
                <span v-else>-</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Dates -->
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6><i class="fas fa-calendar me-2 text-info"></i>Informations système</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="info-group">
                  <label class="info-label">Date de création</label>
                  <p class="info-value">
                    <i class="fas fa-calendar-plus me-2 text-secondary"></i>
                    {{ formatDate(societe.dateCreation) }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-group">
                  <label class="info-label">Dernière modification</label>
                  <p class="info-value">
                    <i class="fas fa-calendar-check me-2 text-secondary"></i>
                    {{ formatDate(societe.dateLastModification) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth, useSweetAlert } from '@/composables';
import ArgonButton from '@/components/ArgonButton.vue';
import api from '@/services/api.service';

const route = useRoute();
const router = useRouter();
const { requireSuperAdmin } = useAuth();
const { showError } = useSweetAlert();

// Vérifier l'accès superadmin
requireSuperAdmin();

// État
const societeId = ref(route.params.id);
const societe = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Charger les données de la société
const loadSociete = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('📡 Chargement de la société ID:', societeId.value);
    const response = await api.getSocieteById(societeId.value);
    
    societe.value = response;
    console.log('✅ Société chargée:', response);
  } catch (err) {
    console.error('❌ Erreur chargement société:', err);
    error.value = 'Impossible de charger les informations de la société';
    
    await showError(
      'Erreur',
      'Société introuvable ou accès refusé'
    );
  } finally {
    isLoading.value = false;
  }
};

// Computed - Vérifier si l'adresse existe
const hasAddress = computed(() => {
  if (!societe.value) return false;
  return societe.value.avenue || societe.value.quartier || 
         societe.value.commune || societe.value.ville || 
         societe.value.province;
});

// Computed - Formater l'adresse complète
const formatAddress = computed(() => {
  if (!societe.value) return '';
  
  const parts = [];
  
  if (societe.value.numero) parts.push(`N° ${societe.value.numero}`);
  if (societe.value.avenue) parts.push(`Avenue ${societe.value.avenue}`);
  if (societe.value.quartier) parts.push(societe.value.quartier);
  if (societe.value.commune) parts.push(societe.value.commune);
  if (societe.value.ville) parts.push(societe.value.ville);
  if (societe.value.province) parts.push(societe.value.province);
  
  return parts.join(', ');
});

// Formater une date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

// Charger au montage
onMounted(() => {
  loadSociete();
});
</script>

<style scoped>
/* Layout collé au sidebar */
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}

/* Info groups */
.info-group {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f2f5;
}

.info-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #8392ab;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  display: block;
}

.info-value {
  font-size: 0.9rem;
  color: #344767;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
}

/* Cards */
.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.card-header h6 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #344767;
}

.card-body {
  padding: 1.5rem;
}

/* Liens */
a {
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* Badges */
.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .container-fluid {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  .d-flex.align-items-center {
    flex-direction: column;
    text-align: center;
  }
  
  .me-4 {
    margin-right: 0 !important;
    margin-bottom: 1rem;
  }
}
</style>

