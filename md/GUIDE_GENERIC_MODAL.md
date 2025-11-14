# 🪟 GenericModal - Composant Modal Réutilisable

## 📋 Description

**GenericModal** est un composant modal Bootstrap 5 réutilisable, **centré verticalement** et personnalisable via des props et des slots.

## ✨ Fonctionnalités

- ✅ **Centré verticalement** sur l'écran
- ✅ **Tailles configurables** (sm, md, lg, xl, fullscreen)
- ✅ **Slots personnalisables** (title, body, footer)
- ✅ **Header avec dégradé** élégant
- ✅ **Body scrollable** avec scrollbar personnalisée
- ✅ **Loading state** intégré
- ✅ **Responsive** et mobile-friendly
- ✅ **API simple** (show/hide)

---

## 📦 Installation

Le composant est déjà exporté dans `src/components/index.js` :

```javascript
import { GenericModal } from '@/components';
```

---

## 🎯 Usage de Base

### 1. Modal Simple

```vue
<template>
  <div>
    <button @click="openModal">Ouvrir Modal</button>
    
    <generic-modal
      modal-id="myModal"
      title="Mon Modal"
      ref="modalRef"
    >
      <template #body>
        <p>Contenu de mon modal</p>
      </template>
    </generic-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { GenericModal } from '@/components';

const modalRef = ref(null);

const openModal = () => {
  modalRef.value?.show();
};
</script>
```

---

## 🎨 Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `modalId` | String | **required** | ID unique du modal (obligatoire) |
| `title` | String | `'Modal'` | Titre du modal |
| `size` | String | `'md'` | Taille: `sm`, `md`, `lg`, `xl`, `fullscreen` |
| `hideFooter` | Boolean | `false` | Masquer le footer |
| `cancelText` | String | `'Annuler'` | Texte bouton annuler |
| `confirmText` | String | `'Confirmer'` | Texte bouton confirmer |
| `confirmColor` | String | `'success'` | Couleur bouton confirmer |
| `confirmIcon` | String | `'fas fa-check'` | Icône bouton confirmer |
| `loadingText` | String | `'Chargement...'` | Texte pendant chargement |
| `isLoading` | Boolean | `false` | État de chargement |

---

## 🎭 Slots

### 1. **Slot `title`** (optionnel)

Personnaliser le titre du modal :

```vue
<generic-modal modal-id="myModal">
  <template #title>
    <i class="fas fa-star me-2"></i>
    Titre Personnalisé
  </template>
</generic-modal>
```

### 2. **Slot `body`** (principal)

Contenu du modal :

```vue
<generic-modal modal-id="myModal">
  <template #body>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="name" />
      <button type="submit">Envoyer</button>
    </form>
  </template>
</generic-modal>
```

### 3. **Slot `footer`** (optionnel)

Personnaliser les boutons du footer :

```vue
<generic-modal modal-id="myModal">
  <template #footer>
    <button @click="handleClose">Fermer</button>
    <button @click="handleSave">Sauvegarder</button>
    <button @click="handleDelete" class="btn-danger">Supprimer</button>
  </template>
</generic-modal>
```

---

## 📡 Événements

| Événement | Payload | Description |
|-----------|---------|-------------|
| `@confirm` | - | Émis au clic sur "Confirmer" |
| `@cancel` | - | Émis au clic sur "Annuler" |
| `@close` | - | Émis à la fermeture du modal |

---

## 🔧 Méthodes Exposées

### `show()`

Ouvrir le modal programmatiquement :

```javascript
const modalRef = ref(null);

const openModal = () => {
  modalRef.value.show();
};
```

### `hide()`

Fermer le modal programmatiquement :

```javascript
const closeModal = () => {
  modalRef.value.hide();
};
```

---

## 📐 Tailles Disponibles

```vue
<!-- Petit (300px) -->
<generic-modal modal-id="modal1" size="sm" />

<!-- Moyen (500px) - Défaut -->
<generic-modal modal-id="modal2" size="md" />

<!-- Grand (800px) -->
<generic-modal modal-id="modal3" size="lg" />

<!-- Extra-large (1140px) -->
<generic-modal modal-id="modal4" size="xl" />

<!-- Plein écran -->
<generic-modal modal-id="modal5" size="fullscreen" />
```

---

## 💡 Exemples Avancés

### 1. Modal de Confirmation

```vue
<template>
  <generic-modal
    modal-id="confirmModal"
    title="Confirmer la suppression"
    size="sm"
    confirm-text="Oui, supprimer"
    confirm-color="danger"
    confirm-icon="fas fa-trash"
    @confirm="handleDelete"
    ref="confirmModalRef"
  >
    <template #body>
      <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
      <p class="text-danger">Cette action est irréversible.</p>
    </template>
  </generic-modal>
</template>

<script setup>
import { ref } from 'vue';

const confirmModalRef = ref(null);

const showConfirmation = () => {
  confirmModalRef.value.show();
};

const handleDelete = () => {
  console.log('Suppression confirmée');
  confirmModalRef.value.hide();
};
</script>
```

### 2. Modal avec Loading

```vue
<template>
  <generic-modal
    modal-id="saveModal"
    title="Enregistrement"
    :is-loading="isSaving"
    loading-text="Enregistrement en cours..."
    @confirm="handleSave"
    ref="saveModalRef"
  >
    <template #body>
      <form>
        <input v-model="formData.name" placeholder="Nom" />
        <input v-model="formData.email" placeholder="Email" />
      </form>
    </template>
  </generic-modal>
</template>

<script setup>
import { ref } from 'vue';

const saveModalRef = ref(null);
const isSaving = ref(false);
const formData = ref({ name: '', email: '' });

const handleSave = async () => {
  isSaving.value = true;
  try {
    await api.save(formData.value);
    saveModalRef.value.hide();
  } catch (error) {
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>
```

### 3. Modal sans Footer

```vue
<generic-modal
  modal-id="infoModal"
  title="Information"
  :hide-footer="true"
>
  <template #body>
    <p>Ceci est un modal d'information sans boutons.</p>
  </template>
</generic-modal>
```

### 4. Modal Personnalisé Complet

```vue
<template>
  <generic-modal
    modal-id="customModal"
    size="lg"
    ref="customModalRef"
  >
    <template #title>
      <div class="d-flex align-items-center">
        <img src="/logo.png" width="30" class="me-2" />
        <span>Créer une Société</span>
      </div>
    </template>

    <template #body>
      <form @submit.prevent="handleSubmit">
        <!-- Formulaire complet ici -->
        <input v-model="societe.nom" placeholder="Nom" />
        <input v-model="societe.email" placeholder="Email" />
      </form>
    </template>

    <template #footer>
      <button class="btn btn-secondary" @click="closeModal">
        Annuler
      </button>
      <button class="btn btn-primary" @click="handleSubmit" :disabled="isSaving">
        <span v-if="isSaving">
          <i class="fas fa-spinner fa-spin me-2"></i>
          Enregistrement...
        </span>
        <span v-else>
          <i class="fas fa-save me-2"></i>
          Créer
        </span>
      </button>
    </template>
  </generic-modal>
</template>

<script setup>
import { ref } from 'vue';

const customModalRef = ref(null);
const isSaving = ref(false);
const societe = ref({ nom: '', email: '' });

const handleSubmit = async () => {
  isSaving.value = true;
  // ... logique de sauvegarde
  isSaving.value = false;
  customModalRef.value.hide();
};

const closeModal = () => {
  customModalRef.value.hide();
};
</script>
```

---

## 🎨 Personnalisation CSS

Le modal utilise des classes Bootstrap 5 et des styles personnalisés :

### Classes Disponibles

- `.modal-dialog-centered` - Centre le modal verticalement
- `.modal-sm` - Petit modal
- `.modal-lg` - Grand modal
- `.modal-xl` - Très grand modal
- `.modal-fullscreen` - Plein écran

### Override CSS

```vue
<style>
/* Personnaliser le header */
.modal-header {
  background: linear-gradient(195deg, #42424a 0%, #191919 100%);
}

/* Personnaliser le body */
.modal-body {
  padding: 2rem;
}

/* Personnaliser le footer */
.modal-footer {
  background-color: #f8f9fa;
}
</style>
```

---

## 📱 Responsive

Le modal s'adapte automatiquement sur mobile :

- **Desktop** : Taille configurée via prop
- **Tablet** : Largeur automatique avec marges
- **Mobile** : Pleine largeur avec padding réduit

---

## ♿ Accessibilité

- ✅ `aria-hidden="true"` sur modal fermé
- ✅ `tabindex="-1"` pour navigation clavier
- ✅ `aria-label="Close"` sur bouton fermeture
- ✅ Focus automatique à l'ouverture
- ✅ Fermeture avec `ESC`
- ✅ Fermeture au clic sur backdrop

---

## 🔄 Comparaison avec SocieteModal

| Fonctionnalité | GenericModal | SocieteModal |
|----------------|--------------|--------------|
| **Usage** | Universel | Spécifique aux sociétés |
| **Slots** | ✅ Complets (title, body, footer) | ❌ Formulaire fixe |
| **Personnalisable** | ✅ 100% | ⚠️ Limité |
| **Taille** | ✅ Configurable | ✅ Configurable |
| **Footer** | ✅ Masquable | ❌ Toujours affiché |
| **Centré** | ✅ Oui | ✅ Oui |

---

## 🎯 Cas d'Usage

### Utiliser GenericModal pour :

- ✅ Confirmations simples
- ✅ Alertes personnalisées
- ✅ Formulaires simples
- ✅ Affichage d'informations
- ✅ Dialogs personnalisés

### Utiliser SocieteModal pour :

- ✅ CRUD Sociétés
- ✅ Formulaire complet avec upload logo
- ✅ Validation spécifique

---

## 📝 Exemple Complet - Page avec Liste

```vue
<template>
  <div>
    <!-- Bouton d'ouverture -->
    <argon-button color="success" @click="openCreateModal">
      <i class="fas fa-plus me-2"></i>
      Nouveau
    </argon-button>

    <!-- Modal Création -->
    <generic-modal
      modal-id="createModal"
      title="Créer un élément"
      size="md"
      confirm-text="Créer"
      confirm-color="success"
      :is-loading="isCreating"
      @confirm="handleCreate"
      ref="createModalRef"
    >
      <template #body>
        <form>
          <div class="mb-3">
            <label>Nom</label>
            <input v-model="newItem.name" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Description</label>
            <textarea v-model="newItem.description" class="form-control"></textarea>
          </div>
        </form>
      </template>
    </generic-modal>

    <!-- Modal Confirmation Suppression -->
    <generic-modal
      modal-id="deleteModal"
      title="Confirmer la suppression"
      size="sm"
      confirm-text="Supprimer"
      confirm-color="danger"
      @confirm="handleDelete"
      ref="deleteModalRef"
    >
      <template #body>
        <p>Êtes-vous sûr de vouloir supprimer "{{ itemToDelete?.name }}" ?</p>
      </template>
    </generic-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { GenericModal, ArgonButton } from '@/components';
import { useSweetAlert } from '@/composables';

const { showSuccess } = useSweetAlert();

const createModalRef = ref(null);
const deleteModalRef = ref(null);
const isCreating = ref(false);
const newItem = ref({ name: '', description: '' });
const itemToDelete = ref(null);

const openCreateModal = () => {
  newItem.value = { name: '', description: '' };
  createModalRef.value.show();
};

const handleCreate = async () => {
  isCreating.value = true;
  try {
    await api.create(newItem.value);
    createModalRef.value.hide();
    await showSuccess('Créé !', 'Élément créé avec succès');
  } finally {
    isCreating.value = false;
  }
};

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  deleteModalRef.value.show();
};

const handleDelete = async () => {
  await api.delete(itemToDelete.value.id);
  deleteModalRef.value.hide();
  await showSuccess('Supprimé !', 'Élément supprimé avec succès');
};
</script>
```

---

## 🎊 Résumé

**GenericModal** est un composant modal Bootstrap 5 :

✅ **Centré verticalement** sur tous les écrans  
✅ **Tailles configurables** (sm, md, lg, xl)  
✅ **Slots personnalisables** (title, body, footer)  
✅ **Loading state** intégré  
✅ **API simple** (show/hide)  
✅ **Responsive** et accessible  
✅ **Réutilisable** pour tout type de modal  

**Utilisez-le partout où vous avez besoin d'un modal !** 🚀

