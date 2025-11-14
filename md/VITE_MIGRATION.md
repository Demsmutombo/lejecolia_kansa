# Migration vers Vite ⚡

## Vue d'ensemble

Ce projet a été migré de **Vue CLI** vers **Vite** pour bénéficier de meilleures performances et d'un temps de démarrage plus rapide.

## Changements effectués

### Fichiers ajoutés
- `vite.config.js` - Configuration Vite
- `jsconfig.json` - Configuration pour l'autocomplétion IDE
- `index.html` - Déplacé de `public/` à la racine

### Fichiers supprimés
- `babel.config.js` - Non nécessaire avec Vite
- `public/index.html` - Déplacé à la racine

### Package.json
#### Scripts mis à jour
```json
{
  "dev": "vite",                    // npm run dev
  "build": "vite build",            // npm run build
  "preview": "vite preview"         // npm run preview
}
```

#### Dépendances
- ✅ Ajouté : `vite` et `@vitejs/plugin-vue`
- ❌ Supprimé : Tous les packages `@vue/cli-*`

## Commandes

### Développement
```bash
npm run dev
```
Démarre le serveur de développement sur **http://localhost:6600**

### Build de production
```bash
npm run build
```
Génère les fichiers optimisés dans le dossier `dist/`

### Prévisualiser le build
```bash
npm run preview
```
Teste le build de production localement

## Configuration Vite

### Port personnalisé
Le serveur de développement utilise le port **6600** (configuré dans `vite.config.js`)

### Alias de chemin
- `@` pointe vers `src/`
- Exemple : `import Header from '@/components/Header.vue'`

### Optimisations du build
- Code splitting automatique
- Chunks séparés pour : vendor (Vue, Router, Vuex), Bootstrap, Chart.js
- Assets optimisés dans `dist/assets/`

## Avantages de Vite

✨ **Démarrage ultra-rapide** - ~372ms vs plusieurs secondes  
🔥 **HMR instantané** - Mise à jour en temps réel sans rechargement  
📦 **Build optimisé** - Utilise Rollup pour la production  
⚡ **ESM natif** - Pas de bundling en développement  

## Compatibilité

- Node.js >= 18 recommandé
- Support des navigateurs modernes (ES2015+)
- Syntaxe Vue 3 uniquement

## Notes importantes

### Import de fichiers
Avec Vite, les imports de fichiers statiques doivent utiliser des chemins absolus ou relatifs :

```javascript
// ✅ Bon
import logo from '@/assets/img/logo.png'
import logo from '/src/assets/img/logo.png'

// ❌ Éviter
require('@/assets/img/logo.png')
```

### Variables d'environnement
Vite utilise `import.meta.env` au lieu de `process.env` :

```javascript
// ✅ Vite
const apiUrl = import.meta.env.VITE_API_URL

// ❌ Vue CLI (ancien)
const apiUrl = process.env.VUE_APP_API_URL
```

Les variables doivent être préfixées par `VITE_` dans le fichier `.env`

## Dépannage

### Erreur "Cannot find module"
Réinstallez les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé
Modifiez le port dans `vite.config.js` :
```javascript
server: {
  port: 3000 // Changez selon vos besoins
}
```

### Cache Vite corrompu
```bash
rm -rf node_modules/.vite
npm run dev
```

## Ressources

- [Documentation Vite](https://vitejs.dev/)
- [Guide de migration](https://vitejs.dev/guide/migration.html)
- [Plugins Vite](https://vitejs.dev/plugins/)

---

**Migration effectuée le** : 1 novembre 2025  
**Version Vite** : 5.4.21  
**Version Vue** : 3.4.19

