<template>
  <div class="py-4">
    <!-- En-tête -->
    <div class="row">
      <div class="col-lg-12">
        <div class="card shadow-sm mb-4">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">
                  <i class="fas fa-cash-register text-primary me-2"></i>
                  Bienvenue, {{ userName }} 👋
                </h5>
                <p class="text-sm mb-0 text-muted">
                  <i class="fas fa-user-circle me-1"></i>
                  Vos performances du {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
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
                  @click="loadStats"
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

      <!-- Statistiques principales -->
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="MES VENTES (7J)"
          :value="`${stats.ventesTotal}`"
          description="ventes effectuées"
          :icon="{
            component: 'ni ni-money-coins',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="MON CA (7J)"
          :value="`${formatCurrency(stats.montantTotal)}`"
          description="chiffre d'affaires"
          :icon="{
            component: 'ni ni-world',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="ARTICLES VENDUS"
          :value="`${Math.round(stats.articlesVendus)}`"
          description="unités (7 derniers jours)"
          :icon="{
            component: 'ni ni-paper-diploma',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <mini-statistics-card
          title="PANIER MOYEN"
          :value="`${formatCurrency(stats.panierMoyen)}`"
          description="par vente (7J)"
          :icon="{
            component: 'ni ni-cart',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- Objectif du jour -->
    <div class="row mt-4">
      <div class="col-lg-12 mb-lg-0 mb-4">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">
                  <i class="fas fa-bullseye text-primary me-2"></i>
                  Ma performance (7 derniers jours)
                </h6>
                <p class="text-xs text-muted mb-0">Votre activité récente</p>
              </div>
              <span class="badge bg-gradient-primary">
                {{ stats.ventesTotal }} vente(s) réalisée(s)
              </span>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="row">
              <div class="col-lg-6">
                <div class="d-flex flex-column h-100">
                  <p class="mb-1 pt-2 text-bold">
                    Chiffre d'affaires total
                  </p>
                  <h5 class="font-weight-bolder">{{ formatCurrency(stats.montantTotal) }}</h5>
                  <div class="progress w-100 mb-2">
                    <div 
                      class="progress-bar bg-gradient-primary" 
                      role="progressbar" 
                      style="width: 100%"
                      aria-valuenow="100"
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p class="text-sm text-muted mb-0">
                    Moyenne : {{ formatCurrency(stats.panierMoyen) }} par vente
                  </p>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="bg-gradient-primary border-radius-lg p-3 text-white">
                  <h6 class="text-white mb-2">
                    <i class="fas fa-award me-2"></i>
                    Votre Performance
                  </h6>
                  <div class="row text-white">
                    <div class="col-6">
                      <p class="text-xs mb-1 opacity-8">Ventes totales</p>
                      <h5 class="text-white mb-0">{{ stats.ventesTotal }}</h5>
                    </div>
                    <div class="col-6">
                      <p class="text-xs mb-1 opacity-8">Articles</p>
                      <h5 class="text-white mb-0">{{ Math.round(stats.articlesVendus) }}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 5 articles -->
    <div class="row mt-4">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-star text-warning me-2"></i>
              Mes Top 5 articles (7 derniers jours)
            </h6>
            <p class="text-xs text-muted mb-0">Articles que vous avez le plus vendus</p>
          </div>
          <div class="card-body p-3">
            <div v-if="topArticles.length === 0" class="text-center py-4">
              <i class="fas fa-box-open fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted mb-0">Aucune vente ces 7 derniers jours</p>
              <p class="text-xs text-muted mb-0">Vos articles les plus vendus s'afficheront ici</p>
            </div>
            <ul v-else class="list-group">
              <li 
                v-for="(article, index) in topArticles" 
                :key="index"
                class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
              >
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm me-3 bg-gradient-dark shadow text-center">
                    <i class="ni ni-mobile-button text-white opacity-10"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-dark text-sm">{{ article.nom }}</h6>
                    <span class="text-xs">{{ article.quantite }} unités vendues</span>
                  </div>
                </div>
                <div class="d-flex align-items-center text-sm font-weight-bold">
                  #{{ index + 1 }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Dernières ventes -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">
              <i class="fas fa-history text-info me-2"></i>
              Mes 10 dernières ventes
            </h6>
            <p class="text-xs text-muted mb-0">Ventes récentes que vous avez effectuées</p>
          </div>
          <div class="card-body p-3">
            <div v-if="dernieresVentes.length === 0" class="text-center py-4">
              <i class="fas fa-shopping-cart fa-3x text-secondary mb-3"></i>
              <p class="text-sm text-muted mb-2">Aucune vente enregistrée</p>
              <router-link to="/vente" class="btn btn-sm btn-primary">
                <i class="fas fa-plus me-1"></i>
                Créer une vente
              </router-link>
            </div>
            <div v-else class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Client
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Articles
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Heure
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Montant
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Paiement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="vente in dernieresVentes" :key="vente.idCommande">
                    <td>
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-sm">{{ vente.clientNom }}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p class="text-xs font-weight-bold mb-0">{{ vente.nombreArticles }} article(s)</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{ new Date(vente.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{ formatCurrency(vente.montantTotal) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <span class="badge badge-sm bg-gradient-success">
                        {{ vente.modePaiement }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import * as api from '@/services/api.service';
import ArgonButton from '@/components/ArgonButton.vue';
import MiniStatisticsCard from '@/examples/Cards/MiniStatisticsCard.vue';

// State
const router = useRouter();
const userStore = useUserStore();
const isLoading = ref(false);

// Données utilisateur
const userName = computed(() => userStore.userName || 'Utilisateur');
const userId = computed(() => userStore.userId);

// Statistiques
const stats = ref({
  ventesJour: 0,
  montantJour: 0,
  ventesTotal: 0,
  montantTotal: 0,
  articlesVendus: 0,
  panierMoyen: 0
});


// Données tableau
const topArticles = ref([]);
const dernieresVentes = ref([]);

// Formater la monnaie
const formatCurrency = (value) => {
  return (value || 0).toLocaleString('fr-CD') + ' FC';
};

const goToDocumentation = () => {
  router.push('/documentation');
};

// ⚡ DASHBOARD CAISSIER - Statistiques Personnelles
const loadStats = async () => {
  isLoading.value = true;
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 DASHBOARD CAISSIER - Statistiques Personnelles');
    console.log(`👤 Caissier: ${userStore.userName} (ID: ${userStore.userId})`);
    console.log(`🏢 Société: ${userStore.societeName} (ID: ${userStore.societeId})`);
    console.log('═══════════════════════════════════════════════════════');
    
    // Date du jour au format yyyy-MM-dd
    const aujourdhui = new Date().toISOString().split('T')[0];
    
    // Calculer la date d'il y a 7 jours
    const il7Jours = new Date();
    il7Jours.setDate(il7Jours.getDate() - 7);
    const dateDebut7Jours = il7Jours.toISOString().split('T')[0];
    
    console.log(`📅 Période: ${dateDebut7Jours} → ${aujourdhui}`);
    
    // 🎯 NOUVELLE STRATÉGIE : Charger toutes les ventes et filtrer en frontend
    try {
      console.log('🔄 Chargement de toutes les ventes de la société...');
      
      // Charger toutes les ventes (sans filtrage utilisateur côté API)
      const ventesData = await api.getJournalVentePaged({
        page: 1,
        pageSize: 9999,
        idSociete: userStore.societeId,
        dateDebut: dateDebut7Jours,
        dateFin: aujourdhui
      });
      
      console.log('📋 Données brutes reçues:', ventesData);
      
      const toutesLesVentes = ventesData?.data || ventesData || [];
      console.log(`📋 Total ventes chargées: ${toutesLesVentes.length}`);
      
      // FILTRER EN FRONTEND pour ne garder que les ventes de CE caissier
      const lignesVente = toutesLesVentes.filter(ligne => {
        const idUtil = ligne.idUtilisateur || ligne.IdUtilisateur;
        return String(idUtil) === String(userStore.userId);
      });
      
      console.log(`🔒 Ventes filtrées pour caissier #${userStore.userId}: ${lignesVente.length}`);
      
      if (lignesVente.length > 0) {
        console.log('📋 Premier élément:', lignesVente[0]);
      }
      
      // Traiter les résultats (même vides)
      if (lignesVente.length === 0) {
        console.log('⚠️ Aucune vente à afficher pour ce caissier');
        stats.value = {
          ventesJour: 0,
          montantJour: 0,
          ventesTotal: 0,
          montantTotal: 0,
          articlesVendus: 0,
          panierMoyen: 0
        };
        topArticles.value = [];
        dernieresVentes.value = [];
        return;
      }
      
      // Séparer les ventes d'aujourd'hui pour les statistiques du jour
      console.log(`🔍 Date du jour recherchée: "${aujourdhui}"`);
      
      const ventesAujourdhui = lignesVente.filter(ligne => {
        const dateCreation = ligne.dateCreation || ligne.DateCreation || '';
        const dateVente = dateCreation.split('T')[0];
        
        console.log(`🔍 Vente #${ligne.idCommande}: dateCreation="${dateCreation}" → dateVente="${dateVente}" → match=${dateVente === aujourdhui}`);
        
        return dateVente === aujourdhui;
      });
      
      console.log(`📅 Ventes d'aujourd'hui (${aujourdhui}): ${ventesAujourdhui.length}`);
      console.log(`📅 Ventes des 7 derniers jours: ${lignesVente.length}`);
      
      // 1️⃣ CALCULER LES STATISTIQUES DU JOUR
      const commandesAujourdhui = new Set(ventesAujourdhui.map(l => l.idCommande || l.IdCommande));
      const nombreVentesJour = commandesAujourdhui.size;
      
      let montantJour = 0;
      let quantiteJour = 0;
      
      ventesAujourdhui.forEach(ligne => {
        const total = parseFloat(ligne.total || ligne.Total || ligne.montantTotal || 0);
        const qte = parseFloat(ligne.quantite || ligne.Quantite || ligne.quantiteTotale || 1);
        
        montantJour += total;
        quantiteJour += qte;
      });
      
      // 2️⃣ CALCULER LES STATISTIQUES DES 7 DERNIERS JOURS
      const commandesTotal = new Set(lignesVente.map(l => l.idCommande || l.IdCommande));
      const nombreVentesTotal = commandesTotal.size;
      
      let montantTotal = 0;
      let quantiteTotal = 0;
      
      lignesVente.forEach(ligne => {
        const total = parseFloat(ligne.total || ligne.Total || ligne.montantTotal || 0);
        const qte = parseFloat(ligne.quantite || ligne.Quantite || ligne.quantiteTotale || 1);
        
        montantTotal += total;
        quantiteTotal += qte;
      });
      
      stats.value = {
        ventesJour: nombreVentesJour,
        montantJour: montantJour,
        ventesTotal: nombreVentesTotal,
        montantTotal: montantTotal,
        articlesVendus: quantiteTotal,
        panierMoyen: nombreVentesTotal > 0 ? montantTotal / nombreVentesTotal : 0
      };
      
      console.log('✅ Stats calculées:', {
        jour: { ventes: stats.value.ventesJour, montant: stats.value.montantJour },
        total7j: { ventes: stats.value.ventesTotal, montant: stats.value.montantTotal, articles: stats.value.articlesVendus },
        panier: stats.value.panierMoyen
      });
      
      // 2️⃣ CALCULER LE TOP 5 DES ARTICLES (sur les 7 derniers jours)
      const articlesMap = {};
      lignesVente.forEach(ligne => {
        const libelle = ligne.libelle || ligne.Libelle || ligne.libelleArticle || ligne.LibelleArticle || 'Article';
        const qte = parseFloat(ligne.quantite || ligne.Quantite || ligne.quantiteTotale || 1);
        
        if (!articlesMap[libelle]) {
          articlesMap[libelle] = { nom: libelle, quantite: 0 };
        }
        articlesMap[libelle].quantite += qte;
      });
      
      topArticles.value = Object.values(articlesMap)
        .sort((a, b) => b.quantite - a.quantite)
        .slice(0, 5);
      
      console.log(`⭐ Top 5 articles (7 derniers jours):`, topArticles.value);
      
      // 3️⃣ GROUPER LES DERNIÈRES VENTES PAR COMMANDE (10 dernières)
      const ventesGroupees = {};
      lignesVente.forEach(ligne => {
        const idCmd = ligne.idCommande || ligne.IdCommande;
        if (!ventesGroupees[idCmd]) {
          ventesGroupees[idCmd] = {
            idCommande: idCmd,
            dateCreation: ligne.dateCreation || ligne.DateCreation,
            clientNom: 'Client',
            nombreArticles: 0,
            montantTotal: 0,
            modePaiement: 'ESPÈCES'
          };
        }
        ventesGroupees[idCmd].nombreArticles++;
        ventesGroupees[idCmd].montantTotal += parseFloat(ligne.total || ligne.Total || 0);
      });
      
      console.log(`📦 ${Object.keys(ventesGroupees).length} commandes groupées`);
      
      // 4️⃣ ENRICHIR AVEC LES NOMS DE CLIENTS
      try {
        const allClients = await api.getClientsParSiteBySociete(userStore.societeId);
        const allCommandes = await api.getCommandes();
        
        const clientsMap = {};
        (Array.isArray(allClients) ? allClients : []).forEach(client => {
          const idClient = client.idClient || client.IdClient;
          clientsMap[idClient] = client.nomComplet || `${client.prenom || ''} ${client.nom || ''}`.trim();
        });
        
        const commandesMap = {};
        (Array.isArray(allCommandes) ? allCommandes : []).forEach(cmd => {
          const idCmd = cmd.idCommande || cmd.IdCommande;
          commandesMap[idCmd] = cmd;
        });
        
        Object.values(ventesGroupees).forEach(vente => {
          const commande = commandesMap[vente.idCommande];
          if (commande) {
            const idClient = commande.idClient || commande.IdClient;
            if (idClient && clientsMap[idClient]) {
              vente.clientNom = clientsMap[idClient];
            }
          }
        });
        
        console.log('✅ Noms de clients enrichis');
      } catch (e) {
        console.warn('⚠️ Erreur enrichissement clients:', e);
      }
      
      dernieresVentes.value = Object.values(ventesGroupees)
        .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
        .slice(0, 10);
      
      console.log(`🕐 ${dernieresVentes.value.length} dernières ventes préparées`);
      
    } catch (e) {
      console.error('❌ Erreur chargement données:', e);
      console.error('❌ Détails:', e.response?.data || e.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur chargement statistiques:', error);
  } finally {
    isLoading.value = false;
    console.log('═══════════════════════════════════════════════════════');
  }
};

// Rafraîchir automatiquement toutes les 2 minutes
let refreshInterval = null;

onMounted(() => {
  loadStats();
  
  // Auto-refresh toutes les 2 minutes
  refreshInterval = setInterval(loadStats, 120000);
});

// Nettoyer l'interval au démontage
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.progress {
  height: 6px;
}

.table th {
  padding: 0.5rem 0.75rem;
}

.table td {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}
</style>
