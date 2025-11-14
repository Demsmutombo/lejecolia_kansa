<template>
  <div class="dashboard-admin">
    <!-- En-tête superadmin -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="alert alert-info d-flex align-items-center">
          <i class="ni ni-badge me-3 text-lg"></i>
          <div>
            <strong>Mode Super Administrateur</strong>
            <p class="mb-0 text-sm">Vous gérez toutes les sociétés</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sélecteur de société -->
    <div class="row mb-4" v-if="userStore.hasMultipleSocietes">
      <div class="col-md-6">
        <label class="form-label">Société active :</label>
        <select 
          class="form-select" 
          :value="userStore.societeId"
          @change="changeSociete"
        >
          <option 
            v-for="societe in userStore.userSocietes" 
            :key="societe.id"
            :value="societe.id"
          >
            {{ societe.name || societe.nom }}
          </option>
        </select>
      </div>
    </div>

    <!-- Statistiques superadmin -->
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="Sociétés"
          :value="stats.totalSocietes"
          description="<span class='text-success text-sm font-weight-bolder'>Total</span> de sociétés"
          :icon="{
            component: 'ni ni-building',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="Articles"
          :value="stats.totalArticles"
          description="<span class='text-info text-sm font-weight-bolder'>Tous</span> les articles"
          :icon="{
            component: 'ni ni-box-2',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="Utilisateurs"
          :value="stats.totalUsers"
          description="<span class='text-success text-sm font-weight-bolder'>Tous</span> les utilisateurs"
          :icon="{
            component: 'ni ni-circle-08',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <mini-statistics-card
          title="Revenus"
          :value="stats.totalRevenue.toLocaleString('fr-CD') + ' FC'"
          description="<span class='text-danger text-sm font-weight-bolder'>+12%</span> ce mois"
          :icon="{
            component: 'ni ni-money-coins',
            background: 'bg-gradient-danger',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- Barres de progression par module -->
    <div class="row mt-4">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0"><i class="fas fa-chart-bar me-2 text-primary"></i>Vue d'Ensemble - Tous les Modules</h6>
          </div>
          <div class="card-body p-3">
            <!-- Sociétés -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <div>
                  <span class="text-sm font-weight-bold">🏢 Sociétés</span>
                  <p class="text-xs text-muted mb-0">Sociétés enregistrées</p>
                </div>
                <span class="text-sm font-weight-bold text-primary">{{ stats.totalSocietes }}</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar bg-gradient-primary" 
                  role="progressbar" 
                  :style="{ width: Math.min((stats.totalSocietes / 20) * 100, 100) + '%' }"
                >
                </div>
              </div>
              <small class="text-xs text-muted">Capacité: 20 sociétés max</small>
            </div>

            <!-- Articles -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <div>
                  <span class="text-sm font-weight-bold">📦 Articles</span>
                  <p class="text-xs text-muted mb-0">Articles de toutes les sociétés</p>
                </div>
                <span class="text-sm font-weight-bold text-info">{{ stats.totalArticles }}</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar bg-gradient-info" 
                  role="progressbar" 
                  :style="{ width: Math.min((stats.totalArticles / 500) * 100, 100) + '%' }"
                >
                </div>
              </div>
              <small class="text-xs text-muted">Catalogue: {{ stats.totalArticles }} / 500 articles</small>
            </div>

            <!-- Utilisateurs -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <div>
                  <span class="text-sm font-weight-bold">👥 Utilisateurs</span>
                  <p class="text-xs text-muted mb-0">Gestionnaires et employés</p>
                </div>
                <span class="text-sm font-weight-bold text-success">{{ stats.totalUsers }}</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar bg-gradient-success" 
                  role="progressbar" 
                  :style="{ width: Math.min((stats.totalUsers / 500) * 100, 100) + '%' }"
                >
                </div>
              </div>
              <small class="text-xs text-muted">Licences: {{ stats.totalUsers }} / 500 utilisateurs</small>
            </div>

            <!-- Clients -->
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <div>
                  <span class="text-sm font-weight-bold">👤 Clients</span>
                  <p class="text-xs text-muted mb-0">Clients de toutes les sociétés</p>
                </div>
                <span class="text-sm font-weight-bold text-warning">{{ stats.totalClients }}</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar bg-gradient-warning" 
                  role="progressbar" 
                  :style="{ width: Math.min((stats.totalClients / 1000) * 100, 100) + '%' }"
                >
                </div>
              </div>
              <small class="text-xs text-muted">Base: {{ stats.totalClients }} clients</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et tableau pour superadmin -->
    <div class="row mt-4">
      <div class="col-lg-7 mb-lg-0 mb-4">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">📈 Performance Globale</h6>
          </div>
          <div class="card-body p-3">
            <gradient-line-chart
              id="admin-chart"
              title="Évolution des ventes"
              :description="`<i class='fa fa-arrow-up text-success'></i> <span class='font-weight-bold'>${stats.growth}%</span> de croissance`"
              :chart="chartData"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">🏢 Sociétés Actives</h6>
          </div>
          <div class="card-body p-3">
            <ul class="list-group">
              <li 
                v-for="societe in recentSocietes" 
                :key="societe.id"
                class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
              >
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm me-3 bg-gradient-dark shadow text-center">
                    <i class="ni ni-building text-white opacity-10"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-dark text-sm">{{ societe.nomSociete }}</h6>
                    <span class="text-xs">{{ societe.nombreSites || 0 }} sites</span>
                  </div>
                </div>
                <div class="d-flex">
                  <router-link 
                    :to="`/societes/${societe.idSociete}`"
                    class="btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right my-auto"
                  >
                    <i class="ni ni-bold-right" aria-hidden="true"></i>
                  </router-link>
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
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { MiniStatisticsCard, GradientLineChart } from '@/examples';
import api from '@/services/api.service';

const userStore = useUserStore();

// Statistiques
const stats = ref({
  totalSocietes: 0,
  totalArticles: 0,
  totalUsers: 0,
  totalClients: 0,
  totalRevenue: 0,
  alerts: 0,
  growth: 0
});

// Données du graphique
const chartData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [{
    label: 'Revenus globaux',
    data: [50000, 52000, 48000, 55000, 60000, 65000]
  }]
});

// Sociétés récentes
const recentSocietes = ref([]);

// Changer de société
const changeSociete = (event) => {
  const newSocieteId = event.target.value;
  const societe = userStore.userSocietes.find(s => s.id == newSocieteId);
  if (societe) {
    userStore.changeSociete(newSocieteId, societe.name || societe.nom);
    // Recharger les données pour la nouvelle société
    loadDashboardData();
  }
};

// Charger les données du dashboard
const loadDashboardData = async () => {
  console.log('📊 Chargement dashboard SuperAdmin...');
  
  try {
    // Charger les données en parallèle
    const [societes, articles, utilisateurs, clients, sites] = await Promise.all([
      api.getSocietes(),
      api.getArticles(),
      api.getUsers(),
      api.getClients(),
      api.getSites()
    ]);
    
    // Compter les sociétés
    stats.value.totalSocietes = Array.isArray(societes) ? societes.length : 0;
    console.log(`🏢 ${stats.value.totalSocietes} société(s)`);
    
    // Compter les articles
    stats.value.totalArticles = Array.isArray(articles) ? articles.length : 0;
    console.log(`📦 ${stats.value.totalArticles} article(s)`);
    
    // Compter les utilisateurs
    stats.value.totalUsers = Array.isArray(utilisateurs) ? utilisateurs.length : 0;
    console.log(`👥 ${stats.value.totalUsers} utilisateur(s)`);
    
    // Compter les clients
    stats.value.totalClients = Array.isArray(clients) ? clients.length : 0;
    console.log(`👤 ${stats.value.totalClients} client(s)`);
    
    // Sociétés récentes (dernières 5)
    if (Array.isArray(societes) && societes.length > 0) {
      // Compter les sites par société
      const sitesParSociete = {};
      (Array.isArray(sites) ? sites : []).forEach(site => {
        if (!sitesParSociete[site.idSociete]) {
          sitesParSociete[site.idSociete] = 0;
        }
        sitesParSociete[site.idSociete]++;
      });
      
      recentSocietes.value = societes
        .slice(0, 5)
        .map(soc => ({
          idSociete: soc.idSociete,
          nomSociete: soc.nomSociete || soc.nom || 'Société',
          nombreSites: sitesParSociete[soc.idSociete] || 0
        }));
      
      console.log(`🏢 ${recentSocietes.value.length} sociétés dans la liste`);
    }
    
    console.log('✅ Dashboard SuperAdmin chargé');
    
  } catch (error) {
    console.error('❌ Erreur chargement dashboard:', error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard-admin {
  /* Styles spécifiques au dashboard admin */
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

