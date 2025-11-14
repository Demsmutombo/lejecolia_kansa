# 📦 Guide des Composants Réutilisables

## Vue d'ensemble

Tous les composants de l'application sont maintenant organisés pour une réutilisation facile à travers tout le projet.

## 🎨 Structure des Composants

```
src/
├── components/           # Composants de base Argon
│   ├── index.js         # Export centralisé
│   └── *.vue            # Composants individuels
├── examples/            # Composants d'exemple et layouts
│   ├── index.js         # Export centralisé
│   ├── Cards/
│   ├── Charts/
│   ├── Navbars/
│   └── Sidenav/
├── composables/         # Logique réutilisable
│   ├── index.js
│   ├── useTheme.js
│   ├── useNavigation.js
│   └── useLayout.js
└── plugins/             # Plugins Vue
    ├── index.js
    └── argon-components.js
```

## 🚀 Utilisation

### Méthode 1 : Import Nommé (Recommandé)

```javascript
// Import de composants spécifiques
import { ArgonButton, ArgonInput, ArgonBadge } from '@/components';
import { MasterCard, GradientLineChart } from '@/examples';

// Utilisation dans votre composant
export default {
  components: {
    ArgonButton,
    ArgonInput,
    MasterCard
  }
}
```

### Méthode 2 : Enregistrement Global

Dans `src/main.js` :

```javascript
import ArgonComponents from './plugins/argon-components';

const app = createApp(App);
app.use(ArgonComponents);
```

Ensuite, tous les composants Argon sont disponibles globalement sans import :

```vue
<template>
  <div>
    <ArgonButton>Cliquez-moi</ArgonButton>
    <ArgonInput v-model="email" placeholder="Email" />
  </div>
</template>
```

## 📚 Composables Disponibles

### useTheme()

Gère le thème de l'application (mode sombre, RTL, etc.)

```javascript
import { useTheme } from '@/composables';

const { darkMode, toggleDarkMode, isRTL, toggleRTL } = useTheme();
```

**Propriétés :**
- `darkMode` - État du mode sombre
- `isRTL` - État RTL (Right-to-Left)
- `isTransparent` - Transparence de l'interface

**Méthodes :**
- `toggleDarkMode()` - Basculer le mode sombre
- `setDarkMode(value)` - Définir le mode sombre
- `toggleRTL()` - Basculer le mode RTL

### useNavigation()

Gère la navigation et l'affichage de l'interface

```javascript
import { useNavigation } from '@/composables';

const { showSidenav, toggleSidenav, toggleConfigurator } = useNavigation();
```

**Propriétés :**
- `showSidenav` - Affichage de la sidebar
- `showNavbar` - Affichage de la navbar
- `showFooter` - Affichage du footer
- `showConfig` - Affichage du configurateur
- `isPinned` - État épinglé de la sidebar
- `isNavFixed` - Navbar fixée

**Méthodes :**
- `toggleSidenav()` - Basculer la sidebar
- `sidebarMinimize()` - Minimiser la sidebar
- `toggleConfigurator()` - Basculer le configurateur
- `navbarFixed()` - Fixer la navbar
- `navbarMinimize()` - Minimiser la navbar

### useLayout()

Gère le layout de l'application

```javascript
import { useLayout } from '@/composables';

const { layout, setLayout } = useLayout();
```

**Propriétés :**
- `layout` - Layout actuel ('default', 'vr', etc.)
- `isAbsolute` - Position absolue

**Méthodes :**
- `setLayout(layoutName)` - Définir le layout
- `toggleAbsolute()` - Basculer la position absolue

## 🎯 Composants de Base (Argon)

### Formulaires
- `ArgonInput` - Champ de saisie
- `ArgonTextarea` - Zone de texte
- `ArgonCheckbox` - Case à cocher
- `ArgonRadio` - Bouton radio
- `ArgonSwitch` - Interrupteur

### Interface
- `ArgonButton` - Bouton
- `ArgonBadge` - Badge
- `ArgonAlert` - Alerte
- `ArgonAvatar` - Avatar
- `ArgonProgress` - Barre de progression
- `ArgonPagination` - Pagination
- `ArgonPaginationItem` - Élément de pagination

## 🎨 Composants Examples

### Cartes
- `ComplexStatisticsCard` - Carte de statistiques complexes
- `DefaultCounterCard` - Carte compteur
- `DefaultInfoCard` - Carte d'information
- `MasterCard` - Carte de crédit
- `MiniStatisticsCard` - Mini statistiques
- `TimelineItem` - Élément de timeline
- `TimelineList` - Liste timeline

### Graphiques
- `ActiveUsersChart` - Graphique utilisateurs actifs
- `GradientLineChart` - Graphique en ligne avec gradient

### Navigation
- `Navbar` - Barre de navigation
- `Sidenav` - Menu latéral
- `SidenavCard` - Carte dans le menu latéral
- `SidenavItem` - Élément du menu
- `SidenavList` - Liste du menu

### Layouts
- `Breadcrumbs` - Fil d'Ariane
- `Footer` - Pied de page
- `Configurator` - Configurateur de thème
- `Calendar` - Calendrier
- `Globe` - Globe 3D

## 💡 Exemples d'Utilisation

### Exemple 1 : Formulaire avec Composants Argon

```vue
<template>
  <div>
    <ArgonInput 
      v-model="form.email" 
      placeholder="Email"
      type="email"
    />
    
    <ArgonInput 
      v-model="form.password" 
      placeholder="Mot de passe"
      type="password"
    />
    
    <ArgonCheckbox v-model="form.remember">
      Se souvenir de moi
    </ArgonCheckbox>
    
    <ArgonButton color="success" @click="handleSubmit">
      Connexion
    </ArgonButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArgonInput, ArgonCheckbox, ArgonButton } from '@/components';

const form = ref({
  email: '',
  password: '',
  remember: false
});

const handleSubmit = () => {
  console.log('Form submitted:', form.value);
};
</script>
```

### Exemple 2 : Dashboard avec Composables

```vue
<template>
  <div>
    <button @click="toggleDarkMode">
      {{ darkMode ? 'Mode Clair' : 'Mode Sombre' }}
    </button>
    
    <button @click="toggleSidenav">
      {{ showSidenav ? 'Masquer' : 'Afficher' }} Menu
    </button>
    
    <MiniStatisticsCard
      title="Utilisateurs"
      value="2,300"
      icon="ni ni-world"
      color="primary"
    />
  </div>
</template>

<script setup>
import { useTheme, useNavigation } from '@/composables';
import { MiniStatisticsCard } from '@/examples';

const { darkMode, toggleDarkMode } = useTheme();
const { showSidenav, toggleSidenav } = useNavigation();
</script>
```

### Exemple 3 : Graphique avec Données Dynamiques

```vue
<template>
  <GradientLineChart
    id="sales-chart"
    title="Ventes"
    description="Performance mensuelle"
    :chart="chartData"
  />
</template>

<script setup>
import { ref } from 'vue';
import { GradientLineChart } from '@/examples';

const chartData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [{
    label: 'Ventes',
    data: [50, 40, 300, 220, 500, 250]
  }]
});
</script>
```

## ⚡ Bonnes Pratiques

### 1. Import Sélectif
```javascript
// ✅ Bon - Import uniquement ce dont vous avez besoin
import { ArgonButton, ArgonInput } from '@/components';

// ❌ Mauvais - Import de tout
import * as AllComponents from '@/components';
```

### 2. Utilisation des Composables
```javascript
// ✅ Bon - Utiliser les composables pour la logique
import { useTheme } from '@/composables';
const { darkMode, toggleDarkMode } = useTheme();

// ❌ Mauvais - Accès direct au store partout
import { useStore } from 'vuex';
const store = useStore();
```

### 3. Nommage Cohérent
```vue
<!-- ✅ Bon - Utiliser le nom exact du composant -->
<ArgonButton />
<MasterCard />

<!-- ❌ Mauvais - Renommer sans raison -->
<AButton /> <!-- au lieu de ArgonButton -->
```

## 🔧 Personnalisation

Pour personnaliser un composant, créez un wrapper :

```vue
<!-- MyCustomButton.vue -->
<template>
  <ArgonButton v-bind="$attrs" color="primary" size="lg">
    <slot />
  </ArgonButton>
</template>

<script setup>
import { ArgonButton } from '@/components';
</script>
```

## 📖 Documentation des Props

Pour voir les props disponibles pour chaque composant, consultez directement les fichiers `.vue` dans `src/components/` et `src/examples/`.

## 🚀 Performance

- Les imports nommés permettent le **tree-shaking** automatique par Vite
- Seuls les composants utilisés sont inclus dans le bundle final
- Les composables sont optimisés avec `computed` pour éviter les re-rendus inutiles

## 🤝 Contribution

Lors de l'ajout de nouveaux composants :

1. Créez le composant dans le bon dossier (`components/` ou `examples/`)
2. Ajoutez l'export dans le fichier `index.js` correspondant
3. Documentez les props et événements dans ce fichier
4. Testez l'import et l'utilisation

---

**Dernière mise à jour** : Migration Vite - Novembre 2025

