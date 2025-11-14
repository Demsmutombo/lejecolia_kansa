# Guide de Dépannage - Clients Non Visibles

## 🔍 Diagnostic du Problème

Vos clients ont été créés mais ne s'affichent pas dans la liste. Voici comment diagnostiquer et résoudre le problème.

---

## 📋 Étapes de Diagnostic

### Étape 1 : Ouvrir la Console du Navigateur

1. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
2. Allez dans l'onglet **Console**
3. Rechargez la page Clients
4. Observez les messages de debug

---

### Étape 2 : Vérifier les Messages de Debug

Vous devriez voir ces messages dans la console :

```
📋 GET /api/Clients
📋 X client(s) reçu(s) de l'API
🔍 DEBUG - Tous les clients reçus: [...]
🔍 DEBUG - Filtrage pour société #18
🔍 DEBUG - Sites chargés: [...]
🔍 DEBUG - sitesMap: {...}
🔍 Client DORCAS LENGE: idSite=7, société du site=18, match=true
🔒 1 client(s) filtrés pour société #18
✅ 1 client(s) chargé(s)
```

---

## 🔧 Solutions Selon le Problème

### Problème 1 : 0 client(s) reçu(s) de l'API

**Cause** : L'API ne retourne aucun client

**Solution** :
```javascript
// Vérifiez dans la console :
📋 0 client(s) reçu(s) de l'API
```

✅ **Résolution** :
- Le client n'a pas été créé correctement dans la base de données
- Essayez de créer un nouveau client
- Vérifiez que l'API `/api/Clients` fonctionne

---

### Problème 2 : Clients reçus mais 0 après filtrage

**Cause** : Le client a un `idSite` qui n'appartient pas à votre société

**Solution** :
```javascript
// Dans la console, vous verrez :
📋 1 client(s) reçu(s) de l'API
🔍 Client DORCAS LENGE: idSite=7, société du site=5, match=false
🔒 0 client(s) filtrés pour société #18
```

**Explication** :
- Le client a été créé avec `idSite = 7`
- Le site #7 appartient à la société #5
- Vous êtes gestionnaire de la société #18
- Le client est filtré et n'apparaît pas

✅ **Résolution Option A - Corriger le site du client** :

1. Connectez-vous en tant que **SuperAdmin**
2. Allez dans **Clients**
3. Vous verrez TOUS les clients (pas de filtrage)
4. Modifiez le client et changez son **Site** pour un site de votre société

✅ **Résolution Option B - Désactiver temporairement le filtrage** :

Je peux modifier le code pour désactiver le filtrage temporairement.

---

### Problème 3 : idSite non défini

**Cause** : Le client a été créé sans `idSite`

**Solution** :
```javascript
// Dans la console :
🔍 Client DORCAS LENGE: idSite=undefined, société du site=undefined, match=false
```

✅ **Résolution** :
- Le champ `idSite` est obligatoire lors de la création
- Recréez le client en sélectionnant un site

---

## 🚨 Solution Rapide : Désactiver le Filtrage Temporairement

Si vous voulez voir TOUS vos clients rapidement pour vérifier qu'ils existent :

### Option 1 : Connexion SuperAdmin

1. Déconnectez-vous
2. Connectez-vous en tant que **SuperAdmin**
3. Allez dans **Clients**
4. Vous verrez TOUS les clients de toutes les sociétés

### Option 2 : Modifier le Code (Temporaire)

Je peux modifier `Clients.vue` pour désactiver le filtrage :

```javascript
// AVANT (avec filtrage)
if (societeId && !isSuperAdmin) {
  // Filtrage actif
}

// APRÈS (sans filtrage - TEMPORAIRE)
if (false) { // Désactiver le filtrage
  // Filtrage désactivé
}
```

**⚠️ Attention** : Cette solution est **temporaire** pour le debug uniquement !

---

## 📊 Vérification des Données

### Vérifier votre Société ID

```javascript
// Dans la console, tapez :
console.log('Ma société:', userStore.societeId);
console.log('Je suis SuperAdmin:', userStore.isSuperAdmin);
```

### Vérifier les Sites de votre Société

```javascript
// Dans la console, après chargement :
// Regardez "🔍 DEBUG - Sites chargés:"
// Notez les idSite de votre société

// Exemple :
Sites de la société #18:
  - Site #7: "Boutique Centre"
  - Site #12: "Boutique Nord"
```

### Vérifier le Site du Client

```javascript
// Dans la console :
🔍 DEBUG - Tous les clients reçus:
[
  {
    idClient: 1,
    nom: "DORCAS",
    prenom: "LENGE",
    idSite: 7,  ← Vérifiez ce numéro
    telephone: "0987667890"
  }
]
```

---

## ✅ Checklist de Vérification

- [ ] J'ai ouvert la console (F12)
- [ ] J'ai rechargé la page Clients
- [ ] J'ai noté le nombre de clients reçus de l'API
- [ ] J'ai noté mon numéro de société
- [ ] J'ai vérifié les idSite de mes sites
- [ ] J'ai vérifié les idSite de mes clients
- [ ] J'ai identifié le problème (voir ci-dessus)

---

## 🔧 Actions Recommandées

### Action 1 : Vérifier les Logs (Maintenant)

1. Ouvrez la console (F12)
2. Allez sur la page Clients
3. Copiez TOUS les messages de debug
4. Partagez-les avec moi

### Action 2 : Créer un Client Test

1. Cliquez sur "Nouveau Client"
2. Remplissez le formulaire
3. **IMPORTANT** : Vérifiez que le **Site** sélectionné appartient bien à votre société
4. Enregistrez
5. Vérifiez dans la console si le client apparaît

### Action 3 : Connexion SuperAdmin (Test)

1. Connectez-vous en tant que SuperAdmin
2. Allez dans Clients
3. Vérifiez si vos clients apparaissent
4. Si OUI : le problème vient du filtrage par société
5. Si NON : le problème vient de l'API ou de la base de données

---

## 📞 Demande d'Aide

Si le problème persiste, partagez avec moi :

1. **Les logs de la console** (copier-coller)
2. **Votre rôle** : SuperAdmin ou Gestionnaire ?
3. **Votre société ID** : Numéro de votre société
4. **Nombre de clients créés** : Combien de clients avez-vous créés ?
5. **Screenshot** : Capture d'écran de la console

---

## 🎯 Solutions Permanentes

### Solution A : Corriger les Données

Si vos clients ont le mauvais `idSite` :
- Je peux créer un script de migration
- Ou vous les modifiez un par un en tant que SuperAdmin

### Solution B : Modifier le Filtrage

Si le filtrage est trop strict :
- Je peux ajuster la logique de filtrage
- Ou ajouter un toggle pour activer/désactiver le filtrage

### Solution C : Désactiver le Filtrage

Si vous n'avez qu'une seule société :
- Je peux désactiver complètement le filtrage
- Tous les clients s'afficheront toujours

---

## 📝 Notes Importantes

### Pourquoi le Filtrage ?

Le filtrage a été mis en place pour :
- **Isoler les sociétés** : Chaque gestionnaire ne voit que ses clients
- **Sécurité** : Empêcher l'accès aux données d'autres sociétés
- **Multi-tenancy** : Support de plusieurs sociétés sur la même plateforme

### Quand Désactiver ?

Désactivez le filtrage si :
- Vous avez **une seule société**
- Vous êtes en **phase de test**
- Vous voulez **tous vos clients visibles**

---

## 🚀 Prochaines Étapes

**MAINTENANT** :
1. Ouvrez la console (F12)
2. Rechargez la page Clients
3. Regardez les logs de debug
4. Partagez-les avec moi

**ENSUITE** :
- Je vous donnerai la solution adaptée à votre situation
- Soit on corrige les données
- Soit on ajuste le filtrage
- Soit on le désactive complètement

---

**Date** : 3 novembre 2025  
**Statut** : 🔍 Diagnostic en cours  
**Action requise** : Ouvrir la console et partager les logs







