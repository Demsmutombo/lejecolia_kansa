<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import DashboardGestionnaire from '@/components/dashboard/DashboardGestionnaire.vue';
import DashboardCaissier from '@/components/dashboard/DashboardCaissier.vue';

const userStore = useUserStore();

const isGestionnaire = computed(() => userStore.isGestionnaire);
const isCaissier = computed(() => userStore.isCaissier);
</script>

<template>
  <div class="py-4 container-fluid">
    <dashboard-gestionnaire v-if="isGestionnaire" />
    <dashboard-caissier v-else-if="isCaissier" />
    
    <!-- Fallback si pas de rôle défini -->
    <div v-else class="row">
      <div class="col-12">
        <div class="alert alert-warning">
          <strong>Attention !</strong> Votre rôle n'est pas défini. Veuillez contacter l'administrateur.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles globaux du dashboard */
</style>
