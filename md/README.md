# 💙 Mombongo - Plateforme de Gestion Commerciale

**Mombongo** est une plateforme complète de gestion commerciale développée avec ❤️ par [**Kansa Business**](https://kansaconsulting.com).

> **Kansa Business** - Nous connectons l'Afrique au futur numérique

[![Kansa Business](https://img.shields.io/badge/Développé%20par-Kansa%20Business-1565c0?style=for-the-badge)](https://kansaconsulting.com)

---

## ⚡ Technologies

- **Vue.js 3** - Framework JavaScript progressif
- **Vite** - Build tool ultra-rapide
- **Bootstrap 5** - Framework CSS
- **Vuex** - Gestion d'état
- **Vue Router** - Routing
- **Chart.js** - Graphiques
- **SASS** - Préprocesseur CSS

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 📦 Structure du projet

```
dashboard-app/
├── public/
│   └── favicon.png
├── src/
│   ├── assets/          # Images, styles, fonts
│   ├── components/      # Composants réutilisables
│   ├── examples/        # Composants d'exemple
│   ├── router/          # Configuration du routing
│   ├── store/           # Gestion d'état Vuex
│   ├── views/           # Pages de l'application
│   ├── App.vue          # Composant racine
│   └── main.js          # Point d'entrée
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite
├── package.json         # Dépendances et scripts
└── VITE_MIGRATION.md    # Guide de migration Vite
```

## 🛠 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement sur http://localhost:6600 |
| `npm run build` | Génère le build de production dans `dist/` |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Analyse et corrige le code |
| `npm run prettify` | Formate le code |

## 📝 Configuration

### Port du serveur

Le serveur de développement utilise le port **6600** par défaut.

Pour le modifier, éditez `vite.config.js`:

```javascript
server: {
  port: 3000 // Votre port personnalisé
}
```

### Variables d'environnement

Créez un fichier `.env` à la racine :

```
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Mon Dashboard
```

Accédez aux variables avec `import.meta.env.VITE_*`

## 🔧 Migration Vite

Ce projet a été migré de Vue CLI vers Vite. Consultez [VITE_MIGRATION.md](./VITE_MIGRATION.md) pour plus de détails.

### Principales différences

- `process.env` → `import.meta.env`
- Extensions `.vue` explicites requises
- `require()` → imports ES modules
- HMR ultra-rapide ⚡

## 📦 Composants Réutilisables

**Tous les composants sont maintenant facilement réutilisables !** 

📖 **Guide complet** : [COMPOSANTS_REUTILISABLES.md](./COMPOSANTS_REUTILISABLES.md)

### Import rapide
```javascript
// Composants de base
import { ArgonButton, ArgonInput, ArgonBadge } from '@/components';

// Composants avancés  
import { MasterCard, GradientLineChart, MiniStatisticsCard } from '@/examples';

// Composables pour la logique réutilisable
import { useTheme, useNavigation, useLayout } from '@/composables';
```

### Exemple d'utilisation
```vue
<template>
  <ArgonButton @click="toggleDarkMode" color="primary">
    {{ darkMode ? 'Mode Clair' : 'Mode Sombre' }}
  </ArgonButton>
</template>

<script setup>
import { ArgonButton } from '@/components';
import { useTheme } from '@/composables';

const { darkMode, toggleDarkMode } = useTheme();
</script>
```

## 📚 Composants disponibles

- Boutons, badges, alertes
- Inputs, checkboxes, switches
- Cartes, modals, pagination
- Graphiques (Chart.js)
- Navigation, sidebar
- Tables de données
- Et plus encore...

## 🌐 Navigateurs supportés

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

## 📄 Versions

- Vue.js: 3.4.19
- Vite: 5.4.21
- Bootstrap: 5.3.3
- Node.js: >= 18 recommandé

---

## 👥 À propos de Kansa Business

**Kansa Business** est une startup congolaise innovante, spécialisée dans le développement de solutions numériques pour l'Afrique.

### 🎯 Notre Mission
Faire du numérique un levier de développement durable en Afrique.

### 🚀 Nos Services
- 💻 **Développement Logiciel** - Applications web, mobiles et desktop
- 🌐 **Réseaux Informatiques** - Installation LAN, MAN, WAN
- 🖥️ **Équipements IT** - Fourniture et déploiement
- 📦 **Services Logistiques** - Gestion et installation

### 📱 Nos Réalisations
- **Kelasi na Biso** - Plateforme de gestion scolaire
- **Congo Hôtel** - Solution de réservation hôtelière
- **K-Archive Pro** - Archivage numérique
- **Mombongo** - Gestion commerciale
- **Ndaku** - Gestion immobilière

### 📞 Contact
- 🌐 Site Web: [https://kansaconsulting.com](https://kansaconsulting.com)
- 📧 Email: contact@kansaconsulting.com
- 📱 Téléphone: +243 89 65 58 249
- 📍 Localisation: Kinshasa, RDC

---

<p align="center">
  <strong>© 2024 Mombongo - Développé avec ❤️ par <a href="https://kansaconsulting.com">Kansa Business</a></strong>
  <br>
  <em>Nous connectons l'Afrique au futur numérique</em>
</p>
