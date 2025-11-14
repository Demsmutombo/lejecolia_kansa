<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";
import { useUserStore } from "@/stores/user";
import api from "@/services/api.service";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const userStore = useUserStore();

const route = useRoute();

const currentRouteName = computed(() => {
  return route.name;
});
const currentDirectory = computed(() => {
  let dir = route.path.split("/")[1];
  return dir.charAt(0).toUpperCase() + dir.slice(1);
});

const minimizeSidebar = () => store.commit("sidebarMinimize");

// 🔔 Nombre de notifications non lues
const notificationsNonLues = ref(0);

// Charger le nombre de notifications non lues
const loadNotificationsCount = async () => {
  try {
    if (!userStore.userId) return;
    
    const response = await api.getNotificationsUtilisateur(userStore.userId, false);
    const notifications = Array.isArray(response) ? response : [];
    
    // Compter les notifications non lues
    notificationsNonLues.value = notifications.filter(n => !n.isLu).length;
    
    console.log(`🔔 ${notificationsNonLues.value} notification(s) non lue(s)`);
  } catch (error) {
    console.warn('⚠️ Erreur chargement notifications:', error);
  }
};

// Interval pour rafraîchir le compteur automatiquement
let notificationInterval = null;

onMounted(() => {
  // Charger au démarrage
  loadNotificationsCount();
  
  // Rafraîchir toutes les 30 secondes
  notificationInterval = setInterval(() => {
    loadNotificationsCount();
  }, 30000); // 30 secondes
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>
<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentDirectory"
      />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <div class="input-group">
            <span class="input-group-text text-body">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              class="form-control"
              :placeholder="isRTL ? 'أكتب هنا...' : 'Type here...'"
            />
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              href="#"
              @click="minimizeSidebar"
              class="p-0 nav-link text-white"
              id="iconNavbarSidenav"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
              </div>
            </a>
          </li>
          <li
            class="nav-item d-flex align-items-center"
            :class="isRTL ? 'ps-2' : 'pe-2'"
          >
            <router-link
              to="/notifications"
              class="p-0 nav-link text-white position-relative"
              title="Voir les notifications"
            >
              <i class="cursor-pointer fa fa-bell"></i>
              <!-- Badge pour les notifications non lues -->
              <span 
                v-if="notificationsNonLues > 0"
                class="badge badge-sm bg-gradient-danger position-absolute top-0 start-100 translate-middle"
                style="font-size: 0.65rem; padding: 0.25rem 0.4rem; border-radius: 50%;"
              >
                {{ notificationsNonLues > 9 ? '9+' : notificationsNonLues }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
