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
        <router-link to="/commandes">
          <argon-button color="secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Retour
          </argon-button>
        </router-link>
      </div>
    </div>

    <!-- Contenu -->
    <div v-else-if="commande" class="row">
      <!-- Header Commande -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="mb-1">Commande #{{ commande.idCommande }}</h3>
                <p class="text-sm text-secondary mb-2">
                  <span :class="statutBadgeClass">
                    {{ commande.statut }}
                  </span>
                </p>
                <p class="text-sm mb-0">
                  <i class="fas fa-calendar me-2"></i>
                  {{ formatDate(commande.dateCommande) }}
                </p>
              </div>
              <div>
                <router-link to="/commandes">
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

      <!-- Informations Commande -->
      <div class="col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-info-circle me-2 text-primary"></i>Informations</h6>
          </div>
          <div class="card-body">
            <div class="info-group">
              <label class="info-label">Client</label>
              <p class="info-value">{{ commande.clientNom || `Client #${commande.idClient}` }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Vendeur</label>
              <p class="info-value">{{ commande.utilisateurNom || `Vendeur #${commande.idUtilisateur}` }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Date</label>
              <p class="info-value">{{ formatDate(commande.dateCommande) }}</p>
            </div>
            <div class="info-group">
              <label class="info-label">Statut</label>
              <p class="info-value">
                <span :class="statutBadgeClass">
                  {{ commande.statut }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lignes de Commande (Articles) -->
      <div class="col-lg-8 mb-4">
        <div class="card h-100">
          <div class="card-header pb-0">
            <h6><i class="fas fa-shopping-cart me-2 text-success"></i>Articles Commandés</h6>
          </div>
          <div class="card-body">
            <div v-if="isLoadingLignes" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"></div>
              <p class="text-sm mt-2">Chargement des articles...</p>
            </div>
            
            <div v-else-if="lignes.length === 0" class="text-center py-3">
              <p class="text-secondary">Aucun article dans cette commande</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Article</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">Qté</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-end">P.U.</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">TVA</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center">Remise</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ligne in lignes" :key="ligne.idLigneCommande">
                    <td>
                      <p class="text-sm font-weight-bold mb-0">{{ ligne.articleNom || 'Article' }}</p>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-gradient-info">{{ parseFloat(ligne.quantite) }}</span>
                    </td>
                    <td class="text-end">
                      <p class="text-sm mb-0">{{ formatCurrency(ligne.prixUnitaire) }}</p>
                    </td>
                    <td class="text-center">
                      <p class="text-xs text-secondary mb-0">{{ parseFloat(ligne.tva) }}%</p>
                    </td>
                    <td class="text-center">
                      <p class="text-xs text-secondary mb-0">{{ parseFloat(ligne.remise) }}%</p>
                    </td>
                    <td class="text-end">
                      <p class="text-sm font-weight-bold mb-0">{{ formatCurrency(calculerTotal(ligne)) }}</p>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-light">
                    <td colspan="5" class="text-end">
                      <strong>TOTAL COMMANDE:</strong>
                    </td>
                    <td class="text-end">
                      <strong class="text-success">{{ formatCurrency(totalCommande) }}</strong>
                    </td>
                  </tr>
                </tfoot>
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
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuth, useSweetAlert } from '@/composables';
import ArgonButton from '@/components/ArgonButton.vue';
import api from '@/services/api.service';

const route = useRoute();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showError } = useSweetAlert();

requireAuth();

const commandeId = ref(route.params.id);
const commande = ref(null);
const lignes = ref([]);
const isLoading = ref(false);
const isLoadingLignes = ref(false);
const error = ref(null);

// Badge statut
const statutBadgeClass = computed(() => {
  const statut = commande.value?.statut;
  const badges = {
    'En cours': 'badge bg-gradient-warning',
    'Validée': 'badge bg-gradient-info',
    'Livrée': 'badge bg-gradient-success',
    'Annulée': 'badge bg-gradient-danger'
  };
  return badges[statut] || 'badge bg-gradient-secondary';
});

// Calculer le total d'une ligne
const calculerTotal = (ligne) => {
  const montantHT = parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire);
  const montantRemise = montantHT * (parseFloat(ligne.remise) / 100);
  const montantTVA = (montantHT - montantRemise) * (parseFloat(ligne.tva) / 100);
  return montantHT - montantRemise + montantTVA;
};

// Total de la commande
const totalCommande = computed(() => {
  return lignes.value.reduce((total, ligne) => total + calculerTotal(ligne), 0);
});

// Formater la date
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

// Formater devise
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency: 'CDF'
  }).format(parseFloat(amount) || 0);
};

// Charger la commande
const loadCommande = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await api.getCommandeById(commandeId.value);
    commande.value = response;
    
    // Enrichir avec noms
    await enrichWithNames();
    
    // Charger les lignes
    await loadLignes();
    
  } catch (err) {
    error.value = 'Commande introuvable';
    await showError('Erreur', 'Commande introuvable');
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec noms client et utilisateur
const enrichWithNames = async () => {
  try {
    const [clients, utilisateurs] = await Promise.all([
      api.getClients(),
      api.getUsers()
    ]);
    
    const clientsMap = {};
    const utilisateursMap = {};
    
    (Array.isArray(clients) ? clients : []).forEach(client => {
      clientsMap[client.idClient] = `${client.prenom} ${client.nom}`;
    });
    
    (Array.isArray(utilisateurs) ? utilisateurs : []).forEach(user => {
      const nomComplet = `${user.nomUtilisateur || ''} ${user.postNomUtilisateur || ''} ${user.prenomUtilisateur || ''}`.trim();
      utilisateursMap[user.idUtilisateur] = nomComplet || `Utilisateur #${user.idUtilisateur}`;
    });
    
    if (commande.value) {
      commande.value.clientNom = clientsMap[commande.value.idClient] || `Client #${commande.value.idClient}`;
      commande.value.utilisateurNom = utilisateursMap[commande.value.idUtilisateur] || `Vendeur #${commande.value.idUtilisateur}`;
    }
  } catch (err) {
    console.warn('Impossible charger noms:', err);
  }
};

// Charger les lignes de la commande
const loadLignes = async () => {
  isLoadingLignes.value = true;
  
  try {
    const response = await api.searchLignesCommande(commandeId.value, null);
    lignes.value = Array.isArray(response) ? response : [];
    
    console.log('✅ Lignes chargées:', lignes.value.length);
    
    // Enrichir avec les noms des articles
    await enrichLignesWithArticles();
    
  } catch (err) {
    console.error('❌ Erreur chargement lignes:', err);
    lignes.value = [];
  } finally {
    isLoadingLignes.value = false;
  }
};

// Enrichir les lignes avec les noms des articles
const enrichLignesWithArticles = async () => {
  try {
    const [stocks, articles] = await Promise.all([
      api.getStocks(),
      api.getArticles()
    ]);
    
    const stocksMap = {};
    const articlesMap = {};
    
    // Créer un map des articles par ID
    (Array.isArray(articles) ? articles : []).forEach(article => {
      articlesMap[article.idArticle] = article.libelle || `Article #${article.idArticle}`;
    });
    
    // Créer un map des stocks avec les noms d'articles
    (Array.isArray(stocks) ? stocks : []).forEach(stock => {
      stocksMap[stock.idStock] = articlesMap[stock.idArticle] || `Article #${stock.idArticle}`;
    });
    
    // Enrichir chaque ligne avec le nom de l'article
    lignes.value = lignes.value.map(ligne => ({
      ...ligne,
      articleNom: stocksMap[ligne.idStock] || `Article inconnu`
    }));
    
    console.log('✅ Lignes enrichies avec noms articles');
  } catch (err) {
    console.warn('⚠️ Impossible charger articles:', err);
  }
};

onMounted(() => {
  loadCommande();
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

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

table {
  font-size: 0.875rem;
}

tfoot tr {
  font-size: 1rem;
}
</style>

