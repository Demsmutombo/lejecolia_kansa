<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import Sidenav from "./examples/Sidenav/index.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import AppFooter from "@/examples/Footer.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

const store = useStore();
const isNavFixed = computed(() => store.state.isNavFixed);
const darkMode = computed(() => store.state.darkMode);
const isAbsolute = computed(() => store.state.isAbsolute);
const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const showNavbar = computed(() => store.state.showNavbar);
const showFooter = computed(() => store.state.showFooter);

// 🎨 Écran de chargement au démarrage
const isAppLoading = ref(true);

onMounted(() => {
  // Masquer l'écran de chargement après que l'app soit prête
  // Attendre que le DOM soit chargé et les ressources initiales
  setTimeout(() => {
    isAppLoading.value = false;
  }, 2000); // 2 secondes minimum pour une expérience fluide
});

const navClasses = computed(() => {
  return {
    "position-sticky bg-white left-auto top-2 z-index-sticky":
      isNavFixed.value && !darkMode.value,
    "position-sticky bg-default left-auto top-2 z-index-sticky":
      isNavFixed.value && darkMode.value,
    "position-absolute px-4 mx-0 w-100 z-index-2": isAbsolute.value,
    "px-0 mx-4": !isAbsolute.value,
  };
});
</script>
<template>
  <!-- 🎨 Écran de chargement au démarrage -->
  <loading-screen :show="isAppLoading" />

  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <sidenav v-if="showSidenav" />

  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->

    <navbar :class="[navClasses]" v-if="showNavbar" />

    <router-view />

    <app-footer v-show="showFooter" />
  </main>
</template>
