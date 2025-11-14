/**
 * Composable pour gérer le layout de l'application
 * Usage: const { layout, setLayout } = useLayout()
 */
import { computed } from 'vue';
import { useStore } from 'vuex';

export function useLayout() {
  const store = useStore();

  const layout = computed(() => store.state.layout);
  const isAbsolute = computed(() => store.state.isAbsolute);

  const setLayout = (layoutName) => {
    store.state.layout = layoutName;
  };

  const toggleAbsolute = () => {
    store.commit('toggleAbsolute');
  };

  return {
    layout,
    isAbsolute,
    setLayout,
    toggleAbsolute
  };
}

