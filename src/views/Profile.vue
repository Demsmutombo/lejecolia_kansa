<script setup>
import { ref, computed, onBeforeMount, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import { useUserStore } from "@/stores/user";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import plateformeLogo from "@/assets/img/logo-plateforme.png";
import api from "@/services/api.service";
import { useSweetAlert } from "@/composables";

const body = document.getElementsByTagName("body")[0];
const store = useStore();
const userStore = useUserStore();

// Charger automatiquement les images WhatsApp pour le slider
const imageModules = import.meta.glob('@/assets/img/signin/*.{jpeg,jpg,png}', {
  eager: true,
  import: 'default'
});
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

if (images.length === 0) {
  images.push(plateformeLogo);
}

// Slider d'images WhatsApp pour le header
const currentImageIndex = ref(0);
let slideInterval = null;

const stopSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
};

const startSlideshow = () => {
  stopSlideshow();
  if (images.length <= 1) return;
  slideInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }, 5000);
};

const { showSuccess, showError, showLoading, close } = useSweetAlert();

const photoInput = ref(null);
const newPhotoPreview = ref('');
const isSavingPhoto = ref(false);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});
const isSavingPassword = ref(false);
const showPasswordForm = ref(false);

// Données complètes de l'utilisateur (avec photo)
const userData = ref(null);
const isLoading = ref(false);

// Charger les données complètes depuis l'API
const loadUserData = async () => {
  isLoading.value = true;
  try {
    const userId = userStore.userId;
    console.log('🔍 Chargement pour userId:', userId);
    
    if (!userId) {
      console.warn('⚠️ Pas de userId - Utilisation données du store uniquement');
      isLoading.value = false;
      return;
    }
    
    try {
      const response = await api.getUserById(userId);
      
      // Vérifier si response est encapsulé ou direct
      userData.value = response?.data || response;
      
      console.log('✅ Données utilisateur chargées depuis API:', {
        id: userData.value?.idUtilisateur,
        nom: userData.value?.nomUtilisateur,
        idRole: userData.value?.idRole,
        hasPhoto: !!userData.value?.photo,
        photoLength: userData.value?.photo?.length || 0
      });
      
      // Charger aussi les noms de site et rôle
      await enrichWithNames();
      
    } catch (apiError) {
      console.warn('⚠️ API getUserById a échoué (404?) - Utilisation du store uniquement');
      console.log('💡 Les données de base du store seront utilisées');
      
      // Utiliser les données minimales du store
      userData.value = null; // Le computed user utilisera le fallback
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    isLoading.value = false;
  }
};

// Enrichir avec les noms de site et rôle
const enrichWithNames = async () => {
  try {
    const [sites, roles] = await Promise.all([
      api.getSitesBySociete(userStore.societeId || 3),
      api.getRoles()
    ]);
    
    // Gérer response encapsulé
    const sitesList = Array.isArray(sites) ? sites : (sites?.data || []);
    const rolesList = Array.isArray(roles) ? roles : (roles?.data || []);
    
    console.log('📋 Sites disponibles:', sitesList.length, 'sites');
    console.log('📋 Rôles disponibles:', rolesList.map(r => ({ id: r.idRole, nom: r.nom || r.name })));
    
    if (userData.value) {
      console.log('🔍 Recherche pour idSite:', userData.value.idSite, '(type:', typeof userData.value.idSite, ')');
      console.log('🔍 Recherche pour idRole:', userData.value.idRole, '(type:', typeof userData.value.idRole, ')');
      
      // Identifier l'ID du site utilisateur (support multi-champs + fallback store)
      const rawSiteId = userData.value.idSite
        ?? userData.value.siteId
        ?? userData.value.site?.idSite
        ?? userData.value.site?.siteId
        ?? userStore.siteId;

      console.log('🔍 rawSiteId détecté:', rawSiteId, '(type:', typeof rawSiteId, ')');

      const normalizedUserSiteId = rawSiteId !== undefined && rawSiteId !== null
        ? String(rawSiteId)
        : null;

      // Normaliser les sites (prise en charge des multiples conventions de nommage)
      const site = sitesList.find((s) => {
        const candidateIds = [
          s.idSite,
          s.siteId,
          s.IDSite,
          s.IdSite,
          s.id,
          s.ID,
          s.Id
        ]
          .filter((value) => value !== undefined && value !== null)
          .map((value) => String(value));

        return normalizedUserSiteId ? candidateIds.includes(normalizedUserSiteId) : false;
      }) || (sitesList.length > 0 ? sitesList[0] : null);

      userData.value.siteName = site?.nomSite
        || site?.name
        || site?.NomSite
        || userStore.siteName
        || userStore.societeName
        || 'Non renseigné';

      console.log('✅ Site sélectionné:', site ? {
        id: site.idSite ?? site.siteId ?? site.IDSite ?? site.IdSite ?? site.id ?? site.ID ?? site.Id,
        nom: site.nomSite || site.name || site.NomSite
      } : 'Aucun site trouvé (fallback utilisé)');
      
      // Trouver le nom du rôle (conversion en string pour comparaison)
      const role = rolesList.find(r => String(r.idRole) === String(userData.value.idRole));
      
      console.log('🔍 Détails du rôle:');
      console.log('  - Rôle trouvé dans API:', role);
      console.log('  - role?.nom:', role?.nom);
      console.log('  - role?.name:', role?.name);
      console.log('  - userStore.roleName:', userStore.roleName);
      console.log('  - userStore.role:', userStore.role);
      
      userData.value.roleName = role?.nom || role?.name || userStore.roleName || userStore.role || 'Non renseigné';
      console.log('✅ Rôle FINAL assigné:', userData.value.roleName);
      
      // Log de la photo avec valeur exacte
      console.log('📸 Champ photo - Valeur:', userData.value.photo);
      console.log('📸 Champ photo - Type:', typeof userData.value.photo);
      console.log('📸 Champ photo - Est null?', userData.value.photo === null);
      console.log('📸 Champ photo - Est vide?', userData.value.photo === '');
      console.log('📸 Champ photo - Longueur:', userData.value.photo?.length || 0);
      
      if (userData.value.photo && userData.value.photo.length > 0) {
        const photoSize = userData.value.photo.length;
        console.log('✅ Photo PRÉSENTE:', {
          taille: `${(photoSize / 1024).toFixed(2)} KB`,
          format: userData.value.photo.substring(0, 30) + '...',
          isBase64: userData.value.photo.startsWith('data:image')
        });
      } else {
        console.log('⚠️ Photo NULL ou VIDE - L\'utilisateur n\'a pas de photo dans la DB');
        console.log('💡 Solution: Ajouter une photo via /utilisateurs → Modifier l\'utilisateur');
      }
    }
  } catch (error) {
    console.error('❌ Erreur dans enrichWithNames:', error);
    console.error('❌ Stack:', error.stack);
  }
};

// Données de l'utilisateur connecté
const user = computed(() => {
  if (userData.value) {
    return {
      // Identité
      nom: `${userData.value.nomUtilisateur} ${userData.value.postNomUtilisateur || ''} ${userData.value.prenomUtilisateur}`.trim(),
      email: userData.value.email || 'Non renseigné',
      telephone: userData.value.numeroTelephone || 'Non renseigné',
      role: userData.value.roleName || userStore.roleName || userStore.role || 'Non renseigné',
      societe: userData.value.siteName || userStore.societeName || 'Non renseignée',
      
      // Photo (filtrer si trop volumineuse pour éviter erreur 431)
      photo: userData.value.photo && userData.value.photo.length < 100000 ? userData.value.photo : null,
      
      // Sexe et date de naissance
      sexe: userData.value.sexe || 'Non renseigné',
      dateNaissance: userData.value.dateNaissance || null,
      
      // Adresse
      province: userData.value.province || 'Non renseignée',
      ville: userData.value.ville || 'Non renseignée',
      commune: userData.value.commune || 'Non renseignée',
      quartier: userData.value.quartier || 'Non renseigné',
      avenue: userData.value.avenue || 'Non renseignée',
      numero: userData.value.numero || 'Non renseigné',
      
      // Statut
      isLoggedIn: userStore.isLoggedIn,
      userSocietes: userStore.userSocietes || []
    };
  }
  
  // Fallback si pas encore chargé ou erreur API - Utiliser les données du store
  return {
    nom: userStore.userName || 'Non renseigné',
    email: userStore.userEmail || 'Non renseigné',
    telephone: 'Non renseigné',
    role: userStore.roleName || userStore.role || 'Non renseigné',
    societe: userStore.societeName || 'Non renseignée',
    photo: null, // Pas de photo si pas dans l'API
    sexe: 'Non renseigné',
    dateNaissance: null,
    province: 'Non renseignée',
    ville: 'Non renseignée',
    commune: 'Non renseignée',
    quartier: 'Non renseigné',
    avenue: 'Non renseignée',
    numero: 'Non renseigné',
    isLoggedIn: userStore.isLoggedIn,
    userSocietes: userStore.userSocietes || []
  };
});

// Afficher le rôle EXACT récupéré depuis l'API
const roleDisplay = computed(() => {
  // Afficher le nom exact du rôle tel qu'il est dans l'API
  const exactRole = user.value.role;
  console.log('🎭 roleDisplay - Rôle à afficher:', exactRole);
  return exactRole || 'Non renseigné';
});

// Couleur du badge selon le rôle
const roleBadgeColor = computed(() => {
  const role = user.value.role.toLowerCase();
  if (role.includes('superadmin') || role.includes('super-admin')) {
    return 'bg-gradient-danger';
  } else if (role.includes('gestionnaire')) {
    return 'bg-gradient-success';
  } else if (role.includes('admin')) {
    return 'bg-gradient-info';
  }
  return 'bg-gradient-secondary';
});

// Gérer l'erreur de chargement d'image
const handleImageError = (event) => {
  console.log('⚠️ Erreur chargement image - Utilisation image par défaut');
  event.target.src = plateformeLogo;
};

// URL de la photo avec fallback
const photoUrl = computed(() => {
  const photo = user.value.photo;
  console.log('📸 photoUrl computed - Photo disponible:', !!photo);
  
  if (photo && photo.length > 0 && photo.length < 100000) {
    console.log('✅ Utilisation photo utilisateur');
    return photo;
  }
  
  console.log('⚠️ Utilisation photo par défaut');
  return plateformeLogo;
});

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Non renseignée';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

// Formater l'adresse
const adresseComplete = computed(() => {
  const parts = [];
  if (user.value.numero) parts.push(`N° ${user.value.numero}`);
  if (user.value.avenue) parts.push(`Avenue ${user.value.avenue}`);
  if (user.value.quartier) parts.push(user.value.quartier);
  if (user.value.commune) parts.push(user.value.commune);
  if (user.value.ville) parts.push(user.value.ville);
  if (user.value.province) parts.push(user.value.province);
  return parts.length > 0 ? parts.join(', ') : 'Non renseignée';
});

const societesGerees = computed(() => {
  const sources = [
    userData.value?.societes,
    userData.value?.userSocietes,
    user.value.userSocietes,
    userStore.userSocietes
  ];

  const rawList = sources.find((list) => Array.isArray(list) && list.length) || [];

  return rawList
    .map((societe) => {
      if (!societe) return null;
      if (typeof societe === 'string') return societe;

      const id = societe.idSociete || societe.id || societe.ID || societe.Id || '';
      const nom = societe.nomSociete || societe.name || societe.nom || '';

      if (nom) return nom;
      if (id) return `Société #${id}`;
      return null;
    })
    .filter(Boolean);
});

const handleSelectPhoto = () => {
  if (photoInput.value) {
    photoInput.value.click();
  }
};

const handlePhotoChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    showError('Erreur', 'La photo est trop volumineuse (max 2MB)');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxDimension = 200;
      let { width, height } = img;

      if (width > height && width > maxDimension) {
        height = height * (maxDimension / width);
        width = maxDimension;
      } else if (height > width && height > maxDimension) {
        width = width * (maxDimension / height);
        height = maxDimension;
      } else if (height === width && width > maxDimension) {
        width = maxDimension;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      newPhotoPreview.value = compressedBase64;
      console.log('✅ Photo compressée pour profil:', {
        taille: `${(compressedBase64.length / 1024).toFixed(2)} KB`,
        dimensions: `${width}x${height}`
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const savePhoto = async () => {
  if (!newPhotoPreview.value) {
    showError('Erreur', 'Veuillez sélectionner une photo avant de sauvegarder');
    return;
  }

  try {
    isSavingPhoto.value = true;
    showLoading('Enregistrement...', 'Mise à jour de la photo de profil');
    const baseUserPayload = userData.value
      ? { ...userData.value }
      : {
          idUtilisateur: userStore.userId,
          idSite: userStore.siteId,
          idRole: userStore.roleId,
          nomUtilisateur: userStore.userName
        };

    const payload = {
      idUtilisateur: Number(baseUserPayload.idUtilisateur || userStore.userId),
      idSite: Number(baseUserPayload.idSite || userStore.siteId),
      idRole: Number(baseUserPayload.idRole || userStore.roleId),
      login: baseUserPayload.login || baseUserPayload.loginUtilisateur || baseUserPayload.loginUser || userStore.userEmail || '',
      nomUtilisateur: baseUserPayload.nomUtilisateur || userStore.userName || '',
      prenomUtilisateur: baseUserPayload.prenomUtilisateur || '',
      postNomUtilisateur: baseUserPayload.postNomUtilisateur || '',
      sexe: baseUserPayload.sexe || user.value.sexe || '',
      email: baseUserPayload.email || userStore.userEmail || '',
      numeroTelephone: baseUserPayload.numeroTelephone || '',
      statut: baseUserPayload.statut !== undefined ? baseUserPayload.statut : true,
      photo: newPhotoPreview.value
    };

    if (!payload.sexe) {
      payload.sexe = 'Non renseigné';
    }

    if (baseUserPayload.motDePasse) {
      payload.motDePasse = baseUserPayload.motDePasse;
    }

    console.log('📤 Payload mise à jour photo:', payload);
    await api.updateUser(userStore.userId, payload);
    close();
    showSuccess('Photo mise à jour', 'Votre photo de profil a été mise à jour');
    if (userData.value) {
      userData.value.photo = newPhotoPreview.value;
    }
    newPhotoPreview.value = '';
    await loadUserData();
  } catch (error) {
    console.error('❌ Erreur mise à jour photo:', error);
    if (error.response?.data) {
      console.error('📩 Détails erreur backend (photo):', error.response.data);
      Object.entries(error.response.data).forEach(([key, value]) => {
        console.error(`   - ${key}:`, value);
      });
    }
    close();
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.response?.data?.errors?.photo?.[0] ||
      error.response?.data?.errors?.Photo?.[0] ||
      (error.response?.data && JSON.stringify(error.response.data)) ||
      'Impossible de mettre à jour la photo';
    showError('Erreur', backendMessage);
  } finally {
    isSavingPhoto.value = false;
  }
};

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
};

const submitPasswordChange = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmNewPassword) {
    showError('Erreur', 'Merci de renseigner tous les champs');
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    showError('Erreur', 'Les mots de passe ne correspondent pas');
    return;
  }

  try {
    isSavingPassword.value = true;
    showLoading('Mise à jour...', 'Modification du mot de passe');
    await api.changeUserPassword(
      userStore.userId,
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      passwordForm.value.confirmNewPassword
    );
    close();
    showSuccess('Mot de passe modifié', 'Votre mot de passe a été mis à jour');
    resetPasswordForm();
    showPasswordForm.value = false;
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    close();
    showError('Erreur', error.response?.data?.message || 'Impossible de modifier le mot de passe');
  } finally {
    isSavingPassword.value = false;
  }
};

watch(
  () => newPhotoPreview.value,
  (preview) => {
    if (!preview && photoInput.value) {
      photoInput.value.value = '';
    }
  }
);

onMounted(() => {
  store.state.isAbsolute = true;
  loadUserData(); // Charger les données complètes
  startSlideshow(); // Démarrer le slider d'images
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  stopSlideshow();
  
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>

<template>
  <main>
    <div class="container-fluid py-4">
      <!-- Header avec slider d'images WhatsApp -->
      <div
        class="page-header min-height-300 position-relative overflow-hidden"
        style="margin-right: -24px; margin-left: -34%;"
      >
        <!-- Slider d'images -->
        <transition name="fade">
          <div
            :key="currentImageIndex"
            class="slider-image position-absolute w-100 h-100"
            :style="{
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }"
          ></div>
        </transition>
        <span class="mask bg-gradient-primary opacity-4 position-absolute w-100 h-100" style="top: 0; left: 0;"></span>
      </div>

      <!-- Carte profil -->
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <!-- Avatar -->
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  :src="newPhotoPreview || photoUrl"
                  alt="profile_image"
                  class="w-100 border-radius-lg profile-image-transparent"
                  @error="handleImageError"
                />
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="handlePhotoChange"
                />
              </div>
              <div class="mt-3 d-flex flex-column gap-2">
                <argon-button
                  color="info"
                  size="sm"
                  variant="outline"
                  @click="handleSelectPhoto"
                >
                  <i class="fas fa-image me-2"></i>
                  Choisir une photo
                </argon-button>
                <argon-button
                  color="success"
                  size="sm"
                  variant="gradient"
                  :disabled="!newPhotoPreview || isSavingPhoto"
                  @click="savePhoto"
                >
                  <i class="fas fa-save me-2"></i>
                  {{ isSavingPhoto ? 'Enregistrement...' : 'Enregistrer la photo' }}
                </argon-button>
                <small class="text-xs text-muted">Formats acceptés: JPG/PNG, max 2MB. L'image sera recadrée automatiquement.</small>
              </div>
            </div>
            
            <!-- Nom et rôle -->
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ user.nom }}</h5>
                <p class="mb-0 font-weight-bold text-sm">
                  <span :class="`badge ${roleBadgeColor}`">
                    {{ roleDisplay }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations détaillées -->
    <div class="py-4 container-fluid">
      <div class="row">
          <!-- Informations principales -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                  <p class="mb-0 font-weight-bold">Informations du profil</p>
              </div>
            </div>
            <div class="card-body">
                <p class="text-uppercase text-sm font-weight-bolder">
                  Informations personnelles
                </p>
              <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Nom complet</label>
                    <div class="form-control">{{ user.nom }}</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Sexe</label>
                    <div class="form-control">{{ user.sexe }}</div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-md-12">
                    <label class="form-label">Date de naissance</label>
                    <div class="form-control">{{ formatDate(user.dateNaissance) }}</div>
                  </div>
                </div>
                
                <hr class="horizontal dark mt-4" />
                
                <p class="text-uppercase text-sm font-weight-bolder">
                  Informations de contact
                </p>
                <div class="row">
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <div class="form-control">
                      <a :href="`mailto:${user.email}`" class="text-dark">
                        <i class="fas fa-envelope me-2"></i>
                        {{ user.email }}
                      </a>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Téléphone</label>
                    <div class="form-control">
                      <a :href="`tel:${user.telephone}`" class="text-dark">
                        <i class="fas fa-phone me-2"></i>
                        {{ user.telephone }}
                      </a>
                    </div>
                  </div>
                </div>
                
                <hr class="horizontal dark mt-4" />
                
                <p class="text-uppercase text-sm font-weight-bolder">
                  Rôle et société
                </p>
                <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Rôle</label>
                    <div class="form-control">
                      <span :class="`badge ${roleBadgeColor}`">
                        {{ roleDisplay }}
                      </span>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Site</label>
                    <div class="form-control">{{ user.societe }}</div>
                  </div>
                </div>
                
                <!-- Sociétés multiples (pour SuperAdmin) -->
                <div v-if="societesGerees.length > 0" class="row mt-3">
                  <div class="col-12">
                    <label class="form-label">Sociétés gérées</label>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                        v-for="(societe, index) in societesGerees"
                        :key="index"
                        class="badge bg-gradient-info"
                      >
                        {{ societe }}
                      </span>
                </div>
              </div>
                </div>
                
                <hr class="horizontal dark mt-4" />
                
                <p class="text-uppercase text-sm font-weight-bolder">
                  Adresse
                </p>
                <div class="row">
                  <div class="col-12">
                    <label class="form-label">Adresse complète</label>
                    <div class="form-control">
                      <i class="fas fa-map-marker-alt me-2"></i>
                      {{ adresseComplete }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
                </div>

          <!-- Informations de session -->
                <div class="col-md-4">
            <div class="card">
              <div class="card-header pb-0">
                <p class="mb-0 font-weight-bold">Statut de connexion</p>
              </div>
              <div class="card-body">
                <div class="text-center py-3">
                  <span class="badge bg-gradient-primary" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
                    <i class="fas fa-circle me-2"></i>
                    {{ user.isLoggedIn ? 'Connecté' : 'Déconnecté' }}
                  </span>
                </div>
                <ul class="list-group">
                  <li class="list-group-item border-0 ps-0 pt-0 text-sm">
                    <strong class="text-dark">Nom:</strong> &nbsp; {{ user.nom }}
                  </li>
                  <li class="list-group-item border-0 ps-0 text-sm">
                    <strong class="text-dark">Rôle:</strong> &nbsp;
                    <span :class="`badge ${roleBadgeColor}`">
                      {{ roleDisplay }}
                    </span>
                  </li>
                  <li class="list-group-item border-0 ps-0 text-sm">
                    <strong class="text-dark">Site:</strong> &nbsp; {{ user.societe }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Actions -->
            <div class="card mt-4">
              <div class="card-header pb-0">
                <p class="mb-0 font-weight-bold">Actions</p>
              </div>
              <div class="card-body pt-0">
                <argon-button
                  color="info"
                  variant="gradient"
                  fullWidth
                  class="mb-2"
                  @click="$router.push('/dashboard')"
                >
                  <i class="fas fa-home me-2"></i>
                  Retour au Dashboard
                </argon-button>
                
                <argon-button
                  v-if="user.role.toLowerCase().includes('superadmin')"
                  color="primary"
                  variant="gradient"
                  fullWidth
                  class="mb-2"
                  @click="$router.push('/utilisateurs')"
                >
                  <i class="fas fa-users me-2"></i>
                  Gérer les utilisateurs
                </argon-button>
                
                <argon-button
                  v-if="user.role.toLowerCase().includes('superadmin')"
                  color="success"
                  variant="gradient"
                  fullWidth
                  @click="$router.push('/societes')"
                >
                  <i class="fas fa-building me-2"></i>
                  Gérer les sociétés
                </argon-button>

                <argon-button
                  color="warning"
                  variant="outline"
                  fullWidth
                  class="mt-3"
                  @click="showPasswordForm = !showPasswordForm"
                >
                  <i class="fas fa-key me-2"></i>
                  {{ showPasswordForm ? 'Fermer' : 'Changer mon mot de passe' }}
                </argon-button>

                <transition name="fade">
                  <div v-if="showPasswordForm" class="mt-3">
                    <form @submit.prevent="submitPasswordChange">
                      <div class="mb-3">
                        <label class="form-label">Mot de passe actuel</label>
                        <argon-input
                          v-model="passwordForm.currentPassword"
                          type="password"
                          placeholder="Mot de passe actuel"
                        />
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Nouveau mot de passe</label>
                        <argon-input
                          v-model="passwordForm.newPassword"
                          type="password"
                          placeholder="Nouveau mot de passe"
                        />
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Confirmer le nouveau mot de passe</label>
                        <argon-input
                          v-model="passwordForm.confirmNewPassword"
                          type="password"
                          placeholder="Confirmer le nouveau mot de passe"
                        />
                      </div>
                      <argon-button
                        color="warning"
                        variant="gradient"
                        fullWidth
                        type="submit"
                        :disabled="isSavingPassword"
                      >
                        <i class="fas fa-save me-2"></i>
                        {{ isSavingPassword ? 'Enregistrement...' : 'Enregistrer le mot de passe' }}
                      </argon-button>
                    </form>
                  </div>
                </transition>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Image de profil transparente sans fond ni bordure */
.profile-image-transparent {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  object-fit: cover;
}

.form-control {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.list-group-item {
  background-color: transparent;
  padding: 0.75rem 0;
}

.gap-2 {
  gap: 0.5rem;
}

/* Styles pour le slider d'images */
.slider-image {
  transition: opacity 1s ease-in-out;
}

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
