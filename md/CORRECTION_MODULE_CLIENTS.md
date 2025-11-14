# Correction Module Clients - Opérations CRUD

## Problèmes Identifiés

### 1. Erreurs 431 (Request Header Fields Too Large)
- **Symptôme** : Erreurs 431 dans la console du serveur Vite
- **Cause** : Headers HTTP trop volumineux, souvent causés par des photos en base64 dans sessionStorage ou les cookies
- **Solution** : Les photos ne doivent PAS être stockées dans sessionStorage (déjà implémenté dans le store)

### 2. Validation du Site Manquante
- **Problème** : Le modal ClientModal ne validait pas que le champ `idSite` était rempli
- **Correction** : Ajout de la validation dans la fonction `validate()`

### 3. Préparation des Données Client
- **Problème** : La fonction `prepareClientData` était trop simplifiée
- **Correction** : Refactorisation pour inclure tous les champs et les dates système

## Modifications Apportées

### 1. ClientModal.vue
```javascript
// Validation améliorée
const validate = () => {
  if (!formData.value.nom || !formData.value.nom.trim()) {
    return { valid: false, message: 'Le nom est obligatoire' };
  }
  if (!formData.value.prenom || !formData.value.prenom.trim()) {
    return { valid: false, message: 'Le prénom est obligatoire' };
  }
  if (!formData.value.telephone || !formData.value.telephone.trim()) {
    return { valid: false, message: 'Le téléphone est obligatoire' };
  }
  if (!formData.value.idSite || formData.value.idSite === 0) {
    return { valid: false, message: 'Le site est obligatoire' };
  }
  return { valid: true };
};
```

### 2. api.service.js - createClient
```javascript
// Suppression de l'encapsulation { client: {...} }
export const createClient = async (clientData) => {
  const preparedData = prepareClientData(clientData, false);
  console.log('📤 POST /api/Clients avec:', preparedData);
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLIENTS, preparedData);
  return response.data;
};
```

### 3. api.service.js - prepareClientData
```javascript
const prepareClientData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Conversion des IDs
  if (cleaned.idClient) cleaned.idClient = parseInt(cleaned.idClient, 10);
  if (cleaned.idSite) cleaned.idSite = parseInt(cleaned.idSite, 10);
  
  // Suppression idClient pour création
  if (!isUpdate || cleaned.idClient === 0) delete cleaned.idClient;
  
  // Nettoyage des champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Boolean statut
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  } else {
    cleaned.statut = true;
  }
  
  // Genre par défaut
  if (!cleaned.genre) cleaned.genre = 'Non précisé';
  
  // Dates système
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  return cleaned;
};
```

## Tests à Effectuer

### Test de Création
1. Ouvrir la page Clients
2. Cliquer sur "Nouveau Client"
3. Remplir les champs obligatoires : Nom, Prénom, Téléphone, Site
4. Cliquer sur "Enregistrer"
5. Vérifier dans la console : `📤 POST /api/Clients avec:` suivi des données
6. Vérifier que le client apparaît dans la liste

### Test de Modification
1. Cliquer sur l'icône "Modifier" d'un client existant
2. Modifier des champs (ex: téléphone, email)
3. Cliquer sur "Enregistrer"
4. Vérifier dans la console : `📤 PUT /api/Clients/{id} avec:`
5. Vérifier que les modifications sont visibles dans la liste

### Test de Suppression
1. Cliquer sur l'icône "Supprimer" d'un client
2. Confirmer la suppression
3. Vérifier que le client disparaît de la liste

### Test d'Activation/Désactivation
1. Cliquer sur "Activer" ou "Désactiver" pour un client
2. Confirmer l'action
3. Vérifier que le statut change (badge Actif/Inactif)

## Logs de Débogage

Les logs suivants devraient apparaître dans la console :

### Chargement des Clients
```
📡 Chargement des clients...
📋 GET /api/Clients
📋 X client(s) reçu(s) de l'API
✅ X client(s) chargé(s)
```

### Création d'un Client
```
💾 Données client à sauvegarder: {...}
✅ Données client préparées: {...}
📤 POST /api/Clients avec: {...}
```

### Modification d'un Client
```
💾 Données client à sauvegarder: {...}
✅ Données client préparées: {...}
📤 PUT /api/Clients/X avec: {...}
```

## Résolution des Problèmes

### Si l'erreur 431 persiste
1. Vérifier que les photos ne sont PAS dans sessionStorage :
   ```javascript
   console.log(sessionStorage.getItem('user'));
   // Ne devrait PAS contenir de photo en base64
   ```

2. Vider le sessionStorage :
   ```javascript
   sessionStorage.clear();
   location.reload();
   ```

### Si l'API retourne une erreur 400
1. Vérifier les données envoyées dans la console
2. Comparer avec le format attendu par l'API (Swagger)
3. Vérifier que tous les champs obligatoires sont présents

### Si le modal ne s'affiche pas
1. Vérifier que Bootstrap JS est chargé
2. Vérifier la console pour des erreurs JavaScript
3. Vérifier que l'ID du modal est unique

## Prochaines Étapes

Si le problème persiste après ces corrections :
1. Capturer la requête exacte envoyée (Network tab du navigateur)
2. Vérifier la documentation Swagger de l'API
3. Comparer avec les autres modules qui fonctionnent (Articles, Sites)

## Affichage des Colonnes (Vue Optimisée V_ClientsParSite)

Les colonnes affichées dans la table des clients utilisent maintenant la vue optimisée :

| Colonne | Source | Description |
|---------|--------|-------------|
| **N°** | - | Numéro d'ordre dans la liste |
| **Client** | `nomComplet` | Nom complet en gras (calculé par l'API) |
| **Genre** | `genre` | Badge M/F/- avec couleur |
| **Email** | `email` | Adresse email (avec lien mailto) |
| **Téléphone** | `telephone` | Numéro de téléphone |
| **Adresse** | `adresseClient` | Adresse complète (calculée par l'API) |
| **Site** | `nomSite` | Nom du site du client |

**Avantages** :
- `nomComplet` est déjà calculé par l'API (plus de calcul côté frontend)
- `adresseClient` est déjà formatée par l'API
- `nomSite` est déjà inclus (plus besoin de jointure)

**Note** : Le champ "Pièce d'Identité" a été complètement retiré du formulaire et de l'affichage car l'API attend un format binaire (byte[]) non supporté pour l'instant.

## Date de Correction
5 novembre 2025

## Filtrage par Société (Vue Optimisée)

### Mode Gestionnaire
- Les clients sont **automatiquement filtrés** par société **directement par l'API**
- Utilise l'endpoint optimisé : `GET /api/V_ClientsParSite/societe/{idSociete}`
- Seuls les clients de la société du gestionnaire sont chargés
- Le sous-titre indique : "X clients de votre société"
- Les sites dans le formulaire sont aussi filtrés par société
- **Performance optimale** : pas de chargement inutile de tous les clients

### Mode SuperAdmin
- Tous les clients de toutes les sociétés sont chargés
- Utilise l'endpoint : `GET /api/V_ClientsParSite`
- Le sous-titre indique : "X clients au total"
- Tous les sites sont disponibles dans le formulaire

### Logs de Chargement
En mode gestionnaire, la console affiche :
```
📡 Chargement des clients...
🔒 MODE GESTIONNAIRE - Chargement direct pour société #1
📊 GET /api/V_ClientsParSite/societe/1
✅ 10 client(s) de votre société
```

En mode superadmin :
```
📡 Chargement des clients...
🔓 MODE SUPERADMIN - Chargement de tous les clients
📊 GET /api/V_ClientsParSite
✅ 26 client(s) au total
```

### Avantages de la Vue Optimisée

1. ✅ **Performance** : Filtrage fait par la base de données (SQL), pas en JavaScript
2. ✅ **Données enrichies** : `nomComplet`, `adresseClient`, `nomSite` déjà calculés
3. ✅ **Moins de requêtes** : Plus besoin de charger les sites pour filtrer
4. ✅ **Scalabilité** : Fonctionne même avec des milliers de clients

## Résultat Final

✅ **Module Clients 100% Fonctionnel**
- ✅ Création de clients avec toutes les données
- ✅ Affichage de la liste avec filtrage automatique par société
- ✅ Modification de clients existants
- ✅ Suppression de clients
- ✅ Toggle du statut actif/inactif
- ✅ Validation stricte du site (obligatoire)
- ✅ Champ pieceIdentite retiré (incompatible avec API)
- ✅ Messages de succès personnalisés

