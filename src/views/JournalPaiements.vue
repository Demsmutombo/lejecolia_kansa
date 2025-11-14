<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- En-tête -->
        <div class="card mb-4">
          <div class="card-header pb-0 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">
                  <i class="fas fa-wallet text-success me-2"></i>
                  Journal des Paiements
                </h6>
                <p class="text-sm mb-0 text-muted">
                  Suivi complet de tous les encaissements{{ isSuperAdmin ? '' : ` - ${userStore.societeName}` }}
                </p>
              </div>
              <argon-button
                color="primary"
                size="sm"
                @click="rafraichirDonnees"
                :disabled="isLoading"
              >
                <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoading }"></i>
                Rafraîchir
              </argon-button>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="row">
          <div class="col-xl-3 col-sm-6 mb-4">
            <mini-statistics-card
              title="TOTAL PAIEMENTS"
              :value="`${stats.nombrePaiements}`"
              description="encaissements"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-success',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-xl-3 col-sm-6 mb-4">
            <mini-statistics-card
              title="MONTANT TOTAL"
              :value="formatCurrency(stats.montantTotal)"
              description="encaissé"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-xl-3 col-sm-6 mb-4">
            <mini-statistics-card
              title="ESPÈCES"
              :value="formatCurrency(stats.montantEspeces)"
              description="en liquide"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-info',
                shape: 'rounded-circle'
              }"
            />
          </div>
          <div class="col-xl-3 col-sm-6 mb-4">
            <mini-statistics-card
              title="MOBILE MONEY"
              :value="formatCurrency(stats.montantMobileMoney)"
              description="électronique"
              :icon="{
                component: 'ni ni-mobile-button',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle'
              }"
            />
          </div>
        </div>

        <!-- Filtres -->
        <div class="card mb-4">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Date Début</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filtres.dateDebut"
                  @change="loadPaiements"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label">Date Fin</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filtres.dateFin"
                  @change="loadPaiements"
                />
              </div>
              <div class="col-md-3" v-if="!isSuperAdmin && sitesOptions.length > 0">
                <label class="form-label">Site</label>
                <select class="form-select" v-model="filtres.idSite" @change="loadPaiements">
                  <option :value="null">Tous les sites</option>
                  <option 
                    v-for="site in sitesOptions" 
                    :key="site.idSite" 
                    :value="site.idSite"
                  >
                    {{ site.nomSite }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Mode de paiement</label>
                <select class="form-select" v-model="filtres.modePaiement" @change="loadPaiements">
                  <option :value="null">Tous</option>
                  <option value="ESPÈCES">ESPÈCES</option>
                  <option value="MOBILE MONEY">MOBILE MONEY</option>
                  <option value="CARTE BANCAIRE">CARTE BANCAIRE</option>
                  <option value="VIREMENT">VIREMENT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau des paiements -->
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-list text-primary me-2"></i>
              Liste des Paiements
            </h6>
            <p class="text-xs text-muted mb-0">
              {{ paiementsAffichages.length }} paiement(s) trouvé(s)
            </p>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
              <p class="text-sm text-muted mt-2">Chargement des paiements...</p>
            </div>

            <div v-else-if="paiementsAffichages.length === 0" class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted">Aucun paiement trouvé</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Date
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Client
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Opérateur
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Commande
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Mode
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Montant
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Site
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="paiement in paiementsAffiches" :key="paiement.idPaiement">
                    <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">
                            {{ formatDate(paiement.datePaiement) }}
                          </h6>
                          <p class="text-xs text-secondary mb-0">
                            {{ formatTime(paiement.datePaiement) }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p class="text-xs font-weight-bold mb-0">
                        {{ getClientFullName(paiement) }}
                      </p>
                    </td>
                    <td>
                      <p class="text-xs text-secondary mb-0">
                        {{ getOperateurFullName(paiement) }}
                      </p>
                    </td>
                    <td>
                      <span class="badge badge-sm bg-gradient-secondary">
                        #{{ paiement.idCommande }}
                      </span>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <span 
                        class="badge badge-sm"
                        :class="{
                          'bg-gradient-success': normalizeModePaiement(paiement.modePaiement).includes('Espèces'),
                          'bg-gradient-info': normalizeModePaiement(paiement.modePaiement).includes('MOBILE'),
                          'bg-gradient-warning': normalizeModePaiement(paiement.modePaiement).includes('CARTE'),
                          'bg-gradient-primary': normalizeModePaiement(paiement.modePaiement).includes('VIREMENT')
                        }"
                      >
                        {{ normalizeModePaiement(paiement.modePaiement) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{ formatCurrency(paiement.montant) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs">
                        {{ paiement.nomSite || 'N/A' }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <button 
                        class="btn btn-link text-secondary mb-0"
                        @click="voirDetails(paiement)"
                        title="Voir détails"
                      >
                        <i class="fas fa-eye text-xs"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="d-flex justify-content-between align-items-center px-3 py-3">
              <p class="text-sm mb-0">
                {{ pagination.start }}-{{ pagination.end }} sur {{ pagination.total }}
              </p>
              <div class="btn-group" role="group">
                <button 
                  class="btn btn-sm btn-outline-primary"
                  @click="changerPage(pagination.currentPage - 1)"
                  :disabled="pagination.currentPage === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  v-for="page in pagesVisibles" 
                  :key="page"
                  class="btn btn-sm"
                  :class="page === pagination.currentPage ? 'btn-primary' : 'btn-outline-primary'"
                  @click="changerPage(page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="btn btn-sm btn-outline-primary"
                  @click="changerPage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage === pagination.totalPages"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails -->
    <div 
      class="modal fade" 
      id="detailsModal" 
      tabindex="-1" 
      ref="detailsModalRef"
    >
      <div class="modal-dialog modal-dialog-centered payment-modal-dialog">
        <div class="modal-content payment-modal shadow-lg border-0">
          <div class="modal-header payment-modal__header bg-gradient-primary text-white border-0">
            <div>
              <h5 class="modal-title mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Détails du Paiement
              </h5>
              <p
                v-if="selectedPaiement?.referencePaiemenet || selectedPaiement?.referencePaiement"
                class="text-xs opacity-75 mb-0"
              >
                Référence · {{ selectedPaiement.referencePaiemenet || selectedPaiement.referencePaiement }}
              </p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body payment-details-body">
            <div v-if="selectedPaiement">
              <div class="info-card amount-card mb-3">
                <div class="amount-card__top">
                  <span class="card-label">Montant payé</span>
                  <span class="badge amount-card__badge" :class="modeBadgeClass(selectedPaiement.modePaiement)">
                    <i class="fas fa-wallet me-1"></i>
                    {{ normalizeModePaiement(selectedPaiement.modePaiement) }}
                  </span>
                </div>
                <span class="card-value">{{ formatCurrency(selectedPaiement.montant) }}</span>
                <div class="amount-card__meta">
                  <span class="meta-item" v-if="selectedPaiement.referencePaiemenet || selectedPaiement.referencePaiement">
                    <i class="fas fa-hashtag me-1"></i>
                    {{ selectedPaiement.referencePaiemenet || selectedPaiement.referencePaiement }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-tags me-1"></i>
                    {{ selectedPaiement.idReservation ? 'Paiement de réservation' : 'Paiement de commande' }}
                  </span>
                </div>
              </div>

              <div class="info-card detail-list">
                <div class="detail-list-item">
                  <span class="detail-list-label">
                    <i class="fas fa-calendar-alt me-2 text-primary"></i>
                    Date
                  </span>
                  <span class="detail-list-value">
                    {{ formatDate(selectedPaiement.datePaiement) }}
                    <small class="detail-list-sub">{{ formatTime(selectedPaiement.datePaiement) }}</small>
                  </span>
                </div>
                <div class="detail-list-item">
                  <span class="detail-list-label">
                    <i class="fas fa-user me-2 text-success"></i>
                    Client
                  </span>
                  <span class="detail-list-value">{{ getClientFullName(selectedPaiement) }}</span>
                </div>
                <div class="detail-list-item">
                  <span class="detail-list-label">
                    <i class="fas fa-user-tie me-2 text-info"></i>
                    Opérateur
                  </span>
                  <span class="detail-list-value">{{ getOperateurFullName(selectedPaiement) }}</span>
                </div>
                <div class="detail-list-item" v-if="selectedPaiement.idCommande">
                  <span class="detail-list-label">
                    <i class="fas fa-file-invoice me-2 text-info"></i>
                    Commande
                  </span>
                  <span class="detail-list-value">#{{ selectedPaiement.idCommande }}</span>
                </div>
                <div class="detail-list-item" v-if="selectedPaiement.idReservation">
                  <span class="detail-list-label">
                    <i class="fas fa-calendar-day me-2 text-info"></i>
                    Réservation
                  </span>
                  <span class="detail-list-value">#{{ selectedPaiement.idReservation }}</span>
                </div>
                <div class="detail-list-item">
                  <span class="detail-list-label">
                    <i class="fas fa-map-marker-alt me-2 text-warning"></i>
                    Site
                  </span>
                  <span class="detail-list-value">{{ selectedPaiement.nomSite || 'N/A' }}</span>
                </div>
                <div class="detail-list-item">
                  <span class="detail-list-label">
                    <i class="fas fa-building me-2 text-secondary"></i>
                    Société
                  </span>
                  <span class="detail-list-value">{{ selectedPaiement.nomSociete || 'N/A' }}</span>
                </div>
                <div class="detail-list-item" v-if="selectedPaiement.statut">
                  <span class="detail-list-label">
                    <i class="fas fa-check-circle me-2 text-success"></i>
                    Statut
                  </span>
                  <span class="detail-list-value">
                    <span class="badge status-badge">{{ selectedPaiement.statut }}</span>
                  </span>
                </div>
                <div class="detail-list-item" v-if="selectedPaiement.libelle">
                  <span class="detail-list-label">
                    <i class="fas fa-align-left me-2 text-primary"></i>
                    Libellé
                  </span>
                  <span class="detail-list-value">{{ selectedPaiement.libelle }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted">
              <i class="fas fa-info-circle me-2"></i>
              Aucune information disponible
            </div>
          </div>
          <div class="modal-footer payment-modal__footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useUserStore } from '@/stores/user';
import * as api from '@/services/api.service';
import MiniStatisticsCard from '@/examples/Cards/MiniStatisticsCard.vue';
import ArgonButton from '@/components/ArgonButton.vue';
import { Modal } from 'bootstrap';

// Store
const userStore = useUserStore();
const isSuperAdmin = computed(() => userStore.role === 'SUPERADMIN');

// État
const isLoading = ref(false);
const paiementsData = ref([]);
const selectedPaiement = ref(null);
const detailsModalRef = ref(null);
let detailsModal = null;

// Statistiques
const stats = ref({
  nombrePaiements: 0,
  montantTotal: 0,
  montantEspeces: 0,
  montantMobileMoney: 0
});

// Filtres
const filtres = ref({
  dateDebut: null,
  dateFin: null,
  idSite: null,
  modePaiement: null
});

// Sites disponibles
const sitesOptions = ref([]);

// Pagination
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10,
  total: 0,
  totalPages: 1,
  start: 0,
  end: 0
});

// Formater la monnaie
const formatCurrency = (value) => {
  return (value || 0).toLocaleString('fr-CD') + ' FC';
};

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

// Formater l'heure
const formatTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Normaliser le mode de paiement (gérer les problèmes d'encodage)
const normalizeModePaiement = (mode) => {
  if (!mode) return 'N/A';
  return mode
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã²/g, 'ò')
    .trim();
};

const modeBadgeClass = (mode) => {
  const normalized = normalizeModePaiement(mode).toUpperCase();
  if (normalized.includes('ESPÈCES')) return 'bg-gradient-success';
  if (normalized.includes('MOBILE')) return 'bg-gradient-info';
  if (normalized.includes('CARTE')) return 'bg-gradient-warning';
  if (normalized.includes('VIREMENT')) return 'bg-gradient-primary';
  return 'bg-gradient-secondary';
};

const buildFullName = (record, groups, fallback, visited = new Set()) => {
  if (!record || visited.has(record)) {
    return 'N/A';
  }
  visited.add(record);

  const parts = [];
  const addPart = (value) => {
    if (value === undefined || value === null) return;
    const clean = String(value).trim();
    if (!clean) return;
    if (!parts.includes(clean)) {
      parts.push(clean);
    }
  };

  groups.forEach((group) => {
    for (const key of group) {
      if (record && Object.prototype.hasOwnProperty.call(record, key)) {
        const val = record[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          addPart(val);
          break;
        }
      }
    }
  });

  const fullName = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (fullName) {
    return fullName;
  }

  const nestedCandidates = [
    record?.client,
    record?.Client,
    record?.customer,
    record?.Customer,
    record?.utilisateur,
    record?.Utilisateur,
    record?.user,
    record?.User,
    record?.operateur,
    record?.Operateur
  ].filter(Boolean);

  for (const nested of nestedCandidates) {
    const nestedName = buildFullName(
      nested,
      groups,
      nested?.nom || nested?.Nom || nested?.name || nested?.Name,
      visited
    );
    if (nestedName && nestedName !== 'N/A') {
      return nestedName;
    }
  }

  if (fallback && String(fallback).trim()) {
    return String(fallback).trim();
  }

  return 'N/A';
};

const getClientFullName = (paiement) => buildFullName(
  paiement,
  [
    ['nomClientComplet', 'NomClientComplet', 'clientNomComplet', 'clientFullName', 'client', 'Client'],
    ['prenomClient', 'PrenomClient', 'clientPrenom', 'prenom', 'Prenom', 'firstName', 'FirstName', 'first_name'],
    ['postNomClient', 'postnomClient', 'clientPostNom', 'postNom', 'postnom', 'middleName', 'MiddleName', 'middle_name'],
    ['nomClient', 'NomClient', 'clientNom', 'nom', 'Nom', 'lastName', 'LastName', 'last_name', 'raisonSocialeClient', 'raisonSociale', 'clientName', 'ClientName']
  ],
  paiement?.nomClient
);

const getOperateurFullName = (paiement) => buildFullName(
  paiement,
  [
    ['nomUtilisateurComplet', 'NomUtilisateurComplet', 'utilisateurNomComplet', 'operateurNomComplet', 'caissierNomComplet', 'utilisateur', 'Utilisateurs', 'Operateur'],
    ['prenomUtilisateur', 'PrenomUtilisateur', 'prenomOperateur', 'PrenomOperateur', 'prenomCaissier', 'PrenomCaissier', 'prenom', 'Prenom', 'firstName', 'FirstName', 'first_name', 'userFirstName', 'userPrenom'],
    ['postNomUtilisateur', 'postnomUtilisateur', 'postNomOperateur', 'postnomOperateur', 'postNomCaissier', 'postnomCaissier', 'postNom', 'postnom', 'middleName', 'MiddleName', 'middle_name'],
    ['nomUtilisateur', 'NomUtilisateur', 'nomOperateur', 'NomOperateur', 'nomCaissier', 'NomCaissier', 'nom', 'Nom', 'lastName', 'LastName', 'last_name', 'userNom', 'userName']
  ],
  paiement?.nomUtilisateurComplet || paiement?.nomUtilisateur || paiement?.utilisateur || paiement?.operateur
);

// Paiements à afficher (avec pagination)
const paiementsAffichages = computed(() => paiementsData.value);

const paiementsAffiches = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage;
  const end = start + pagination.value.itemsPerPage;
  return paiementsAffichages.value.slice(start, end);
});

const pagesVisibles = computed(() => {
  const pages = [];
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

// Charger les sites
const loadSites = async () => {
  if (isSuperAdmin.value) return;
  
  try {
    const sites = await api.getSitesBySociete(userStore.societeId);
    sitesOptions.value = Array.isArray(sites) ? sites : [];
  } catch (error) {
    console.error('Erreur chargement sites:', error);
  }
};

// Charger les paiements
const loadPaiements = async () => {
  isLoading.value = true;
  
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('💰 JOURNAL DES PAIEMENTS - Chargement');
    console.log(`🏢 Société: ${userStore.societeName} (ID: ${userStore.societeId})`);
    console.log(`👤 Rôle: ${userStore.role}`);
    console.log('═══════════════════════════════════════════════════════');
    
    // ⚠️ ATTENTION : L'API V_Paiement ne supporte pas les filtres en query params
    // On charge TOUT et on filtre en frontend
    
    console.log('📡 Chargement de TOUS les paiements depuis l\'API...');
    
    // Charger TOUS les paiements (sans paramètres)
    let data = await api.getPaiements({});
    let paiements = Array.isArray(data) ? data : [];
    
    console.log(`📦 ${paiements.length} paiements reçus de l'API (toutes sociétés)`);
    if (paiements.length > 0) {
      console.log('🔍 Premier paiement (clés):', Object.keys(paiements[0]));
      console.log('🔍 Premier paiement (valeurs):', paiements[0]);
    }
    
    // 🛡️ FILTRAGE COMPLET EN FRONTEND
    const paiementsAvantFiltrage = paiements.length;
    
    paiements = paiements.filter(paiement => {
      // 1️⃣ Filtrage SOCIÉTÉ (sauf superadmin)
      if (!isSuperAdmin.value && userStore.societeId) {
        const idSocietePaiement = paiement.idSociete || paiement.IdSociete;
        if (String(idSocietePaiement) !== String(userStore.societeId)) {
          return false;
        }
      }
      
      // 2️⃣ Filtrage DATE DÉBUT
      if (filtres.value.dateDebut) {
        const datePaiement = (paiement.datePaiement || '').split('T')[0];
        if (datePaiement < filtres.value.dateDebut) {
          return false;
        }
      }
      
      // 3️⃣ Filtrage DATE FIN
      if (filtres.value.dateFin) {
        const datePaiement = (paiement.datePaiement || '').split('T')[0];
        if (datePaiement > filtres.value.dateFin) {
          return false;
        }
      }
      
      // 4️⃣ Filtrage SITE
      if (filtres.value.idSite) {
        const idSitePaiement = paiement.idSite || paiement.IdSite;
        if (String(idSitePaiement) !== String(filtres.value.idSite)) {
          return false;
        }
      }
      
      // 5️⃣ Filtrage MODE DE PAIEMENT
      if (filtres.value.modePaiement) {
        // Normaliser le mode de paiement (gérer les problèmes d'encodage)
        let modePaiement = (paiement.modePaiement || '')
          .toUpperCase()
          .replace(/ÃŠCES/g, 'ÈCES')
          .replace(/Ã©/g, 'é')
          .trim();
        
        const filtreMode = filtres.value.modePaiement.toUpperCase().trim();
        
        if (!modePaiement.includes(filtreMode) && !filtreMode.includes(modePaiement)) {
          return false;
        }
      }
      
      return true;
    });
    
    const paiementsRejetes = paiementsAvantFiltrage - paiements.length;
    console.log(`🔒 Filtrage: ${paiementsAvantFiltrage} → ${paiements.length} paiements (${paiementsRejetes} rejetés)`);
    
    if (!isSuperAdmin.value) {
      console.log(`✅ Affichage uniquement de la société #${userStore.societeId}`);
    }
    
    paiementsData.value = paiements;
    console.log(`✅ ${paiementsData.value.length} paiements affichés (après filtrage)`);
    
    // Calculer les statistiques
    calculerStatistiques();
    
    // Mettre à jour la pagination
    pagination.value.total = paiementsData.value.length;
    pagination.value.totalPages = Math.ceil(paiementsData.value.length / pagination.value.itemsPerPage);
    pagination.value.currentPage = 1;
    updatePaginationInfo();
    
  } catch (error) {
    console.error('❌ Erreur chargement paiements:', error);
    paiementsData.value = [];
  } finally {
    isLoading.value = false;
    console.log('═══════════════════════════════════════════════════════');
  }
};

// Calculer les statistiques
const calculerStatistiques = () => {
  const paiements = paiementsData.value;
  
  stats.value.nombrePaiements = paiements.length;
  stats.value.montantTotal = paiements.reduce((sum, p) => 
    sum + parseFloat(p.montant || 0), 0
  );
  
  // Calculer montants par mode de paiement (avec normalisation)
  stats.value.montantEspeces = paiements
    .filter(p => normalizeModePaiement(p.modePaiement).toUpperCase().includes('ESPÈCES'))
    .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
    
  stats.value.montantMobileMoney = paiements
    .filter(p => normalizeModePaiement(p.modePaiement).toUpperCase().includes('MOBILE'))
    .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
    
  console.log('📊 Statistiques calculées:', {
    total: stats.value.nombrePaiements,
    montantTotal: stats.value.montantTotal,
    especes: stats.value.montantEspeces,
    mobileMoney: stats.value.montantMobileMoney
  });
};

// Changer de page
const changerPage = (page) => {
  if (page === '...' || page < 1 || page > pagination.value.totalPages) return;
  pagination.value.currentPage = page;
  updatePaginationInfo();
};

// Mettre à jour les infos de pagination
const updatePaginationInfo = () => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage + 1;
  const end = Math.min(start + pagination.value.itemsPerPage - 1, pagination.value.total);
  pagination.value.start = start;
  pagination.value.end = end;
};

// Voir les détails
const voirDetails = (paiement) => {
  selectedPaiement.value = paiement;
  if (!detailsModal) {
    detailsModal = new Modal(detailsModalRef.value);
  }
  detailsModal.show();
};

// Rafraîchir les données
const rafraichirDonnees = async () => {
  await loadPaiements();
};

// Lifecycle
onMounted(async () => {
  await loadSites();
  await loadPaiements();
});

onActivated(async () => {
  await loadPaiements();
});
</script>

<style scoped>
.table th {
  padding: 0.75rem;
}

.table td {
  padding: 0.75rem;
}

.payment-modal-dialog {
  max-width: 520px;
  margin: 0 auto;
}

.payment-modal__header .modal-title {
  font-weight: 600;
}

.payment-details-body {
  background: #f8fafc;
}

.payment-modal__footer {
  background: #f8f9fa;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
}

.info-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 1rem;
  box-shadow: 0 1.25rem 2.5rem -1.5rem rgba(31, 45, 61, 0.35);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.info-card.stacked .detail-item {
  border-top: 1px dashed rgba(203, 213, 225, 0.7);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.info-card.stacked .detail-item:first-child {
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.amount-card {
  background: linear-gradient(135deg, #2dce89, #11cdef);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  border: none;
}

.amount-card::after {
  content: "";
  position: absolute;
  inset: auto -30% -30% auto;
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.amount-card .card-label {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  opacity: 0.85;
}

.amount-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.amount-card .card-value {
  font-size: 1.9rem;
  font-weight: 700;
  margin-top: 0.35rem;
}

.amount-card__badge {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.72rem;
  padding: 0.35rem 0.75rem;
}

.amount-card__meta {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  font-size: 0.8rem;
  opacity: 0.9;
}

.amount-card__meta .meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.detail-list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.5rem 0.65rem;
  border-radius: 0.6rem;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.45);
  flex-wrap: wrap;
}

.detail-list-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
}

.detail-list-value {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.95rem;
  text-align: right;
  flex: 1;
  word-break: break-word;
}

.detail-list-sub {
  display: block;
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  margin-top: 0.15rem;
}

.status-badge {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(45, 206, 137, 0.15);
  color: #2dce89;
  border: 1px solid rgba(45, 206, 137, 0.35);
}
</style>

