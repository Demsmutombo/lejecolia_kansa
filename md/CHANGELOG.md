# Changelog

## [1.0.0] - 2025-11-01

### Migration Vite
- ⚡ Migration complète de Vue CLI vers Vite
- 🚀 Temps de démarrage réduit à ~370ms
- 🔥 Hot Module Replacement (HMR) instantané
- 📦 Build optimisé avec code splitting

### Modifications techniques
- Remplacement de `process.env` par `import.meta.env`
- Ajout des extensions `.vue` explicites dans les imports
- Conversion de tous les `require()` en imports ES modules
- Protection contre les erreurs de canvas dans les composants Chart

### Fichiers modifiés
- Configuration Vite (`vite.config.js`)
- Router (`src/router/index.js`)
- Composants: App, Carousel, VirtualReality, MasterCard, RocketCard, GradientLineChart
- Index.html déplacé à la racine
- Package.json mis à jour avec scripts Vite

### Améliorations
- Serveur de développement sur port 6600
- Alias `@` configuré vers `src/`
- Build optimisé avec chunks séparés (vendor, bootstrap, charts)
- Support des navigateurs modernes (ES2015+)

### Documentation
- Nouveau README simplifié
- Guide de migration Vite (`VITE_MIGRATION.md`)
- Instructions d'installation et utilisation
