/**
 * Composable pour gérer le thème de l'application
 * Usage: const { darkMode, toggleDarkMode } = useTheme()
 */
import { computed } from 'vue';
import { useStore } from 'vuex';

export function useTheme() {
  const store = useStore();

  const darkMode = computed(() => store.state.darkMode);
  const isRTL = computed(() => store.state.isRTL);
  const isTransparent = computed(() => store.state.isTransparent);

  const toggleDarkMode = () => {
    store.commit('toggleDarkMode');
  };

  const setDarkMode = (value) => {
    store.state.darkMode = value;
  };

  const toggleRTL = () => {
    store.commit('toggleRTL');
  };

  return {
    darkMode,
    isRTL,
    isTransparent,
    toggleDarkMode,
    setDarkMode,
    toggleRTL
  };
}

