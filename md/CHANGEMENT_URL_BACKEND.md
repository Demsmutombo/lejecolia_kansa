# Changement URL Backend

## ✅ Modification Effectuée

L'URL du backend a été mise à jour dans la configuration API.

---

## 🔧 Modification

### Fichier : `src/config/api.js`

#### Avant
```javascript
BASE_URL: 'https://mombongo.asdc-rdc.org'
```

#### Après
```javascript
BASE_URL: 'https://mombongov2.asdc-rdc.org'
```

---

## 🌐 Nouvelle Configuration

Tous les appels API pointent maintenant vers :
```
https://mombongov2.asdc-rdc.org/api/...
```

### Exemples d'Endpoints

- **Login** : `https://mombongov2.asdc-rdc.org/api/Utilisateurs/Authentifier`
- **Articles** : `https://mombongov2.asdc-rdc.org/api/Articles`
- **Clients** : `https://mombongov2.asdc-rdc.org/api/Clients`
- **Stocks** : `https://mombongov2.asdc-rdc.org/api/Stocks`
- **Commandes** : `https://mombongov2.asdc-rdc.org/api/Commande`
- **Vente** : `https://mombongov2.asdc-rdc.org/api/Vente/enregistrer`

---

## 🚀 Application Lancée

Le serveur de développement Vite est démarré :
- **Port** : 3001 (car 3000 était occupé)
- **URL** : http://127.0.0.1:3001/
- **Navigateur** : Ouvert automatiquement

---

## 📝 Note Importante

Cette modification est **centralisée** dans un seul fichier (`src/config/api.js`), donc tous les appels API utilisent automatiquement la nouvelle URL.

---

**Date de modification** : 4 novembre 2025  
**Auteur** : Assistant IA  
**Nouvelle URL** : https://mombongov2.asdc-rdc.org/






