<template>
  <div class="dashboard-gestionnaire">
    <!-- En-tête gestionnaire -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="ni ni-briefcase-24 me-3 text-lg text-success"></i>
          <div>
                  <h5 class="mb-0">{{ userStore.societeName }}</h5>
                  <p class="mb-0 text-sm text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </p>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <argon-button
                  color="info"
                  variant="gradient"
                  size="sm"
                  @click="goToDocumentation"
                >
                  <i class="fas fa-book me-1"></i>
                  Documentation
                </argon-button>
                <argon-button
                  color="primary"
                  size="sm"
                  @click="loadDashboardData"
                  :disabled="isLoading"
                >
                  <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoading }"></i>
                  Rafraîchir
                </argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques gestionnaire -->
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="VENTES DU JOUR"
          :value="`${stats.ventesJour}`"
          description="<span class='text-success text-sm font-weight-bolder'>Ventes</span> aujourd'hui"
          :icon="{
            component: 'ni ni-cart',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="CA DU MOIS"
          :value="stats.revenue.toLocaleString('fr-CD') + ' FC'"
          description="<span class='text-primary text-sm font-weight-bolder'>Chiffre</span> d'affaires"
          :icon="{
            component: 'ni ni-money-coins',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="CLIENTS ACTIFS"
          :value="stats.clients"
          description="<span class='text-info text-sm font-weight-bolder'>Clients</span> de votre société"
          :icon="{
            component: 'ni ni-circle-08',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <mini-statistics-card
          title="EMPLOYÉS"
          :value="stats.employees"
          description="<span class='text-warning text-sm font-weight-bolder'>Membres</span> de l'équipe"
          :icon="{
            component: 'ni ni-single-02',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- Statistiques secondaires -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="ARTICLES"
          :value="`${stats.articles}`"
          description="<span class='text-secondary text-sm font-weight-bolder'>Produits</span> en catalogue"
          :icon="{
            component: 'ni ni-box-2',
            background: 'bg-gradient-secondary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="STOCKS"
          :value="`${stats.stocks}`"
          description="<span class='text-dark text-sm font-weight-bolder'>Articles</span> en stock"
          :icon="{
            component: 'ni ni-archive-2',
            background: 'bg-gradient-dark',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="VENTES TOTALES"
          :value="`${stats.ventesTotales}`"
          description="<span class='text-success text-sm font-weight-bolder'>Commandes</span> de l'année"
          :icon="{
            component: 'ni ni-shop',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <mini-statistics-card
          title="BÉNÉFICE NET"
          :value="stats.beneficeNet.toLocaleString('fr-CD') + ' FC'"
          description="<span class='text-danger text-sm font-weight-bolder'>Marge</span> du mois"
          :icon="{
            component: 'ni ni-diamond',
            background: 'bg-gradient-danger',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- Résumé rapide -->
    <div class="row mt-4">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-chart-bar me-2 text-primary"></i>
              Vue d'ensemble de {{ userStore.societeName }}
            </h6>
            <p class="text-xs text-muted mb-0">Statistiques et performance de votre société</p>
          </div>
          <div class="card-body p-3">
            <div class="row text-center">
              <div class="col-md-3 mb-3">
                <div class="border-end">
                  <h4 class="font-weight-bolder text-success mb-1">{{ stats.ventesJour }}</h4>
                  <p class="text-xs text-muted mb-0">Ventes du jour</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="border-end">
                  <h4 class="font-weight-bolder text-primary mb-1">{{ stats.revenue.toLocaleString('fr-CD') }} FC</h4>
                  <p class="text-xs text-muted mb-0">CA du mois</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="border-end">
                  <h4 class="font-weight-bolder text-info mb-1">{{ stats.clients }}</h4>
                  <p class="text-xs text-muted mb-0">Clients actifs</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div>
                  <h4 class="font-weight-bolder text-warning mb-1">{{ stats.employees }}</h4>
                  <p class="text-xs text-muted mb-0">Employés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et activités -->
    <div class="row mt-4">
      <div class="col-lg-7 mb-lg-0 mb-4">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">📈 Performance - {{ userStore.societeName }}</h6>
          </div>
          <div class="card-body p-3">
            <gradient-line-chart
              id="gestionnaire-chart"
              title="Ventes mensuelles"
              :description="`<i class='fa fa-arrow-up text-success'></i> <span class='font-weight-bold'>${stats.growth}%</span> de croissance`"
              :chart="chartData"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card h-100">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-history text-info me-2"></i>
              Activités récentes
            </h6>
            <p class="text-xs text-muted mb-0">Dernières opérations de votre société</p>
          </div>
          <div class="card-body p-3">
            <div v-if="recentActivities.length === 0" class="text-center py-4">
              <i class="fas fa-inbox fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted">Aucune activité récente</p>
            </div>
            <timeline-list v-else>
              <timeline-item
                v-for="(activity, index) in recentActivities"
                :key="index"
                :color="activity.color"
                :icon="activity.icon"
                :title="activity.title"
                :dateTime="activity.dateTime"
              />
            </timeline-list>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventes du jour -->
    <div class="row mt-4">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-shopping-cart text-success me-2"></i>
              Ventes du jour
            </h6>
            <p class="text-xs text-muted mb-0">{{ stats.ventesJour }} vente(s) aujourd'hui</p>
          </div>
          <div class="card-body p-3">
            <div v-if="ventesJourDetails.length === 0" class="text-center py-4">
              <i class="fas fa-shopping-basket fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted">Aucune vente aujourd'hui</p>
              <router-link to="/vente" class="btn btn-sm btn-primary mt-2">
                <i class="fas fa-plus me-1"></i>
                Créer une vente
              </router-link>
                        </div>
            <div v-else>
              <ul class="list-group">
                <li 
                  v-for="vente in ventesJourDetails" 
                  :key="vente.idCommande"
                  class="list-group-item border-0 ps-0 mb-3"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                      <h6 class="mb-1 text-dark text-sm">
                        <i class="fas fa-receipt me-2 text-success"></i>
                        Commande #{{ vente.idCommande }}
                      </h6>
                      <p class="text-xs text-muted mb-1">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        {{ vente.nomSite || 'Site' }}
                      </p>
                        </div>
                    <div class="text-end">
                      <span class="text-sm font-weight-bold text-success">
                        {{ vente.montantTotal.toLocaleString('fr-CD') }} FC
                      </span>
                    </div>
                  </div>
                  <div class="ps-4">
                    <ul class="list-unstyled mb-0">
                      <li 
                        v-for="(article, idx) in vente.articles" 
                        :key="idx"
                        class="text-xs mb-1"
                      >
                        <i class="fas fa-box me-2 text-info"></i>
                        <strong>{{ article.libelle }}</strong>
                        <span class="text-muted"> × {{ article.quantite }}</span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 5 Articles -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-star text-warning me-2"></i>
              Top 5 Articles vendus
            </h6>
            <p class="text-xs text-muted mb-0">Articles les plus vendus</p>
          </div>
          <div class="card-body p-3">
            <div v-if="topArticles.length === 0" class="text-center py-4">
              <i class="fas fa-box-open fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted">Aucun article vendu</p>
            </div>
            <ul v-else class="list-group">
              <li 
                v-for="(article, index) in topArticles" 
                :key="index"
                class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2"
              >
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm me-3 bg-gradient-dark shadow text-center">
                    <i class="ni ni-box-2 text-white opacity-10"></i>
                  </div>
                  <div>
                    <h6 class="mb-1 text-dark text-sm">{{ article.libelle }}</h6>
                    <span class="text-xs">{{ article.quantite }} unités vendues</span>
                  </div>
                </div>
                <div class="d-flex flex-column align-items-end">
                  <span class="badge bg-gradient-warning mb-1">#{{ index + 1 }}</span>
                  <span class="text-xs text-success font-weight-bold">
                    {{ article.montant.toLocaleString('fr-CD') }} FC
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { MiniStatisticsCard, GradientLineChart, TimelineList, TimelineItem } from '@/examples';
import { ArgonAvatar, ArgonBadge, ArgonButton } from '@/components';
import api from '@/services/api.service';
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const router = useRouter();
const userStore = useUserStore();
const societeId = computed(() => userStore.societeId);
const isLoading = ref(false);

// Statistiques
const stats = ref({
  articles: 0,
  clients: 0,
  employees: 0,
  stocks: 0,
  commandes: 0,
  ventesTotales: 0,        // 🆕 Nombre total de ventes
  revenue: 0,              // CA du mois
  beneficeNet: 0,          // 🆕 Bénéfice net
  margeBrute: 0,           // 🆕 Marge brute
  tasks: 0,
  growth: 0,
  ventesJour: 0,           // Ventes aujourd'hui
  commandesEnCours: 0
});

// Top articles vendus
const topArticles = ref([]);

// Ventes du jour (détails)
const ventesJourDetails = ref([]);

// Données du graphique
const chartData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [{
    label: 'Ventes',
    data: [0, 0, 0, 0, 0, 0]
  }]
});

// Activités récentes
const recentActivities = ref([]);

// Employés
const employees = ref([]);

// Charger les données du dashboard
const loadDashboardData = async () => {
  isLoading.value = true;
  
  try {
  console.log('═══════════════════════════════════════════════════════');
    console.log('📊 DASHBOARD GESTIONNAIRE - Chargement dynamique');
    console.log(`🏢 Société: ${userStore.societeName} (ID: ${societeId.value})`);
  console.log(`👤 Utilisateur: ${userStore.userName}`);
  console.log('═══════════════════════════════════════════════════════');
  
  if (!societeId.value) {
    console.error('❌ ERREUR: Aucune société associée au gestionnaire !');
    return;
  }
  
    // Charger les données en parallèle avec VUES OPTIMISÉES
    await Promise.all([
      loadArticles(),
      loadClients(),
      loadUtilisateurs(),
      loadStatsVentes(),      // 🆕 Utilise V_JournalVenteParSite
      loadStocks(),
      loadTopArticles()       // 🆕 Articles les plus vendus
    ]);
    
    // Charger le rapport financier (CA, bénéfice)
    await loadRapportFinancier();
    
    // Charger les activités récentes
    await loadActivites();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DASHBOARD GESTIONNAIRE CHARGÉ - RÉSUMÉ:');
    console.log(`   📦 Articles: ${stats.value.articles}`);
    console.log(`   👥 Clients: ${stats.value.clients}`);
    console.log(`   👤 Employés: ${stats.value.employees}`);
    console.log(`   📊 Stocks: ${stats.value.stocks}`);
    console.log(`   🛒 Ventes totales (année): ${stats.value.ventesTotales}`);
    console.log(`   🛒 Ventes du jour: ${stats.value.ventesJour}`);
    console.log(`   💰 CA du mois: ${stats.value.revenue.toLocaleString('fr-CD')} FC`);
    console.log(`   💎 Bénéfice net: ${stats.value.beneficeNet.toLocaleString('fr-CD')} FC`);
    console.log('═══════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Erreur chargement dashboard:', error);
  } finally {
    isLoading.value = false;
  }
};

// Charger les articles de la société
const loadArticles = async () => {
  try {
    const articlesData = await api.getArticlesBySociete(societeId.value);
    stats.value.articles = (Array.isArray(articlesData) ? articlesData : []).length;
    console.log(`📦 ${stats.value.articles} article(s) de votre société`);
  } catch (e) {
    console.warn('Erreur articles:', e);
    // Fallback: charger tous et filtrer
    try {
      const allArticles = await api.getArticles();
      const articlesFiltres = (Array.isArray(allArticles) ? allArticles : []).filter(art => 
        art.idSociete === societeId.value || art.idSociete === parseInt(societeId.value)
      );
      stats.value.articles = articlesFiltres.length;
      console.log(`📦 ${stats.value.articles} article(s) (fallback)`);
    } catch (err) {
      console.warn('Erreur fallback articles:', err);
    }
  }
};

// Charger les clients de la société
const loadClients = async () => {
  try {
    console.log(`👥 CHARGEMENT CLIENTS - Société #${societeId.value}`);
    
    // Utiliser l'API optimisée V_ClientsParSite (filtrée par société)
    const clientsVue = await api.getClientsParSiteBySociete(societeId.value);
    console.log(`   ✅ Vue clients retourne: ${Array.isArray(clientsVue) ? clientsVue.length : 0} clients`);
    
    stats.value.clients = Array.isArray(clientsVue) ? clientsVue.length : 0;
    
  } catch (e) {
    console.error('❌ Erreur clients (vue):', e);
    
    // Fallback : charger tous et filtrer
    try {
      const allClients = await api.getClients();
      console.log(`   📋 Fallback - Total BDD: ${Array.isArray(allClients) ? allClients.length : 0} clients`);
      
    const clientsSociete = (Array.isArray(allClients) ? allClients : []).filter(client => {
        return String(client.idSociete) === String(societeId.value);
    });
    
    stats.value.clients = clientsSociete.length;
    console.log(`   ✅ Filtrés pour société #${societeId.value}: ${stats.value.clients} clients`);
    } catch (err) {
      console.error('❌ Erreur fallback clients:', err);
    }
  }
};

// Charger les utilisateurs (⚡ OPTIMISÉ avec API V_Utilisateur)
const loadUtilisateurs = async () => {
  try {
    // Utiliser l'API optimisée V_Utilisateur (déjà filtrés par société !)
    const usersFiltres = await api.getUtilisateursVueBySociete(societeId.value);
    
    stats.value.employees = (Array.isArray(usersFiltres) ? usersFiltres : []).length;
    console.log(`👥 ${stats.value.employees} employés (API optimisée)`);
    
    // Top 5 employés pour le tableau
    employees.value = (Array.isArray(usersFiltres) ? usersFiltres : [])
      .slice(0, 5)
      .map(user => ({
        id: user.idUtilisateur,
        name: user.nomComplet || `${user.nomUtilisateur || ''} ${user.prenomUtilisateur || ''}`.trim(),
        email: user.email || 'N/A',
        role: user.role || 'Utilisateur',
        status: user.statut ? 'Actif' : 'Inactif',
        statusColor: user.statut ? 'success' : 'secondary',
      lastLogin: user.isConnected ? 'En ligne' : 'Hors ligne',
      avatar: user.photo || plateformeLogo
    }));
    
    console.log(`👤 ${stats.value.employees} employés`);
  } catch (e) {
    console.warn('Erreur utilisateurs:', e);
  }
};

// Note: loadCommandes() est remplacée par loadStatsVentes() et loadRapportFinancier()
// Ces nouvelles fonctions utilisent les vues optimisées V_JournalVenteParSite

// Charger les stocks de la société
const loadStocks = async () => {
  try {
    console.log(`📦 CHARGEMENT STOCKS - Société #${societeId.value}`);
    
    // Utiliser la vue optimisée V_StockArticleSite
    const stocksVue = await api.getStocksVueBySociete(societeId.value);
    console.log(`   ✅ Vue stocks retourne: ${Array.isArray(stocksVue) ? stocksVue.length : 0} articles en stock`);
    
    stats.value.stocks = Array.isArray(stocksVue) ? stocksVue.length : 0;
  } catch (e) {
    console.error('❌ Erreur stocks:', e);
    // Fallback sur l'API classique
    try {
      const stocksSociete = await api.getStocksBySociete(societeId.value);
      stats.value.stocks = Array.isArray(stocksSociete) ? stocksSociete.length : 0;
      console.log(`   ✅ Fallback stocks: ${stats.value.stocks}`);
    } catch (err) {
      console.warn('❌ Erreur fallback stocks:', err);
    }
  }
};

// 🆕 Charger les statistiques de ventes (V_JournalVenteParSite)
const loadStatsVentes = async () => {
  try {
    console.log(`📊 CHARGEMENT STATS VENTES - TOUTE LA SOCIÉTÉ #${societeId.value}`);
    console.log(`   🔓 Tous sites, tous caissiers, gestionnaires inclus`);
    
    const aujourdhui = new Date().toISOString().split('T')[0];
    let statsJourAPI = null;
    let ventesJourDepuisAPI = 0;
    let detailsJourDepuisAPI = [];

    const parseIntSafe = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const parseFloatSafe = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const cleaned = typeof value === 'string' ? value.replace(',', '.') : value;
      const parsed = parseFloat(cleaned);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const normaliserArticles = (articlesSource, fallbackLibelle) => {
      if (!Array.isArray(articlesSource) || articlesSource.length === 0) {
        return [{
          libelle: fallbackLibelle || 'Article',
          quantite: 1
        }];
      }

      return articlesSource.map((article) => ({
        libelle: article?.libelle ?? article?.nomArticle ?? article?.designation ?? article?.article ?? fallbackLibelle ?? 'Article',
        quantite: article?.quantite ?? article?.qte ?? article?.qty ?? article?.Quantite ?? 1
      }));
    };

    const normaliserCommande = (commande, index) => {
      if (!commande) return null;

      const idCommande =
        commande.idCommande ??
        commande.commandeId ??
        commande.id ??
        commande.Id ??
        `CMD-${Date.now()}-${index}`;

      const dateCreation =
        commande.dateCreation ??
        commande.dateCommande ??
        commande.dateVente ??
        commande.date ??
        commande.createdAt ??
        new Date().toISOString();

      const montantTotal = parseFloatSafe(
        commande.montantTotal ??
        commande.total ??
        commande.ca ??
        commande.montant ??
        commande.totalCommande ??
        0
      );

      const articles = normaliserArticles(
        commande.articles ?? commande.details ?? commande.lignes ?? commande.items,
        commande.libelle ?? commande.article ?? commande.nomArticle ?? commande.designation
      );

      const nombreArticles =
        parseIntSafe(
          commande.nombreArticles ??
          commande.nbArticles ??
          commande.quantiteTotale ??
          commande.totalArticles ??
          commande.quantite ??
          commande.nb_articles
        ) || articles.length;

      return {
        idCommande,
        dateCreation,
        montantTotal,
        nombreArticles,
        nomSite: commande.nomSite ?? commande.site ?? commande.siteName ?? commande.nom_site ?? '-',
        articles
      };
    };

    try {
      statsJourAPI = await api.getJournalVenteStatsDate(aujourdhui, {
        idSociete: societeId.value
      });
      console.log('   📊 Stats du jour (API dédiée):', statsJourAPI);

      if (statsJourAPI) {
        ventesJourDepuisAPI = parseIntSafe(
          statsJourAPI.ventes ??
          statsJourAPI.nombreVentes ??
          statsJourAPI.totalVentes ??
          statsJourAPI.commandes ??
          statsJourAPI.nombreCommandes ??
          statsJourAPI.nbVentes ??
          statsJourAPI.count ??
          0
        );

        const detailsPotentiels = statsJourAPI.details ??
          statsJourAPI.commandes ??
          statsJourAPI.ventes ??
          statsJourAPI.lignes ??
          statsJourAPI.items ??
          [];

        if (Array.isArray(detailsPotentiels) && detailsPotentiels.length > 0) {
          detailsJourDepuisAPI = detailsPotentiels
            .map((commande, index) => normaliserCommande(commande, index))
            .filter(Boolean);
        }
      }
    } catch (statsErr) {
      console.warn('   ⚠️ Impossible de récupérer les stats du jour dédiées:', statsErr);
    }
    
    // 🔄 Charger TOUTES les ventes de la société (TOUS SITES, TOUS UTILISATEURS)
    const ventesData = await api.getJournalVentePaged({
      page: 1,
      pageSize: 9999,
      idSociete: societeId.value,
      // ⚠️ NE PAS filtrer par idSite ou idUtilisateur ici !
      dateDebut: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0] // Début de l'année
    });
    
    let toutesVentes = ventesData?.data || ventesData || [];
    console.log(`   📦 ${toutesVentes.length} lignes de ventes chargées (TOUTE la base de données)`);
    
    // 🛡️ FILTRAGE PAR SOCIÉTÉ (sécurité frontend)
    const ventesAvantFiltrage = toutesVentes.length;
    toutesVentes = toutesVentes.filter(vente => {
      const idSocieteVente = parseInt(vente.idSociete || vente.IdSociete);
      const idSocieteCible = parseInt(societeId.value);
      return idSocieteVente === idSocieteCible;
    });
    
    if (ventesAvantFiltrage > toutesVentes.length) {
      console.warn(`   🔒 ${ventesAvantFiltrage - toutesVentes.length} ventes d'autres sociétés filtrées`);
    }
    console.log(`   ✅ ${toutesVentes.length} ventes pour société #${societeId.value}`);
    
    if (toutesVentes.length > 0) {
      console.log(`   🔍 Exemple première vente:`, toutesVentes[0]);

      const normaliserDateVente = (vente) => {
        const candidats = [
          vente.dateCreation,
          vente.dateCommande,
          vente.dateVente,
          vente.date,
          vente.createdAt,
          vente.DateCreation,
          vente.DateCommande
        ];

        for (const valeur of candidats) {
          if (!valeur) continue;
          const dateStr = String(valeur);
          if (dateStr.includes('T')) {
            return dateStr.split('T')[0];
          }
          if (dateStr.includes(' ')) {
            return dateStr.split(' ')[0];
          }
          if (dateStr.length >= 10) {
            return dateStr.slice(0, 10);
          }
        }
        return null;
      };

      const extraireIdCommande = (vente, index) => (
        vente.idCommande ??
        vente.commandeId ??
        vente.id ??
        vente.Id ??
        `CMD-${Date.now()}-${index}`
      );

      // Calculer le nombre de commandes uniques
      const commandesUniques = new Set(
        toutesVentes.map((v, index) => extraireIdCommande(v, index))
      );
      stats.value.ventesTotales = commandesUniques.size;
      
      // Ventes du jour (TOUTE la société)
      const ventesJour = toutesVentes.filter(v => {
        const dateVente = normaliserDateVente(v);
        return dateVente === aujourdhui;
      });
      
      console.log(`   📅 Ventes filtrées pour aujourd'hui (${aujourdhui}): ${ventesJour.length} lignes`);
      
      const commandesJour = new Set(
        ventesJour.map((v, index) => extraireIdCommande(v, index))
      );
      stats.value.ventesJour = commandesJour.size;
      
      console.log(`   🛒 Commandes uniques du jour: ${stats.value.ventesJour}`);
      console.log(`   📋 IDs commandes du jour:`, Array.from(commandesJour));
      
      // Grouper les ventes du jour par commande pour l'affichage
      const ventesJourParCommande = {};
      ventesJour.forEach(vente => {
        const idCmd = vente.idCommande;
        if (!ventesJourParCommande[idCmd]) {
          ventesJourParCommande[idCmd] = {
            idCommande: idCmd,
            dateCreation: normaliserDateVente(vente),
            montantTotal: 0,
            nombreArticles: 0,
            nomSite: vente.nomSite || vente.site || vente.siteName || '-',
            articles: [] // 🆕 Liste des articles
          };
        }
        ventesJourParCommande[idCmd].montantTotal += parseFloatSafe(
          vente.total ??
          vente.montantTotal ??
          vente.montant ??
          vente.ca ??
          0
        );
        ventesJourParCommande[idCmd].nombreArticles += parseIntSafe(
          vente.quantite ??
          vente.quantiteTotale ??
          vente.qte ??
          1
        );

        const articlesPourCommande = normaliserArticles(
          vente.articles ?? vente.lignes ?? vente.details ?? vente.items,
          vente.libelle ?? vente.article ?? vente.nomArticle ?? vente.designation
        );

        ventesJourParCommande[idCmd].articles.push(...articlesPourCommande);
      });
      
      ventesJourDetails.value = Object.values(ventesJourParCommande)
        .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
        .slice(0, 5);
      
      // Calculer le nombre de commandes (pour l'affichage dans stats.commandes)
      stats.value.commandes = stats.value.ventesTotales;
      
      console.log(`   ✅ Ventes totales (année): ${stats.value.ventesTotales}`);
      console.log(`   ✅ Ventes du jour: ${stats.value.ventesJour} commandes`);
      console.log(`   ✅ Détails ventes du jour: ${ventesJourDetails.value.length} commandes à afficher`);
    } else {
      ventesJourDetails.value = [];
      console.log(`   ⚠️ Aucune vente trouvée pour la société`);
    }

    // 🆕 Prioriser les stats du jour provenant de l'API dédiée si disponibles
    if (ventesJourDepuisAPI > 0) {
      console.log(`   ✅ Override ventes du jour via API dédiée: ${ventesJourDepuisAPI}`);
      stats.value.ventesJour = ventesJourDepuisAPI;
    }

    if (detailsJourDepuisAPI.length > 0) {
      console.log(`   ✅ Détails ventes du jour fournis par l'API dédiée: ${detailsJourDepuisAPI.length}`);
      ventesJourDetails.value = detailsJourDepuisAPI
        .map((detail, index) => detail || normaliserCommande(detail, index))
        .filter(Boolean)
        .slice(0, 5);
    }
    
  } catch (e) {
    console.error('❌ Erreur stats ventes:', e);
    ventesJourDetails.value = [];
  }
};

// 🆕 Charger le rapport financier (CA, marge, bénéfice)
const loadRapportFinancier = async () => {
  try {
    console.log(`💰 CHARGEMENT RAPPORT FINANCIER - Société #${societeId.value}`);
    
    // Calculer le début du mois
    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);
    const dateDebutMois = debutMois.toISOString().split('T')[0];
    const dateFinMois = new Date().toISOString().split('T')[0];
    
    console.log(`   📅 Période: ${dateDebutMois} → ${dateFinMois}`);
    
    const rapport = await api.getJournalVenteRapportFinancier({
      idSociete: societeId.value,
      dateDebut: dateDebutMois,
      dateFin: dateFinMois,
      granularite: 'day'
    });
    
    console.log(`   ✅ Rapport financier reçu:`, rapport);
    
    // Extraire les données
    if (rapport?.resume || rapport) {
      const resume = rapport.resume || rapport;
      stats.value.revenue = parseFloat(resume.caTotal || 0);
      stats.value.margeBrute = parseFloat(resume.margeBrute || 0);
      stats.value.beneficeNet = parseFloat(resume.beneficeNet || 0);
      
      console.log(`   💰 CA Total (mois): ${stats.value.revenue.toLocaleString('fr-CD')} FC`);
      console.log(`   💎 Bénéfice Net: ${stats.value.beneficeNet.toLocaleString('fr-CD')} FC`);
      
      // Calculer le taux de croissance
      if (rapport.evolution && Array.isArray(rapport.evolution) && rapport.evolution.length >= 2) {
        const dernierMontant = parseFloat(rapport.evolution[rapport.evolution.length - 1]?.montant || 0);
        const avantDernierMontant = parseFloat(rapport.evolution[rapport.evolution.length - 2]?.montant || 0);
        
        if (avantDernierMontant > 0) {
          stats.value.growth = Math.round(((dernierMontant - avantDernierMontant) / avantDernierMontant) * 100);
        }
      }
    }
    
    // Mettre à jour le graphique avec l'évolution
    if (rapport?.evolution && Array.isArray(rapport.evolution)) {
      chartData.value.labels = rapport.evolution.map(e => {
        const date = new Date(e.periode);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      });
      chartData.value.datasets[0].data = rapport.evolution.map(e => parseFloat(e.montant || 0));
      
      console.log(`   📈 Graphique mis à jour avec ${rapport.evolution.length} points`);
    }
    
  } catch (e) {
    console.error('❌ Erreur rapport financier:', e);
  }
};

// 🆕 Charger les top articles vendus
const loadTopArticles = async () => {
  try {
    console.log(`🏆 CHARGEMENT TOP ARTICLES - Société #${societeId.value}`);

    const data = await api.getJournalVenteGroupedByArticle({
      idSociete: societeId.value
    });

    console.log(`   ✅ Données reçues (type: ${typeof data}):`, data);

    let articles = [];
    if (data?.articles && Array.isArray(data.articles)) {
      articles = data.articles;
      console.log(`   ✅ Format 1: data.articles (${articles.length} articles)`);
    } else if (Array.isArray(data)) {
      articles = data;
      console.log(`   ✅ Format 2: data directement (${articles.length} articles)`);
    } else if (data?.data && Array.isArray(data.data)) {
      articles = data.data;
      console.log(`   ✅ Format 3: data.data (${articles.length} articles)`);
    }

    if (articles.length === 0) {
      console.log(`   ⚠️ Endpoint ne retourne pas de données, calcul manuel à partir des ventes...`);

      const baseParams = {
        page: 1,
        pageSize: 9999,
        idSociete: societeId.value,
        dateDebut: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
      };

      const ventesData = await api.getJournalVentePaged(baseParams);
      let ventes = ventesData?.data || ventesData || [];
      const totalCount = parseInt(ventesData?.totalCount || ventesData?.pagination?.totalCount || ventes?.length || 0, 10);

      if ((!ventes || ventes.length === 0) && totalCount > 0 && totalCount !== 2147483648) {
        console.warn(`   ⚠️ Requête ventes vide mais totalCount=${totalCount}, nouvelle tentative avec pageSize totalCount`);
        const retryParams = { ...baseParams, pageSize: Math.max(1, totalCount) };
        const retryData = await api.getJournalVentePaged(retryParams);
        ventes = retryData?.data || retryData || [];
        console.log(`   🔄 Résultat tentative 2: ${ventes.length} ventes`);
      }

      console.log(`   📦 ${ventes.length} ventes reçues de l'API (fallback)`);
      if (ventes.length > 0) {
        console.log(`   🔍 Première vente fallback:`, ventes[0]);
      }

      const ventesAvantFiltrage = ventes.length;
      ventes = ventes.filter(vente => {
        const idSocieteVente = Number(vente.idSociete || vente.IdSociete);
        const idSocieteCible = Number(societeId.value);
        const appartientASociete = idSocieteVente === idSocieteCible;

        if (!appartientASociete && vente.idSociete !== undefined) {
          console.log(`   ⚠️ Vente rejetée: société #${idSocieteVente} ≠ société #${idSocieteCible}`);
        }

        return appartientASociete;
      });

      const ventesRejetes = ventesAvantFiltrage - ventes.length;
      if (ventesRejetes > 0) {
        console.warn(`   🔒 ${ventesRejetes} ventes d'autres sociétés rejetées`);
      }
      console.log(`   ✅ ${ventes.length} ventes filtrées pour société #${societeId.value}`);

      if (ventes.length > 0) {
        const articlesMap = {};
        ventes.forEach(vente => {
          const articleLibelle =
            vente.libelle ||
            vente.Libelle ||
            vente.libelleArticle ||
            vente.LibelleArticle ||
            vente.articleLibelle ||
            vente.article ||
            `Article #${vente.idArticle || vente.ArticleId || '?'}`;

          const articleId = vente.idArticle || vente.ArticleId || articleLibelle;
          const key = `${articleId}-${articleLibelle}`;

          if (!articlesMap[key]) {
            articlesMap[key] = {
              libelle: articleLibelle,
              quantite: 0,
              montant: 0,
              ventes: 0
            };
          }

          articlesMap[key].quantite += parseFloat(vente.quantite || vente.Quantite || 0);
          articlesMap[key].montant += parseFloat(vente.total || vente.Total || vente.montant || 0);
          articlesMap[key].ventes++;
        });

        topArticles.value = Object.values(articlesMap)
          .filter(article => article.montant > 0 || article.quantite > 0 || article.ventes > 0)
          .sort((a, b) => b.montant - a.montant)
          .slice(0, 5);

        console.log(`   ✅ Top ${topArticles.value.length} articles calculés (fallback):`, topArticles.value);
      } else {
        topArticles.value = [];
      }

      return;
    }

    console.log(`   🔍 Premier article:`, articles[0]);
    console.log(`   🔍 Propriétés:`, Object.keys(articles[0]));

    topArticles.value = articles
      .sort((a, b) => {
        const montantA = parseFloat(a.montantTotal || a.MontantTotal || a.total || 0);
        const montantB = parseFloat(b.montantTotal || b.MontantTotal || b.total || 0);
        return montantB - montantA;
      })
      .slice(0, 5)
      .map(article => ({
        libelle: article.libelleArticle || article.LibelleArticle || article.libelle || article.article || `Article #${article.idArticle || article.ArticleId || '?'}`,
        quantite: parseFloat(article.quantiteTotale || article.QuantiteTotale || article.quantite || 0),
        montant: parseFloat(article.montantTotal || article.MontantTotal || article.total || 0),
        ventes: parseInt(article.nombreVentes || article.NombreVentes || article.ventes || 0)
      }));

    console.log(`   🏆 Top ${topArticles.value.length} articles chargés:`, topArticles.value);
  } catch (e) {
    console.error('❌ Erreur top articles:', e);
    topArticles.value = [];
  }
};

// Charger les activités récentes de la société
const loadActivites = async () => {
  try {
    console.log(`📋 CHARGEMENT ACTIVITÉS - Société #${societeId.value}`);
    
    // Charger les dernières ventes de la société (7 derniers jours)
    const il7Jours = new Date();
    il7Jours.setDate(il7Jours.getDate() - 7);
    const dateDebut7Jours = il7Jours.toISOString().split('T')[0];
    const aujourdhui = new Date().toISOString().split('T')[0];
    
    const baseParams = {
      page: 1,
      pageSize: 200,
      idSociete: societeId.value,
      dateDebut: dateDebut7Jours,
      dateFin: aujourdhui
    };

    const ventesData = await api.getJournalVentePaged(baseParams);
    let ventes = ventesData?.data || ventesData || [];
    const totalCount = parseInt(ventesData?.totalCount || ventesData?.pagination?.totalCount || ventes?.length || 0, 10);

    if ((!ventes || ventes.length === 0) && totalCount > 0 && totalCount !== 2147483648) {
      console.warn(`   ⚠️ Requête activités vide mais totalCount=${totalCount}, nouvelle tentative avec pageSize totalCount`);
      const retryParams = { ...baseParams, pageSize: Math.max(1, totalCount) };
      const retryData = await api.getJournalVentePaged(retryParams);
      ventes = retryData?.data || retryData || [];
      console.log(`   🔄 Résultat tentative 2 activités: ${ventes.length} ventes`);
    }

    console.log(`   📦 ${ventes.length} lignes de ventes récentes reçues de l'API`);
    if (ventes.length > 0) {
      console.log(`   🔍 Première vente récente:`, ventes[0]);
    }

    // 🛡️ FILTRAGE PAR SOCIÉTÉ (sécurité frontend)
    const ventesAvantFiltrage = ventes.length;
    ventes = ventes.filter(vente => {
      const idSocieteVente = parseInt(vente.idSociete || vente.IdSociete);
      const idSocieteCible = parseInt(societeId.value);
      return idSocieteVente === idSocieteCible;
    });
    
    if (ventesAvantFiltrage > ventes.length) {
      console.warn(`   🔒 ${ventesAvantFiltrage - ventes.length} ventes d'autres sociétés filtrées`);
    }
    console.log(`   ✅ ${ventes.length} ventes pour société #${societeId.value} (7 derniers jours)`);
    
    if (ventes.length > 0) {
      // Grouper par commande pour éviter les doublons
      const ventesParCommande = {};
      ventes.forEach(vente => {
        const idCmd = vente.idCommande;
        if (!ventesParCommande[idCmd]) {
          ventesParCommande[idCmd] = {
            idCommande: idCmd,
            dateCreation: vente.dateCreation,
            montantTotal: 0,
            nombreArticles: 0,
            nomSite: vente.nomSite,
            articles: [] // Liste des articles vendus
          };
        }
        ventesParCommande[idCmd].montantTotal += parseFloat(vente.total || 0);
        ventesParCommande[idCmd].nombreArticles++;
        
        // Ajouter l'article avec son nom
        ventesParCommande[idCmd].articles.push({
          libelle: vente.libelle || 'Article',
          quantite: parseFloat(vente.quantite || 1)
        });
      });
      
      // Prendre les 5 plus récentes
      const ventesRecentes = Object.values(ventesParCommande)
        .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
      .slice(0, 5);
    
      recentActivities.value = ventesRecentes.map(vente => {
        // Construire le titre avec les noms des articles
        let titre = '';
        if (vente.articles.length === 1) {
          // 1 seul article : afficher son nom
          titre = `${vente.articles[0].libelle} (${vente.articles[0].quantite}x)`;
        } else if (vente.articles.length === 2) {
          // 2 articles : afficher les deux
          titre = `${vente.articles[0].libelle}, ${vente.articles[1].libelle}`;
        } else {
          // 3+ articles : afficher les 2 premiers + "..."
          titre = `${vente.articles[0].libelle}, ${vente.articles[1].libelle} +${vente.articles.length - 2}`;
        }
        
        return {
          color: 'success',
      icon: {
        component: 'ni ni-cart',
        color: 'white'
      },
          title: `${titre} - ${vente.montantTotal.toLocaleString('fr-CD')} FC`,
          dateTime: formatRelativeTime(vente.dateCreation)
        };
      });
      
      console.log(`   ✅ ${recentActivities.value.length} activités affichées avec noms d'articles`);
    } else {
      console.log(`   ⚠️ Aucune activité récente`);
      recentActivities.value = [];
    }
  } catch (e) {
    console.warn('❌ Erreur activités:', e);
    recentActivities.value = [];
  }
};

// Formater le temps relatif
const formatRelativeTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} jour(s)`;
  } catch (e) {
    return '-';
  }
};

const goToDocumentation = () => {
  router.push('/documentation');
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard-gestionnaire {
  /* Styles spécifiques au dashboard gestionnaire */
}

.progress {
  height: 8px;
  border-radius: 0.5rem;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 0.5rem;
}
</style>

