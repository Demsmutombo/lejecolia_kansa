<script setup>
import { ref, onBeforeUnmount, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useAuth, useSweetAlert } from "@/composables";
import { login as apiLogin } from "@/services/api.service";
import API_CONFIG from "@/config/api";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import plateformeLogo from "@/assets/img/logo-plateforme.png";

const body = document.getElementsByTagName("body")[0];
const store = useStore();
const router = useRouter();
const route = useRoute();
const auth = useAuth();
const { login, role: userRole, isSuperAdmin } = auth;
const { showWelcome, showError } = useSweetAlert();

// Charger automatiquement les images WhatsApp pour le slider
const imageModules = import.meta.glob('@/assets/img/signin/*.{jpeg,jpg,png}', {
  eager: true,
  import: 'default'
});
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

if (!images.length) {
  images.push(plateformeLogo);
}

// État du formulaire
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

// Slider d'images
const currentImageIndex = ref(0);
let slideInterval = null;

const startSlideshow = () => {
  slideInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }, 5000); // Change toutes les 5 secondes
};

// Gestion de la connexion
const handleSignIn = async () => {
  console.log('🔐 Tentative de connexion...');
  errorMessage.value = '';
  
  // Validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs';
    console.error('❌ Champs vides');
    return;
  }
  
  console.log('📧 Login:', email.value);
  isLoading.value = true;
  
  try {
    console.log('📡 Appel API vers:', API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN);
    
    // Appel API d'authentification (login et motDePasse)
    const response = await apiLogin(email.value, password.value);
    
    console.log('✅ Réponse API reçue:', response);
    
    // Extraire les données utilisateur
    const userData = {
      id: response.id || response.utilisateur_id || response.idUtilisateur,
      name: response.nom || response.name || response.nomComplet,
      email: response.email || response.login,
      role: response.role || response.type_utilisateur,
      token: response.token,
      societeId: response.societe_id || response.societeId || response.idSociete,
      societeName: response.societe_name || response.societeName || response.nomSociete || response.nomSite || 'Ma Société',
      societes: response.societes || []
    };
    
    console.log('📋 Données extraites pour le store:', {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      societeId: userData.societeId,
      societeName: userData.societeName,  // ← Vérifier cette valeur
      hasSocietes: userData.societes.length > 0
    });
    
    // Connexion avec le store Pinia
    login(userData);
    
    // Le rôle est maintenant normalisé dans le store
    console.log('👤 Rôle brut de l\'API:', userData.role);
    console.log('✅ Rôle normalisé dans le store:', userRole.value);
    console.log('🎭 Est SuperAdmin?', isSuperAdmin.value);
    
    // Déterminer le texte à afficher
    const roleText = isSuperAdmin.value 
      ? 'Super Administrateur' 
      : 'Gestionnaire';
    
    console.log('📝 Texte du rôle affiché:', roleText);
    
    // Afficher le message de bienvenue avec SweetAlert
    await showWelcome(userData.name, roleText, userData.societeName);
    
    // Redirection vers la page demandée ou dashboard
    const redirectTo = route.query.redirect || '/dashboard';
    router.push(redirectTo);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    
    let errorTitle = 'Erreur de connexion';
    let errorText = '';
    
    if (error.message?.includes('Accès refusé')) {
      errorTitle = 'Authentification refusée';
      errorText = 'Vos identifiants ne permettent pas d’accéder à la plateforme. Merci de vérifier vos informations ou de contacter l’administrateur.';
    } else if (error.response?.status === 401) {
      errorTitle = 'Identifiants incorrects';
      errorText = 'Email ou mot de passe incorrect';
    } else if (error.response?.status === 403) {
      errorTitle = 'Accès refusé';
      errorText = 'Vous n\'avez pas les permissions nécessaires';
    } else if (error.code === 'ERR_NETWORK') {
      errorTitle = 'Erreur réseau';
      errorText = 'Impossible de contacter le serveur';
    } else {
      errorText = 'Une erreur est survenue. Veuillez réessayer.';
    }
    
    // Afficher l'erreur avec SweetAlert
    await showError(errorTitle, errorText);
    errorMessage.value = errorText;
  } finally {
    isLoading.value = false;
  }
};


onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onMounted(() => {
  // Démarrer le slider automatique
  startSlideshow();
});

onBeforeUnmount(() => {
  // Arrêter le slider
  if (slideInterval) {
    clearInterval(slideInterval);
  }
  
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-primary"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h3 class="font-weight-bolder text-primary mb-2">Lejecolia</h3>
                  <p class="mb-1 text-sm">Gestion privative du restaurant</p>
                  <p class="mb-3 text-xs text-muted">
                    Développée par 
                    <a href="https://kansaconsulting.com" target="_blank" class="text-primary font-weight-bold">
                      Kansa Business
                    </a>
                  </p>
                  <h4 class="font-weight-bolder mt-4">Connexion à l'Espace Lejecolia</h4>
                  <p class="mb-0 text-muted">Connectez-vous pour gérer votre établissement Lejecolia</p>
                </div>
                <div class="card-body">
                  <!-- Message d'erreur -->
                  <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span class="alert-text text-white">
                      <strong>Erreur!</strong> {{ errorMessage }}
                    </span>
                    <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <form role="form" @submit.prevent="handleSignIn">
                    <div class="mb-3">
                      <argon-input
                        v-model="email"
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="lg"
                        :disabled="isLoading"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        size="lg"
                        :disabled="isLoading"
                        @keyup.enter="handleSignIn"
                      />
                    </div>
                    <argon-switch v-model="rememberMe" id="rememberMe" name="remember-me"
                      >Se souvenir de moi</argon-switch
                    >

                    <div class="text-center">
                      <argon-button
                        type="button"
                        @click="handleSignIn"
                        class="mt-4"
                        variant="gradient"
                        color="primary"
                        fullWidth
                        size="lg"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading">
                          <i class="fas fa-spinner fa-spin me-2"></i>
                          Connexion en cours...
                        </span>
                        <span v-else>Se connecter</span>
                      </argon-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden image-slider"
              >
                <!-- Slider d'images -->
                <transition name="fade">
                  <div 
                    :key="currentImageIndex"
                    class="slider-image"
                    :style="{
                      backgroundImage: `url(${images[currentImageIndex]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }"
                  ></div>
                </transition>
                <span class="mask bg-gradient-primary opacity-3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.image-slider {
  position: relative;
}

.slider-image {
  transition: opacity 1s ease-in-out;
}

/* Transitions fade pour le changement d'images */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}
</style>
