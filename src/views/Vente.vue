<template>
  <div class="container-fluid px-4 py-3">
    <div class="row">
      <div class="col-12 mb-3">
        <h4 class="mb-0"><i class="fas fa-cash-register me-2 text-success"></i> Point de Vente</h4>
        <p class="text-sm text-white mb-0">Enregistrer une nouvelle vente</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card bg-gradient-success shadow-sm">
          <div class="card-body p-3 text-white">
            <div class="d-flex align-items-center">
              <div class="icon icon-shape bg-white text-success shadow text-center border-radius-md me-3">
                <i class="ni ni-cart text-lg"></i>
              </div>
              <div>
                <p class="text-sm mb-1 text-uppercase">VENTES DU JOUR</p>
                <h4 class="font-weight-bolder mb-0">
                  <span v-if="isLoadingStats">
                    <i class="fas fa-spinner fa-spin me-2"></i>Chargement...
                  </span>
                  <span v-else>{{ ventesJourStats.ventes }}</span>
                </h4>
                <p class="text-xs mb-0">
                  <span class="font-weight-bold">Ventes</span> aujourd'hui
                  <span v-if="!isLoadingStats" class="ms-2">• {{ formatCurrency(ventesJourStats.ca) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Colonne gauche: Client + Panier -->
      <div class="col-lg-8">
        <!-- Client -->
        <div class="card mb-4">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h6 class="mb-0">👤 Client</h6>
              <argon-button 
                v-if="!showClientForm" 
                color="info" 
                size="sm" 
                class="ms-auto"
                @click="showClientForm = true"
              >
                <i class="fas fa-user-plus me-1"></i> Nouveau Client
              </argon-button>
              <argon-button 
                v-else 
                color="secondary" 
                size="sm" 
                class="ms-auto"
                @click="showClientForm = false; resetClientForm()"
              >
                <i class="fas fa-times me-1"></i> Annuler
              </argon-button>
            </div>
          </div>
          <div class="card-body">
            <!-- Sélection client existant -->
            <div v-if="!showClientForm" class="row">
              <div class="col-12 mb-3">
                <label class="form-label">Sélectionner un client existant</label>
                <argon-select
                  v-model="venteData.clientExistant"
                  :options="clientsOptions"
                  placeholder="Choisir un client..."
                  :disabled="isLoadingClients"
                  @update:modelValue="handleClientSelect"
                />
              </div>
            </div>

            <!-- Formulaire nouveau client -->
            <div v-else class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom *</label>
                <argon-input v-model="venteData.nom" placeholder="Nom" :is-required="true" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Prénom *</label>
                <argon-input v-model="venteData.prenom" placeholder="Prénom" :is-required="true" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Téléphone *</label>
                <argon-input v-model="venteData.telephone" placeholder="+243 123 456 789" :is-required="true" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <argon-input v-model="venteData.email" type="email" placeholder="email@example.com" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Genre</label>
                <argon-select
                  v-model="venteData.genre"
                  :options="[{value: 'M', label: 'Masculin'}, {value: 'F', label: 'Féminin'}]"
                  placeholder="Sélectionner"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Site *</label>
                <argon-select
                  v-model="venteData.idSite"
                  :options="sitesOptions"
                  placeholder="Sélectionner un site"
                  :disabled="isLoadingSites"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Panier -->
        <div class="card">
          <div class="card-header pb-0">
            <h6 class="mb-0">🛒 Panier</h6>
          </div>
          <div class="card-body">
            <!-- Ajouter un article -->
            <div class="row mb-4">
              <div class="col-md-8">
                <label class="form-label">Article</label>
                <argon-select
                  v-model="nouvelArticle.idStock"
                  :options="stocksOptions"
                  placeholder="Sélectionner un article..."
                  :disabled="isLoadingStocks"
                  @update:modelValue="handleArticleSelect"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">Qté</label>
                <argon-input
                  v-model="nouvelArticle.quantite"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="1"
                />
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <argon-button
                  color="success"
                  size="md"
                  class="w-100"
                  @click="ajouterArticle"
                  :disabled="!nouvelArticle.idStock"
                >
                  <i class="fas fa-plus"></i>
                </argon-button>
              </div>
            </div>

            <!-- Liste des articles -->
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">Article</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">Qté</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">P.U.</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">TVA</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">Remise</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="venteData.lignesCommandes.length === 0">
                    <td colspan="7" class="text-center text-secondary py-4">
                      <i class="fas fa-shopping-cart fa-2x mb-2"></i>
                      <p class="mb-0">Panier vide</p>
                    </td>
                  </tr>
                  <tr v-for="(ligne, index) in venteData.lignesCommandes" :key="index">
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ ligne.articleNom }}</p>
                      <p class="text-xs text-secondary mb-0">Stock disponible: {{ ligne.stockDisponible }}</p>
                    </td>
                    <td class="align-middle text-center">
                      <input
                        v-model.number="ligne.quantite"
                        type="number"
                        min="1"
                        :max="ligne.stockDisponible"
                        step="1"
                        class="form-control form-control-sm text-center d-inline-block"
                        style="width: 70px; font-size: 0.875rem;"
                      />
                    </td>
                    <td class="align-middle text-end">
                      <span class="text-secondary text-sm">{{ formatCurrency(ligne.prixUnitaire) }}</span>
                    </td>
                    <td class="align-middle text-end">
                      <input
                        v-model.number="ligne.tva"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        class="form-control form-control-sm text-end d-inline-block"
                        style="width: 60px; font-size: 0.875rem;"
                      />
                      <span class="text-secondary text-sm ms-1">%</span>
                    </td>
                    <td class="align-middle text-end">
                      <input
                        v-model.number="ligne.remise"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        class="form-control form-control-sm text-end d-inline-block"
                        style="width: 60px; font-size: 0.875rem;"
                      />
                      <span class="text-secondary text-sm ms-1">%</span>
                    </td>
                    <td class="align-middle text-end">
                      <span class="text-sm font-weight-bold">{{ formatCurrency(calculerLigneTotal(ligne)) }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <button
                        @click="retirerArticle(index)"
                        class="btn btn-link text-danger p-0 mb-0"
                        title="Retirer"
                      >
                        <i class="fas fa-trash text-sm"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite: Paiement + Total -->
      <div class="col-lg-4">
        <!-- Paiement -->
        <div class="card mb-4">
          <div class="card-header pb-0">
            <h6 class="mb-0">💳 Paiement</h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Mode de Paiement *</label>
              <argon-select
                v-model="venteData.modePaiement"
                :options="modePaiementOptions"
                placeholder="Sélectionner"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Référence Paiement</label>
              <argon-input
                v-model="venteData.referencePaiement"
                placeholder="Généré automatiquement"
              />
            </div>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="card bg-gradient-dark">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-white text-sm">Sous-total:</span>
              <span class="text-white font-weight-bold">{{ formatCurrency(totaux.sousTotal) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-white text-sm">TVA:</span>
              <span class="text-white font-weight-bold">{{ formatCurrency(totaux.totalTVA) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-white text-sm">Remises:</span>
              <span class="text-white font-weight-bold">-{{ formatCurrency(totaux.totalRemises) }}</span>
            </div>
            <hr class="horizontal light my-3">
            <div class="d-flex justify-content-between">
              <span class="text-white font-weight-bold">TOTAL:</span>
              <span class="text-white font-weight-bold h5 mb-0">{{ formatCurrency(totaux.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="mt-4 d-grid gap-2">
          <argon-button
            color="success"
            size="lg"
            @click="validerVente"
            :disabled="!peutValider || isLoading"
          >
            <i class="fas fa-check-circle me-2"></i>
            {{ isLoading ? 'Traitement...' : 'Valider la Vente' }}
          </argon-button>
          <argon-button
            color="secondary"
            size="md"
            @click="annulerVente"
          >
            <i class="fas fa-times me-2"></i>
            Annuler
          </argon-button>
        </div>
      </div>
    </div>

    <!-- Modal de facture -->
    <facture-modal
      :show="showFacture"
      :vente="derniereVente"
      :client="dernierClient"
      @close="showFacture = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import FactureModal from '@/components/modals/FactureModal.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';

const router = useRouter();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showSuccess, showError, showLoading, close, showConfirm } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const isLoadingClients = ref(false);
const isLoadingStocks = ref(false);
const isLoadingSites = ref(false);
const showClientForm = ref(false);
const isLoadingStats = ref(false);
const clientsOptions = ref([]);
const stocksOptions = ref([]);
const stocksData = ref([]);
const sitesOptions = ref([]);

// État pour la facture
const showFacture = ref(false);
const derniereVente = ref(null);
const dernierClient = ref(null);

const modePaiementOptions = [
  { value: 'Espèces', label: '💵 Espèces' },
  { value: 'Carte bancaire', label: '💳 Carte bancaire' },
  { value: 'Virement', label: '🏦 Virement' },
  { value: 'Mobile Money', label: '📱 Mobile Money' }
];

// Données de la vente
const venteData = ref({
  // Client
  clientExistant: null,
  nom: '',
  prenom: '',
  genre: '',
  email: '',
  telephone: '',
  dateNaissance: null,
  idSite: 0,
  pieceIdentite: '',
  province: '',
  ville: '',
  commune: '',
  quartier: '',
  avenue: '',
  numero: '',
  // Commande
  idUtilisateur: userStore.userId,
  dateCommande: new Date().toISOString(),
  statutCommande: 'Validée',
  // Paiement
  datePaiement: new Date().toISOString(),
  modePaiement: '',
  montant: 0,
  referencePaiement: '',
  statutPaiement: 'Payé',
  libellePaiement: '',
  catalogueId: 0,
  // Lignes
  lignesCommandes: []
});

// Nouvel article à ajouter
const nouvelArticle = ref({
  idStock: null,
  quantite: '1'
});

// Statistiques du jour
const ventesJourStats = ref({
  ventes: 0,
  ca: 0
});

// Calculer les totaux
const totaux = computed(() => {
  let sousTotal = 0;
  let totalTVA = 0;
  let totalRemises = 0;

  venteData.value.lignesCommandes.forEach(ligne => {
    const montantHT = ligne.prixUnitaire * ligne.quantite;
    const remise = (montantHT * ligne.remise) / 100;
    const montantApresRemise = montantHT - remise;
    const tva = (montantApresRemise * ligne.tva) / 100;

    sousTotal += montantHT;
    totalRemises += remise;
    totalTVA += tva;
  });

  const total = sousTotal - totalRemises + totalTVA;

  return { sousTotal, totalTVA, totalRemises, total };
});

// Peut valider la vente?
const peutValider = computed(() => {
  const aClient = showClientForm.value
    ? (venteData.value.nom && venteData.value.prenom && venteData.value.telephone)
    : venteData.value.clientExistant;

  const aArticles = venteData.value.lignesCommandes.length > 0;
  const aModePaiement = venteData.value.modePaiement;

  return aClient && aArticles && aModePaiement;
});

// Charger clients
const buildClientLabel = (client = {}) => {
  const fullName =
    client.nomComplet ||
    `${client.prenomClient || client.prenom || ''} ${client.nomClient || client.nom || ''}`.trim();
  const contact = client.telephone || client.numeroTelephone || client.contact || '';
  const site = client.nomSite || client.siteName || client.site || '';
  let label = fullName || `Client #${client.idClient}`;
  if (site) label += ` – ${site}`;
  if (contact) label += ` (${contact})`;
  return label;
};

const loadClients = async () => {
  isLoadingClients.value = true;
  try {
    const societeId = userStore.societeId;
    if (!societeId) {
      clientsOptions.value = [];
      return;
    }

    console.log(`📋 Chargement clients pour point de vente (société #${societeId})...`);
    const response = await api.getClientsParSiteBySociete(societeId);
    const clients = Array.isArray(response) ? response : [];
    console.log(`✅ ${clients.length} client(s) disponible(s) pour la vente`);

    clientsOptions.value = clients.map((client) => ({
      value: parseInt(client.idClient, 10),
      label: buildClientLabel(client),
      raw: client,
    }));
  } catch (error) {
    console.error('❌ Erreur chargement clients:', error);
    clientsOptions.value = [];
  } finally {
    isLoadingClients.value = false;
  }
};

// Charger stocks
const buildStockLabel = (stock) => {
  const articleName =
    stock.articleNom ||
    stock.nomArticle ||
    stock.libelle ||
    stock.descriptionArticle ||
    `Article #${stock.idArticle}`;
  const siteName =
    stock.siteNom ||
    stock.nomSite ||
    stock.site ||
    '';
  const prix = stock.prixVentHT || stock.prixVente || stock.prix || stock.prixUnitaire || 0;
  const quantite = parseFloat(stock.quantiteStock) || 0;

  let label = `${articleName} (Stock: ${quantite.toFixed(0)})`;
  if (siteName) label += ` – ${siteName}`;
  label += ` – ${formatCurrency(prix)}`;
  return label;
};

const loadStocks = async () => {
  isLoadingStocks.value = true;
  try {
    const societeId = userStore.societeId;
    if (!societeId) {
      stocksData.value = [];
      stocksOptions.value = [];
      return;
    }

    console.log(`📦 Chargement stocks pour point de vente (société #${societeId})...`);
    const response = await api.getStocksVueBySociete(societeId);
    let stocksDisponibles = Array.isArray(response) ? response : [];

    stocksDisponibles = stocksDisponibles
      .filter((s) => parseFloat(s.quantiteStock) > 0 && s.statut !== false)
      .map((stock) => ({
        ...stock,
        articleNom:
          stock.articleNom ||
          stock.nomArticle ||
          stock.libelleArticle ||
          stock.libelle ||
          stock.descriptionArticle ||
          `Article #${stock.idArticle}`,
        siteNom: stock.siteNom || stock.nomSite || stock.site || '',
        prixVentHT: stock.prixVentHT || stock.prixVente || stock.prix || stock.prixUnitaire || 0,
      }));

    console.log(`✅ ${stocksDisponibles.length} stock(s) disponible(s) pour la vente`);
    stocksData.value = stocksDisponibles;

    stocksOptions.value = stocksDisponibles.map((stock) => ({
      value: stock.idStock,
      label: buildStockLabel(stock),
      articleNom: stock.articleNom,
      prixVentHT: parseFloat(stock.prixVentHT),
      quantiteStock: parseFloat(stock.quantiteStock),
    }));

    console.log('✅ Stocks formatés pour le dropdown:', stocksOptions.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement stocks:', error);
    stocksData.value = [];
    stocksOptions.value = [];
  } finally {
    isLoadingStocks.value = false;
  }
};

// Sélectionner un client existant
const handleClientSelect = async (idClient) => {
  if (!idClient) return;

  const option = clientsOptions.value.find((client) => client.value === idClient);
  const client = option?.raw;
  if (!client) return;

  venteData.value.nom = client.nom || client.nomClient || '';
  venteData.value.prenom = client.prenom || client.prenomClient || '';
  venteData.value.genre = client.genre || client.sex || '';
  venteData.value.email = client.email || '';
  venteData.value.telephone = client.telephone || client.numeroTelephone || client.contact || '';
  if (client.idSite) {
    venteData.value.idSite = parseInt(client.idSite, 10);
  }
};

// Sélectionner un article
const handleArticleSelect = (idStock) => {
  const stock = stocksOptions.value.find((s) => s.value === idStock);
  if (stock) {
    nouvelArticle.value.prixUnitaire = stock.prixVentHT;
    nouvelArticle.value.articleNom = stock.articleNom;
    nouvelArticle.value.stockDisponible = stock.quantiteStock;
  }
};

// Ajouter un article au panier
const ajouterArticle = () => {
  if (!nouvelArticle.value.idStock) return;

  const stock = stocksOptions.value.find(s => s.value === nouvelArticle.value.idStock);
  if (!stock) return;

  // Vérifier si l'article existe déjà
  const existant = venteData.value.lignesCommandes.find(l => l.idStock === nouvelArticle.value.idStock);
  if (existant) {
    showError('Erreur', 'Cet article est déjà dans le panier');
    return;
  }

  // Vérifier la quantité disponible
  if (nouvelArticle.value.quantite > parseFloat(stock.quantiteStock)) {
    showError('Erreur', `Quantité insuffisante (disponible: ${parseFloat(stock.quantiteStock).toFixed(0)})`);
    return;
  }

  venteData.value.lignesCommandes.push({
    idStock: nouvelArticle.value.idStock,
    articleNom: stock.articleNom,
    quantite: parseFloat(nouvelArticle.value.quantite),
    prixUnitaire: parseFloat(stock.prixVentHT),
    tva: 16, // TVA standard en RDC : 16%
    remise: 0,
    stockDisponible: parseFloat(stock.quantiteStock).toFixed(0)
  });

  // Réinitialiser
  nouvelArticle.value = { idStock: null, quantite: '1' };
};

// Retirer un article
const retirerArticle = (index) => {
  venteData.value.lignesCommandes.splice(index, 1);
};

// Calculer le total d'une ligne
const calculerLigneTotal = (ligne) => {
  const montantHT = ligne.prixUnitaire * ligne.quantite;
  const remise = (montantHT * ligne.remise) / 100;
  const montantApresRemise = montantHT - remise;
  const tva = (montantApresRemise * ligne.tva) / 100;
  return montantApresRemise + tva;
};

// Formater en devise
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF' }).format(value);
};

// Réinitialiser le formulaire client
const resetClientForm = () => {
  venteData.value.clientExistant = null;
  venteData.value.nom = '';
  venteData.value.prenom = '';
  venteData.value.genre = '';
  venteData.value.email = '';
  venteData.value.telephone = '';
  // Réinitialiser le site au premier de la liste
  if (sitesOptions.value.length > 0) {
    venteData.value.idSite = sitesOptions.value[0].value;
  }
};

// Valider la vente
const validerVente = async () => {
  console.log('🚀🚀🚀 NOUVEAU CODE VENTE.VUE CHARGÉ - VERSION 2.0 🚀🚀🚀');
  
  const result = await showConfirm(
    'Confirmer la vente ?',
    `Montant total: ${formatCurrency(totaux.value.total)}`,
    { confirmButtonText: 'Oui, valider', confirmButtonColor: '#2dce89' }
  );

  if (!result.isConfirmed) return;

  showLoading('Enregistrement de la vente...', 'Veuillez patienter');
  isLoading.value = true;

  try {
    // Générer référence si vide
    if (!venteData.value.referencePaiement) {
      venteData.value.referencePaiement = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Mettre à jour le montant
    venteData.value.montant = totaux.value.total;

    // Libellé
    venteData.value.libellePaiement = `Vente ${venteData.value.modePaiement} - ${venteData.value.referencePaiement}`;

    // 🎯 SYSTÈME DE FALLBACK INTELLIGENT
    let response = null;
    let methodeUtilisee = '';
    
    console.log('═══════════════════════════════════════════');
    console.log('💾 ENREGISTREMENT VENTE - Système SP avec Fallback [v2.0]');
    console.log('═══════════════════════════════════════════');
    
    // 1️⃣ PRIORITÉ: Stored Procedure
    try {
      console.log('🔄 Tentative 1/3: Stored Procedure (SP)...');
      response = await api.enregistrerVenteSP(venteData.value);
      methodeUtilisee = 'Stored Procedure (SP)';
      console.log('✅ Succès avec Stored Procedure !');
    } catch (spError) {
      console.warn('⚠️ SP échouée:', spError.message);
      
      // 2️⃣ FALLBACK 1: Méthode Standard (Entity Framework)
      try {
        console.log('🔄 Tentative 2/3: Méthode Standard (EF)...');
        response = await api.enregistrerVente(venteData.value);
        methodeUtilisee = 'Méthode Standard (Entity Framework)';
        console.log('✅ Succès avec méthode standard !');
      } catch (stdError) {
        console.warn('⚠️ Standard échouée:', stdError.message);
        
        // 3️⃣ FALLBACK 2: Méthode Alternative
        try {
          console.log('🔄 Tentative 3/3: Méthode Alternative...');
          response = await api.enregistrerVenteAlternative(venteData.value);
          methodeUtilisee = 'Méthode Alternative';
          console.log('✅ Succès avec méthode alternative !');
        } catch (altError) {
          console.error('❌ Toutes les méthodes ont échoué !');
          throw new Error('Impossible d\'enregistrer la vente avec aucune méthode disponible');
        }
      }
    }
    
    console.log('═══════════════════════════════════════════');
    console.log(`✅ VENTE ENREGISTRÉE via: ${methodeUtilisee}`);
    console.log('═══════════════════════════════════════════');

    close();
    await showSuccess(
      'Vente enregistrée !', 
      `Montant total : ${formatCurrency(totaux.value.total)}`
    );

    // Sauvegarder les données pour la facture
    derniereVente.value = {
      ...venteData.value,
      idVente: response?.idVente || response?.id || Date.now(),
      dateCreation: new Date().toISOString(),
      methodeEnregistrement: methodeUtilisee
    };

    // Récupérer les infos du client
    console.log('📋 Préparation données client pour facture...');
    console.log('📋 showClientForm:', showClientForm.value);
    console.log('📋 clientExistant:', venteData.value.clientExistant);
    console.log('📋 nom/prenom:', venteData.value.nom, venteData.value.prenom);
    
    if (venteData.value.clientExistant) {
      // Client existant sélectionné
      const clientOption = clientsOptions.value.find(c => c.value === venteData.value.clientExistant);
      console.log('👤 Client existant sélectionné:', clientOption);
      dernierClient.value = {
        nom: clientOption?.nom || '',
        prenom: clientOption?.prenom || '',
        telephone: clientOption?.telephone || '',
        email: clientOption?.email || ''
      };
    } else {
      // Nouveau client créé
      console.log('👤 Nouveau client créé avec données formulaire');
      dernierClient.value = {
        nom: venteData.value.nom,
        prenom: venteData.value.prenom,
        telephone: venteData.value.telephone,
        email: venteData.value.email
      };
    }
    
    console.log('✅ Données client pour facture:', dernierClient.value);

    // Afficher la facture
    showFacture.value = true;
  } catch (error) {
    close();
    console.error('❌ Erreur fatale:', error);
    await showError('Erreur', error.response?.data?.message || error.message || 'Impossible d\'enregistrer la vente');
  } finally {
    isLoading.value = false;
  }
};

// Annuler la vente
const annulerVente = async () => {
  const result = await showConfirm(
    'Annuler ?',
    'Toutes les données seront perdues',
    { confirmButtonText: 'Oui, annuler', confirmButtonColor: '#f5365c' }
  );

  if (result.isConfirmed) {
    router.push('/dashboard');
  }
};

// Charger les sites pour le dropdown du nouveau client
const loadSites = async () => {
  isLoadingSites.value = true;
  try {
    const societeId = userStore.societeId;
    if (!societeId) {
      sitesOptions.value = [];
      return;
    }

    console.log('🏢 Chargement sites pour nouveau client...');
    const response = await api.getSitesBySociete(societeId);

    const filteredSites = Array.isArray(response) ? response : [];
    console.log(`✅ ${filteredSites.length} site(s) associé(s) trouvé(s) pour la société #${societeId}`);

    // Formater pour le dropdown
    sitesOptions.value = filteredSites.map(site => ({
      value: parseInt(site.idSite, 10),
      label: site.nomSite || site.nom || `Site #${site.idSite}`
    }));
    
    // Pré-sélectionner le premier site
    if (sitesOptions.value.length > 0 && !venteData.value.idSite) {
      venteData.value.idSite = sitesOptions.value[0].value;
      console.log('✅ Site pré-sélectionné:', sitesOptions.value[0].label);
    }
    
    console.log('✅ Sites chargés pour dropdown:', sitesOptions.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement sites:', error);
    sitesOptions.value = [];
  } finally {
    isLoadingSites.value = false;
  }
};

const loadVentesJourStats = async () => {
  isLoadingStats.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.getJournalVenteStatsDate(today, {
      idSociete: userStore.isSuperAdmin ? undefined : userStore.societeId,
      idSite: userStore.siteId || undefined,
      idUtilisateur: userStore.userId || undefined
    });

    const ventes =
      parseInt(
        response?.ventes ??
        response?.nombreVentes ??
        response?.totalVentes ??
        response?.commandes ??
        response?.nombreCommandes ??
        response?.nbVentes ??
        response?.count ??
        0,
        10
      ) || 0;

    const ca =
      parseFloat(
        response?.ca ??
        response?.montant ??
        response?.montantTotal ??
        response?.total ??
        0
      ) || 0;

    ventesJourStats.value = {
      ventes,
      ca
    };
  } catch (error) {
    console.error('❌ Erreur chargement stats ventes du jour:', error);
    ventesJourStats.value = { ventes: 0, ca: 0 };
  } finally {
    isLoadingStats.value = false;
  }
};

onMounted(() => {
  loadClients();
  loadStocks();
  loadSites();
  loadVentesJourStats();
});
</script>

<style scoped>
.table th {
  padding: 0.75rem 0.5rem;
}

.table td {
  padding: 0.75rem 0.5rem;
}
</style>

