/**
 * Composable pour simplifier l'utilisation de l'authentification et des rôles
 * Usage: const { isLoggedIn, isSuperAdmin, canAccess, login, logout } = useAuth()
 */
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

export function useAuth() {
  const userStore = useUserStore();
  const router = useRouter();

  // États computed
  const isLoggedIn = computed(() => userStore.isLoggedIn);
  const isSuperAdmin = computed(() => userStore.isSuperAdmin);
  const isGestionnaire = computed(() => userStore.isGestionnaire);
  const isCaissier = computed(() => userStore.isCaissier);
  const role = computed(() => userStore.role);
  const userId = computed(() => userStore.userId);
  const userName = computed(() => userStore.userName);
  const societeId = computed(() => userStore.societeId);
  const societeName = computed(() => userStore.societeName);
  const userSocietes = computed(() => userStore.userSocietes);
  const hasMultipleSocietes = computed(() => userStore.hasMultipleSocietes);

  /**
   * Connexion simplifiée
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} redirectTo - Route de redirection après connexion
   */
  const login = (userData, redirectTo = '/dashboard') => {
    userStore.login(userData);
    router.push(redirectTo);
  };

  /**
   * Déconnexion simplifiée
   * @param {string} redirectTo - Route de redirection après déconnexion
   */
  const logout = (redirectTo = '/signin') => {
    userStore.logout();
    router.push(redirectTo);
  };

  /**
   * Vérifier si l'utilisateur peut accéder à une fonctionnalité
   * @param {string} requiredRole - Rôle requis ('superadmin' ou autre)
   * @returns {boolean}
   */
  const canAccess = (requiredRole) => {
    return userStore.canAccess(requiredRole);
  };

  /**
   * Changer de société active (pour superadmin)
   * @param {number|string} newSocieteId
   * @param {string} newSocieteName
   */
  const changeSociete = (newSocieteId, newSocieteName) => {
    userStore.changeSociete(newSocieteId, newSocieteName);
  };

  /**
   * Vérifier si l'utilisateur est authentifié, sinon rediriger
   */
  const requireAuth = () => {
    if (!isLoggedIn.value) {
      router.push('/signin');
      return false;
    }
    return true;
  };

  /**
   * Vérifier si l'utilisateur est superadmin, sinon rediriger
   */
  const requireSuperAdmin = () => {
    if (!isLoggedIn.value) {
      router.push('/signin');
      return false;
    }
    if (!isSuperAdmin.value) {
      console.warn('Accès refusé : Réservé aux super administrateurs');
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  return {
    // États
    isLoggedIn,
    isSuperAdmin,
    isGestionnaire,
    isCaissier,
    role,
    userId,
    userName,
    societeId,
    societeName,
    userSocietes,
    hasMultipleSocietes,
    
    // Actions
    login,
    logout,
    canAccess,
    changeSociete,
    requireAuth,
    requireSuperAdmin
  };
}

