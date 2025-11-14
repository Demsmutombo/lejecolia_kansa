<template>
  <div 
    class="modal fade" 
    :id="modalId" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalElement"
  >
    <div 
      class="modal-dialog modal-dialog-centered"
      :class="modalSizeClass"
    >
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="title">{{ title }}</slot>
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        
        <!-- Body -->
        <div class="modal-body">
          <slot name="body">
            <p>Contenu du modal</p>
          </slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer" v-if="!hideFooter">
          <slot name="footer">
            <argon-button 
              type="button" 
              color="secondary" 
              data-bs-dismiss="modal"
            >
              {{ cancelText }}
            </argon-button>
            <argon-button 
              type="button"
              :color="confirmColor" 
              @click="handleConfirm"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <i class="fas fa-spinner fa-spin me-2"></i>
                {{ loadingText }}
              </span>
              <span v-else>
                <i :class="confirmIcon + ' me-2'"></i>
                {{ confirmText }}
              </span>
            </argon-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Modal } from 'bootstrap';
import ArgonButton from '@/components/ArgonButton.vue';

const props = defineProps({
  modalId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(value)
  },
  hideFooter: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  confirmColor: {
    type: String,
    default: 'success'
  },
  confirmIcon: {
    type: String,
    default: 'fas fa-check'
  },
  loadingText: {
    type: String,
    default: 'Chargement...'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const modalElement = ref(null);

const modalSizeClass = computed(() => {
  const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-custom-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    fullscreen: 'modal-fullscreen'
  };
  return sizeMap[props.size] || '';
});

const handleConfirm = () => {
  emit('confirm');
};

const show = () => {
  if (modalElement.value) {
    const modal = new Modal(modalElement.value);
    modal.show();
  }
};

const hide = () => {
  if (modalElement.value) {
    const modal = Modal.getInstance(modalElement.value);
    if (modal) {
      modal.hide();
    }
  }
};

// Exposer les méthodes
defineExpose({
  show,
  hide
});
</script>

<style scoped>
.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

/* Taille personnalisée pour md (même taille que Sociétés et Sites) */
.modal-custom-md {
  max-width: 520px;
}

.modal-content {
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #344767;
  margin: 0;
}
</style>

