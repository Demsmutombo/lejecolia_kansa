<template>
  <div class="container-fluid py-4">
    <!-- Loading -->
    <div v-if="isLoading" class="row">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="row">
      <div class="col-12">
        <div class="alert alert-danger">
          <strong>Erreur :</strong> {{ error }}
        </div>
        <router-link to="/utilisateurs">
          <argon-button color="secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Retour
          </argon-button>
        </router-link>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else-if="user" class="row">
      <!-- Header -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="d-flex align-items-center">
                <div class="me-4">
                  <img 
                    :src="user.photo || plateformeLogo" 
                    :alt="nomComplet"
                    class="rounded-circle"
                    style="width: 100px; height: 100px; object-fit: cover; border: 3px solid #e9ecef;"
                  />
                </div>
                <div>
                  <h3 class="mb-1">{{ nomComplet }}</h3>
                  <p class="text-sm text-secondary mb-2">
                    <span v-if="user.isConnected" class="badge bg-gradient-success me-2">
                      <i class="fas fa-circle me-1"></i>En ligne
                    </span>
                    <span v-if="user.roleName" class="badge bg-gradient-info me-2">
                      {{ user.roleName }}
                    </span>
                    <span :class="user.statut ? 'badge bg-gradient-success' : 'badge bg-gradient-secondary'">
                      {{ user.statut ? 'Actif' : 'Inactif' }}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <router-link to="/utilisateurs">
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

      <!-- Infos Personnelles -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-user me-2 text-primary"></i>Informations Personnelles</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Nom complet</label>
              <p class="info-value">{{ nomComplet }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Sexe</label>
              <p class="info-value">{{ user.sexe || '-' }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Date de naissance</label>
              <p class="info-value">{{ formatDate(user.dateNaissance) }}</p>
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
                <a v-if="user.email" :href="`mailto:${user.email}`" class="text-dark">
                  <i class="fas fa-envelope me-2 text-secondary"></i>
                  {{ user.email }}
                </a>
              </p>
            </div>
            <div class="info-group">
              <label class="info-label">Téléphone</label>
              <p class="info-value">
                <a v-if="user.numeroTelephone" :href="`tel:${user.numeroTelephone}`" class="text-dark">
                  <i class="fas fa-phone me-2 text-secondary"></i>
                  {{ user.numeroTelephone }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Connexion -->
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-key me-2 text-warning"></i>Connexion</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Login</label>
              <p class="info-value">{{ user.login }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Site</label>
              <p class="info-value">
                <router-link 
                  v-if="user.idSite" 
                  :to="`/sites/${user.idSite}`"
                  class="text-primary"
                >
                  {{ user.siteName || `Site #${user.idSite}` }}
                  <i class="fas fa-external-link-alt ms-1"></i>
                </router-link>
              </p>
            </div>
            <div class="info-group">
              <label class="info-label">Rôle</label>
              <p class="info-value">{{ user.roleName || `Rôle #${user.idRole}` }}</p>
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
                    {{ formatDate(user.dateCreation) }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-group">
                  <label class="info-label">Dernière modification</label>
                  <p class="info-value">
                    <i class="fas fa-calendar-check me-2 text-secondary"></i>
                    {{ formatDate(user.dateLastModification) }}
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
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const route = useRoute();
const { requireSuperAdmin } = useAuth();
const { showError } = useSweetAlert();

requireSuperAdmin();

const userId = ref(route.params.id);
const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

const nomComplet = computed(() => {
  if (!user.value) return '';
  return `${user.value.nomUtilisateur} ${user.value.postNomUtilisateur || ''} ${user.value.prenomUtilisateur}`.trim();
});

const hasAddress = computed(() => {
  if (!user.value) return false;
  return user.value.avenue || user.value.quartier || user.value.commune || user.value.ville || user.value.province;
});

const formatAddress = computed(() => {
  if (!user.value) return '';
  const parts = [];
  if (user.value.numero) parts.push(`N° ${user.value.numero}`);
  if (user.value.avenue) parts.push(`Avenue ${user.value.avenue}`);
  if (user.value.quartier) parts.push(user.value.quartier);
  if (user.value.commune) parts.push(user.value.commune);
  if (user.value.ville) parts.push(user.value.ville);
  if (user.value.province) parts.push(user.value.province);
  return parts.join(', ');
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

const loadUser = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await api.getUserById(userId.value);
    user.value = response;
    
    // Charger noms site/rôle
    try {
      const [sites, roles] = await Promise.all([
        api.getSites(),
        api.getRoles()
      ]);
      
      const site = (Array.isArray(sites) ? sites : []).find(s => s.idSite == user.value.idSite);
      const role = (Array.isArray(roles) ? roles : []).find(r => r.idRole == user.value.idRole);
      
      user.value.siteName = site?.nomSite || '';
      user.value.roleName = role?.nom || role?.name || '';
    } catch (err) {
      console.warn('Impossible charger noms');
    }
    
  } catch (err) {
    error.value = 'Utilisateur introuvable';
    await showError('Erreur', 'Utilisateur introuvable');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.container-fluid {
  padding-left: 0 !important;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
}

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

a {
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>

