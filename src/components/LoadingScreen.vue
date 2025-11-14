<template>
  <transition name="fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <img 
          src="@/assets/img/logo-lejecolia.png" 
          alt="Lejecolia" 
          class="loading-logo"
        />
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p class="loading-text">Chargement en cours...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
});

const isLoading = ref(props.show);

// Auto-masquer après un délai minimum
onMounted(() => {
  // Attendre au moins 1.5 secondes avant de permettre de masquer
  setTimeout(() => {
    if (!props.show) {
      isLoading.value = false;
    }
  }, 1500);
});

// Surveiller les changements de props
import { watch } from 'vue';
watch(() => props.show, (newValue) => {
  // Attendre un minimum de temps avant de masquer
  if (!newValue) {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  } else {
    isLoading.value = true;
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  overflow: hidden;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInUp 0.6s ease-out;
}

.loading-logo {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
  animation: pulse 2s ease-in-out infinite;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(255, 152, 0, 0.2);
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 152, 0, 0.2);
  border-top: 4px solid #ff9800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #344767;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 1rem;
  animation: fadeInOut 1.5s ease-in-out infinite;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Transition pour masquer l'écran */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

