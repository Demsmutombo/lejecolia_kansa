# 📝 LIGNES DE COMMANDE - Détails des Commandes

## 🎯 OBJECTIF

Afficher les **détails d'une commande** : les articles commandés avec leur quantité, prix unitaire, TVA, remise et total.

**URL :** `/commandes/:id`  
**Accès :** Tous les utilisateurs connectés

---

## ✅ FONCTIONNALITÉS

### Page Détails Commande

1. ✅ **Informations commande** (N°, Client, Vendeur, Date, Statut)
2. ✅ **Liste des articles** commandés (lignes de commande)
3. ✅ **Calcul automatique** des totaux
4. ✅ **Badges colorés** par statut
5. ✅ **Formatage devise** (USD)
6. ✅ **Formatage date** en français

---

## 📊 INTERFACE

### En-tête

```
╔════════════════════════════════════════╗
║  Commande #7                           ║
║  🟡 En cours                           ║
║  📅 31 octobre 2025 13:54             ║
║                        [← Retour]      ║
╚════════════════════════════════════════╝
```

### Informations (Gauche)

```
┌─────────────────────────────┐
│ ℹ️ Informations              │
├─────────────────────────────┤
│ Client: OBED TENDAYO        │
│ Vendeur: mutombo            │
│ Date: 31 oct. 2025 13:54    │
│ Statut: 🟡 En cours         │
└─────────────────────────────┘
```

### Lignes de Commande (Droite)

```
┌──────────────────────────────────────────────────┐
│ 🛒 Articles Commandés                            │
├──────────────────────────────────────────────────┤
│ Article    Qté  P.U.         TVA  Rem.  Total    │
│ ───────────────────────────────────────────────  │
│ Stock #1   1    25,000.00 $  0%   0%   25,000 $ │
│ Stock #2   1    500.00 $     0%   0%   500 $    │
├──────────────────────────────────────────────────┤
│               TOTAL COMMANDE:       25,500.00 $  │
└──────────────────────────────────────────────────┘
```

---

## 🔢 CALCULS

### Montant par Ligne

```javascript
const montantHT = quantite × prixUnitaire;
const montantRemise = montantHT × (remise / 100);
const montantTVA = (montantHT - montantRemise) × (tva / 100);
const montantTotal = montantHT - montantRemise + montantTVA;
```

**Exemple Ligne 1 :**
- Quantité : 1
- Prix unitaire : 25,000.00
- TVA : 0%
- Remise : 0%

```
HT = 1 × 25,000 = 25,000.00
Remise = 25,000 × 0% = 0.00
TVA = 25,000 × 0% = 0.00
Total = 25,000 - 0 + 0 = 25,000.00 $
```

**Exemple Ligne 2 :**
- Quantité : 1
- Prix unitaire : 500.00
- TVA : 0%
- Remise : 0%

```
Total = 500.00 $
```

**Total Commande = 25,500.00 $**

---

## 📦 EXEMPLE COMMANDE #7

### Informations

```json
{
  "idCommande": 7,
  "idClient": 8,
  "idUtilisateur": 1,
  "dateCommande": "2025-10-31T13:54:16",
  "statut": "En cours"
}
```

### Lignes (2 articles)

**Ligne 1 :**
```json
{
  "idLigneCommande": 7,
  "idCommande": 7,
  "idStock": 1,
  "quantite": 1,
  "prixUnitaire": 25000,
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
  "prixUnitaire": 500,
  "tva": 0,
  "remise": 0
}
```

**Total :** 25,500.00 $

---

## 🎨 BADGES PAR STATUT

| Statut | Couleur | Badge |
|--------|---------|-------|
| **En cours** | 🟡 Jaune | `bg-gradient-warning` |
| **Validée** | 🔵 Bleu | `bg-gradient-info` |
| **Livrée** | 🟢 Vert | `bg-gradient-success` |
| **Annulée** | 🔴 Rouge | `bg-gradient-danger` |

---

## 🔗 NAVIGATION

### Depuis la Liste des Commandes

**Cliquez sur** 👁️ **"Voir Détails"**

```
Liste Commandes
  ↓ Clic sur "Voir Détails"
Détails Commande #7
  ↓ Affiche
Informations + Lignes + Total
```

### Bouton Retour

**Cliquez sur "Retour"** → Retourne à `/commandes`

---

## 📊 TABLEAU DES LIGNES

### Colonnes

| Colonne | Description | Alignement |
|---------|-------------|------------|
| **Article** | idStock (en attendant nom) | Gauche |
| **Qté** | Quantité (badge bleu) | Centre |
| **P.U.** | Prix unitaire formaté | Droite |
| **TVA** | Pourcentage TVA | Centre |
| **Remise** | Pourcentage remise | Centre |
| **Total** | Total ligne calculé | Droite |

### Footer

**Total Commande** en vert et gras

---

## 📁 FICHIERS CRÉÉS

### 1. Page Détails
✅ `src/views/CommandeDetail.vue`
- Informations commande
- Tableau lignes
- Calculs automatiques
- Formatage devise et date

### 2. Route
✅ `src/router/index.js` - Route `/commandes/:id`

### 3. Action
✅ `src/views/Commandes.vue` - Bouton "Voir Détails"

### 4. Documentation
✅ `MODULE_LIGNES_COMMANDE.md` - Ce fichier

---

## 🧪 TESTER

### 1. Page Commandes

**Allez sur `/commandes`**

### 2. Cliquez "Voir Détails"

**Sur n'importe quelle commande** (ex: Commande #7)

### 3. Vérifiez

**Page détails affiche :**
- ✅ N° de commande
- ✅ Badge statut coloré
- ✅ Client et vendeur
- ✅ Date formatée
- ✅ Tableau des lignes (articles)
- ✅ Total calculé

**Commande #7 devrait afficher :**
- 2 lignes (Stock #1 et Stock #2)
- Total : 25,500.00 $

---

## 💡 AMÉLIORATION FUTURE

### Afficher le Nom des Articles

Au lieu de "Stock #1", afficher le nom de l'article :

```javascript
// Charger les articles depuis Stock/Catalogue
const stocks = await api.getStocks();
const stocksMap = {};

stocks.forEach(stock => {
  stocksMap[stock.idStock] = stock.articleNom;
});

ligne.articleNom = stocksMap[ligne.idStock];
```

**Affichage :**
```
CONCEPTION LOGO    1    25,000 $
FARDE CHEMISE      1    500 $
```

Au lieu de :
```
Stock #1           1    25,000 $
Stock #2           1    500 $
```

---

## 🎯 RÉSULTAT

✅ **Page détails commande** créée  
✅ **Affiche les lignes** (articles commandés)  
✅ **Calcul automatique** des totaux  
✅ **Formatage devise** (USD)  
✅ **Badges colorés** par statut  
✅ **Action "Voir"** dans la liste  
✅ **Navigation** complète  

**Cliquez sur "Voir Détails" dans la liste des commandes pour tester !** 🛒📝

---

## 🎊 MODULES COMPLETS !

| Module | Liste | Détails | Actions |
|--------|-------|---------|---------|
| **Sociétés** | ✅ | ✅ | CRUD |
| **Sites** | ✅ | ✅ | CRUD |
| **Utilisateurs** | ✅ | ✅ | CRUD |
| **Articles** | ✅ | - | CRUD |
| **Clients** | ✅ | - | CRUD |
| **Commandes** | ✅ | ✅ | CRUD ⭐ |

**APPLICATION COMPLÈTE AVEC DÉTAILS DES COMMANDES !** 🎉

