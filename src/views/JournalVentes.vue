<template>
  <div class="container-fluid px-4 py-3">
    <!-- En-tête -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">
              <i class="fas fa-book me-2 text-primary"></i> Journal des Ventes
            </h4>
            <p class="text-sm text-white mb-0">
              Analyse complète des ventes avec statistiques et rapports financiers
            </p>
          </div>
          <argon-button
            color="info"
            size="sm"
            @click="rafraichirDonnees"
            :disabled="isLoading"
          >
            <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoading }"></i>
            {{ isLoading ? 'Chargement...' : 'Rafraîchir' }}
          </argon-button>
        </div>
      </div>
    </div>

    <!-- Cartes Statistiques -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md me-3">
                <i class="fas fa-coins text-white text-lg opacity-10"></i>
              </div>
              <div class="flex-grow-1">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">CA Total</p>
                <h5 class="font-weight-bolder mb-0">
                  {{ formatCurrency(caTotalCalcule) }}
                </h5>
                <span class="text-xs text-secondary">
                  {{ ventesData.length }} vente(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-success shadow text-center border-radius-md me-3">
                <i class="fas fa-chart-line text-white text-lg opacity-10"></i>
              </div>
              <div class="flex-grow-1">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">Bénéfice Net</p>
                <h5 class="font-weight-bolder mb-0">
                  {{ formatCurrency(stats.beneficeNet) }}
                </h5>
                <span class="text-xs text-secondary">
                  Marge: {{ stats.margeBrute }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md me-3">
                <i class="fas fa-calendar-day text-white text-lg opacity-10"></i>
              </div>
              <div class="flex-grow-1">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">CA Aujourd'hui</p>
                <h5 class="font-weight-bolder mb-0">
                  {{ formatCurrency(caAujourdhui) }}
                </h5>
                <span class="text-xs text-secondary">
                  {{ ventesAujourdhui }} vente(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-warning shadow text-center border-radius-md me-3">
                <i class="fas fa-boxes text-white text-lg opacity-10"></i>
              </div>
              <div class="flex-grow-1">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">Quantité Vendue</p>
                <h5 class="font-weight-bolder mb-0">
                  {{ quantiteTotaleCalculee }}
                </h5>
                <span class="text-xs text-secondary">
                  Articles vendus
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card mb-4">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-0">🔍 Filtres</h6>
          <argon-button
            color="secondary"
            size="sm"
            @click="resetFilters"
          >
            <i class="fas fa-redo me-1"></i> Réinitialiser
          </argon-button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label">Recherche</label>
            <argon-input
              v-model="searchQuery"
              type="text"
              placeholder="Client, article, site, commande..."
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Date Début</label>
            <argon-input
              v-model="filters.dateDebut"
              type="date"
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Date Fin</label>
            <argon-input
              v-model="filters.dateFin"
              type="date"
            />
          </div>
          <div class="col-md-3 mb-3" v-if="userStore.isSuperAdmin">
            <label class="form-label">Site</label>
            <argon-select
              v-model="filters.idSite"
              :options="sitesOptions"
              placeholder="Tous les sites"
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Utilisateur</label>
            <argon-select
              v-model="filters.idUtilisateur"
              :options="utilisateursOptions"
              placeholder="Tous les utilisateurs"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <argon-button
              color="primary"
              @click="applyFilters"
              :disabled="isLoading"
            >
              <i class="fas fa-search me-1"></i>
              {{ isLoading ? 'Chargement...' : 'Appliquer les Filtres' }}
            </argon-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div class="card">
      <div class="card-header pb-0">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'ventes' }"
              @click="activeTab = 'ventes'"
              role="tab"
            >
              <i class="fas fa-list me-1"></i> Toutes les Ventes
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'articles' }"
              @click="activeTab = 'articles'"
              role="tab"
            >
              <i class="fas fa-chart-bar me-1"></i> Par Article
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'utilisateurs' }"
              @click="activeTab = 'utilisateurs'"
              role="tab"
            >
              <i class="fas fa-user-circle me-1"></i> Par Utilisateur
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'rapport' }"
              @click="activeTab = 'rapport'"
              role="tab"
            >
              <i class="fas fa-file-invoice-dollar me-1"></i> Rapport Financier
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <!-- Onglet: Toutes les Ventes -->
        <div v-show="activeTab === 'ventes'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0">Liste des Ventes</h6>
            <argon-button
              color="success"
              size="sm"
              @click="exportData('ventes')"
            >
              <i class="fas fa-file-excel me-1"></i> Exporter
            </argon-button>
          </div>
          
          <!-- Tableau manuel (au lieu de DataTable qui peut avoir des problèmes) -->
          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Date</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Cmd</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Article</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Qté</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">P.U.</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">Total</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Vendeur</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Site</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="9" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="ventesData.length === 0">
                  <td colspan="9" class="text-center text-secondary py-4">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p class="mb-0">Aucune vente disponible</p>
                  </td>
                </tr>
                <tr v-else v-for="(vente, index) in ventesData" :key="index">
                  <td>
                    <p class="text-xs mb-0">{{ vente.dateVenteFormatee }}</p>
                  </td>
                  <td>
                    <span class="badge badge-sm bg-gradient-secondary">{{ vente.idCommande }}</span>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ vente.libelle }}</p>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm">{{ parseFloat(vente.quantite).toFixed(0) }}</span>
                  </td>
                  <td class="align-middle text-end">
                    <span class="text-xs text-secondary">{{ formatCurrency(vente.prixUnitaire) }}</span>
                  </td>
                  <td class="align-middle text-end">
                    <span class="text-sm font-weight-bold">{{ formatCurrency(vente.total) }}</span>
                  </td>
                  <td>
                    <p class="text-xs font-weight-bold mb-0 text-info">{{ vente.nomUtilisateur }}</p>
                  </td>
                  <td>
                    <span class="badge badge-sm bg-gradient-info">{{ vente.nomSite }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <div class="d-flex justify-content-center gap-1">
                      <button
                        @click="voirDetails(vente)"
                        class="btn btn-link text-info p-0 mb-0 me-2"
                        title="Voir détails"
                      >
                        <i class="fas fa-eye text-sm"></i>
                      </button>
                      <button
                        v-if="userStore.isGestionnaire || userStore.isSuperAdmin"
                        @click="allerVersCommande(vente.idCommande)"
                        class="btn btn-link text-primary p-0 mb-0"
                        title="Gérer dans Commandes"
                      >
                        <i class="fas fa-external-link-alt text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Info nombre de résultats -->
          <div v-if="ventesData.length > 0" class="mt-3">
            <p class="text-sm text-secondary text-end mb-0">
              <strong>{{ ventesData.length }}</strong> vente(s) affichée(s) pour votre société
            </p>
          </div>
        </div>

        <!-- Onglet: Par Article -->
        <div v-show="activeTab === 'articles'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0">Ventes Groupées par Article</h6>
            <argon-button
              color="success"
              size="sm"
              @click="exportData('articles')"
            >
              <i class="fas fa-file-excel me-1"></i> Exporter
            </argon-button>
          </div>

          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Article</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Quantité</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">Montant Total</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Nb Ventes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="articlesData.length === 0 && !isLoading">
                  <td colspan="4" class="text-center text-secondary py-4">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p class="mb-0">Aucune donnée disponible</p>
                  </td>
                </tr>
                <tr v-else-if="isLoading">
                  <td colspan="4" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="(article, index) in articlesData" :key="index">
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ article.LibelleArticle || article.libelleArticle || article.libelle }}</p>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm">{{ parseFloat(article.QuantiteTotale || article.quantiteTotale || article.quantite || 0).toFixed(0) }}</span>
                  </td>
                  <td class="align-middle text-end">
                    <span class="text-sm font-weight-bold">{{ formatCurrency(article.MontantTotal || article.montantTotal || article.montant || 0) }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <span class="badge badge-sm bg-gradient-info">{{ article.NombreVentes || article.nombreVentes || article.ventes || 0 }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Onglet: Par Utilisateur -->
        <div v-show="activeTab === 'utilisateurs'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0">Ventes par Utilisateur</h6>
            <argon-button
              color="success"
              size="sm"
              @click="exportData('utilisateurs')"
            >
              <i class="fas fa-file-excel me-1"></i> Exporter
            </argon-button>
          </div>

          <!-- Tableau manuel pour Par Utilisateur -->
          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Date</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Vendeur</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Article</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Qté</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">Total</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Site</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Chargement...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="utilisateursData.length === 0">
                  <td colspan="6" class="text-center text-secondary py-4">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p class="mb-0">Aucune donnée disponible</p>
                  </td>
                </tr>
                <tr v-else v-for="(vente, index) in utilisateursData" :key="index">
                  <td>
                    <p class="text-xs mb-0">{{ vente.dateVenteFormatee }}</p>
                  </td>
                  <td>
                    <p class="text-xs font-weight-bold mb-0 text-primary">{{ vente.nomUtilisateur }}</p>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ vente.libelle }}</p>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm">{{ parseFloat(vente.quantite).toFixed(0) }}</span>
                  </td>
                  <td class="align-middle text-end">
                    <span class="text-sm font-weight-bold">{{ formatCurrency(vente.total) }}</span>
                  </td>
                  <td>
                    <span class="badge badge-sm bg-gradient-info">{{ vente.nomSite }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Info nombre de résultats -->
          <div v-if="utilisateursData.length > 0" class="mt-3">
            <p class="text-sm text-secondary text-end mb-0">
              <strong>{{ utilisateursData.length }}</strong> vente(s) affichée(s) pour votre société
            </p>
          </div>
        </div>

        <!-- Onglet: Rapport Financier -->
        <div v-show="activeTab === 'rapport'">
          <div class="row">
            <div class="col-12 mb-4">
              <h6 class="mb-3">📊 Résumé Financier</h6>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="card bg-gradient-primary">
                    <div class="card-body p-3 text-white">
                      <p class="text-sm mb-1 opacity-8">CA Total</p>
                      <h4 class="font-weight-bolder mb-0 text-white">
                        {{ formatCurrency(rapportFinancier.caTotal) }}
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="card bg-gradient-success">
                    <div class="card-body p-3 text-white">
                      <p class="text-sm mb-1 opacity-8">Marge Brute</p>
                      <h4 class="font-weight-bolder mb-0 text-white">
                        {{ formatCurrency(rapportFinancier.margeBrute) }}
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="card bg-gradient-info">
                    <div class="card-body p-3 text-white">
                      <p class="text-sm mb-1 opacity-8">Bénéfice Net</p>
                      <h4 class="font-weight-bolder mb-0 text-white">
                        {{ formatCurrency(rapportFinancier.beneficeNet) }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <h6 class="mb-3">📈 Évolution des Ventes</h6>
              <div class="card">
                <div class="card-body">
                  <div v-if="!rapportFinancier.evolution || rapportFinancier.evolution.length === 0" class="text-center text-secondary py-4">
                    <i class="fas fa-chart-line fa-2x mb-2 opacity-6"></i>
                    <p class="mb-0">Aucune donnée d'évolution disponible</p>
                    <p class="text-xs mb-0">Essayez de sélectionner une période avec des ventes</p>
                  </div>
                  <canvas v-else id="evolutionChart" height="100"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Vente -->
    <div v-if="showDetailsModal && venteSelectionnee" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-gradient-info">
            <h5 class="modal-title text-white">
              <i class="fas fa-info-circle me-2"></i>
              Détails de la Vente #{{ venteSelectionnee.idCommande }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-2">
              <div class="col-6">
                <p class="text-xs text-muted mb-0">Date</p>
                <p class="text-sm font-weight-bold">{{ venteSelectionnee.dateVenteFormatee }}</p>
              </div>
              <div class="col-6">
                <p class="text-xs text-muted mb-0">Commande</p>
                <p class="text-sm font-weight-bold">#{{ venteSelectionnee.idCommande }}</p>
              </div>
            </div>
            <hr class="horizontal dark my-2">
            <div class="row mb-2">
              <div class="col-12">
                <p class="text-xs text-muted mb-0">Article</p>
                <p class="text-sm font-weight-bold">{{ venteSelectionnee.libelle }}</p>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-4">
                <p class="text-xs text-muted mb-0">Quantité</p>
                <p class="text-sm font-weight-bold">{{ venteSelectionnee.quantite }}</p>
              </div>
              <div class="col-4">
                <p class="text-xs text-muted mb-0">Prix Unitaire</p>
                <p class="text-sm font-weight-bold">{{ formatCurrency(venteSelectionnee.prixUnitaire) }}</p>
              </div>
              <div class="col-4">
                <p class="text-xs text-muted mb-0">Total</p>
                <p class="text-sm font-weight-bold text-primary">{{ formatCurrency(venteSelectionnee.total) }}</p>
              </div>
            </div>
            <hr class="horizontal dark my-2">
            <div class="row mb-2">
              <div class="col-6">
                <p class="text-xs text-muted mb-0">Vendeur</p>
                <p class="text-sm font-weight-bold">{{ venteSelectionnee.nomUtilisateur }}</p>
              </div>
              <div class="col-6">
                <p class="text-xs text-muted mb-0">Site</p>
                <p class="text-sm font-weight-bold">{{ venteSelectionnee.nomSite }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <argon-button color="secondary" @click="showDetailsModal = false">
              <i class="fas fa-times me-1"></i> Fermer
            </argon-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';
import Chart from 'chart.js/auto';

const router = useRouter();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showError, showLoading, close, showSuccess, showConfirm } = useSweetAlert();

requireAuth();

// État
const isLoading = ref(false);
const activeTab = ref('ventes');
let chartInstance = null;

// Modals
const showDetailsModal = ref(false);
const venteSelectionnee = ref(null);

// Filtres
const filters = ref({
  dateDebut: '',
  dateFin: '',
  idSite: null,
  idUtilisateur: null
});

const searchQuery = ref('');

let filtersAutoRefreshTimeout = null;
watch(
  () => ({ ...filters.value }),
  () => {
    if (filtersAutoRefreshTimeout) {
      clearTimeout(filtersAutoRefreshTimeout);
    }
    filtersAutoRefreshTimeout = setTimeout(() => {
      console.log('🔁 Filtres modifiés - rafraîchissement automatique');
      applyFilters();
    }, 500);
  },
  { deep: true }
);

// Options pour les dropdowns
const sitesOptions = ref([{ value: null, label: 'Tous les sites' }]);
const utilisateursOptions = ref([{ value: null, label: 'Tous les utilisateurs' }]);

// Statistiques
const stats = ref({
  caTotal: 0,
  beneficeNet: 0,
  margeBrute: 0,
  caJour: 0,
  ventesJour: 0,
  ventesTotales: 0,
  quantiteTotale: 0
});

// Calculer la quantité totale depuis les ventes affichées
const quantiteTotaleCalculee = computed(() => {
  if (!ventesData.value || ventesData.value.length === 0) return 0;
  
  const total = ventesData.value.reduce((sum, vente) => {
    return sum + parseFloat(vente.quantite || 0);
  }, 0);
  
  return Math.round(total);
});

// Calculer le CA total depuis les ventes affichées
const caTotalCalcule = computed(() => {
  if (!ventesData.value || ventesData.value.length === 0) return 0;
  
  const total = ventesData.value.reduce((sum, vente) => {
    return sum + parseFloat(vente.total || 0);
  }, 0);
  
  return total;
});

// Calculer le nombre de ventes affichées
const nombreVentesCalcule = computed(() => {
  return ventesData.value ? ventesData.value.length : 0;
});

// Calculer le CA d'aujourd'hui depuis les ventes affichées
const caAujourdhui = computed(() => {
  if (!ventesData.value || ventesData.value.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  
  const ventesJour = ventesData.value.filter(vente => {
    const dateVente = vente.dateCreation ? vente.dateCreation.split('T')[0] : '';
    return dateVente === today;
  });
  
  const total = ventesJour.reduce((sum, vente) => {
    return sum + parseFloat(vente.total || 0);
  }, 0);
  
  return total;
});

// Nombre de ventes aujourd'hui
const ventesAujourdhui = computed(() => {
  if (!ventesData.value || ventesData.value.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  
  return ventesData.value.filter(vente => {
    const dateVente = vente.dateCreation ? vente.dateCreation.split('T')[0] : '';
    return dateVente === today;
  }).length;
});

// Données
const ventesData = ref([]);
const articlesData = ref([]);
const utilisateursData = ref([]);
const rapportFinancier = ref({
  caTotal: 0,
  margeBrute: 0,
  beneficeNet: 0,
  evolution: []
});

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 9999, // Charger TOUTES les ventes pour filtrage frontend
  total: 0,
  totalPages: 0
});

const paginationUtilisateurs = ref({
  page: 1,
  pageSize: 9999, // Charger TOUTES les ventes pour filtrage frontend
  total: 0,
  totalPages: 0
});

// Colonnes pour les tableaux
// Basées sur les propriétés réelles + enrichissement
const ventesColumns = [
  { key: 'dateVenteFormatee', label: 'Date', sortable: true },
  { key: 'idCommande', label: 'Cmd', sortable: true },
  { key: 'libelle', label: 'Article', sortable: true },
  { key: 'quantite', label: 'Qté', sortable: true, align: 'center' },
  { key: 'prixUnitaire', label: 'P.U.', sortable: true, align: 'right', format: 'currency' },
  { key: 'total', label: 'Total', sortable: true, align: 'right', format: 'currency' },
  { key: 'nomUtilisateur', label: 'Vendeur', sortable: true },
  { key: 'nomSite', label: 'Site', sortable: true }
];

const utilisateursColumns = [
  { key: 'dateVenteFormatee', label: 'Date', sortable: true },
  { key: 'nomUtilisateur', label: 'Vendeur', sortable: true },
  { key: 'libelle', label: 'Article', sortable: true },
  { key: 'quantite', label: 'Qté', sortable: true, align: 'center' },
  { key: 'total', label: 'Total', sortable: true, align: 'right', format: 'currency' },
  { key: 'nomSite', label: 'Site', sortable: true }
];

// Formater la devise
const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF' }).format(num);
};

// Charger les sites
const loadSites = async () => {
  try {
    const allSites = await api.getSites();
    let sites = Array.isArray(allSites) ? allSites : [];
    
    // Filtrer par société pour les gestionnaires
    if (!userStore.isSuperAdmin && userStore.societeId) {
      sites = sites.filter(site => 
        site.idSociete === userStore.societeId || 
        site.idSociete === parseInt(userStore.societeId)
      );
      console.log(`🔒 Sites filtrés pour société #${userStore.societeId}:`, sites.length);
    }
    
    sitesOptions.value = [
      { value: null, label: 'Tous les sites' },
      ...sites.map(site => ({
        value: site.idSite,
        label: site.nomSite || site.nom || `Site #${site.idSite}`
      }))
    ];
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
  }
};

// Charger les utilisateurs
const loadUtilisateurs = async () => {
  try {
    const allUtilisateurs = await api.getUsers();
    let utilisateurs = Array.isArray(allUtilisateurs) ? allUtilisateurs : [];
    
    // Filtrer par société pour les gestionnaires
    if (!userStore.isSuperAdmin && userStore.societeId) {
      // Charger les sites pour faire le mapping
      const sites = await api.getSites();
      const sitesMap = {};
      (Array.isArray(sites) ? sites : []).forEach(site => {
        sitesMap[site.idSite] = site.idSociete;
      });
      
      // Filtrer les utilisateurs de la même société
      utilisateurs = utilisateurs.filter(user => {
        const userSocieteId = sitesMap[user.idSite];
        return userSocieteId === userStore.societeId || 
               userSocieteId === parseInt(userStore.societeId);
      });
      console.log(`🔒 Utilisateurs filtrés pour société #${userStore.societeId}:`, utilisateurs.length);
    }
    
    utilisateursOptions.value = [
      { value: null, label: 'Tous les utilisateurs' },
      ...utilisateurs.map(user => ({
        value: user.idUtilisateur,
        label: `${user.prenom || ''} ${user.nom || ''}`.trim()
      }))
    ];
  } catch (error) {
    console.error('❌ Erreur chargement utilisateurs:', error);
  }
};

// Charger les statistiques
const loadStats = async () => {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 CHARGEMENT STATS - Journal des Ventes');
    console.log(`🏢 Société ID: ${userStore.societeId}`);
    console.log(`📍 Site ID: ${userStore.siteId}`);
    console.log(`👤 Utilisateur: ${userStore.userName}`);
    console.log('═══════════════════════════════════════════════════════');

    // Stats globales (filtrées par société pour gestionnaires)
    const statsGlobales = await api.getJournalVenteStats({
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idUtilisateur: filters.value.idUtilisateur || undefined
    });
    console.log('📊 Stats globales (filtrées société):', statsGlobales);
    
    // DEBUG: Voir les propriétés des stats
    if (Array.isArray(statsGlobales) && statsGlobales.length > 0) {
      console.log('🔍 Propriétés stats globales:', Object.keys(statsGlobales[0]));
      console.log('🔍 Première stat:', statsGlobales[0]);
    }

    // Stats du jour (avec filtrage société)
    const today = new Date().toISOString().split('T')[0];
    const statsJour = await api.getJournalVenteStatsDate(today, {
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      idUtilisateur: filters.value.idUtilisateur
    });
    console.log('📊 Stats du jour:', statsJour);

    // Rapport financier (avec filtrage société)
    const rapport = await api.getJournalVenteRapportFinancier({
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      dateDebut: filters.value.dateDebut || undefined,
      dateFin: filters.value.dateFin || undefined
    });
    console.log('📊 Rapport financier:', rapport);

    // Calculer quantité totale depuis statsGlobales (filtrées par société)
    let quantiteTotale = 0;
    let ventesTotales = 0;
    
    if (Array.isArray(statsGlobales) && statsGlobales.length > 0) {
      console.log('🔍 Stats globales reçues:', statsGlobales.length, 'sites');
      console.log('🔍 Première stat complète:', statsGlobales[0]);
      console.log('🔍 Propriétés disponibles:', Object.keys(statsGlobales[0]));
      
      // Calculer la somme des quantités et ventes
      statsGlobales.forEach(stat => {
        // Essayer toutes les propriétés possibles
        const quantite = parseFloat(
          stat.quantiteTotale || 
          stat.QuantiteTotale || 
          stat.quantiteVendue || 
          stat.QuantiteVendue || 
          stat.quantite || 
          stat.Quantite || 
          0
        );
        
        const ventes = parseInt(
          stat.nombreVentes || 
          stat.NombreVentes || 
          stat.ventes || 
          stat.Ventes || 
          stat.totalVentes ||
          stat.TotalVentes ||
          0
        );
        
        quantiteTotale += quantite;
        ventesTotales += ventes;
        
        console.log(`📊 Site: ${stat.nomSite || stat.NomSite || stat.idSite}, Quantité: ${quantite}, Ventes: ${ventes}`);
      });
      
      console.log(`✅ Totaux calculés: ${quantiteTotale} articles, ${ventesTotales} ventes`);
    } else {
      console.log('⚠️ Pas de stats globales disponibles');
    }
    
    // FALLBACK: Si toujours 0, utiliser les stats du jour
    if (quantiteTotale === 0 && statsJour?.quantiteVendue) {
      quantiteTotale = parseFloat(statsJour.quantiteVendue);
      console.log('💡 Utilisation stats du jour pour quantité:', quantiteTotale);
    }
    
    stats.value = {
      caTotal: parseFloat(rapport?.resume?.caTotal || 0),
      beneficeNet: parseFloat(rapport?.resume?.beneficeNet || 0),
      margeBrute: parseFloat(rapport?.resume?.margeBrute || 0),
      caJour: parseFloat(statsJour?.ca || 0),
      ventesJour: parseInt(statsJour?.ventes || 0),
      ventesTotales: parseInt(ventesTotales) || 0,
      quantiteTotale: parseInt(quantiteTotale) || 0
    };
    
    console.log('📊 Stats finales calculées:', stats.value);
    console.log('📦 Quantité Totale:', stats.value.quantiteTotale, 'articles vendus');
  } catch (error) {
    console.error('❌ Erreur chargement stats:', error);
  }
};

// Charger les ventes
const loadVentes = async (page = 1) => {
  isLoading.value = true;
  try {
    const effectiveSocieteId = userStore.isSuperAdmin ? undefined : userStore.societeId;
    const effectivePageSize = pagination.value.pageSize && pagination.value.pageSize > 0
      ? pagination.value.pageSize
      : 9999;

    const params = {
      page,
      pageSize: effectivePageSize,
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idSociete: effectiveSocieteId,
      dateDebut: filters.value.dateDebut || undefined,
      dateFin: filters.value.dateFin || undefined,
      idUtilisateur: filters.value.idUtilisateur || undefined
    };

    console.log('📊 Chargement ventes avec params:', params);
    console.log(`🔒 Filtrage société: ${params.idSociete ? 'Société #' + params.idSociete : 'TOUTES (superadmin)'}`);
    console.log(`📄 PageSize: ${params.pageSize} (toutes les ventes en une fois)`);
    const response = await api.getJournalVentePaged(params);
    console.log('📊 Response ventes:', response);

    let ventes = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
    
    console.log(`📊 Ventes reçues de l'API: ${ventes.length} ventes (toutes sociétés confondues)`);
    
    // 🔒 FILTRAGE STRICT PAR SOCIÉTÉ (côté frontend si backend ne filtre pas)
    if (!userStore.isSuperAdmin && userStore.societeId) {
      const totalAvantFiltre = ventes.length;
      
      // Charger les sites pour mapper idSite -> idSociete
      const sites = await api.getSites();
      const sitesMap = {};
      (Array.isArray(sites) ? sites : []).forEach(site => {
        sitesMap[site.idSite] = site.idSociete;
      });
      
      // Filtrer : ne garder que les ventes dont le site appartient à notre société
      ventes = ventes.filter(vente => {
        const venteSocieteId = sitesMap[vente.idSite];
        const appartientASociete = Number(venteSocieteId) === Number(userStore.societeId);
        
        if (!appartientASociete) {
          console.log(`❌ Vente rejetée: Site #${vente.idSite} (société #${venteSocieteId}) ≠ société #${userStore.societeId}`);
        }
        
        return appartientASociete;
      });
      
      console.log(`🔒 FILTRAGE SOCIÉTÉ: ${totalAvantFiltre} ventes → ${ventes.length} ventes (société #${userStore.societeId})`);
    }
    
    // 🔧 ENRICHISSEMENT : Ajouter les noms des utilisateurs
    if (ventes.length > 0) {
      console.log('🔄 Enrichissement des données avec noms utilisateurs...');
      
      // Charger TOUS les utilisateurs directement depuis /api/Utilisateurs
      // (sans passer par V_Utilisateur qui peut être filtré)
      console.log('🔄 Appel direct à /api/Utilisateurs...');
      const tousUtilisateurs = await api.getUsers();
      console.log('📋 Utilisateurs chargés:', Array.isArray(tousUtilisateurs) ? tousUtilisateurs.length : 0);
      
      // DEBUG: Afficher TOUS les IDs disponibles
      if (Array.isArray(tousUtilisateurs) && tousUtilisateurs.length > 0) {
        const allIds = tousUtilisateurs.map(u => u.idUtilisateur).filter(Boolean);
        console.log('🔍 TOUS les IDs utilisateurs disponibles:', allIds);
        console.log('🔍 Les IDs 2 et 3 existent?', {
          id2: allIds.includes(2) || allIds.includes('2'),
          id3: allIds.includes(3) || allIds.includes('3')
        });
        console.log('🔍 Premier utilisateur (TOUTES les propriétés):', tousUtilisateurs[0]);
        console.log('🔍 Propriétés disponibles:', Object.keys(tousUtilisateurs[0]));
      }
      
      // Créer un map ID -> Nom (en convertissant les IDs en string ET number)
      const utilisateursMap = {};
      (Array.isArray(tousUtilisateurs) ? tousUtilisateurs : []).forEach(user => {
        const userId = user.idUtilisateur || user.IdUtilisateur;
        if (userId) {
          // Essayer différentes variantes de propriétés (camelCase, PascalCase, etc.)
          const prenom = user.prenom || user.Prenom || user.prenomUtilisateur || user.PrenomUtilisateur || user.firstName || '';
          const nom = user.nom || user.Nom || user.nomUtilisateur || user.NomUtilisateur || user.lastName || '';
          const username = user.username || user.Username || user.userName || user.UserName || '';
          const fullName = user.fullName || user.FullName || user.nomComplet || user.NomComplet || '';
          
          // Construire le nom complet avec toutes les sources possibles
          let nomFinal = fullName || `${prenom} ${nom}`.trim() || username || `User #${userId}`;
          
          // Stocker avec toutes les variantes d'ID possibles
          utilisateursMap[String(userId)] = nomFinal;
          utilisateursMap[Number(userId)] = nomFinal;
          utilisateursMap[userId] = nomFinal;
          
          console.log(`👤 Utilisateur #${userId} → "${nomFinal}"`);
        }
      });
      
      console.log('🗺️ Map utilisateurs créée:', Object.keys(utilisateursMap).length / 2, 'utilisateurs');
      
      // DEBUG: Vérifier si les IDs recherchés sont dans le map
      console.log('🔍 Utilisateur ID=2 dans map?', utilisateursMap['2'], utilisateursMap[2]);
      console.log('🔍 Utilisateur ID=3 dans map?', utilisateursMap['3'], utilisateursMap[3]);
      
      // Enrichir chaque vente
      ventes = ventes.map(vente => {
        const idUtil = vente.idUtilisateur;
        const nomTrouve = utilisateursMap[idUtil] || 
                         utilisateursMap[String(idUtil)] || 
                         utilisateursMap[Number(idUtil)];
        
        if (!nomTrouve) {
          console.log(`⚠️ Utilisateur non trouvé: ID=${idUtil} (type: ${typeof idUtil})`);
        }
        
        return {
          ...vente,
          nomUtilisateur: nomTrouve || `Utilisateur #${idUtil}`,
          // Formater la date pour un meilleur affichage
          dateVenteFormatee: vente.dateCreation ? new Date(vente.dateCreation).toLocaleDateString('fr-FR') : '-'
        };
      });
      
      console.log('✅ Données enrichies:', ventes.length, 'ventes');
    }
    
    ventesData.value = ventes;
    
    // Mettre à jour la pagination (CRITIQUE: utiliser les ventes filtrées, pas l'API)
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      console.log('🔍 Filtrage recherche (ventes) sur:', query);
      ventes = ventes.filter(vente => {
        const fields = [
          vente.libelle,
          vente.nomClient,
          vente.nomUtilisateur,
          vente.nomSite,
          vente.idCommande,
          vente.dateVenteFormatee,
          vente.dateCreation
        ];
        return fields.some(field =>
          field &&
          String(field).toLowerCase().includes(query)
        );
      });
      console.log(`🔍 Résultats recherche ventes: ${ventes.length} entrée(s)`);
    }

    const totalFiltre = ventes.length;
    const pageSize = totalFiltre > 0 ? totalFiltre : (response.pagination?.pageSize || effectivePageSize);
    
    pagination.value = {
      page: 1, // Toujours page 1 car on charge tout et filtre frontend
      pageSize: totalFiltre || 1, // éviter 0
      total: totalFiltre,
      totalPages: 1
    };
    
    console.log(`📊 Pagination mise à jour: ${totalFiltre} ventes sur 1 page`);
  } catch (error) {
    console.error('❌ Erreur chargement ventes:', error);
    showError('Erreur', 'Impossible de charger les ventes');
  } finally {
    isLoading.value = false;
  }
};

// Charger les articles
const loadArticles = async () => {
  isLoading.value = true;
  try {
    // Pour l'endpoint gestionnaire, idSite est OBLIGATOIRE
    // Si userStore.siteId est undefined, charger le premier site de la société
    let siteId = filters.value.idSite || userStore.siteId;
    
    if (!siteId && !userStore.isSuperAdmin && userStore.societeId) {
      console.log('⚠️ Pas de siteId défini, chargement du premier site de la société...');
      if (sitesOptions.value.length > 1) {
        // Prendre le premier site (après "Tous les sites")
        siteId = sitesOptions.value[1]?.value;
        console.log(`✅ Utilisation du site #${siteId}`);
      }
    }
    
    const params = {
      idSite: siteId || undefined,
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      dateDebut: filters.value.dateDebut || undefined,
      dateFin: filters.value.dateFin || undefined,
      idUtilisateur: filters.value.idUtilisateur || undefined
    };

    console.log('📊 Chargement articles groupés avec params:', params);
    console.log(`🔒 Filtrage société: ${params.idSociete ? 'Société #' + params.idSociete : 'TOUTES (superadmin)'}`);
    
    // Utiliser l'endpoint gestionnaire si l'utilisateur n'est pas superadmin ET si on a un idSite
    const response = (userStore.isSuperAdmin || !params.idSite)
      ? await api.getJournalVenteGroupedByArticle(params)
      : await api.getJournalVenteGroupedByArticleGestionnaire(params);
    
    console.log('📊 Response articles:', response);

    // Format peut varier : articles directement ou dans response.articles
    let articles = [];
    if (response.articles) {
      articles = Array.isArray(response.articles) ? response.articles : [];
    } else if (Array.isArray(response)) {
      articles = response;
    } else {
      articles = [];
    }
    
    console.log(`📊 Articles reçus de l'API: ${articles.length}`);
    
    // 🔒 FILTRAGE STRICT PAR SOCIÉTÉ (si les articles ont idSite)
    if (!userStore.isSuperAdmin && userStore.societeId && articles.length > 0) {
      const totalAvantFiltre = articles.length;
      
      // Vérifier si les articles ont une propriété idSite ou nomSite
      if (articles[0].idSite || articles[0].IdSite) {
        // Charger les sites pour mapper idSite -> idSociete
        const sites = await api.getSites();
        const sitesMap = {};
        (Array.isArray(sites) ? sites : []).forEach(site => {
          sitesMap[site.idSite] = site.idSociete;
        });
        
        // Filtrer par société
        articles = articles.filter(article => {
          const articleSiteId = article.idSite || article.IdSite;
          const articleSocieteId = sitesMap[articleSiteId];
          return articleSocieteId === userStore.societeId || 
                 articleSocieteId === parseInt(userStore.societeId);
        });
        
        console.log(`🔒 FILTRAGE SOCIÉTÉ (articles): ${totalAvantFiltre} → ${articles.length} articles`);
      } else {
        console.log('⚠️ Les articles ne contiennent pas idSite, filtrage impossible');
      }
    }
    
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      console.log('🔍 Filtrage recherche (articles) sur:', query);
      articles = articles.filter(article => {
        const libelle =
          article.LibelleArticle ||
          article.libelleArticle ||
          article.libelle ||
          article.article ||
          '';
        return String(libelle).toLowerCase().includes(query);
      });
      console.log(`🔍 Résultats recherche articles: ${articles.length} entrée(s)`);
    }

    articlesData.value = articles;
    
    // DEBUG : Afficher les propriétés du premier article
    if (articlesData.value.length > 0) {
      console.log('🔍 PROPRIÉTÉS du premier article:', Object.keys(articlesData.value[0]));
      console.log('🔍 Exemple d\'article:', articlesData.value[0]);
    }
  } catch (error) {
    console.error('❌ Erreur chargement articles:', error);
    showError('Erreur', 'Impossible de charger les articles');
  } finally {
    isLoading.value = false;
  }
};

// Charger les données par utilisateur
const loadUtilisateursData = async (page = 1) => {
  isLoading.value = true;
  try {
    const params = {
      page,
      pageSize: paginationUtilisateurs.value.pageSize,
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      dateDebut: filters.value.dateDebut || undefined,
      dateFin: filters.value.dateFin || undefined,
      idUtilisateur: filters.value.idUtilisateur || undefined
    };

    console.log('📊 Chargement ventes par utilisateur avec params:', params);
    console.log(`🔒 Filtrage société: ${params.idSociete ? 'Société #' + params.idSociete : 'TOUTES (superadmin)'}`);
    
    // Utiliser /paged (général) au lieu de /utilisateur-date-paged (qui exige idUtilisateur)
    // L'endpoint /utilisateur-date-paged exige un idUtilisateur > 0
    const response = await api.getJournalVentePaged(params);
    console.log('📊 Response utilisateurs:', response);

    let ventes = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
    
    console.log(`📊 Ventes par utilisateur reçues: ${ventes.length}`);
    
    // 🔒 FILTRAGE STRICT PAR SOCIÉTÉ (côté frontend)
    if (!userStore.isSuperAdmin && userStore.societeId) {
      const totalAvantFiltre = ventes.length;
      
      // Charger les sites pour mapper idSite -> idSociete
      const sites = await api.getSites();
      const sitesMap = {};
      (Array.isArray(sites) ? sites : []).forEach(site => {
        sitesMap[site.idSite] = site.idSociete;
      });
      
      // Filtrer par société
      ventes = ventes.filter(vente => {
        const venteSocieteId = sitesMap[vente.idSite];
        return venteSocieteId === userStore.societeId || 
               venteSocieteId === parseInt(userStore.societeId);
      });
      
      console.log(`🔒 FILTRAGE SOCIÉTÉ (utilisateurs): ${totalAvantFiltre} → ${ventes.length} ventes`);
    }
    
    // 🔧 ENRICHISSEMENT : Ajouter les noms des utilisateurs
    if (ventes.length > 0) {
      console.log('🔄 Enrichissement des données par utilisateur...');
      console.log('🔄 Appel direct à /api/Utilisateurs...');
      
      // Charger TOUS les utilisateurs directement
      const tousUtilisateurs = await api.getUsers();
      console.log('📋 Utilisateurs chargés:', Array.isArray(tousUtilisateurs) ? tousUtilisateurs.length : 0);
      
      // DEBUG: Afficher TOUS les IDs disponibles
      if (Array.isArray(tousUtilisateurs) && tousUtilisateurs.length > 0) {
        const allIds = tousUtilisateurs.map(u => u.idUtilisateur).filter(Boolean);
        console.log('🔍 TOUS les IDs utilisateurs disponibles:', allIds);
      }
      
      // Créer un map ID -> Nom avec système intelligent
      const utilisateursMap = {};
      (Array.isArray(tousUtilisateurs) ? tousUtilisateurs : []).forEach(user => {
        const userId = user.idUtilisateur || user.IdUtilisateur;
        if (userId) {
          // Essayer différentes variantes de propriétés
          const prenom = user.prenom || user.Prenom || user.prenomUtilisateur || user.PrenomUtilisateur || user.firstName || '';
          const nom = user.nom || user.Nom || user.nomUtilisateur || user.NomUtilisateur || user.lastName || '';
          const username = user.username || user.Username || user.userName || user.UserName || '';
          const fullName = user.fullName || user.FullName || user.nomComplet || user.NomComplet || '';
          
          // Construire le nom complet
          let nomFinal = fullName || `${prenom} ${nom}`.trim() || username || `User #${userId}`;
          
          // Stocker avec toutes les variantes
          utilisateursMap[String(userId)] = nomFinal;
          utilisateursMap[Number(userId)] = nomFinal;
          utilisateursMap[userId] = nomFinal;
          
          console.log(`👤 Utilisateur #${userId} → "${nomFinal}"`);
        }
      });
      
      console.log('🗺️ Map utilisateurs créée:', Object.keys(utilisateursMap).length / 3, 'utilisateurs');
      
      // Enrichir chaque vente
      ventes = ventes.map(vente => {
        const idUtil = vente.idUtilisateur;
        const nomTrouve = utilisateursMap[idUtil] || 
                         utilisateursMap[String(idUtil)] || 
                         utilisateursMap[Number(idUtil)];
        
        if (!nomTrouve) {
          console.log(`⚠️ Utilisateur non trouvé pour ID=${idUtil} (type: ${typeof idUtil})`);
        }
        
        return {
          ...vente,
          nomUtilisateur: nomTrouve || `Utilisateur #${idUtil}`,
          dateVenteFormatee: vente.dateCreation ? new Date(vente.dateCreation).toLocaleDateString('fr-FR') : '-'
        };
      });
      
      console.log('✅ Données utilisateurs enrichies:', ventes.length, 'ventes');
    }
    
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      console.log('🔍 Filtrage recherche (utilisateurs) sur:', query);
      ventes = ventes.filter(vente => {
        const fields = [
          vente.nomUtilisateur,
          vente.nomClient,
          vente.libelle,
          vente.nomSite,
          vente.idCommande,
          vente.dateVenteFormatee,
          vente.dateCreation
        ];
        return fields.some(field =>
          field &&
          String(field).toLowerCase().includes(query)
        );
      });
      console.log(`🔍 Résultats recherche utilisateurs: ${ventes.length} entrée(s)`);
    }

    utilisateursData.value = ventes;
    
    // Mettre à jour la pagination (CRITIQUE: utiliser les ventes filtrées)
    const totalFiltre = ventes.length;
    
    paginationUtilisateurs.value = {
      page: 1,
      pageSize: totalFiltre,
      total: totalFiltre,
      totalPages: 1
    };
    
    console.log(`📊 Pagination utilisateurs: ${totalFiltre} ventes sur 1 page`);
  } catch (error) {
    console.error('❌ Erreur chargement utilisateurs:', error);
    showError('Erreur', 'Impossible de charger les données par utilisateur');
  } finally {
    isLoading.value = false;
  }
};

// Charger le rapport financier
const loadRapportFinancier = async () => {
  isLoading.value = true;
  try {
    const params = {
      idSite: filters.value.idSite || userStore.siteId || undefined,
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      dateDebut: filters.value.dateDebut || undefined,
      dateFin: filters.value.dateFin || undefined,
      granularite: 'jour'
    };

    console.log('📊 Chargement rapport financier avec params:', params);
    console.log(`🔒 Filtrage société: ${params.idSociete ? 'Société #' + params.idSociete : 'TOUTES (superadmin)'}`);
    const response = await api.getJournalVenteRapportFinancier(params);
    console.log('📊 Response rapport:', response);

    rapportFinancier.value = {
      caTotal: parseFloat(response?.resume?.caTotal || 0),
      margeBrute: parseFloat(response?.resume?.margeBrute || 0),
      beneficeNet: parseFloat(response?.resume?.beneficeNet || 0),
      evolution: Array.isArray(response?.evolution) ? response.evolution : []
    };

    console.log('📊 Données rapport financier:', rapportFinancier.value);
    console.log('📈 Données évolution:', rapportFinancier.value.evolution);
    console.log('📈 Nombre de points:', rapportFinancier.value.evolution.length);

    // Créer le graphique d'évolution
    if (rapportFinancier.value.evolution.length > 0) {
      await nextTick();
      console.log('📊 Création du graphique...');
      createChart();
    } else {
      console.log('⚠️ Pas de données d\'évolution, graphique non créé');
    }
  } catch (error) {
    console.error('❌ Erreur chargement rapport:', error);
    showError('Erreur', 'Impossible de charger le rapport financier');
  } finally {
    isLoading.value = false;
  }
};

// Créer le graphique d'évolution
const createChart = () => {
  console.log('🎨 createChart() appelée');
  
  const canvas = document.getElementById('evolutionChart');
  console.log('📊 Canvas trouvé?', !!canvas);
  
  if (!canvas) {
    console.error('❌ Canvas #evolutionChart non trouvé dans le DOM');
    return;
  }

  // Détruire le graphique existant
  if (chartInstance) {
    console.log('🗑️ Destruction du graphique existant');
    chartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  const evolution = rapportFinancier.value.evolution || [];
  
  console.log('📈 Création du graphique avec', evolution.length, 'points');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: evolution.map(e => {
        const date = new Date(e.periode);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      }),
      datasets: [{
        label: 'CA par jour',
        data: evolution.map(e => parseFloat(e.montant || e.ca || 0)),
        borderColor: '#5e72e4',
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('fr-CD').format(value) + ' FC';
            }
          }
        }
      }
    }
  });
  
  console.log('✅ Graphique créé avec succès!');
};

// Appliquer les filtres
const applyFilters = async () => {
  console.log('🔍 Application des filtres:', filters.value, 'Recherche:', searchQuery.value);
  
  // Recharger les stats
  await loadStats();
  
  // Recharger les données selon l'onglet actif
  switch (activeTab.value) {
    case 'ventes':
      await loadVentes(1);
      break;
    case 'articles':
      await loadArticles();
      break;
    case 'utilisateurs':
      await loadUtilisateursData(1);
      break;
    case 'rapport':
      await loadRapportFinancier();
      break;
  }
};

// Réinitialiser les filtres
const resetFilters = () => {
  filters.value = {
    dateDebut: '',
    dateFin: '',
    idSite: null,
    idUtilisateur: null
  };
  applyFilters();
};

// Rafraîchir toutes les données (bouton manuel)
const rafraichirDonnees = async () => {
  console.log('🔄 RAFRAÎCHISSEMENT MANUEL des données...');
  
  // Recharger les stats
  await loadStats();
  
  // Recharger les données de l'onglet actif
  switch (activeTab.value) {
    case 'ventes':
      await loadVentes(1);
      break;
    case 'articles':
      await loadArticles();
      break;
    case 'utilisateurs':
      await loadUtilisateursData(1);
      break;
    case 'rapport':
      await loadRapportFinancier();
      break;
  }
  
  console.log('✅ Rafraîchissement terminé');
};

// Gérer le changement de page
const handlePageChange = (page) => {
  pagination.value.page = page;
  loadVentes(page);
};

const handlePageChangeUtilisateurs = (page) => {
  paginationUtilisateurs.value.page = page;
  loadUtilisateursData(page);
};

// Exporter les données
const exportData = async (type) => {
  showLoading('Export en cours...', 'Génération du fichier Excel');
  
  try {
    let data = [];
    let filename = '';

    switch (type) {
      case 'ventes':
        data = ventesData.value;
        filename = `ventes_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'articles':
        data = articlesData.value;
        filename = `articles_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'utilisateurs':
        data = utilisateursData.value;
        filename = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }

    // Conversion simple en CSV
    if (data.length === 0) {
      showError('Erreur', 'Aucune donnée à exporter');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(';'),
      ...data.map(row => headers.map(h => row[h] || '').join(';'))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    close();
    showSuccess('Exporté !', 'Le fichier a été téléchargé');
  } catch (error) {
    close();
    console.error('❌ Erreur export:', error);
    showError('Erreur', 'Impossible d\'exporter les données');
  }
};

// ==================== ACTIONS SUR LES VENTES ====================

// Voir les détails d'une vente
const voirDetails = (vente) => {
  console.log('👁️ Affichage détails vente:', vente);
  venteSelectionnee.value = vente;
  showDetailsModal.value = true;
};

// Rediriger vers le module Commandes pour gérer la vente
const allerVersCommande = (idCommande) => {
  console.log('🔗 Redirection vers commande #', idCommande);
  router.push(`/commandes/${idCommande}`);
};

// Watch pour recharger les données quand on change d'onglet
watch(activeTab, async (newTab) => {
  switch (newTab) {
    case 'ventes':
      await loadVentes(1);
      break;
    case 'articles':
      await loadArticles();
      break;
    case 'utilisateurs':
      await loadUtilisateursData(1);
      break;
    case 'rapport':
      await loadRapportFinancier();
      break;
  }
});

// Fonction d'initialisation commune
const initialiser = async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 JOURNAL DES VENTES - Initialisation');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`👤 Utilisateur: ${userStore.userName}`);
  console.log(`🏢 Société: ${userStore.societeName || 'N/A'} (ID: ${userStore.societeId || 'N/A'})`);
  console.log(`📍 Site: ${userStore.siteId || 'N/A'}`);
  console.log(`🔑 Rôle: ${userStore.isSuperAdmin ? 'SUPERADMIN (toutes les sociétés)' : 'GESTIONNAIRE (société filtrée)'}`);
  console.log('═══════════════════════════════════════════════════════');
  
  // Charger les options pour les filtres
  await Promise.all([
    loadSites(),
    loadUtilisateurs()
  ]);

  // Charger les stats
  await loadStats();

  // Charger les données de l'onglet actif
  await loadVentes(1);
  
  console.log('✅ Journal des Ventes - Chargement terminé');
};

// Initialisation au montage
onMounted(async () => {
  await initialiser();
});

// Auto-refresh quand on revient sur la page (après avoir ajouté une vente)
onActivated(async () => {
  console.log('🔄 Page réactivée - Auto-refresh des données...');
  await rafraichirDonnees();
});
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
  color: #67748e;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 1rem;
}

.nav-tabs .nav-link:hover {
  color: #5e72e4;
  border-bottom-color: #5e72e4;
}

.nav-tabs .nav-link.active {
  color: #5e72e4;
  font-weight: 600;
  border-bottom-color: #5e72e4;
  background: transparent;
}

.icon-shape {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

