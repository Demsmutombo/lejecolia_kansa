/**
 * Export centralisé de tous les composants exemples
 * Permet l'importation facile : import { MasterCard, GradientLineChart } from '@/examples'
 */

// Layouts
export { default as Breadcrumbs } from './Breadcrumbs.vue';
export { default as Footer } from './Footer.vue';
export { default as Configurator } from './Configurator.vue';
// Calendar et Globe nécessitent des dépendances supplémentaires (@fullcalendar, three.js)
// Décommentez après installation : npm install @fullcalendar/core @fullcalendar/daygrid three
// export { default as Calendar } from './Calendar.vue';
// export { default as Globe } from './Globe.vue';

// Navigation
export { default as Navbar } from './Navbars/Navbar.vue';
export { default as Sidenav } from './Sidenav/index.vue';
export { default as SidenavCard } from './Sidenav/SidenavCard.vue';
export { default as SidenavItem } from './Sidenav/SidenavItem.vue';
export { default as SidenavList } from './Sidenav/SidenavList.vue';

// Cards
export { default as ComplexStatisticsCard } from './Cards/ComplexStatisticsCard.vue';
export { default as DefaultCounterCard } from './Cards/DefaultCounterCard.vue';
export { default as DefaultInfoCard } from './Cards/DefaultInfoCard.vue';
export { default as MasterCard } from './Cards/MasterCard.vue';
export { default as MiniStatisticsCard } from './Cards/MiniStatisticsCard.vue';
export { default as TimelineItem } from './Cards/TimelineItem.vue';
export { default as TimelineList } from './Cards/TimelineList.vue';

// Charts
export { default as ActiveUsersChart } from './Charts/ActiveUsersChart.vue';
export { default as GradientLineChart } from './Charts/GradientLineChart.vue';

// Page Layouts
export { default as PageFooter } from './PageLayout/Footer.vue';
export { default as PageNavbar } from './PageLayout/Navbar.vue';

