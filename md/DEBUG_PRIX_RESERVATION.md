# Debug - Prix Réservation Ne Se Remplit Pas

## 🔍 Système de Récupération du Prix

Le prix de l'article est maintenant récupéré automatiquement avec **3 niveaux de recherche** :

```
1. Article.prix (priorité 1) ✅
   ↓ Si pas trouvé
2. Stock.prixVente (priorité 2) ✅
   ↓ Si pas trouvé
3. Saisie manuelle (prix = 0) ⚠️
```

---

## 📋 Comment Débugger

### Étape 1 : Ouvrir la Console (F12)

1. Appuyez sur **F12**
2. Allez dans l'onglet **Console**
3. Ouvrez le formulaire "Nouvelle Réservation"
4. Sélectionnez un article

### Étape 2 : Vérifier les Logs

Vous devriez voir ces messages :

```
📋 Articles complets chargés: X
🔍 Premier article: { idArticle: 1, libelle: "...", prix: 500, ... }
✅ Articles chargés pour dropdown: X

// Puis quand vous sélectionnez un article:
🔄 Article changé: 5
💰 === RÉCUPÉRATION PRIX ARTICLE #5 ===
🔍 Article trouvé dans articlesData: { ... }
🔍 Prix possibles dans article: {
  prix: 500,
  prixVente: null,
  prixUnitaire: null,
  tarif: null,
  montant: null
}
✅ Prix récupéré depuis article: 500 FC
💰 Calcul: 500 FC × 1 = 500 FC
```

---

## ❌ Problèmes Possibles et Solutions

### Problème 1 : Aucun Article Chargé

**Console** :
```
📋 Articles complets chargés: 0
✅ Articles chargés pour dropdown: 0
```

**Cause** : L'API `/api/Articles` ne retourne rien

**Solution** :
1. Vérifiez que vous avez créé des articles
2. Allez dans le menu "Articles"
3. Créez au moins un article avec un prix

---

### Problème 2 : Article Sans Prix

**Console** :
```
🔍 Prix possibles dans article: {
  prix: null,
  prixVente: null,
  prixUnitaire: null,
  tarif: null,
  montant: null
}
🔍 Recherche prix dans les stocks...
📋 Stocks chargés: 10
🔍 Stock trouvé: null
❌ AUCUN PRIX TROUVÉ pour article #5
💡 Veuillez saisir le prix manuellement
```

**Cause** : L'article n'a pas de prix défini

**Solution A - Ajouter le prix à l'article** :
1. Allez dans "Articles"
2. Modifiez l'article
3. Ajoutez un prix

**Solution B - Créer un stock avec prix** :
1. Allez dans "Stocks"
2. Créez un stock pour cet article
3. Définissez le `prixVente`

---

### Problème 3 : Article Trouvé Mais Prix = 0

**Console** :
```
🔍 Prix possibles dans article: {
  prix: 0,
  prixVente: 0,
  ...
}
```

**Cause** : Le prix est défini à 0

**Solution** :
1. Modifiez l'article et mettez un prix > 0
2. Ou créez un stock avec prixVente > 0

---

### Problème 4 : Événement @change Ne Se Déclenche Pas

**Console** :
```
// Aucun message "🔄 Article changé"
```

**Cause** : Le composant ArgonSelect ne déclenche pas l'événement

**Solution** :
Le watch devrait fonctionner même sans @change. Vérifiez le watch :

```javascript
watch(() => formData.value.idArticle, (newIdArticle) => {
  console.log('👁️ WATCH DÉCLENCHÉ, nouvel article:', newIdArticle);
  if (newIdArticle) {
    getPrixArticle(newIdArticle);
  }
});
```

---

## 🧪 Tests de Diagnostic

### Test 1 : Vérifier les Articles

Dans la console, tapez :
```javascript
// Copier-coller dans la console
console.log('Articles chargés:', articlesData.value);
console.log('Premier article:', articlesData.value[0]);
```

**Résultat Attendu** :
```javascript
Articles chargés: Array(5) [...]
Premier article: {
  idArticle: 1,
  libelle: "Produit X",
  prix: 500,  ← DOIT EXISTER
  ...
}
```

### Test 2 : Récupération Manuelle du Prix

Dans la console, tapez :
```javascript
// Remplacer 5 par l'ID de votre article
const article = articlesData.value.find(a => a.idArticle === 5);
console.log('Article trouvé:', article);
console.log('Prix:', article.prix);
```

### Test 3 : Vérifier le FormData

Dans la console après sélection d'article, tapez :
```javascript
console.log('ID Article sélectionné:', formData.value.idArticle);
console.log('Prix Unitaire:', formData.value.prixUnitaire);
console.log('Montant Total:', formData.value.montantTotal);
```

---

## 🔧 Structure de l'Article API

Votre API doit retourner des articles avec cette structure :

```json
[
  {
    "idArticle": 1,
    "libelle": "Produit A",
    "prix": 500,          ← IMPORTANT !
    "description": "...",
    "idSociete": 18,
    "statut": true
  },
  {
    "idArticle": 2,
    "libelle": "Produit B",
    "prix": 750,          ← IMPORTANT !
    "description": "...",
    "idSociete": 18,
    "statut": true
  }
]
```

**Champs Prix Acceptés** :
- `prix` ← **Recommandé**
- `prixVente`
- `prixUnitaire`
- `tarif`
- `montant`

---

## 📊 Propriétés Essayées

La fonction essaie **5 propriétés différentes** pour trouver le prix :

```javascript
const prixPossibles = [
  article.prix,          // ← Essayé en premier
  article.prixVente,     // ← Essayé en deuxième
  article.prixUnitaire,  // ← Essayé en troisième
  article.tarif,         // ← Essayé en quatrième
  article.montant        // ← Essayé en cinquième
];

// Prend le premier qui n'est pas null/undefined et > 0
const prix = prixPossibles.find(p => p !== null && p !== undefined && p > 0);
```

---

## 🚀 Actions Immédiates

### Action 1 : Vérifier la Structure de vos Articles

1. Ouvrez la console (F12)
2. Allez sur la page "Articles"
3. Dans la console, tapez :
```javascript
// Voir tous les articles
console.table(articlesData.value);
```

4. Vérifiez que la colonne `prix` existe et contient des valeurs

### Action 2 : Créer un Article Test

1. Allez dans "Articles"
2. Créez un nouvel article
3. **IMPORTANT** : Remplissez le champ **Prix**
4. Enregistrez
5. Retournez dans Réservations
6. Sélectionnez cet article
7. Vérifiez si le prix se remplit

### Action 3 : Partager les Logs

Copiez-collez dans la console et partagez le résultat :

```javascript
// 1. Articles chargés
console.log('📋 Articles:', articlesData.value);

// 2. Premier article
console.log('🔍 Premier article:', articlesData.value[0]);

// 3. Prix du premier article
const premier = articlesData.value[0];
if (premier) {
  console.log('💰 Prix trouvés:', {
    prix: premier.prix,
    prixVente: premier.prixVente,
    prixUnitaire: premier.prixUnitaire
  });
}
```

---

## 💡 Solution Temporaire

Si ça ne fonctionne toujours pas, saisissez le prix **manuellement** :

1. Sélectionnez l'article
2. Dans le champ "Prix Unitaire (FC)"
3. Tapez le prix (ex: 500)
4. Le montant total se calculera automatiquement

---

## 📞 Besoin d'Aide ?

Partagez avec moi :

1. **Les logs de la console** quand vous sélectionnez un article
2. **La structure d'un article** : `console.log(articlesData.value[0])`
3. **Screenshot** de la console avec les erreurs/warnings

Je pourrai alors vous donner une solution précise ! 🎯

---

**Date** : 3 novembre 2025  
**Statut** : 🔍 Debug en cours  
**Action** : Ouvrir console et partager les logs







