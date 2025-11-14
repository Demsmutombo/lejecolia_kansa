<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/services/api.service';

const props = defineProps({
  show: Boolean,
  vente: Object,
  client: Object
});

const emit = defineEmits(['close']);

const userStore = useUserStore();

// Données de la société et du site
const societe = ref(null);
const site = ref(null);

// Charger les infos de la société et du site
const loadSocieteInfo = async () => {
  try {
    if (!userStore.societeId) {
      console.log('⚠️ Pas de societeId dans userStore');
      return;
    }

    console.log('🔄 Chargement infos société/site pour facture...');
    console.log('🏢 SocieteId:', userStore.societeId);
    console.log('📍 SiteId:', userStore.siteId);

    // Charger la société
    societe.value = await api.getSocieteById(userStore.societeId || 3);
    
    console.log('✅ Société trouvée:', societe.value?.nomSociete || 'Non trouvée');

    // Charger le premier site de la société si userStore.siteId est undefined
    const sites = await api.getSitesBySociete(userStore.societeId || 3);
    const sitesList = Array.isArray(sites) ? sites : (sites?.data || []);
    
    if (userStore.siteId) {
      // Utiliser le site de l'utilisateur
      site.value = sitesList.find(s => String(s.idSite) === String(userStore.siteId));
      console.log('✅ Site utilisateur:', site.value?.nomSite || 'Non trouvé');
    } else {
      // Prendre le premier site de la société
      site.value = sitesList[0] || null;
      console.log('✅ Premier site de la société:', site.value?.nomSite || 'Aucun site trouvé');
    }
  } catch (error) {
    console.error('❌ Erreur chargement infos société:', error);
  }
};

// Charger au montage et quand le modal s'ouvre
watch(() => props.show, (newVal) => {
  if (newVal) {
    loadSocieteInfo();
  }
});

// Formater la date
const formatDate = (date) => {
  if (!date) return new Date().toLocaleDateString('fr-FR');
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Formater la devise
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0
  }).format(value || 0);
};

// Calculer le total d'une ligne
const calculerLigneTotal = (ligne) => {
  const montantHT = ligne.prixUnitaire * ligne.quantite;
  const remise = (montantHT * (ligne.remise || 0)) / 100;
  const montantApresRemise = montantHT - remise;
  const tva = (montantApresRemise * (ligne.tva || 0)) / 100;
  return montantApresRemise + tva;
};

// Calculer les totaux
const totaux = computed(() => {
  if (!props.vente?.lignesCommandes) {
    return { sousTotal: 0, totalTVA: 0, totalRemises: 0, total: 0 };
  }

  let sousTotal = 0;
  let totalTVA = 0;
  let totalRemises = 0;

  props.vente.lignesCommandes.forEach(ligne => {
    const montantHT = ligne.prixUnitaire * ligne.quantite;
    const remise = (montantHT * (ligne.remise || 0)) / 100;
    const montantApresRemise = montantHT - remise;
    const tva = (montantApresRemise * (ligne.tva || 0)) / 100;

    sousTotal += montantHT;
    totalRemises += remise;
    totalTVA += tva;
  });

  const total = sousTotal - totalRemises + totalTVA;

  return { sousTotal, totalTVA, totalRemises, total };
});

// Imprimer la facture
const imprimerFacture = () => {
  // Masquer temporairement tout sauf la facture
  const factureContent = document.getElementById('facture-content');
  const originalContent = document.body.innerHTML;
  const printContent = factureContent.innerHTML;

  // Remplacer le contenu de la page
  document.body.innerHTML = `
    <html>
      <head>
        <title>Facture ${props.vente?.idVente || 'N/A'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f8f9fa; }
          .text-end { text-align: right; }
          .text-center { text-align: center; }
          .text-primary { color: #1565c0; }
          .text-muted { color: #6c757d; }
          .font-weight-bold { font-weight: bold; }
          hr { border: 1px solid #ddd; margin: 15px 0; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `;

  // Imprimer
  window.print();

  // Restaurer le contenu original
  document.body.innerHTML = originalContent;
  window.location.reload();
};

// Télécharger en PDF
const telechargerPDF = () => {
  imprimerFacture();
  // Note: L'utilisateur choisira "Enregistrer en PDF" dans la boîte de dialogue d'impression
};
</script>

<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 700px;">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header bg-gradient-primary">
          <h5 class="modal-title text-white">
            <i class="fas fa-file-invoice me-2"></i>
            Facture
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="emit('close')"></button>
        </div>

        <!-- Corps de la facture -->
        <div class="modal-body p-3" id="facture-content">
          <!-- En-tête de la facture -->
          <div class="row mb-3">
            <div class="col-7">
              <h4 class="text-primary mb-2">FACTURE</h4>
              <p class="mb-1"><strong>{{ societe?.nomSociete || userStore.societeName }}</strong></p>
              <p class="mb-1 text-sm">
                <i class="fas fa-store me-2 text-primary"></i>
                <strong>{{ site?.nomSite || userStore.siteName }}</strong>
              </p>
              <p class="mb-1 text-sm text-muted" v-if="site?.telephone || societe?.telephone">
                <i class="fas fa-phone me-2"></i>{{ site?.telephone || societe?.telephone }}
              </p>
              <p class="mb-0 text-sm text-muted" v-if="site?.email || societe?.email">
                <i class="fas fa-envelope me-2"></i>{{ site?.email || societe?.email }}
              </p>
              <p class="mb-0 text-xs text-muted mt-2" v-if="site?.ville || site?.commune">
                <i class="fas fa-map-marker-alt me-2"></i>
                {{ [site?.avenue, site?.quartier, site?.commune, site?.ville, site?.province].filter(Boolean).join(', ') }}
              </p>
            </div>
            <div class="col-5 text-end">
              <img 
                v-if="societe?.logo"
                :src="societe.logo" 
                alt="Logo société" 
                style="max-height: 60px; max-width: 100%; object-fit: contain; margin-bottom: 0.5rem;"
              />
              <div v-else class="bg-light rounded p-2 mb-1" style="height: 60px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-building fa-lg text-muted"></i>
              </div>
              <p class="mb-0 text-xs"><strong>Date :</strong> {{ formatDate(vente?.dateCreation) }}</p>
              <p class="mb-0 text-xs"><strong>N° :</strong> {{ vente?.idVente || 'N/A' }}</p>
            </div>
          </div>

          <hr class="horizontal dark my-2">

          <!-- Identifiants Fiscaux et Adresse -->
          <div class="row mb-2">
            <div class="col-6">
              <h6 class="text-uppercase text-xxs mb-1 text-muted">Identifiants Fiscaux</h6>
              <div class="text-xxs">
                <p class="mb-1" v-if="societe?.numeroImpot">
                  <strong>NUMÉRO D'IMPÔT</strong><br>
                  <span class="text-muted">{{ societe.numeroImpot }}</span>
                </p>
                <p class="mb-1" v-if="societe?.rccm">
                  <strong>RCCM</strong><br>
                  <span class="text-muted">{{ societe.rccm }}</span>
                </p>
                <p class="mb-0" v-if="societe?.idNational">
                  <strong>ID NATIONAL</strong><br>
                  <span class="text-muted">{{ societe.idNational }}</span>
                </p>
                <p class="mb-0 mt-2" v-if="!societe?.numeroImpot && !societe?.rccm && !societe?.idNational">
                  <span class="text-muted fst-italic">Non renseignés</span>
                </p>
              </div>
            </div>
            <div class="col-6">
              <h6 class="text-uppercase text-xxs mb-1 text-muted">Adresse</h6>
              <div class="text-xxs">
                <p class="mb-0">
                  <strong>ADRESSE COMPLÈTE</strong><br>
                  <span class="text-muted">
                    <template v-if="site">
                      {{ [
                        site.numero ? `N° ${site.numero}` : '',
                        site.avenue ? `Avenue ${site.avenue}` : '',
                        site.quartier,
                        site.commune,
                        site.ville,
                        site.province
                      ].filter(Boolean).join(', ') || 
                      [
                        societe?.avenue,
                        societe?.quartier,
                        societe?.commune,
                        societe?.ville,
                        societe?.province
                      ].filter(Boolean).join(', ') || 
                      'Non renseignée' }}
                    </template>
                    <template v-else-if="societe">
                      {{ [
                        societe.avenue,
                        societe.quartier,
                        societe.commune,
                        societe.ville,
                        societe.province
                      ].filter(Boolean).join(', ') || 'Non renseignée' }}
                    </template>
                    <template v-else>
                      Non renseignée
                    </template>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <hr class="horizontal dark my-2">

          <!-- Informations client -->
          <div class="row mb-2">
            <div class="col-12">
              <h6 class="text-uppercase text-xxs mb-1 text-muted">Facturé à :</h6>
              <p class="mb-0 text-sm"><strong>{{ client?.nom }} {{ client?.prenom }}</strong></p>
              <p class="mb-0 text-xs text-muted" v-if="client?.telephone || client?.email">
                <span v-if="client?.telephone">📞 {{ client.telephone }}</span>
                <span v-if="client?.email" class="ms-2">📧 {{ client.email }}</span>
              </p>
            </div>
          </div>

          <!-- Détails des articles -->
          <div class="table-responsive">
            <table class="table table-bordered table-sm">
              <thead class="bg-light">
                <tr>
                  <th class="text-uppercase text-xxs font-weight-bolder">Article</th>
                  <th class="text-uppercase text-xxs font-weight-bolder text-center">Qté</th>
                  <th class="text-uppercase text-xxs font-weight-bolder text-end">P.U.</th>
                  <th class="text-uppercase text-xxs font-weight-bolder text-end">TVA</th>
                  <th class="text-uppercase text-xxs font-weight-bolder text-end">Rem.</th>
                  <th class="text-uppercase text-xxs font-weight-bolder text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ligne, index) in vente?.lignesCommandes" :key="index">
                  <td class="text-xs">{{ ligne.articleNom }}</td>
                  <td class="text-xs text-center">{{ ligne.quantite }}</td>
                  <td class="text-xs text-end">{{ formatCurrency(ligne.prixUnitaire) }}</td>
                  <td class="text-xs text-end">{{ ligne.tva || 0 }}%</td>
                  <td class="text-xs text-end">{{ ligne.remise || 0 }}%</td>
                  <td class="text-xs text-end font-weight-bold">{{ formatCurrency(calculerLigneTotal(ligne)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totaux -->
          <div class="row mt-3">
            <div class="col-md-6 offset-md-6">
              <div class="card bg-gradient-light">
                <div class="card-body p-2">
                  <div class="d-flex justify-content-between mb-1">
                    <span class="text-xs">Sous-total HT :</span>
                    <span class="text-xs font-weight-bold">{{ formatCurrency(totaux.sousTotal) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-1">
                    <span class="text-xs">Remises :</span>
                    <span class="text-xs font-weight-bold text-danger">- {{ formatCurrency(totaux.totalRemises) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-1">
                    <span class="text-xs">TVA :</span>
                    <span class="text-xs font-weight-bold">{{ formatCurrency(totaux.totalTVA) }}</span>
                  </div>
                  <hr class="horizontal dark my-1">
                  <div class="d-flex justify-content-between">
                    <span class="text-sm font-weight-bold">TOTAL TTC :</span>
                    <span class="text-sm font-weight-bold text-primary">{{ formatCurrency(totaux.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mode de paiement et Opérateur -->
          <div class="row mt-3">
            <div class="col-12">
              <div class="card bg-light">
                <div class="card-body p-2">
                  <div class="row">
                    <div class="col-6">
                      <p class="text-xs mb-0">
                        <i class="fas fa-credit-card me-2 text-info"></i>
                        <strong>Mode de paiement :</strong>
                      </p>
                      <p class="text-sm mb-0 ms-4">
                        <span class="badge bg-gradient-info">{{ vente?.modePaiement || 'N/A' }}</span>
                      </p>
                    </div>
                    <div class="col-6">
                      <p class="text-xs mb-0">
                        <i class="fas fa-user-tie me-2 text-primary"></i>
                        <strong>Vendeur :</strong>
                      </p>
                      <p class="text-sm mb-0 ms-4 font-weight-bold">
                        {{ userStore.userName || userStore.nomUtilisateur || 'N/A' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer de la facture -->
          <div class="row mt-3">
            <div class="col-12 text-center">
              <hr class="horizontal dark my-2">
              <p class="text-xs mb-1">
                <strong>{{ societe?.nomSociete || userStore.societeName }}</strong>
              </p>
              <p class="text-xxs text-muted mb-0" v-if="societe?.telephone || site?.telephone">
                📞 {{ societe?.telephone || site?.telephone }}
                <span v-if="societe?.email || site?.email" class="ms-2">
                  📧 {{ societe?.email || site?.email }}
                </span>
              </p>
              <p class="text-xxs text-muted mt-2 mb-0">
                <em>Facture générée via Lejecolia</em>
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-footer no-print">
          <button type="button" class="btn btn-secondary" @click="emit('close')">
            <i class="fas fa-times me-2"></i>
            Fermer
          </button>
          <button type="button" class="btn btn-info" @click="imprimerFacture">
            <i class="fas fa-print me-2"></i>
            Imprimer
          </button>
          <button type="button" class="btn btn-primary" @click="telechargerPDF">
            <i class="fas fa-file-pdf me-2"></i>
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal.show {
  display: block;
  overflow-y: auto;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 3.5rem);
}

.form-control-sm {
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}

.table-sm th,
.table-sm td {
  padding: 0.4rem 0.5rem;
}

.badge-sm {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

/* Styles d'impression */
@media print {
  /* Masquer les éléments non nécessaires */
  .modal-header,
  .modal-footer,
  .no-print {
    display: none !important;
  }

  .modal-dialog {
    max-width: 100% !important;
    margin: 0 !important;
  }

  .modal-content {
    border: none !important;
    box-shadow: none !important;
  }

  .modal-body {
    padding: 20px !important;
  }

  /* Forcer l'affichage en noir et blanc */
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Optimiser pour l'impression */
  .card {
    page-break-inside: avoid;
    box-shadow: none !important;
  }

  .table {
    font-size: 11pt !important;
  }

  /* Masquer le fond du modal */
  .modal {
    background-color: white !important;
    position: relative !important;
  }
}
</style>

