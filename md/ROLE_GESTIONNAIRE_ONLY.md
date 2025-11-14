# 👤 RÔLE GESTIONNAIRE UNIQUEMENT

## 🎯 OBJECTIF

Dans le formulaire de création/modification d'utilisateur, le dropdown **Rôle** affiche **uniquement le rôle "Gestionnaire"**, pas tous les autres rôles.

---

## ✅ FONCTIONNEMENT

### Filtrage Automatique

```javascript
// Charger tous les rôles depuis l'API
const allRoles = await api.getRoles();

// Filtrer pour ne garder QUE "Gestionnaire"
const gestionnaireRoles = allRoles.filter(role => {
  const roleName = role.nom || role.name || '';
  return roleName.toLowerCase().includes('gestionnaire');
});

// Afficher dans le dropdown
roles.value = gestionnaireRoles;
```

### Pré-sélection Automatique

Si un seul rôle disponible (Gestionnaire), il est **automatiquement pré-sélectionné** :

```javascript
if (roles.value.length === 1 && !formData.value.idRole) {
  formData.value.idRole = roles.value[0].value;
  console.log('✅ Rôle Gestionnaire pré-sélectionné automatiquement');
}
```

---

## 📊 AVANT vs APRÈS

### Avant

**Dropdown Rôle affichait :**
- Super-Admin
- Admin
- Gestionnaire ✅
- Utilisateur
- Etc.

❌ L'utilisateur pouvait sélectionner n'importe quel rôle

### Après

**Dropdown Rôle affiche :**
- Gestionnaire ✅

✅ Un seul choix possible  
✅ Pré-sélectionné automatiquement  
✅ Cohérent avec le filtre de la liste  

---

## 🔒 SÉCURITÉ

### Pourquoi Filtrer ?

1. **Cohérence** - La liste affiche seulement les gestionnaires
2. **Sécurité** - Empêche de créer des Super-Admin par erreur
3. **Simplicité** - Un seul choix = moins d'erreurs
4. **Rôle défini** - Le SuperAdmin gère SEULEMENT les gestionnaires

### Rôles Protégés

❌ **Super-Admin** - Ne peut pas être créé via ce formulaire  
❌ **Admin** - Ne peut pas être créé via ce formulaire  
❌ **Autres rôles** - Ne peuvent pas être créés via ce formulaire  
✅ **Gestionnaire** - Seul rôle disponible  

---

## 🎨 INTERFACE

### Formulaire

```
┌─────────────────────────────────┐
│  Nouvel Utilisateur             │
├─────────────────────────────────┤
│                                 │
│  Nom *          Prénom *        │
│  [_____]        [_____]         │
│                                 │
│  Email *        Téléphone *     │
│  [_____]        [_____]         │
│                                 │
│  Login *        Mot de passe *  │
│  [_____]        [_____]         │
│                                 │
│  Site *         Rôle *          │
│  [Site 1 ▼]     [Gestionnaire]  │ ← Pré-sélectionné !
│                                 │
├─────────────────────────────────┤
│  [Annuler]  [Enregistrer]       │
└─────────────────────────────────┘
```

**Le rôle "Gestionnaire" est :**
- ✅ Pré-sélectionné automatiquement
- ✅ Seul choix disponible
- ✅ Obligatoire (champ requis)

---

## 🔍 LOGS DE DÉBOGAGE

Lors de l'ouverture du modal, dans la console :

```
✅ Sites chargés pour dropdown: 2
✅ Rôles filtrés (Gestionnaire uniquement): 1
📋 Rôles disponibles: [{ value: 3, label: "Gestionnaire" }]
✅ Rôle Gestionnaire pré-sélectionné automatiquement
```

Cela confirme :
- Nombre de rôles après filtrage (devrait être 1)
- Le rôle disponible (Gestionnaire)
- La pré-sélection automatique

---

## 🔧 MODIFICATIONS

### `src/components/modals/UtilisateurModal.vue`

**Fonction `loadRoles()` modifiée :**

```javascript
const loadRoles = async () => {
  // Charger tous les rôles
  const response = await api.getRoles();
  const allRoles = Array.isArray(response) ? response : [];
  
  // ✅ FILTRE: Ne garder QUE "Gestionnaire"
  const gestionnaireRoles = allRoles.filter(role => {
    const roleName = role.nom || role.name || '';
    return roleName.toLowerCase().includes('gestionnaire');
  });
  
  // Mapper pour le dropdown
  roles.value = gestionnaireRoles.map(role => ({
    value: parseInt(role.idRole, 10),
    label: role.nom || role.name
  }));
  
  // ✅ PRÉ-SÉLECTION: Si un seul rôle, le sélectionner automatiquement
  if (roles.value.length === 1 && !formData.value.idRole) {
    formData.value.idRole = roles.value[0].value;
  }
};
```

---

## 📋 CAS D'USAGE

### Création d'un Nouveau Gestionnaire

1. SuperAdmin clique sur **"Nouveau Gestionnaire"**
2. Modal s'ouvre
3. Rôle **"Gestionnaire"** déjà sélectionné ✅
4. Utilisateur remplit les autres champs
5. Enregistre → Nouvel utilisateur avec rôle Gestionnaire

### Modification d'un Gestionnaire

1. SuperAdmin clique sur **"Modifier"** sur un gestionnaire
2. Modal s'ouvre avec données pré-remplies
3. Rôle affiché : **"Gestionnaire"** (désactivé si souhaité)
4. Utilisateur modifie d'autres champs
5. Enregistre → Rôle reste "Gestionnaire"

---

## ⚙️ CONFIGURATION

### Changer le Rôle Filtré

Pour afficher un autre rôle, modifier le filtre :

```javascript
// Afficher uniquement "Admin"
return roleName.toLowerCase().includes('admin');

// Afficher uniquement "Super-Admin"
return roleName.toLowerCase().includes('super');
```

### Afficher Plusieurs Rôles

Pour afficher Gestionnaire + Utilisateur :

```javascript
return roleName.toLowerCase().includes('gestionnaire') ||
       roleName.toLowerCase().includes('utilisateur');
```

### Désactiver le Filtre

Pour afficher tous les rôles :

```javascript
// Supprimer le filtre
roles.value = allRoles.map(role => ({
  value: parseInt(role.idRole, 10),
  label: role.nom || role.name
}));
```

---

## 🧪 TESTER

1. **Ouvrir** `/utilisateurs`
2. **Cliquer** sur "Nouveau Gestionnaire"
3. **Vérifier** dans le formulaire :
   - ✅ Dropdown "Rôle" affiche SEULEMENT "Gestionnaire"
   - ✅ Rôle déjà pré-sélectionné
   - ✅ Console: "Rôles filtrés (Gestionnaire uniquement): 1"

4. **Créer** un utilisateur
5. **Vérifier** qu'il a bien le rôle "Gestionnaire"
6. **Vérifier** qu'il apparaît dans la liste filtrée

---

## 💡 COHÉRENCE AVEC LA LISTE

### Page Liste

**Affiche :** Seulement les gestionnaires  
**Badge :** "Rôle: Gestionnaire uniquement"

### Modal Formulaire

**Dropdown Rôle :** Seulement "Gestionnaire"  
**Pré-sélection :** Automatique

✅ **Cohérence totale** entre la liste et le formulaire !

---

## 🎯 RÉSULTAT

### Avant

- Dropdown affichait tous les rôles (5+)
- Risque de sélectionner le mauvais rôle
- Incohérence avec la liste filtrée

### Après

- ✅ Dropdown affiche SEULEMENT "Gestionnaire"
- ✅ Pré-sélectionné automatiquement
- ✅ Cohérent avec la liste filtrée
- ✅ Impossible de créer autre chose qu'un gestionnaire
- ✅ Interface simplifiée

---

## 📁 FICHIER MODIFIÉ

### `src/components/modals/UtilisateurModal.vue`

✅ Fonction `loadRoles()` avec filtre  
✅ Pré-sélection automatique  
✅ Logs de débogage  

---

## 🎉 TERMINÉ !

Le dropdown Rôle affiche maintenant **uniquement "Gestionnaire"** !

**Le SuperAdmin ne peut créer QUE des gestionnaires via ce formulaire.** ✅

---

## 📝 NOTES

### Pourquoi cette Restriction ?

1. **Séparation des responsabilités** - SuperAdmin gère les gestionnaires
2. **Sécurité** - Pas de création accidentelle de Super-Admin
3. **Clarté** - Interface plus simple et claire
4. **Workflow** - Un SuperAdmin crée des gestionnaires, qui créent des utilisateurs

### Alternative pour Créer d'Autres Rôles

Si besoin de créer des Super-Admin ou Admin :
- Utiliser un formulaire séparé (page d'administration système)
- Ou désactiver temporairement le filtre
- Ou créer directement en base de données

**Mais pour la gestion quotidienne, seuls les gestionnaires sont créés !** ✅

