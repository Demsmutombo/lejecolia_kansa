# 🎯 ArgonSelect - Composant Select/Dropdown

## 📋 Description

**ArgonSelect** est un composant de sélection (dropdown/liste déroulante) réutilisable, stylisé dans le thème Argon Dashboard.

## ✨ Fonctionnalités

- ✅ **v-model** compatible
- ✅ **Options dynamiques** (depuis API ou données locales)
- ✅ **Placeholder** personnalisable
- ✅ **États de validation** (success/error)
- ✅ **Tailles configurables** (sm, md, lg)
- ✅ **Désactivable** (disabled)
- ✅ **Clés personnalisables** (valueKey, labelKey)
- ✅ **Champ requis** (isRequired)

---

## 📦 Installation

Le composant est déjà exporté dans `src/components/index.js` :

```javascript
import { ArgonSelect } from '@/components';
```

---

## 🎯 Usage de Base

### 1. Select Simple

```vue
<template>
  <argon-select
    v-model="selectedType"
    :options="types"
    placeholder="Choisir un type"
  />
</template>

<script setup>
import { ref } from 'vue';
import { ArgonSelect } from '@/components';

const selectedType = ref('');
const types = ref([
  { value: 'SARL', label: 'SARL - Société à Responsabilité Limitée' },
  { value: 'SA', label: 'SA - Société Anonyme' },
  { value: 'SPRL', label: 'SPRL - Société Privée à Responsabilité Limitée' }
]);
</script>
```

---

## 🎨 Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `modelValue` | String, Number | `''` | Valeur sélectionnée (v-model) |
| `options` | Array | `[]` | Liste des options à afficher |
| `placeholder` | String | `'Sélectionner...'` | Texte par défaut |
| `name` | String | `''` | Attribut name du select |
| `id` | String | `''` | Attribut id du select |
| `size` | String | `'default'` | Taille: `sm`, `default`, `lg` |
| `success` | Boolean | `false` | État de validation réussie |
| `error` | Boolean | `false` | État d'erreur |
| `disabled` | Boolean | `false` | Désactiver le select |
| `isRequired` | Boolean | `false` | Champ obligatoire |
| `valueKey` | String | `'value'` | Clé pour la valeur de l'option |
| `labelKey` | String | `'label'` | Clé pour le label de l'option |

---

## 📡 Événements

| Événement | Payload | Description |
|-----------|---------|-------------|
| `update:modelValue` | value | Émis quand la sélection change |

---

## 💡 Exemples

### 1. Select avec API

```vue
<template>
  <div>
    <label>Type de Société</label>
    <argon-select
      v-model="societe.type"
      :options="typesSocietes"
      :disabled="isLoading"
      placeholder="Choisir un type"
      id="typeSociete"
      name="type"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArgonSelect } from '@/components';
import api from '@/services/api.service';

const societe = ref({ type: '' });
const typesSocietes = ref([]);
const isLoading = ref(false);

const loadTypes = async () => {
  isLoading.value = true;
  try {
    const response = await api.getTypesSocietes();
    typesSocietes.value = response.map(type => ({
      value: type.id,
      label: type.nom
    }));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTypes();
});
</script>
```

### 2. Select avec Validation

```vue
<template>
  <argon-select
    v-model="formData.category"
    :options="categories"
    :error="errors.category"
    :success="!errors.category && formData.category"
    :is-required="true"
    placeholder="Catégorie *"
  />
  <span v-if="errors.category" class="text-danger text-sm">
    {{ errors.category }}
  </span>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({ category: '' });
const errors = ref({});
const categories = ref([
  { value: 'tech', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'sante', label: 'Santé' }
]);

const validate = () => {
  if (!formData.value.category) {
    errors.value.category = 'La catégorie est obligatoire';
  } else {
    delete errors.value.category;
  }
};
</script>
```

### 3. Select avec Tailles

```vue
<!-- Petit -->
<argon-select
  v-model="value1"
  :options="options"
  size="sm"
/>

<!-- Normal (défaut) -->
<argon-select
  v-model="value2"
  :options="options"
/>

<!-- Grand -->
<argon-select
  v-model="value3"
  :options="options"
  size="lg"
/>
```

### 4. Select avec Clés Personnalisées

```vue
<template>
  <argon-select
    v-model="selectedUser"
    :options="users"
    value-key="idUser"
    label-key="nomComplet"
    placeholder="Sélectionner un utilisateur"
  />
</template>

<script setup>
const users = ref([
  { idUser: 1, nomComplet: 'Jean Dupont' },
  { idUser: 2, nomComplet: 'Marie Martin' },
  { idUser: 3, nomComplet: 'Pierre Durand' }
]);
</script>
```

### 5. Select Désactivé

```vue
<argon-select
  v-model="value"
  :options="options"
  :disabled="true"
  placeholder="Non disponible"
/>
```

---

## 🎨 Structure des Options

### Format Standard

```javascript
const options = [
  { value: 'val1', label: 'Label 1' },
  { value: 'val2', label: 'Label 2' },
  { value: 'val3', label: 'Label 3' }
];
```

### Format Personnalisé

```javascript
// Si vos données ont d'autres noms de clés
const options = [
  { id: 1, nom: 'Option 1' },
  { id: 2, nom: 'Option 2' }
];

// Utilisez valueKey et labelKey
<argon-select
  :options="options"
  value-key="id"
  label-key="nom"
/>
```

---

## 📱 Utilisation dans SocieteModal

Le composant est utilisé dans `SocieteModal.vue` pour le champ "Type de Société" :

```vue
<template>
  <div class="col-md-6 mb-3">
    <label class="form-label">Type de Société</label>
    <argon-select
      v-model="formData.type"
      :options="typesSocietes"
      placeholder="Sélectionner un type"
      :disabled="isLoadingTypes"
      id="typeSociete"
      name="type"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.service';

const typesSocietes = ref([]);
const isLoadingTypes = ref(false);

const loadTypesSocietes = async () => {
  isLoadingTypes.value = true;
  try {
    const response = await api.getTypesSocietes();
    typesSocietes.value = response.map(type => ({
      value: type.nomType || type.type || type,
      label: type.nomType || type.type || type
    }));
  } catch (error) {
    // Valeurs par défaut si l'API échoue
    typesSocietes.value = [
      { value: 'SARL', label: 'SARL - Société à Responsabilité Limitée' },
      { value: 'SA', label: 'SA - Société Anonyme' },
      // ... autres types
    ];
  } finally {
    isLoadingTypes.value = false;
  }
};

onMounted(() => {
  loadTypesSocietes();
});
</script>
```

---

## 🔧 API Endpoint

### Configuration

Dans `src/config/api.js` :

```javascript
TYPES_SOCIETES: '/api/TypesSocietes',
```

### Service

Dans `src/services/api.service.js` :

```javascript
export const getTypesSocietes = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.TYPES_SOCIETES);
  return response.data;
};
```

---

## 🎯 Types de Société Par Défaut

Si l'API ne répond pas, le composant utilise ces types par défaut :

1. **SARL** - Société à Responsabilité Limitée
2. **SA** - Société Anonyme
3. **SPRL** - Société Privée à Responsabilité Limitée
4. **SNC** - Société en Nom Collectif
5. **SCS** - Société en Commandite Simple
6. **ASBL** - Association Sans But Lucratif
7. **Entreprise Individuelle**
8. **Coopérative**
9. **ONG** - Organisation Non Gouvernementale
10. **Autre**

---

## 🎨 Styles CSS

Le composant utilise des styles cohérents avec Argon Dashboard :

```css
.form-control {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.1);
}

/* Validation */
.is-valid {
  border-color: #2dce89;
}

.is-invalid {
  border-color: #f5365c;
}
```

---

## 🔄 Comparaison ArgonInput vs ArgonSelect

| Fonctionnalité | ArgonInput | ArgonSelect |
|----------------|------------|-------------|
| **Type** | Input texte | Dropdown |
| **Saisie libre** | ✅ Oui | ❌ Non |
| **Options prédéfinies** | ❌ Non | ✅ Oui |
| **Validation** | ✅ Oui | ✅ Oui |
| **API compatible** | ✅ Oui | ✅ Oui |
| **v-model** | ✅ Oui | ✅ Oui |

---

## ✅ Avantages

### Pour l'Utilisateur
✅ Choix guidé (pas de fautes de frappe)  
✅ Options claires et visibles  
✅ Rapide à utiliser  

### Pour le Développeur
✅ Données cohérentes  
✅ Pas de nettoyage de saisie  
✅ Facile à valider  
✅ Réutilisable partout  

### Pour l'Application
✅ Données standardisées  
✅ Moins d'erreurs  
✅ Meilleure UX  

---

## 📚 Cas d'Usage

### Utiliser ArgonSelect pour :

- ✅ Types de société
- ✅ Catégories
- ✅ Statuts
- ✅ Pays/Villes/Provinces
- ✅ Rôles utilisateurs
- ✅ Secteurs d'activité
- ✅ Toute liste prédéfinie

### Utiliser ArgonInput pour :

- ✅ Nom
- ✅ Email
- ✅ Téléphone
- ✅ Adresse
- ✅ Description
- ✅ Toute saisie libre

---

## 🎊 Résumé

**ArgonSelect** est un composant select moderne :

✅ **v-model** compatible  
✅ **Options dynamiques** depuis API  
✅ **Validation** intégrée  
✅ **Tailles** configurables  
✅ **Clés personnalisables**  
✅ **Valeurs par défaut** en fallback  
✅ **Stylisé** Argon Dashboard  
✅ **Réutilisable** partout  

**Utilisez-le pour tous vos dropdowns !** 🚀

