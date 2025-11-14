/**
 * Composable pour gérer la navigation et l'interface
 * Usage: const { showSidenav, toggleSidenav } = useNavigation()
 */
import { computed } from 'vue';
import { useStore } from 'vuex';

export function useNavigation() {
  const store = useStore();

  const showSidenav = computed(() => store.state.showSidenav);
  const showNavbar = computed(() => store.state.showNavbar);
  const showFooter = computed(() => store.state.showFooter);
  const showConfig = computed(() => store.state.showConfig);
  const hideConfigButton = computed(() => store.state.hideConfigButton);
  const isPinned = computed(() => store.state.isPinned);
  const isNavFixed = computed(() => store.state.isNavFixed);

  const toggleSidenav = () => {
    store.commit('toggleSidenav');
  };

  const sidebarMinimize = () => {
    store.commit('sidebarMinimize');
  };

  const toggleConfigurator = () => {
    store.commit('toggleConfigurator');
  };

  const navbarFixed = () => {
    store.commit('navbarFixed');
  };

  const navbarMinimize = () => {
    store.commit('navbarMinimize');
  };

  return {
    showSidenav,
    showNavbar,
    showFooter,
    showConfig,
    hideConfigButton,
    isPinned,
    isNavFixed,
    toggleSidenav,
    sidebarMinimize,
    toggleConfigurator,
    navbarFixed,
    navbarMinimize
  };
}

