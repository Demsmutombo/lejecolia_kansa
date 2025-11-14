import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("../views/Articles.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/clients",
    name: "Clients",
    component: () => import("../views/Clients.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/utilisateurs",
    name: "Utilisateurs",
    component: () => import("../views/Utilisateurs.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/commandes",
    name: "Commandes",
    component: () => import("../views/Commandes.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/reservations",
    name: "Reservations",
    component: () => import("../views/Reservations.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/commandes/:id",
    name: "CommandeDetail",
    component: () => import("../views/CommandeDetail.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/stocks",
    name: "Stocks",
    component: () => import("../views/Stocks.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/paiements",
    name: "Paiements",
    component: () => import("../views/Paiements.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/journal-ventes",
    name: "JournalVentes",
    component: () => import("../views/JournalVentes.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/journal-paiements",
    name: "JournalPaiements",
    component: () => import("../views/JournalPaiements.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("../views/Notifications.vue"),
    meta: {
      requiresAuth: true,
      requiresGestionnaire: true,
    },
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: () => import("../views/Documentation.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/vente",
    name: "Vente",
    component: () => import("../views/Vente.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    meta: { requiresAuth: false },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory("/lejcolia/"),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.isLoggedIn) {
    userStore.restoreSession();
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: "Signin", query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresGestionnaire && userStore.isCaissier) {
    console.warn("Accès refusé : fonctionnalité réservée à l'équipe de gestion");
    return next({ name: "Dashboard" });
  }

  if (to.meta.requiresSuperAdmin && !userStore.isSuperAdmin) {
    console.warn("Accès refusé : fonctionnalité réservée aux super administrateurs");
    return next({ name: "Dashboard" });
  }

  if (to.name === "Signin" && userStore.isLoggedIn) {
    return next({ name: "Dashboard" });
  }

  if (to.path === "/" && userStore.isLoggedIn) {
    return next({ name: "Dashboard" });
  }

  next();
});

export default router;
