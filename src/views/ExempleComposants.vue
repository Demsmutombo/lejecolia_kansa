<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
            <h6>Exemple de Composants Réutilisables</h6>
            <p class="text-sm">Démonstration des composants et composables</p>
          </div>
          <div class="card-body">
            <!-- Section Thème -->
            <div class="mb-4">
              <h6 class="text-sm">Gestion du Thème</h6>
              <ArgonButton 
                @click="toggleDarkMode" 
                color="dark" 
                size="sm"
                class="me-2"
              >
                {{ darkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre' }}
              </ArgonButton>
              
              <ArgonButton 
                @click="toggleSidenav" 
                color="info" 
                size="sm"
              >
                {{ showSidenav ? 'Masquer' : 'Afficher' }} Menu
              </ArgonButton>
            </div>

            <!-- Section Formulaire -->
            <div class="mb-4">
              <h6 class="text-sm mb-3">Composants de Formulaire</h6>
              <div class="row">
                <div class="col-md-6">
                  <ArgonInput 
                    v-model="form.name" 
                    placeholder="Votre nom"
                    label="Nom"
                  />
                </div>
                <div class="col-md-6">
                  <ArgonInput 
                    v-model="form.email" 
                    placeholder="email@exemple.com"
                    type="email"
                    label="Email"
                  />
                </div>
              </div>
              
              <ArgonTextarea 
                v-model="form.message" 
                placeholder="Votre message..."
                label="Message"
                :rows="3"
              />
              
              <div class="d-flex gap-3 mb-3">
                <ArgonCheckbox v-model="form.newsletter">
                  S'abonner à la newsletter
                </ArgonCheckbox>
                
                <ArgonSwitch v-model="form.notifications">
                  Notifications
                </ArgonSwitch>
              </div>

              <ArgonButton 
                @click="handleSubmit" 
                color="success"
                variant="gradient"
              >
                Envoyer
              </ArgonButton>
            </div>

            <!-- Section Badges et Alertes -->
            <div class="mb-4">
              <h6 class="text-sm mb-3">Badges et Statuts</h6>
              <div class="d-flex gap-2 flex-wrap">
                <ArgonBadge color="success">Actif</ArgonBadge>
                <ArgonBadge color="warning">En attente</ArgonBadge>
                <ArgonBadge color="danger">Erreur</ArgonBadge>
                <ArgonBadge color="info">Information</ArgonBadge>
                <ArgonBadge color="dark">Archivé</ArgonBadge>
              </div>
            </div>

            <!-- Section Progress -->
            <div class="mb-4">
              <h6 class="text-sm mb-3">Barres de Progression</h6>
              <ArgonProgress 
                :value="progressValue" 
                color="success" 
                :label="true"
                class="mb-2"
              />
              <ArgonButton 
                @click="progressValue = Math.min(100, progressValue + 10)" 
                color="primary" 
                size="sm"
                class="me-2"
              >
                Augmenter
              </ArgonButton>
              <ArgonButton 
                @click="progressValue = Math.max(0, progressValue - 10)" 
                color="secondary" 
                size="sm"
              >
                Diminuer
              </ArgonButton>
            </div>

            <!-- Section Alert -->
            <ArgonAlert 
              v-if="showAlert" 
              color="info" 
              dismissible
              @close="showAlert = false"
            >
              <strong>Info!</strong> Ceci est un exemple d'alerte réutilisable.
            </ArgonAlert>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Cards -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <MiniStatisticsCard
          title="Utilisateurs"
          value="2,300"
          description="<span class='text-success text-sm font-weight-bolder'>+55%</span> depuis le mois dernier"
          :icon="{
            component: 'ni ni-world',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <MiniStatisticsCard
          title="Ventes"
          value="€53,000"
          description="<span class='text-success text-sm font-weight-bolder'>+3%</span> depuis hier"
          :icon="{
            component: 'ni ni-money-coins',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <MiniStatisticsCard
          title="Nouveaux clients"
          value="+3,462"
          description="<span class='text-danger text-sm font-weight-bolder'>-2%</span> depuis hier"
          :icon="{
            component: 'ni ni-paper-diploma',
            background: 'bg-gradient-danger',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-xl-3 col-sm-6">
        <MiniStatisticsCard
          title="Commandes"
          value="103,430"
          description="<span class='text-success text-sm font-weight-bolder'>+5%</span> que prévu"
          :icon="{
            component: 'ni ni-cart',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  ArgonButton, 
  ArgonInput, 
  ArgonTextarea, 
  ArgonCheckbox, 
  ArgonSwitch,
  ArgonBadge,
  ArgonAlert,
  ArgonProgress
} from '@/components';
import { MiniStatisticsCard } from '@/examples';
import { useTheme, useNavigation } from '@/composables';

// Utilisation des composables
const { darkMode, toggleDarkMode } = useTheme();
const { showSidenav, toggleSidenav } = useNavigation();

// État du formulaire
const form = ref({
  name: '',
  email: '',
  message: '',
  newsletter: false,
  notifications: true
});

// État de la progress bar
const progressValue = ref(45);

// État de l'alerte
const showAlert = ref(true);

// Gestion de la soumission
const handleSubmit = () => {
  console.log('Formulaire soumis:', form.value);
  alert('Formulaire soumis ! Consultez la console pour voir les données.');
};
</script>

