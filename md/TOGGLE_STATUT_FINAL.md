# 🔄 TOGGLE STATUT - Solution Complète

## ✅ PROBLÈME RÉSOLU

### Avant
- ❌ Pas de moyen de désactiver une société
- ❌ Fallait la supprimer pour la retirer
- ❌ Perte de données

### Après ✅
- ✅ **Toggle Activer/Désactiver** en 1 clic
- ✅ **Conservation** de toutes les données
- ✅ **Réversible** à tout moment
- ✅ **Icône dynamique** (vert/gris)
- ✅ **Label dynamique** (Activer/Désactiver)

---

## 🎯 FONCTIONNEMENT

### Société Active (🟢)

```
┌──────────────────────────────────────────────┐
│ cadolux        [✓ Actif] 🟢                  │
│                                              │
│ Actions:                                     │
│ [👁️] [🟢 Désactiver] [✏️] [🗑️]             │
└──────────────────────────────────────────────┘
```

**Clic sur "Désactiver" :**
```
1. Popup: "Désactiver cette société ?"
           "Voulez-vous désactiver cadolux ?"
   ↓
2. Clic "Oui, désactiver"
   ↓
3. PUT /api/Societes/13 avec { ...données, statut: false }
   ↓
4. Message: "cadolux a été désactivée avec succès"
   ↓
5. Badge devient: [Inactif] ⚫
   Icône devient: [⚫ Activer] (grise)
```

---

### Société Inactive (⚫)

```
┌──────────────────────────────────────────────┐
│ cadolux        [Inactif] ⚫                   │
│                                              │
│ Actions:                                     │
│ [👁️] [⚫ Activer] [✏️] [🗑️]                 │
└──────────────────────────────────────────────┘
```

**Clic sur "Activer" :**
```
1. Popup: "Activer cette société ?"
           "Voulez-vous activer cadolux ?"
   ↓
2. Clic "Oui, activer"
   ↓
3. PUT /api/Societes/13 avec { ...données, statut: true }
   ↓
4. Message: "cadolux a été activée avec succès"
   ↓
5. Badge devient: [✓ Actif] 🟢
   Icône devient: [🟢 Désactiver] (verte)
```

---

## 🔧 CORRECTIONS APPLIQUÉES

### 1. **Action Toggle Ajoutée** (Societes.vue)

```javascript
{
  name: 'toggle',
  label: (row) => row.statut ? 'Désactiver' : 'Activer',
  icon: (row) => row.statut ? 'fas fa-toggle-on' : 'fas fa-toggle-off',
  class: (row) => row.statut ? 'text-success' : 'text-secondary',
  onClick: (row) => handleToggleStatus(row)
}
```

**Propriétés dynamiques :**
- `label` est une **fonction** qui retourne le texte selon le statut
- `icon` est une **fonction** qui retourne l'icône selon le statut
- `class` est une **fonction** qui retourne la couleur selon le statut

---

### 2. **Fonction handleToggleStatus** (Societes.vue)

```javascript
const handleToggleStatus = async (societe) => {
  const newStatus = !societe.statut;
  const action = newStatus ? 'activer' : 'désactiver';
  
  // Confirmation
  const result = await showConfirm(
    `${action.charAt(0).toUpperCase() + action.slice(1)} cette société ?`,
    `Voulez-vous ${action} "${societe.nomSociete}" ?`
  );

  if (result.isConfirmed) {
    // Mise à jour du statut uniquement
    const updatedData = { ...societe, statut: newStatus };
    await api.updateSociete(societe.idSociete, updatedData);
    
    const statusText = newStatus ? 'activée' : 'désactivée';
    await showSuccess('Statut modifié !', `${societe.nomSociete} a été ${statusText}`);
    
    await loadSocietes(); // Rafraîchir la liste
  }
};
```

---

### 3. **DataTable - Support Fonctions Dynamiques**

```javascript
// Méthodes ajoutées
const getActionLabel = (action, row) => {
  return typeof action.label === 'function' 
    ? action.label(row) 
    : action.label;
};

const getActionIcon = (action, row) => {
  return typeof action.icon === 'function' 
    ? action.icon(row) 
    : action.icon;
};

const getActionClass = (action, row) => {
  const baseClass = typeof action.class === 'function' 
    ? action.class(row) 
    : action.class;
  return baseClass || 'text-secondary';
};
```

**Template mis à jour :**
```vue
<a
  :class="getActionClass(action, row)"
  :title="getActionLabel(action, row)"
>
  <i :class="getActionIcon(action, row)"></i>
  <span>{{ getActionLabel(action, row) }}</span>
</a>
```

---

### 4. **ArgonSwitch - v-model Supporté**

```vue
<argon-switch 
  v-model="formData.statut"
  id="societeStatut"
  name="statut"
>
  Société active
</argon-switch>
```

**Événements :**
```javascript
@change="emit('update:modelValue', $event.target.checked)"
```

---

## 🎨 FEEDBACK VISUEL

### Badge dans le Tableau

| Statut | Badge | Couleur |
|--------|-------|---------|
| Actif | `[✓ Actif]` | 🟢 Vert |
| Inactif | `[Inactif]` | ⚫ Gris |

### Icône Toggle

| Statut | Icône | Label | Couleur |
|--------|-------|-------|---------|
| Actif | 🔄 toggle-on | "Désactiver" | 🟢 Vert |
| Inactif | 🔄 toggle-off | "Activer" | ⚫ Gris |

### Messages de Confirmation

| Action | Titre | Bouton | Couleur |
|--------|-------|--------|---------|
| Activer | "Activer cette société ?" | "Oui, activer" | 🟢 Vert |
| Désactiver | "Désactiver cette société ?" | "Oui, désactiver" | 🔴 Rouge |

---

## 📊 ORDRE DES ACTIONS

```
[👁️] [🔄] [✏️] [🗑️]
```

1. **👁️ Voir** - Consultation (noir)
2. **🔄 Toggle** - Change statut (vert/gris) ⭐
3. **✏️ Modifier** - Édite tout (gris)
4. **🗑️ Supprimer** - Suppression (rouge)

**De la moins dangereuse à la plus dangereuse** →

---

## 🎯 CAS D'USAGE

### Suspendre temporairement

```
Société: Hotel Palace
Raison: Rénovations 3 mois

Action:
1. Clic 🔄 "Désactiver"
2. Société → Inactif ⚫
3. Après 3 mois → Clic 🔄 "Activer"
4. Société → Actif 🟢

✅ Aucune donnée perdue
✅ Réactivation facile
```

### Archiver sans supprimer

```
Société: Ancien Client
Raison: Plus de contrat actif

Action:
1. Clic 🔄 "Désactiver"
2. Société → Inactif ⚫
3. Société archivée mais consultable

✅ Historique conservé
✅ Peut être réactivé si nouveau contrat
```

### Supprimer définitivement

```
Société: Test 123
Raison: Doublon à supprimer

Action:
1. Clic 🗑️ "Supprimer"
2. Confirmation
3. Société disparaît

⚠️ Perte définitive
⚠️ Irréversible
```

---

## 📁 FICHIERS MODIFIÉS

### 1. ✅ `src/components/DataTable.vue`
- Ajout `getActionLabel()`
- Ajout `getActionIcon()`
- Ajout `getActionClass()`
- Support des fonctions dynamiques

### 2. ✅ `src/views/Societes.vue`
- Action toggle ajoutée
- Fonction `handleToggleStatus()`
- Icônes/labels dynamiques

### 3. ✅ `src/components/ArgonSwitch.vue`
- Support v-model
- Événement update:modelValue

### 4. ✅ Documentation
- `TOGGLE_STATUT_FINAL.md`
- `ACTIONS_SOCIETES.md`
- `CORRECTION_SWITCH.md`

---

## 🧪 TESTER MAINTENANT

1. **Rechargez** `/societes`
2. **Regardez** les actions de "cadolux"
3. **Vous verrez** :
   - 👁️ Voir
   - 🟢 Désactiver (si actif) OU ⚫ Activer (si inactif)
   - ✏️ Modifier
   - 🗑️ Supprimer
4. **Survolez** chaque icône pour voir le label
5. **Cliquez** sur Toggle (🔄)
6. **Confirmez**
7. **Vérifiez** que le badge change
8. **Re-cliquez** pour inverser

---

## 🎊 RÉSULTAT FINAL

**GESTION COMPLÈTE DU STATUT !**

✅ **Toggle** en 1 clic  
✅ **Icône dynamique** selon statut  
✅ **Label dynamique** selon statut  
✅ **Couleur dynamique** selon statut  
✅ **Confirmation** avant action  
✅ **Message** de succès  
✅ **Rafraîchissement** automatique  
✅ **Données conservées**  
✅ **Réversible** à tout moment  

**Vous pouvez maintenant activer/désactiver une société sans la supprimer !** 🚀

---

## 💡 AVANTAGE DU DATATABLE

Le DataTable supporte maintenant :

✅ **Propriétés statiques** : `label: "Voir"`  
✅ **Propriétés dynamiques** : `label: (row) => row.active ? "Désactiver" : "Activer"`  

**Réutilisable pour toutes vos tables !** 🎯

