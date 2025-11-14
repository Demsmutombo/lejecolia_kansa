<template>
  <div class="card" :class="cardClass">
    <!-- En-tête -->
    <div class="card-header pb-0" v-if="title || $slots.header || showSearch || $slots.actions">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div class="mb-2 mb-md-0">
          <slot name="header">
            <h6 class="mb-0">{{ title }}</h6>
            <p v-if="subtitle" class="text-sm text-secondary mb-0">{{ subtitle }}</p>
          </slot>
        </div>
        
        <div class="d-flex gap-2 align-items-center">
          <!-- Recherche -->
          <argon-input
            v-if="showSearch"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            size="sm"
            class="mb-0"
            style="min-width: 200px;"
          />
          
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Corps du tableau -->
    <div class="card-body px-0 pt-0 pb-2">
      <!-- Chargement -->
      <div v-if="loading" class="text-center p-4">
        <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
        <p class="text-sm text-secondary mt-2">{{ loadingText }}</p>
      </div>

      <!-- Vide -->
      <div v-else-if="!filteredData || filteredData.length === 0" class="text-center p-4">
        <i class="ni ni-folder-17 fa-2x text-secondary mb-3"></i>
        <p class="text-sm text-secondary">{{ emptyText }}</p>
      </div>

      <!-- Tableau -->
      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index"
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                :class="getHeaderClass(column, index)"
                :style="column.width ? `width: ${column.width}` : ''"
              >
                {{ column.label }}
              </th>
              <th v-if="hasActions" class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, rowIndex) in paginatedData" 
              :key="getRowKey(row, rowIndex)"
              :class="rowClass"
              @click="handleRowClick(row, rowIndex)"
            >
              <td
                v-for="(column, colIndex) in columns"
                :key="colIndex"
                :class="getCellClass(column)"
              >
                <!-- Slot personnalisé pour cette cellule -->
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :value="getValue(row, column.key)"
                  :index="rowIndex"
                >
                  <!-- Rendu par défaut -->
                  <span v-html="renderCell(column, row, rowIndex)"></span>
                </slot>
              </td>

              <!-- Actions -->
              <td v-if="hasActions" class="align-middle">
                <slot name="row-actions" :row="row" :index="rowIndex">
                  <div class="d-flex gap-2 justify-content-end">
                    <a
                      v-for="(action, actIndex) in actions"
                      :key="actIndex"
                      href="javascript:;"
                      class="font-weight-bold text-xs"
                      :class="getActionClass(action, row)"
                      :title="getActionLabel(action, row)"
                      @click.stop="handleAction(action, row, rowIndex)"
                    >
                      <i v-if="getActionIcon(action, row)" :class="getActionIcon(action, row)" class="me-1"></i>
                      <span v-if="!action.iconOnly">{{ getActionLabel(action, row) }}</span>
                    </a>
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div 
        v-if="showPagination && totalPages > 1" 
        class="d-flex justify-content-between align-items-center px-3 py-3 flex-wrap"
      >
        <div class="text-sm text-secondary mb-2 mb-md-0">
          {{ startIndex + 1 }}-{{ endIndex }} sur {{ filteredData.length }}
        </div>
        <argon-pagination>
          <argon-pagination-item
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            prev
          />
          <argon-pagination-item
            v-for="page in visiblePages"
            :key="page"
            :label="page.toString()"
            :active="page === currentPage"
            @click="goToPage(page)"
          />
          <argon-pagination-item
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            next
          />
        </argon-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ArgonInput from './ArgonInput.vue';
import ArgonPagination from './ArgonPagination.vue';
import ArgonPaginationItem from './ArgonPaginationItem.vue';
import ArgonBadge from './ArgonBadge.vue';
import ArgonAvatar from './ArgonAvatar.vue';
import plateformeLogo from '@/assets/img/logo-plateforme.png';

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  actions: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Chargement...' },
  emptyText: { type: String, default: 'Aucune donnée' },
  showSearch: { type: Boolean, default: false },
  searchFields: { type: Array, default: () => [] },
  showPagination: { type: Boolean, default: true },
  itemsPerPage: { type: Number, default: 10 },
  cardClass: { type: String, default: '' },
  rowClass: { type: String, default: '' },
  rowKey: { type: String, default: 'id' }
});

const emit = defineEmits(['action', 'row-click']);

const searchQuery = ref('');
const currentPage = ref(1);

const hasActions = computed(() => props.actions && props.actions.length > 0);

// Filtrage
const filteredData = computed(() => {
  if (!searchQuery.value || props.searchFields.length === 0) return props.data;
  
  const query = searchQuery.value.toLowerCase();
  return props.data.filter(row =>
    props.searchFields.some(field => {
      const val = getValue(row, field);
      return val && val.toString().toLowerCase().includes(query);
    })
  );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredData.value.length / props.itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + props.itemsPerPage, filteredData.value.length));
const paginatedData = computed(() => 
  props.showPagination 
    ? filteredData.value.slice(startIndex.value, endIndex.value)
    : filteredData.value
);

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

// Fonctions utilitaires
const getValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

const getRowKey = (row, index) => getValue(row, props.rowKey) || index;

const getHeaderClass = (column, index) => {
  const classes = [];
  if (column.align === 'center') classes.push('text-center');
  if (column.align === 'right') classes.push('text-end');
  if (index > 0) classes.push('ps-2');
  return classes.join(' ');
};

const getCellClass = (column) => {
  const classes = [column.className || ''];
  if (column.align === 'center') classes.push('align-middle text-center');
  if (column.align === 'right') classes.push('align-middle text-end');
  return classes.join(' ');
};

const renderCell = (column, row, rowIndex = 0) => {
  const value = getValue(row, column.key);
  
  if (column.render) {
    return column.render(value, row, rowIndex);
  }
  
  switch (column.type) {
    case 'index':
      // Numéro de ligne séquentiel (commence à 1)
      const pageOffset = (currentPage.value - 1) * props.itemsPerPage;
      return `<strong>${pageOffset + rowIndex + 1}</strong>`;
    
    case 'badge':
      const badgeColor = column.badgeColor ? (typeof column.badgeColor === 'function' ? column.badgeColor(value, row) : column.badgeColor) : 'primary';
      return `<span class="badge badge-sm bg-gradient-${badgeColor}">${value || '-'}</span>`;
    
    case 'date':
      return value ? new Date(value).toLocaleDateString('fr-FR') : '-';
    
    case 'currency':
      return value !== null && value !== undefined 
        ? new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF' }).format(value)
        : '-';
    
    case 'avatar':
      const name = getValue(row, column.nameKey || 'name');
      const email = getValue(row, column.emailKey || 'email');
      const avatar = getValue(row, column.avatarKey || 'avatar');
      return `
        <div class="d-flex px-2 py-1">
          <div>
            <img src="${avatar || plateformeLogo}" class="avatar avatar-sm me-3" alt="${name}" />
          </div>
          <div class="d-flex flex-column justify-content-center">
            <h6 class="mb-0 text-sm">${name || '-'}</h6>
            ${email ? `<p class="text-xs text-secondary mb-0">${email}</p>` : ''}
          </div>
        </div>
      `;
    
    default:
      return value || '-';
  }
};

// Helpers pour actions dynamiques
const getActionLabel = (action, row) => {
  return typeof action.label === 'function' ? action.label(row) : action.label;
};

const getActionIcon = (action, row) => {
  return typeof action.icon === 'function' ? action.icon(row) : action.icon;
};

const getActionClass = (action, row) => {
  const baseClass = typeof action.class === 'function' ? action.class(row) : action.class;
  return baseClass || 'text-secondary';
};

const handleAction = (action, row, index) => {
  if (action.onClick) action.onClick(row, index);
  emit('action', { action: action.name || getActionLabel(action, row), row, index });
};

const handleRowClick = (row, index) => {
  emit('row-click', { row, index });
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

watch(searchQuery, () => currentPage.value = 1);
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
