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
        <router-link to="/sites">
          <argon-button color="secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Retour à la liste
          </argon-button>
        </router-link>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else-if="site" class="row">
      <!-- Header -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="mb-2">{{ site.nomSite }}</h3>
                <p class="text-sm text-secondary mb-2">
                  <span v-if="site.societeName" class="badge bg-gradient-info me-2">
                    {{ site.societeName }}
                  </span>
                  <span :class="site.statut ? 'badge bg-gradient-success' : 'badge bg-gradient-secondary'">
                    {{ site.statut ? 'Actif' : 'Inactif' }}
                  </span>
                </p>
              </div>
              <div>
                <router-link to="/sites">
                  <argon-button color="secondary" size="sm">
                    <i class="fas fa-arrow-left me-2"></i>
                    Retour
                  </argon-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-info-circle me-2 text-primary"></i>Informations</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Nom du site</label>
              <p class="info-value">{{ site.nomSite || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Contact</label>
              <p class="info-value">
                <a v-if="site.contact" :href="`tel:${site.contact}`" class="text-dark">
                  <i class="fas fa-phone me-2 text-secondary"></i>
                  {{ site.contact }}
                </a>
                <span v-else>-</span>
              </p>
            </div>
            <div class="info-group">
              <label class="info-label">Société</label>
              <p class="info-value">
                <router-link 
                  v-if="site.idSociete" 
                  :to="`/societes/${site.idSociete}`"
                  class="text-primary"
                >
                  {{ site.societeName || `Société #${site.idSociete}` }}
                  <i class="fas fa-external-link-alt ms-1"></i>
                </router-link>
                <span v-else>-</span>
              </p>
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
                    {{ formatDate(site.dateCreation) }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-group">
                  <label class="info-label">Dernière modification</label>
                  <p class="info-value">
                    <i class="fas fa-calendar-check me-2 text-secondary"></i>
                    {{ formatDate(site.dateLastModification) }}
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
import { useRoute } from 'vue-router';
import { useAuth, useSweetAlert } from '@/composables';
import ArgonButton from '@/components/ArgonButton.vue';
import api from '@/services/api.service';

const route = useRoute();
const { requireSuperAdmin } = useAuth();
const { showError } = useSweetAlert();

// Vérifier l'accès superadmin
requireSuperAdmin();

// État
const siteId = ref(route.params.id);
const site = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Charger les données du site
const loadSite = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('📡 Chargement du site ID:', siteId.value);
    const response = await api.getSiteById(siteId.value);
    site.value = response;
    
    // Charger le nom de la société
    if (site.value.idSociete) {
      try {
        const societe = await api.getSocieteById(site.value.idSociete);
        site.value.societeName = societe.nomSociete;
      } catch (err) {
        console.warn('Impossible de charger le nom de la société');
      }
    }
    
    console.log('✅ Site chargé:', response);
  } catch (err) {
    console.error('❌ Erreur chargement site:', err);
    error.value = 'Impossible de charger les informations du site';
    await showError('Erreur', 'Site introuvable ou accès refusé');
  } finally {
    isLoading.value = false;
  }
};

// Computed - Vérifier si l'adresse existe
const hasAddress = computed(() => {
  if (!site.value) return false;
  return site.value.avenue || site.value.quartier || 
         site.value.commune || site.value.ville || 
         site.value.province;
});

// Computed - Formater l'adresse complète
const formatAddress = computed(() => {
  if (!site.value) return '';
  
  const parts = [];
  if (site.value.numero) parts.push(`N° ${site.value.numero}`);
  if (site.value.avenue) parts.push(`Avenue ${site.value.avenue}`);
  if (site.value.quartier) parts.push(site.value.quartier);
  if (site.value.commune) parts.push(site.value.commune);
  if (site.value.ville) parts.push(site.value.ville);
  if (site.value.province) parts.push(site.value.province);
  
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
  loadSite();
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
</style>

