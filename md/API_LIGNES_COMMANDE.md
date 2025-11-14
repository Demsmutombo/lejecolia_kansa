# 📝 API LIGNES DE COMMANDE

## 🎯 OBJECTIF

Les **Lignes de Commande** représentent les **détails d'une commande** : les articles commandés avec leur quantité, prix, TVA et remise.

**Une commande** peut avoir **plusieurs lignes** (plusieurs articles).

---

## 📦 SCHÉMA DES DONNÉES

```json
{
  "idLigneCommande": 1,
  "idCommande": 1,          // Lien vers la commande
  "idStock": 2,             // Lien vers le stock/article
  "quantite": 1.0,          // Quantité commandée
  "prixUnitaire": 500.00,   // Prix unitaire
  "tva": 0.00,              // TVA (%)
  "remise": 0.00,           // Remise (%)
  "dateCreation": "2025-10-30T15:07:15",
  "dateLastModification": "2025-10-30T15:07:15",
  "statut": true
}
```

---

## 🔌 API ENDPOINTS CONFIGURÉS

| Action | Méthode | Endpoint |
|--------|---------|----------|
| Lister toutes | GET | `/api/LigneCommande` |
| Par ID | GET | `/api/LigneCommande/{id}` |
| Rechercher | GET | `/api/LigneCommande/search?idCommande=&idCatalogue=` |
| Créer | POST | `/api/LigneCommande` |
| Modifier | PUT | `/api/LigneCommande/{id}` |
| Supprimer | DELETE | `/api/LigneCommande/{id}` |

---

## 📊 EXEMPLE DE COMMANDE COMPLÈTE

### Commande #7 (2 lignes)

**Commande :**
```json
{
  "idCommande": 7,
  "idClient": 8,
  "idUtilisateur": 1,
  "dateCommande": "2025-10-31T13:54:16",
  "statut": "En cours"
}
```

**Ligne 1 :**
```json
{
  "idLigneCommande": 7,
  "idCommande": 7,
  "idStock": 1,
  "quantite": 1,
  "prixUnitaire": 25000.00,
  "tva": 0,
  "remise": 0
}
```

**Ligne 2 :**
```json
{
  "idLigneCommande": 8,
  "idCommande": 7,
  "idStock": 2,
  "quantite": 1,
  "prixUnitaire": 500.00,
  "tva": 0,
  "remise": 0
}
```

**Total commande :** 25,500.00 (25,000 + 500)

---

## 🔍 RECHERCHE PAR COMMANDE

Pour récupérer les lignes d'une commande spécifique :

```javascript
const lignes = await api.searchLignesCommande(idCommande, null);

// Exemple: Lignes de la commande #7
const lignes = await api.searchLignesCommande(7, null);
// Retourne: [ligne 7, ligne 8]
```

---

## 💰 CALCULS

### Montant Ligne

```javascript
const montantHT = quantite * prixUnitaire;
const montantRemise = montantHT * (remise / 100);
const montantTVA = (montantHT - montantRemise) * (tva / 100);
const montantTTC = montantHT - montantRemise + montantTVA;
```

**Exemple :**
- Quantité : 5
- Prix unitaire : 500.00
- Remise : 10%
- TVA : 16%

```
Montant HT = 5 × 500 = 2,500.00
Remise = 2,500 × 10% = 250.00
Base TVA = 2,500 - 250 = 2,250.00
TVA = 2,250 × 16% = 360.00
Montant TTC = 2,250 + 360 = 2,610.00
```

---

## 📊 DONNÉES EXISTANTES

### 8 Lignes de Commande

| ID | Commande | Stock | Qté | Prix Unit. | Total |
|----|----------|-------|-----|------------|-------|
| 1 | #1 | 2 | 1 | 500.00 | 500.00 |
| 2 | #2 | 2 | 1 | 500.00 | 500.00 |
| 3 | #3 | 1 | 1 | 25,000.00 | 25,000.00 |
| 4 | #4 | 1 | 1 | 25,000.00 | 25,000.00 |
| 5 | #5 | 2 | 2 | 500.00 | 1,000.00 |
| 6 | #6 | 2 | 5 | 500.00 | 2,500.00 |
| 7 | #7 | 1 | 1 | 25,000.00 | 25,000.00 |
| 8 | #7 | 2 | 1 | 500.00 | 500.00 |

**Commande #7** a **2 lignes** (articles différents)

---

## 🎯 UTILISATION

### Dans la Page Commandes

Afficher les détails d'une commande :

```javascript
// Charger les lignes de la commande
const lignes = await api.searchLignesCommande(commandeId);

// Afficher dans un tableau
lignes.forEach(ligne => {
  const total = ligne.quantite * ligne.prixUnitaire;
  console.log(`Article ${ligne.idStock}: ${ligne.quantite} × ${ligne.prixUnitaire} = ${total}`);
});
```

### Dans un Modal de Commande

Ajouter/Modifier les articles commandés :

```vue
<template>
  <div>
    <h6>Articles commandés</h6>
    <div v-for="ligne in lignes" :key="ligne.idLigneCommande">
      Article: {{ ligne.articleNom }}
      Quantité: {{ ligne.quantite }}
      Prix: {{ ligne.prixUnitaire }}
      Total: {{ ligne.quantite * ligne.prixUnitaire }}
    </div>
  </div>
</template>
```

---

## ✅ API CONFIGURÉE

### Endpoints
✅ `LIGNES_COMMANDE: '/api/LigneCommande'`  
✅ `LIGNE_COMMANDE_BY_ID: (id) => '/api/LigneCommande/{id}'`  
✅ `LIGNES_COMMANDE_SEARCH: '/api/LigneCommande/search'`  

### Fonctions
✅ `getLignesCommande()`  
✅ `getLigneCommandeById(id)`  
✅ `searchLignesCommande(idCommande, idCatalogue)`  
✅ `createLigneCommande(data)`  
✅ `updateLigneCommande(id, data)`  
✅ `deleteLigneCommande(id)`  
✅ `prepareLigneCommandeData()` - Helper

### Export
✅ Ajouté au default export de `api.service.js`

---

## 💡 NOTES

### Relation avec Stock

`idStock` fait référence à un article en stock. Il faudrait probablement :
- Une table Stock avec les articles disponibles
- Ou utiliser `idArticle` directement

**Pour l'instant**, l'API utilise `idStock`. Si vous avez une API `/api/Stock`, il faudra la configurer aussi.

### Format Décimaux

Les nombres sont retournés avec beaucoup de décimales :
```
"quantite": "1.0000000000000000000000000000"
```

**JavaScript les convertit automatiquement** :
```javascript
parseFloat("1.0000000000000000000000000000") // = 1.0
```

---

## 🎯 PROCHAINES ÉTAPES (SI NÉCESSAIRE)

### 1. Page Détail Commande

Créer `/commandes/:id` pour afficher :
- Informations de la commande
- Liste des lignes (articles commandés)
- Total de la commande
- Actions (ajouter/retirer articles)

### 2. Module Stock

Si l'API `/api/Stock` existe, créer le module Stock pour :
- Gérer les articles en stock
- Voir les quantités disponibles
- Mouvements de stock

### 3. Intégration dans Commandes

Ajouter un bouton "Voir détails" dans la liste des commandes :
- Affiche les lignes de la commande
- Calcule le total
- Permet d'ajouter/modifier les lignes

---

## ✅ API LIGNES COMMANDE CONFIGURÉE !

✅ **3 endpoints** configurés  
✅ **6 fonctions** API disponibles  
✅ **Helper** de préparation des données  
✅ **Gestion** décimaux (quantité, prix, TVA, remise)  
✅ **Exporté** dans api.service.js  

**L'API est prête à être utilisée pour afficher/gérer les détails des commandes !** 📝

