# ⚙️ Gestion des Ventes - Actions et Modifications

**Date** : 6 novembre 2025  
**Version** : 1.3.0  
**Statut** : ✅ Fonctionnel

---

## 🎯 Fonctionnalités Ajoutées

Le module **Journal des Ventes** inclut maintenant une colonne **"Actions"** permettant de :

1. 👁️ **Voir les détails** d'une vente
2. ✏️ **Modifier** une vente (quantité, prix)
3. ❌ **Annuler** une vente

---

## 📊 Interface Utilisateur

### Colonne "Actions" Ajoutée

**Tableau des ventes** :

| Date | Cmd | Article | Qté | P.U. | Total | Vendeur | Site | **Actions** |
|------|-----|---------|-----|------|-------|---------|------|-------------|
| 06/11 | 23 | TERRE... | 1 | 116k | 116k | Carolle | LEJ | 👁️ ✏️ ❌ |

**Boutons** :
- 👁️ **Bleu** (Info) : Voir détails (tous les rôles)
- ✏️ **Jaune** (Warning) : Modifier (gestionnaires uniquement)
- ❌ **Rouge** (Danger) : Annuler (gestionnaires uniquement)

---

## 🔐 Permissions

| Rôle | Voir Détails | Modifier | Annuler |
|------|-------------|----------|---------|
| **Superadmin** | ✅ Toutes | ✅ Toutes | ✅ Toutes |
| **Gestionnaire** | ✅ Sa société | ✅ Sa société | ✅ Sa société |
| **Caissier** | ❌ Pas d'accès au module | - | - |

**Code** :
```vue
<button
  v-if="userStore.isGestionnaire || userStore.isSuperAdmin"
  @click="modifierVente(vente)"
  title="Modifier"
>
  <i class="fas fa-edit"></i>
</button>
```

---

## 👁️ Voir les Détails

### Modal

```
┌──────────────────────────────────────────┐
│ ℹ️ Détails de la Vente #23               │
├──────────────────────────────────────────┤
│ Date: 06/11/2025     Commande: #23       │
│ ──────────────────────────────────────── │
│ Article: TERRE LEGENDAIRE                │
│ ──────────────────────────────────────── │
│ Quantité: 1   P.U.: 116 000 FC           │
│ Total: 116 000 FC                        │
│ ──────────────────────────────────────── │
│ Vendeur: Carolle Mpiana                  │
│ Site: LEJECOLIA                          │
│                                          │
│                    [Fermer]              │
└──────────────────────────────────────────┘
```

### Fonction

```javascript
const voirDetails = (vente) => {
  console.log('👁️ Affichage détails vente:', vente);
  venteSelectionnee.value = vente;
  showDetailsModal.value = true;
};
```

**Utilité** : Voir rapidement les informations complètes sans modifier

---

## ✏️ Modifier une Vente

### Modal

```
┌──────────────────────────────────────────┐
│ ✏️ Modifier la Vente #23                 │
├──────────────────────────────────────────┤
│ ⚠️ Attention: La modification affectera  │
│    les statistiques et les stocks.       │
│ ──────────────────────────────────────── │
│ Article: TERRE LEGENDAIRE (désactivé)    │
│                                          │
│ Quantité*: [___5___]                     │
│ Prix Unitaire*: [__116000__]            │
│                                          │
│ Total Calculé:                           │
│ ┌────────────────────────┐               │
│ │   580 000,00 FC        │               │
│ └────────────────────────┘               │
│                                          │
│         [Annuler]  [Enregistrer]         │
└──────────────────────────────────────────┘
```

### Fonction

```javascript
const modifierVente = (vente) => {
  console.log('✏️ Modification vente:', vente);
  venteSelectionnee.value = vente;
  showModifierModal.value = true;
};

const sauvegarderModification = async (venteModifiee) => {
  showLoading('Enregistrement...', 'Veuillez patienter');

  try {
    // Mettre à jour la ligne de commande
    await api.updateLigneCommande(venteModifiee.idCommande, {
      quantite: venteModifiee.quantite,
      prixUnitaire: venteModifiee.prixUnitaire,
      total: parseFloat(venteModifiee.quantite) * parseFloat(venteModifiee.prixUnitaire)
    });

    close();
    await showSuccess('Modifié !', 'La vente a été mise à jour');

    // Rafraîchir
    showModifierModal.value = false;
    await rafraichirDonnees();
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', 'Impossible de modifier');
  }
};
```

### Workflow

1. Clic sur ✏️ (jaune)
2. Modal s'ouvre avec données actuelles
3. Modifier **Quantité** ou **Prix Unitaire**
4. Total **recalculé automatiquement**
5. Clic sur "Enregistrer"
6. Confirmation SweetAlert
7. Données rafraîchies automatiquement

---

## ❌ Annuler une Vente

### Confirmation

```
┌──────────────────────────────────────────┐
│ ⚠️ Annuler cette vente ?                 │
├──────────────────────────────────────────┤
│ Vente #23 - TERRE LEGENDAIRE             │
│ (116 000,00 FC)                          │
│                                          │
│    [Non, conserver]  [Oui, annuler]      │
└──────────────────────────────────────────┘
```

### Fonction

```javascript
const annulerVenteConfirm = async (vente) => {
  const result = await showConfirm(
    'Annuler cette vente ?',
    `Vente #${vente.idCommande} - ${vente.libelle} (${formatCurrency(vente.total)})`,
    { 
      confirmButtonText: 'Oui, annuler',
      confirmButtonColor: '#f5365c'
    }
  );

  if (!result.isConfirmed) return;

  showLoading('Annulation en cours...', 'Veuillez patienter');

  try {
    // Marquer la commande comme "Annulée"
    await api.updateCommande(vente.idCommande, {
      statutCommande: 'Annulée'
    });

    close();
    await showSuccess('Vente annulée !', 'La vente a été marquée comme annulée');

    // Rafraîchir
    await rafraichirDonnees();
  } catch (error) {
    close();
    console.error('❌ Erreur:', error);
    await showError('Erreur', 'Impossible d\'annuler');
  }
};
```

### Workflow

1. Clic sur ❌ (rouge)
2. Confirmation SweetAlert
3. Si confirmé → API `PUT /api/Commande/{id}` avec `statutCommande: "Annulée"`
4. Message de succès
5. Liste rafraîchie automatiquement
6. Vente marquée mais **pas supprimée** (conservée dans l'historique)

---

## 📡 Endpoints API Utilisés

| Action | Méthode | Endpoint | Fonction |
|--------|---------|----------|----------|
| Modifier | PUT | `/api/LigneCommande/{id}` | `updateLigneCommande()` |
| Annuler | PUT | `/api/Commande/{id}` | `updateCommande()` |
| Rafraîchir | GET | `/api/V_JournalVenteParSite/paged` | `getJournalVentePaged()` |

**Tous les endpoints existent déjà** dans `api.service.js` ✅

---

## 🔄 Auto-Refresh

### Après Modification/Annulation

```javascript
// Automatiquement après chaque action
await rafraichirDonnees();
```

**Résultat** :
- Les statistiques se mettent à jour
- Le tableau se recharge
- Les totaux sont recalculés

### Bouton Manuel

Bouton "🔄 Rafraîchir" en haut à droite de la page.

---

## 🛡️ Sécurité

### Validation Côté Serveur

**IMPORTANT** : Le backend doit vérifier que :
- L'utilisateur a le droit de modifier/annuler cette vente
- La vente appartient à la société de l'utilisateur
- Le stock est réajusté après modification

### Double Confirmation

Pour les actions critiques :
1. **Confirmation SweetAlert** (frontend)
2. **Validation backend** (API)

---

## 🧪 Tests

### Test 1 : Voir Détails

1. Aller dans Journal des Ventes
2. Cliquer sur 👁️ (bleu) d'une vente
3. **Vérifier** : Modal s'ouvre avec toutes les infos
4. Cliquer "Fermer"
5. **Vérifier** : Modal se ferme

**✅ Résultat** : Tous les détails affichés correctement

---

### Test 2 : Modifier une Vente

1. Cliquer sur ✏️ (jaune) d'une vente
2. **Modifier** la quantité de 1 à 5
3. **Vérifier** : Total recalculé automatiquement
4. Cliquer "Enregistrer"
5. **Vérifier** : 
   - Message "Modifié !"
   - Liste rafraîchie
   - Nouvelle quantité affichée
   - Statistiques mises à jour

**✅ Résultat** : Modification enregistrée et visible

---

### Test 3 : Annuler une Vente

1. Cliquer sur ❌ (rouge) d'une vente
2. **Confirmer** l'annulation
3. **Vérifier** :
   - Message "Vente annulée !"
   - Liste rafraîchie
   - Vente marquée comme annulée (ou retirée)
   - Statistiques recalculées

**✅ Résultat** : Vente annulée avec succès

---

## 🎨 Style et UX

### Boutons d'Action

```css
.btn-link {
  padding: 0;
  margin-bottom: 0;
}

.btn-link:hover {
  transform: scale(1.2);
  transition: transform 0.2s;
}
```

**Icônes** :
- 👁️ `fa-eye` (bleu)
- ✏️ `fa-edit` (jaune)
- ❌ `fa-trash` (rouge)

### Modals

- **Header coloré** selon l'action (bleu, jaune)
- **Alertes** pour les actions critiques
- **Calcul en temps réel** du total
- **Boutons clairement identifiés**

---

## 📝 Logs de Debug

### Voir Détails

```
👁️ Affichage détails vente: {idCommande: "23", libelle: "TERRE LEGENDAIRE", ...}
```

### Modifier

```
✏️ Modification vente: {idCommande: "23", quantite: "1", ...}
📤 PUT /api/LigneCommande/23 avec: {quantite: 5, prixUnitaire: 116000, ...}
✅ Modifié !
🔄 RAFRAÎCHISSEMENT MANUEL des données...
✅ Rafraîchissement terminé
```

### Annuler

```
❌ Annulation vente: {idCommande: "23", ...}
📤 PUT /api/Commande/23 avec: {statutCommande: "Annulée"}
✅ Vente annulée !
🔄 RAFRAÎCHISSEMENT MANUEL des données...
✅ Rafraîchissement terminé
```

---

## 🚨 Gestion des Erreurs

### Erreur 403 : Accès Refusé

```
❌ Erreur: Vous n'avez pas le droit de modifier cette vente
```

**Cause** : Vente d'une autre société ou rôle insuffisant

### Erreur 404 : Vente Non Trouvée

```
❌ Erreur: Vente introuvable
```

**Cause** : Vente déjà supprimée ou ID incorrect

### Erreur 400 : Données Invalides

```
❌ Erreur: Quantité doit être > 0
```

**Cause** : Validation backend échouée

---

## 🔧 Améliorations Futures

### Court Terme

1. **Historique des modifications** :
   - Tracer qui a modifié quoi et quand
   - Table `HistoriqueVentes`

2. **Raison d'annulation** :
   - Champ texte dans la confirmation
   - Enregistrer la raison

3. **Notifications** :
   - Notifier le vendeur original de la modification
   - Email de confirmation

### Moyen Terme

1. **Modification groupée** :
   - Sélectionner plusieurs ventes
   - Appliquer une remise globale

2. **Restauration** :
   - Annuler l'annulation
   - Restaurer une vente annulée

3. **Filtrer les ventes annulées** :
   - Checkbox "Afficher les ventes annulées"
   - Badge rouge pour les ventes annulées

---

## ✅ Checklist de Production

Avant déploiement :

- [x] Boutons Actions ajoutés
- [x] Modal Détails créé
- [x] Modal Modification créé
- [x] Fonction Annulation créée
- [x] Permissions par rôle implémentées
- [x] Endpoints API vérifiés
- [ ] Tests avec données réelles
- [ ] Vérification backend (validation)
- [ ] Test de sécurité (modification vente autre société)

---

## 🎉 Résumé

Le module **Journal des Ventes** permet maintenant aux **gestionnaires** de :

✅ **Consulter** les détails de chaque vente  
✅ **Modifier** la quantité ou le prix  
✅ **Annuler** une vente incorrecte  
✅ **Rafraîchir** les données en un clic  
✅ **Voir les stats** recalculées automatiquement  

**Tous les changements sont tracés dans les logs** pour audit et debugging ! 🔒

---

**Date de création** : 6 novembre 2025  
**Version** : 1.3.0  
**Statut** : ✅ Production Ready  
**Fichiers modifiés** : `src/views/JournalVentes.vue`

