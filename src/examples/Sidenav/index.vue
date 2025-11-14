<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useUserStore } from "@/stores/user";
import SidenavList from "./SidenavList.vue";
import api from "@/services/api.service";
import API_CONFIG from "@/config/api";
import plateformeLogo from "@/assets/img/logo-plateforme.png";

const store = useStore();
const userStore = useUserStore();

const PLATFORM_NAME = "Lejecolia";

const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);

// Logo et nom de la société
const societeLogo = ref(null);
const societeNomAPI = ref('');

// Charger le logo de la société depuis l'API Societes
const loadSocieteLogo = async () => {
  try {
    if (!userStore.isLoggedIn || !userStore.societeId) {
      console.log('⚠️ Pas de societeId - Logo par défaut');
      return;
    }
    
    console.log('🔍 Chargement logo société ID:', userStore.societeId);
    
    // Charger la société Lejecolia
    const societeResponse = await api.getSocieteById(userStore.societeId || 3);
    const maSociete = societeResponse || null;
    
    if (maSociete) {
      console.log('✅ Société trouvée:', {
        nom: maSociete.nomSociete,
        hasLogo: !!maSociete.logo,
        logoSize: maSociete.logo?.length || 0
      });
      
      // Stocker le logo (filtrer si trop grand)
      if (maSociete.logo && maSociete.logo.length > 0) {
        const normalizedLogo = normalizeLogoValue(maSociete.logo);
        if (normalizedLogo) {
          societeLogo.value = normalizedLogo;
        }
      }
      
      societeNomAPI.value = maSociete.nomSociete;
    } else {
      console.log('⚠️ Société non trouvée dans la liste');
    }
  } catch (error) {
    console.warn('⚠️ Impossible de charger le logo:', error.message);
  }
};

const determineBase64MimeType = (base64String = "") => {
  if (base64String.startsWith("/9j/")) {
    return "data:image/jpeg;base64,";
  }
  if (base64String.startsWith("iVBORw0KGgo")) {
    return "data:image/png;base64,";
  }
  if (base64String.startsWith("R0lGODlh") || base64String.startsWith("R0lGODdh")) {
    return "data:image/gif;base64,";
  }
  if (base64String.startsWith("UklGR")) {
    return "data:image/webp;base64,";
  }
  return "data:image/png;base64,";
};

const normalizeLogoValue = (rawLogo) => {
  if (!rawLogo) {
    return null;
  }

  const trimmed = rawLogo.trim();

  if (trimmed.startsWith("data:image")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    console.log("ℹ️ Logo société via URL absolue");
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    console.log("ℹ️ Logo société via chemin absolu backend");
    return `${API_CONFIG.BASE_URL?.replace(/\/$/, "") || ""}${trimmed}`;
  }

  if (trimmed.length < 300000) {
    const prefix = determineBase64MimeType(trimmed);
    console.log("ℹ️ Logo société converti en data URL:", prefix);
    return `${prefix}${trimmed}`;
  }

  console.warn("⚠️ Logo société ignoré (format non pris en charge)");
  return null;
};

// URL du logo (logo société ou logo par défaut)
const logoUrl = computed(() => {
  if (societeLogo.value) {
    return societeLogo.value;
  }
  return plateformeLogo;
});

const plateformeNom = computed(() => PLATFORM_NAME);

// Charger le logo au montage
onMounted(() => {
  if (userStore.isLoggedIn) {
    loadSocieteLogo();
  }
});

// Recharger si l'utilisateur se connecte
watch(() => userStore.isLoggedIn, (newVal) => {
  if (newVal) {
    loadSocieteLogo();
  }
});
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-primary'}`"
  />

  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}    
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : ' '
      } ${sidebarType}`"
    id="sidenav-main"
  >
    <div class="sidenav-header">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>

      <router-link class="m-0 navbar-brand" to="/">
        <img
          :src="logoUrl"
          class="navbar-brand-img h-100"
          alt="Logo plateforme"
          style="max-height: 50px; object-fit: contain;"
        />
        <span class="ms-2 font-weight-bold me-2">{{ plateformeNom }}</span>
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />

    <sidenav-list />
  </aside>
</template>
