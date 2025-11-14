<template>
  <div class="container-fluid px-4 py-3">
    <div class="row">
      <div class="col-12 mb-3">
        <div class="d-flex align-items-center">
          <div>
            <h4 class="mb-0"><i class="fas fa-bell me-2 text-info"></i> Notifications</h4>
            <p class="text-sm text-white mb-0">Gérez vos notifications</p>
          </div>
          <div class="ms-auto d-flex gap-2">
            <argon-button
              color="light"
              size="sm"
              @click="playNotificationSound"
              title="Tester le son de notification"
            >
              <i class="fas fa-volume-up me-1"></i>
              Tester le son
            </argon-button>
            <argon-button
              v-if="notificationsNonLues.length > 0"
              color="info"
              size="sm"
              @click="marquerToutCommeLues"
            >
              <i class="fas fa-check-double me-1"></i>
              Tout marquer comme lu
            </argon-button>
            <argon-button
              color="secondary"
              size="sm"
              @click="showFilters = !showFilters"
            >
              <i class="fas fa-filter me-1"></i>
              {{ showFilters ? 'Masquer' : 'Filtres' }}
            </argon-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div v-if="showFilters" class="row mb-3">
      <div class="col-md-3">
        <label class="form-label text-sm">Type</label>
        <argon-select
          v-model="filters.type"
          :options="typeOptions"
          placeholder="Tous"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label text-sm">Priorité</label>
        <argon-select
          v-model="filters.priorite"
          :options="prioriteOptions"
          placeholder="Toutes"
        />
      </div>
      <div class="col-md-3">
        <label class="form-label text-sm">Statut</label>
        <argon-select
          v-model="filters.statut"
          :options="statutOptions"
          placeholder="Toutes"
        />
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <argon-button
          color="secondary"
          size="md"
          class="w-100"
          @click="resetFilters"
        >
          <i class="fas fa-redo me-1"></i>
          Réinitialiser
        </argon-button>
      </div>
    </div>

    <!-- Compteurs -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                <i class="ni ni-bell-55 text-lg opacity-10"></i>
              </div>
              <div class="ms-3">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">Total</p>
                <h5 class="font-weight-bolder mb-0">{{ notifications.length }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                <i class="ni ni-email-83 text-lg opacity-10"></i>
              </div>
              <div class="ms-3">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">Non lues</p>
                <h5 class="font-weight-bolder mb-0">{{ notificationsNonLues.length }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex">
              <div class="icon icon-shape bg-gradient-success shadow text-center border-radius-md">
                <i class="ni ni-check-bold text-lg opacity-10"></i>
              </div>
              <div class="ms-3">
                <p class="text-sm mb-0 text-capitalize font-weight-bold">Lues</p>
                <h5 class="font-weight-bolder mb-0">{{ notificationsLues.length }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des notifications -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>

            <div v-else-if="notificationsFiltrees.length === 0" class="text-center py-5">
              <i class="fas fa-bell-slash fa-3x text-secondary mb-3"></i>
              <p class="text-secondary mb-0">Aucune notification</p>
            </div>

            <div v-else class="list-group list-group-flush">
              <div
                v-for="notification in notificationsFiltrees"
                :key="notification.idNotification"
                class="list-group-item list-group-item-action"
                :class="{ 'bg-light': !notification.isLu }"
                @click="handleNotificationClick(notification)"
                style="cursor: pointer;"
              >
                <div class="d-flex w-100 justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                      <i
                        :class="getTypeIcon(notification.type)"
                        class="me-2"
                      ></i>
                      <h6 class="mb-0 me-2" :class="{ 'font-weight-bold': !notification.isLu }">
                        {{ notification.titre }}
                      </h6>
                      <span
                        class="badge badge-sm"
                        :class="getPrioriteClass(notification.priorite)"
                      >
                        {{ notification.priorite }}
                      </span>
                      <span
                        v-if="!notification.isLu"
                        class="badge badge-sm bg-gradient-info ms-2"
                      >
                        Nouveau
                      </span>
                    </div>
                    <p class="text-sm text-secondary mb-1" v-html="formatMessage(notification.message)"></p>
                    <small class="text-muted">
                      <i class="far fa-clock me-1"></i>
                      {{ formatDate(notification.dateCreation) }}
                    </small>
                  </div>
                  <div class="d-flex flex-column align-items-end ms-3">
                    <button
                      v-if="!notification.isLu"
                      @click.stop="marquerCommeLue(notification.idNotification)"
                      class="btn btn-sm btn-link text-info p-0 mb-2"
                      title="Marquer comme lu"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <i
                      v-else
                      class="fas fa-check-circle text-success"
                      title="Lu"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="notificationModal" tabindex="-1" ref="notificationModalRef">
      <div class="modal-dialog modal-dialog-centered notification-modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <i :class="getTypeIcon(selectedNotification?.type || '')"></i>
              {{ selectedNotification?.titre || 'Notification' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeNotificationModal"></button>
          </div>
          <div class="modal-body" v-if="selectedNotification">
            <div class="row g-3">
              <div class="col-md-8">
                <p class="text-sm text-muted mb-1">Message</p>
                <div class="alert alert-secondary" v-html="formatMessage(selectedNotification.message)"></div>
              </div>
              <div class="col-md-4">
                <p class="text-sm text-muted mb-1">Informations</p>
                <ul class="list-group list-group-flush text-sm">
                  <li class="list-group-item px-0 d-flex justify-content-between">
                    <span>Type</span>
                    <span class="badge bg-light text-dark">{{ selectedNotification.type || '—' }}</span>
                  </li>
                  <li class="list-group-item px-0 d-flex justify-content-between">
                    <span>Priorité</span>
                    <span class="badge badge-sm" :class="getPrioriteClass(selectedNotification.priorite)">
                      {{ selectedNotification.priorite || '—' }}
                    </span>
                  </li>
                  <li class="list-group-item px-0 d-flex justify-content-between">
                    <span>Reçue</span>
                    <span>{{ formatFullDate(selectedNotification.dateCreation) }}</span>
                  </li>
                  <li class="list-group-item px-0 d-flex justify-content-between">
                    <span>Statut</span>
                    <span>
                      <i v-if="selectedNotification.isLu" class="fas fa-check-circle text-success me-2"></i>
                      <i v-else class="fas fa-circle text-info me-2"></i>
                      {{ selectedNotification.isLu ? 'Lue' : 'Non lue' }}
                    </span>
                  </li>
                  <li
                    v-if="selectedNotification.dateLecture"
                    class="list-group-item px-0 d-flex justify-content-between"
                  >
                    <span>Lu le</span>
                    <span>{{ formatFullDate(selectedNotification.dateLecture) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <argon-button
              v-if="selectedNotification?.lien"
              color="info"
              variant="gradient"
              @click="ouvrirLienNotification"
            >
              <i class="fas fa-external-link-alt me-2"></i>
              Ouvrir la page liée
            </argon-button>
            <argon-button color="secondary" variant="outline" @click="closeNotificationModal">
              Fermer
            </argon-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonSelect from '@/components/ArgonSelect.vue';
import { useAuth, useSweetAlert } from '@/composables';
import api from '@/services/api.service';
import { Modal } from 'bootstrap';

const router = useRouter();
const { requireAuth } = useAuth();
const userStore = useUserStore();
const { showSuccess, showError, showLoading, close } = useSweetAlert();

requireAuth();

const isLoading = ref(false);
const notifications = ref([]);
const showFilters = ref(false);
const previousNotifCount = ref(null); // Pour détecter les nouvelles notifications
const selectedNotification = ref(null);
const notificationModalRef = ref(null);
let notificationModal = null;

const filters = ref({
  type: '',
  priorite: '',
  statut: '' // 'lues', 'nonLues', ''
});

const typeOptions = [
  { value: '', label: 'Tous' },
  { value: 'Info', label: 'ℹ️ Info' },
  { value: 'Alerte', label: '⚠️ Alerte' },
  { value: 'Vente', label: '💰 Vente' },
  { value: 'Stock', label: '📦 Stock' },
  { value: 'Système', label: '⚙️ Système' }
];

const prioriteOptions = [
  { value: '', label: 'Toutes' },
  { value: 'Haute', label: '🔴 Haute' },
  { value: 'Moyenne', label: '🟡 Moyenne' },
  { value: 'Basse', label: '🟢 Basse' }
];

const statutOptions = [
  { value: '', label: 'Toutes' },
  { value: 'nonLues', label: 'Non lues' },
  { value: 'lues', label: 'Lues' }
];

// Notifications filtrées
const notificationsFiltrees = computed(() => {
  let result = [...notifications.value];

  if (filters.value.type) {
    result = result.filter(n => n.type === filters.value.type);
  }

  if (filters.value.priorite) {
    result = result.filter(n => n.priorite === filters.value.priorite);
  }

  if (filters.value.statut === 'lues') {
    result = result.filter(n => n.isLu);
  } else if (filters.value.statut === 'nonLues') {
    result = result.filter(n => !n.isLu);
  }

  // Trier par date (plus récentes en premier)
  result.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));

  return result;
});

const notificationsNonLues = computed(() => notifications.value.filter(n => !n.isLu));
const notificationsLues = computed(() => notifications.value.filter(n => n.isLu));

// 🔊 Jouer un son de notification (bip)
const playNotificationSound = () => {
  try {
    // Créer un contexte audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Créer un oscillateur pour générer le son
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connecter l'oscillateur au gain, puis à la sortie
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurer le son (fréquence et type)
    oscillator.type = 'sine'; // Son doux
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Note aiguë (800 Hz)
    
    // Envelope pour un son plus agréable (fade in/out)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05); // Montée rapide
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3); // Descente douce
    
    // Démarrer et arrêter le son
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Nettoyer après
    oscillator.onended = () => {
      audioContext.close();
    };
    
    console.log('🔔 Son de notification joué');
  } catch (error) {
    console.warn('⚠️ Impossible de jouer le son:', error);
  }
};

// Formater le message pour afficher les noms en gras
const formatMessage = (message) => {
  if (!message) return '';
  // Convertir **texte** en <strong>texte</strong>
  return message.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-dark">$1</strong>');
};

// Charger les notifications
const loadNotifications = async () => {
  isLoading.value = true;
  try {
    const userId = userStore.userId;
    const response = await api.getNotificationsUtilisateur(userId, false);
    
    let notifs = Array.isArray(response) ? response : [];
    console.log('📋 Notifications chargées:', notifs.length);
    
    // 🔧 ENRICHISSEMENT : Remplacer les IDs par des noms compréhensibles
    if (notifs.length > 0) {
      console.log('🔄 Enrichissement des notifications...');
      
      // Charger les clients et commandes pour enrichir les messages
      const societeId = userStore.societeId || 3;
      let clients = [];
      let commandes = [];
      
      try {
        clients = await api.getClientsParSiteBySociete(societeId);
        commandes = await api.getCommandesBySociete(societeId);
        
        console.log(`📋 ${clients?.length || 0} clients et ${commandes?.length || 0} commandes chargés`);
      } catch (e) {
        console.warn('⚠️ Erreur chargement données enrichissement:', e);
      }
      
      // Créer des maps pour accès rapide
      const clientsMap = {};
      (Array.isArray(clients) ? clients : []).forEach(c => {
        const idClient = c.idClient || c.IdClient;
        const nom = c.nomComplet || `${c.prenom || ''} ${c.nom || ''}`.trim() || `Client #${idClient}`;
        clientsMap[String(idClient)] = nom;
      });
      
      const commandesMap = {};
      (Array.isArray(commandes) ? commandes : []).forEach(cmd => {
        const idCmd = cmd.idCommande || cmd.IdCommande;
        commandesMap[String(idCmd)] = cmd;
      });
      
      // Enrichir les messages et titres
      notifs = notifs.map(notif => {
        let message = notif.message || '';
        let titre = notif.titre || '';
        
        // Remplacer "client X" par le nom du client
        message = message.replace(/client\s+(\d+)/gi, (match, idClient) => {
          const nomClient = clientsMap[idClient];
          return nomClient ? `**${nomClient}**` : match;
        });
        
        // Remplacer "Commande #X enregistrée pour client Y" par un message plus clair
        message = message.replace(/Commande\s+#(\d+)\s+enregistr[ée]+\s+pour\s+\*\*([^*]+)\*\*/gi, (match, idCmd, nomClient) => {
          const commande = commandesMap[idCmd];
          const montant = commande?.montantTotal ? ` de **${parseFloat(commande.montantTotal).toLocaleString('fr-CD')} FC**` : '';
          return `Vente${montant} pour **${nomClient}**`;
        });
        
        // Améliorer le titre si c'est une vente
        if (titre.toLowerCase().includes('vente')) {
          titre = '💰 Nouvelle Vente';
        } else if (titre.toLowerCase().includes('compte')) {
          titre = '✅ Compte Activé';
        } else if (titre.toLowerCase().includes('stock')) {
          titre = '📦 Alerte Stock';
        }
        
        return {
          ...notif,
          titre: titre,
          message: message
        };
      });
      
      console.log('✅ Notifications enrichies');
    }
    
    notifications.value = notifs;
    
    const notifCountNonLues = notifs.filter(n => !n.isLu).length;

    if (previousNotifCount.value !== null && notifCountNonLues > previousNotifCount.value) {
      const nouvellesNotifs = notifCountNonLues - previousNotifCount.value;
      console.log(`🔔 ${nouvellesNotifs} nouvelle(s) notification(s) détectée(s) !`);
      playNotificationSound();
    }

    previousNotifCount.value = notifCountNonLues;
    
  } catch (error) {
    console.error('❌ Erreur chargement notifications:', error);
    await showError('Erreur', 'Impossible de charger les notifications');
  } finally {
    isLoading.value = false;
  }
};

// Marquer comme lue
const marquerCommeLue = async (idNotification) => {
  try {
    await api.marquerNotificationLue(idNotification);
    
    // Mettre à jour localement
    const notification = notifications.value.find(n => n.idNotification === idNotification);
    if (notification) {
      notification.isLu = true;
      notification.dateLecture = new Date().toISOString();
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    await showError('Erreur', 'Impossible de marquer comme lu');
  }
};

// Marquer tout comme lu
const marquerToutCommeLues = async () => {
  showLoading('Marquage en cours...');
  try {
    const userId = userStore.userId;
    await api.marquerToutLu(userId);
    
    // Mettre à jour localement
    notifications.value.forEach(n => {
      n.isLu = true;
      n.dateLecture = new Date().toISOString();
    });
    
    close();
    await showSuccess('Terminé !', 'Toutes les notifications sont marquées comme lues');
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', 'Impossible de marquer tout comme lu');
  }
};

const handleNotificationClick = (notification) => {
  selectedNotification.value = notification;

  if (!notification.isLu) {
    marquerCommeLue(notification.idNotification);
  }

  if (!notificationModal) {
    notificationModal = new Modal(notificationModalRef.value, {
      backdrop: 'static'
    });
  }
  notificationModal.show();
};

const closeNotificationModal = () => {
  if (notificationModal) {
    notificationModal.hide();
  }
  selectedNotification.value = null;
};

const ouvrirLienNotification = () => {
  if (selectedNotification.value?.lien) {
    router.push(selectedNotification.value.lien);
    closeNotificationModal();
  }
};

const formatFullDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Icône selon le type
const getTypeIcon = (type) => {
  const icons = {
    'Info': 'fas fa-info-circle text-info',
    'Alerte': 'fas fa-exclamation-triangle text-warning',
    'Vente': 'fas fa-cash-register text-success',
    'Stock': 'fas fa-box text-primary',
    'Système': 'fas fa-cog text-secondary'
  };
  return icons[type] || 'fas fa-bell text-secondary';
};

// Classe selon la priorité
const getPrioriteClass = (priorite) => {
  const classes = {
    'Haute': 'bg-gradient-danger',
    'Moyenne': 'bg-gradient-warning',
    'Basse': 'bg-gradient-success'
  };
  return classes[priorite] || 'bg-gradient-secondary';
};

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Réinitialiser les filtres
const resetFilters = () => {
  filters.value = {
    type: '',
    priorite: '',
    statut: ''
  };
};

// Interval pour vérifier les nouvelles notifications automatiquement
let notificationInterval = null;

onMounted(() => {
  loadNotifications();
  
  // 🔄 Vérifier les nouvelles notifications toutes les 30 secondes
  notificationInterval = setInterval(() => {
    console.log('🔄 Vérification automatique des nouvelles notifications...');
    loadNotifications();
  }, 30000); // 30 secondes
  
  console.log('✅ Vérification automatique des notifications activée (toutes les 30s)');
});

// Nettoyer l'interval quand le composant est détruit
onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    console.log('🛑 Vérification automatique des notifications arrêtée');
  }

  if (notificationModal) {
    notificationModal.hide();
    notificationModal = null;
  }
});
</script>

<style scoped>
.icon-shape {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:hover {
  background-color: #f8f9fa !important;
}

.modal-body .alert {
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #334155;
}

.list-group-item {
  background: transparent;
}

.notification-modal-dialog {
  max-width: 720px;
}

@media (max-width: 992px) {
  .notification-modal-dialog {
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>

