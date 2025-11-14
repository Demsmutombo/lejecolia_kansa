<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useUserStore } from "@/stores/user";

import SidenavItem from "./SidenavItem.vue";

const store = useStore();
const userStore = useUserStore();
const router = useRouter();
const currentRoute = useRoute();

const isRTL = computed(() => store.state.isRTL);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const isSuperAdmin = computed(() => userStore.isSuperAdmin);
const isCaissier = computed(() => userStore.isCaissier);
const hasGestionAccess = computed(() => !isCaissier.value || isSuperAdmin.value);

const getRoute = () => {
  const routeArr = currentRoute.path.split("/");
  return routeArr[1] || "";
};

const handleLogout = () => {
  userStore.logout();
  router.push("/signin");
};
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="mt-3 nav-item" v-if="isLoggedIn">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          Espace Lejecolia
        </h6>
      </li>

      <li class="nav-item" v-if="isLoggedIn">
        <sidenav-item
          to="/dashboard"
          :class="getRoute() === 'dashboard' ? 'active' : ''"
          navText="Dashboard"
        >
          <template #icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/articles"
          :class="getRoute() === 'articles' ? 'active' : ''"
          navText="Articles"
        >
          <template #icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/clients"
          :class="getRoute() === 'clients' ? 'active' : ''"
          navText="Clients"
        >
          <template #icon>
            <i class="ni ni-circle-08 text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/utilisateurs"
          :class="getRoute() === 'utilisateurs' ? 'active' : ''"
          navText="Utilisateurs"
        >
          <template #icon>
            <i class="ni ni-badge text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/commandes"
          :class="getRoute() === 'commandes' ? 'active' : ''"
          navText="Commandes"
        >
          <template #icon>
            <i class="ni ni-cart text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/reservations"
          :class="getRoute() === 'reservations' ? 'active' : ''"
          navText="Réservations"
        >
          <template #icon>
            <i class="ni ni-calendar-grid-58 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/stocks"
          :class="getRoute() === 'stocks' ? 'active' : ''"
          navText="Stocks"
        >
          <template #icon>
            <i class="ni ni-box-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="isLoggedIn">
        <sidenav-item
          to="/vente"
          :class="getRoute() === 'vente' ? 'active' : ''"
          navText="Point de Vente"
        >
          <template #icon>
            <i class="fas fa-cash-register text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/paiements"
          :class="getRoute() === 'paiements' ? 'active' : ''"
          navText="Paiements"
        >
          <template #icon>
            <i class="ni ni-money-coins text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/journal-ventes"
          :class="getRoute() === 'journal-ventes' ? 'active' : ''"
          navText="Journal des ventes"
        >
          <template #icon>
            <i class="ni ni-chart-bar-32 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/journal-paiements"
          :class="getRoute() === 'journal-paiements' ? 'active' : ''"
          navText="Journal des paiements"
        >
          <template #icon>
            <i class="ni ni-single-copy-04 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="hasGestionAccess">
        <sidenav-item
          to="/notifications"
          :class="getRoute() === 'notifications' ? 'active' : ''"
          navText="Notifications"
        >
          <template #icon>
            <i class="ni ni-bell-55 text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item" v-if="isLoggedIn">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          Mon Compte
        </h6>
      </li>

      <li class="nav-item" v-if="isLoggedIn">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          navText="Profil"
        >
          <template #icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="isLoggedIn">
        <sidenav-item
          to="/documentation"
          :class="getRoute() === 'documentation' ? 'active' : ''"
          navText="Documentation"
        >
          <template #icon>
            <i class="fas fa-book text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" v-if="isLoggedIn">
        <a
          class="nav-link"
          href="javascript:;"
          @click="handleLogout"
        >
          <div
            class="shadow icon icon-shape icon-sm border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
          >
            <i class="ni ni-button-power text-danger text-sm opacity-10"></i>
          </div>
          <span class="nav-link-text ms-1">Déconnexion</span>
        </a>
      </li>
    </ul>
  </div>
</template>

