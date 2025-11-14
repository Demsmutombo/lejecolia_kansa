# Devise Franc Congolais (FC) - Réservations

## 📋 Modifications Effectuées

Tous les montants dans le formulaire de réservation sont maintenant affichés en **Franc Congolais (FC)** au lieu de Dollar ($).

---

## ✅ Changements Appliqués

### 1. **Devise FC Partout** 🇨🇩

Tous les champs de montant affichent maintenant **FC** :
- Prix Unitaire (FC)
- Montant Total (FC)
- Montant Avancé (FC)

### 2. **Prix Récupéré Automatiquement** 🔄

Quand vous sélectionnez un article :
1. Le système cherche d'abord dans les **Stocks** (`prixVente`)
2. Si pas trouvé, cherche dans les **Articles** (`prix`)
3. Le prix se remplit automatiquement en **Franc Congolais**

### 3. **Affichage Amélioré** 💰

Le montant total s'affiche dans une grande boîte verte :
```
┌──────────────────┐
│   1,500.00 FC    │
│  Prix × Quantité │
└──────────────────┘
```

---

## 🔧 Détails Techniques

### Récupération du Prix (Améliorée)

```javascript
// Récupérer le prix de l'article sélectionné
const getPrixArticle = async (idArticle) => {
  if (!idArticle) return;
  
  try {
    console.log('📦 Récupération prix de l\'article #' + idArticle);
    
    // 1. Chercher d'abord dans les stocks
    const stocks = await api.getStocks();
    const stock = stocks.find(s => s.idArticle === parseInt(idArticle));
    
    if (stock && stock.prixVente) {
      formData.value.prixUnitaire = parseFloat(stock.prixVente);
      console.log('✅ Prix récupéré:', stock.prixVente, 'FC');
      calculerMontantTotal();
    } else {
      // 2. Si pas trouvé, chercher dans les articles
      console.warn('⚠️ Pas de prix dans le stock, recherche dans les articles...');
      const articles = await api.getArticles();
      const article = articles.find(a => a.idArticle === parseInt(idArticle));
      
      if (article && article.prix) {
        formData.value.prixUnitaire = parseFloat(article.prix);
        console.log('✅ Prix récupéré depuis article:', article.prix, 'FC');
        calculerMontantTotal();
      } else {
        console.warn('⚠️ Aucun prix trouvé pour cet article');
        formData.value.prixUnitaire = 0;
      }
    }
  } catch (error) {
    console.error('❌ Erreur récupération prix:', error);
    formData.value.prixUnitaire = 0;
  }
};
```

### Sources de Prix (Priorité)

```
1. Stock (prixVente) ← PRIORITAIRE
   ↓ Si pas trouvé
2. Article (prix) ← FALLBACK
   ↓ Si pas trouvé
3. Prix = 0 (à saisir manuellement)
```

---

## 📊 Interface Utilisateur

### Formulaire de Réservation

```
┌─────────────────────────────────────────┐
│  Nouvelle Réservation                   │
├─────────────────────────────────────────┤
│                                         │
│  Article: [Produit X ▼]                │
│  Quantité: [5]                          │
│                                         │
│  💰 Montants (en Franc Congolais)      │
│                                         │
│  Prix Unitaire (FC) *                   │
│  [300.00] ← Rempli automatiquement      │
│  🔄 Rempli automatiquement depuis       │
│     l'article                           │
│                                         │
│  Montant Total                          │
│  ┌─────────────────────┐               │
│  │   1,500.00 FC       │ Grande boîte  │
│  │  Prix × Quantité    │ verte         │
│  └─────────────────────┘               │
│                                         │
│  Montant Avancé (FC)                    │
│  [500.00]                              │
│  Acompte versé par le client           │
│                                         │
│         [Annuler]  [Enregistrer]        │
└─────────────────────────────────────────┘
```

---

## 🔄 Flux de Récupération du Prix

### Scénario 1 : Prix dans Stock ✅

```
Utilisateur sélectionne Article #5
  ↓
getPrixArticle(5) appelé
  ↓
GET /api/Stocks
  ↓
Cherche stock où idArticle === 5
  ↓
Stock trouvé : { prixVente: 300 }
  ↓
Prix Unitaire = 300 FC ✅
  ↓
Montant Total = 300 × 5 = 1,500 FC
```

### Scénario 2 : Prix dans Article (Fallback) ✅

```
Utilisateur sélectionne Article #10
  ↓
getPrixArticle(10) appelé
  ↓
GET /api/Stocks
  ↓
Stock NOT FOUND (pas de stock pour cet article)
  ↓
GET /api/Articles
  ↓
Article trouvé : { prix: 250 }
  ↓
Prix Unitaire = 250 FC ✅
  ↓
Montant Total = 250 × 5 = 1,250 FC
```

### Scénario 3 : Aucun Prix Trouvé ⚠️

```
Utilisateur sélectionne Article #15
  ↓
getPrixArticle(15) appelé
  ↓
GET /api/Stocks → NOT FOUND
  ↓
GET /api/Articles → Prix non défini
  ↓
Prix Unitaire = 0 FC ⚠️
  ↓
Console : "⚠️ Aucun prix trouvé pour cet article"
  ↓
Utilisateur doit saisir le prix manuellement
```

---

## 📝 Labels Modifiés

### Avant ❌
```html
<label>Prix Unitaire *</label>
→ Montant Total: 150.00 $
→ Montant Avancé
```

### Après ✅
```html
<label>Prix Unitaire (FC) *</label>
→ Montant Total: 150.00 FC
→ Montant Avancé (FC)
```

---

## 💡 Conseils d'Utilisation

### Pour l'Utilisateur

1. **Sélectionnez l'article** : Le prix se remplit automatiquement en FC
2. **Vérifiez le prix** : Il doit correspondre au prix de votre article
3. **Modifiez si besoin** : Vous pouvez ajuster le prix (remise, promo, etc.)
4. **Entrez la quantité** : Le montant total se calcule automatiquement
5. **Montant avancé** : Entrez l'acompte versé par le client (optionnel)

### Console de Debug

Quand vous sélectionnez un article, la console affiche :
```
📦 Récupération prix de l'article #5
📋 Stocks chargés: 42
🔍 Stock trouvé: { idArticle: 5, prixVente: 300 }
✅ Prix récupéré: 300 FC
💰 Calcul: 300 × 5 = 1500
```

Si problème :
```
⚠️ Pas de prix dans le stock, recherche dans les articles...
✅ Prix récupéré depuis article: 300 FC
```

Ou :
```
⚠️ Aucun prix trouvé pour cet article
```

---

## ⚠️ Points d'Attention

### 1. **Données Requises**

Pour que le prix se récupère automatiquement, il faut :
- **Stock** : Avoir un stock avec `prixVente` défini
- **OU Article** : Avoir un article avec `prix` défini
- **Sinon** : Saisir le prix manuellement

### 2. **Priorité des Sources**

```
Stock (prixVente) > Article (prix) > Saisie manuelle
```

Le prix du **Stock** est prioritaire car c'est le prix de vente actuel.

### 3. **Prix Modifiable**

Même si le prix est récupéré automatiquement :
- Vous **pouvez le modifier** (remises, négociations)
- Le montant total se recalcule automatiquement

---

## 🎯 Cas d'Usage

### Cas 1 : Réservation Standard

**Situation** : Client réserve 3 articles à 500 FC pièce

1. Sélectionner l'article → Prix : **500 FC** (automatique)
2. Quantité : **3**
3. Montant Total : **1,500 FC** (automatique)
4. Montant Avancé : **500 FC** (acompte)
5. Reste à payer : **1,000 FC**

### Cas 2 : Réservation avec Remise

**Situation** : Client VIP a -10% de remise

1. Sélectionner l'article → Prix : **1,000 FC** (automatique)
2. **Modifier le prix** : **900 FC** (remise appliquée)
3. Quantité : **2**
4. Montant Total : **1,800 FC** (900 × 2)

### Cas 3 : Article sans Prix

**Situation** : Nouvel article sans prix défini

1. Sélectionner l'article → Prix : **0 FC**
2. Console : "⚠️ Aucun prix trouvé"
3. **Saisir manuellement** : **750 FC**
4. Quantité : **4**
5. Montant Total : **3,000 FC**

---

## 🔧 Maintenance

### Ajouter d'Autres Devises (Futur)

Si vous voulez supporter plusieurs devises :

```javascript
// Ajouter une sélection de devise
const devises = [
  { value: 'FC', label: 'Franc Congolais (FC)', symbole: 'FC' },
  { value: 'USD', label: 'Dollar Américain ($)', symbole: '$' },
  { value: 'EUR', label: 'Euro (€)', symbole: '€' }
];

// Affichage dynamique
<h5>{{ formatMontant(montantTotal) }} {{ deviseSelectionnee.symbole }}</h5>
```

### Taux de Change (Futur)

Pour convertir entre devises :

```javascript
const tauxChange = {
  'FC': 1,
  'USD': 2500,  // 1 USD = 2500 FC
  'EUR': 2700   // 1 EUR = 2700 FC
};

const convertir = (montant, deviseDe, deviseVers) => {
  const montantFC = montant * tauxChange[deviseDe];
  return montantFC / tauxChange[deviseVers];
};
```

---

## 🎯 Résumé

| Aspect | Avant | Après |
|--------|-------|-------|
| **Devise** | Dollar ($) | ✅ Franc Congolais (FC) |
| **Prix récupéré** | Non | ✅ Automatiquement depuis Stock/Article |
| **Source prix** | N/A | ✅ Stock > Article > Manuel |
| **Affichage** | Simple | ✅ Grande boîte verte |
| **Labels** | Génériques | ✅ "(FC)" explicite |
| **Aide** | Non | ✅ Textes d'aide et émojis |
| **Debug** | Minimal | ✅ Logs détaillés console |

---

## ✅ Tests Recommandés

### Test 1 : Prix depuis Stock
1. Créer un stock avec `prixVente = 500 FC`
2. Créer une réservation avec cet article
3. ✅ Prix = 500 FC (automatique)

### Test 2 : Prix depuis Article
1. Créer un article avec `prix = 300 FC` (sans stock)
2. Créer une réservation avec cet article
3. ✅ Prix = 300 FC (automatique depuis article)

### Test 3 : Aucun Prix
1. Créer un article sans prix défini
2. Créer une réservation
3. ✅ Prix = 0, message console, saisie manuelle requise

### Test 4 : Calcul Montant
1. Article à 200 FC, quantité 5
2. ✅ Montant = 1,000 FC
3. Affichage : "1,000.00 FC" dans boîte verte

---

**Date de modification** : 3 novembre 2025  
**Auteur** : Assistant IA  
**Version** : 1.0  
**Devise** : Franc Congolais (FC) 🇨🇩







