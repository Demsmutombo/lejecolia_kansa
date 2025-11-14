/**
 * Export centralisé de tous les composants de base Argon
 * Permet l'importation facile : import { ArgonButton, ArgonInput } from '@/components'
 */

// Composants de formulaire
export { default as ArgonInput } from './ArgonInput.vue';
export { default as ArgonSelect } from './ArgonSelect.vue';
export { default as ArgonTextarea } from './ArgonTextarea.vue';
export { default as ArgonCheckbox } from './ArgonCheckbox.vue';
export { default as ArgonRadio } from './ArgonRadio.vue';
export { default as ArgonSwitch } from './ArgonSwitch.vue';

// Composants UI
export { default as ArgonButton } from './ArgonButton.vue';
export { default as ArgonBadge } from './ArgonBadge.vue';
export { default as ArgonAlert } from './ArgonAlert.vue';
export { default as ArgonAvatar } from './ArgonAvatar.vue';
export { default as ArgonProgress } from './ArgonProgress.vue';

// Composants de pagination
export { default as ArgonPagination } from './ArgonPagination.vue';
export { default as ArgonPaginationItem } from './ArgonPaginationItem.vue';

// Composants avancés
export { default as DataTable } from './DataTable.vue';
export { default as GenericModal } from './GenericModal.vue';

// Modals
export { default as SocieteModal } from './modals/SocieteModal.vue';
export { default as SiteModal } from './modals/SiteModal.vue';
export { default as UtilisateurModal } from './modals/UtilisateurModal.vue';
export { default as ArticleModal } from './modals/ArticleModal.vue';
export { default as ClientModal } from './modals/ClientModal.vue';
export { default as CommandeModal } from './modals/CommandeModal.vue';
export { default as ReservationModal } from './modals/ReservationModal.vue';
export { default as PaiementModal } from './modals/PaiementModal.vue';
export { default as StockModal } from './modals/StockModal.vue';

// Note: DataTable est un tableau réutilisable avec recherche, pagination et actions
// Voir GUIDE_DATATABLE.md pour la documentation complète

