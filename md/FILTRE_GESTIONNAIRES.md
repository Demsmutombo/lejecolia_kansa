# 👥 FILTRE GESTIONNAIRES - SuperAdmin

## 🎯 OBJECTIF

**Afficher UNIQUEMENT les utilisateurs avec le rôle "Gestionnaire"** dans la page `/utilisateurs`

Les autres rôles (Super-Admin, Admin, etc.) sont **masqués** de la liste.

---

## ✅ FONCTIONNEMENT

### Filtrage Automatique

```javascript
// Après avoir chargé tous les utilisateurs depuis l'API
utilisateursGestionnaires = utilisateurs.filter(user => {
  return user.roleName.toLowerCase().includes('gestionnaire');
});
```

### Critère de Filtre

Un utilisateur est affiché SI :
- Son `roleName` contient le mot **"gestionnaire"** (insensible à la casse)

Exemples acceptés :
- ✅ "Gestionnaire"
- ✅ "gestionnaire"
- ✅ "Gestionnaire de société"
- ❌ "Super-Admin"
- ❌ "Admin"
- ❌ "Utilisateur"

---

## 📊 AFFICHAGE

### Titre
**"Gestion des Gestionnaires"**

### Sous-titre
"Liste des utilisateurs avec le rôle Gestionnaire"

### Badge
```
🔹 Rôle: Gestionnaire uniquement
```

### Bouton
**"Nouveau Gestionnaire"** (au lieu de "Nouvel Utilisateur")

---

## 🔍 LOGS DE DÉBOGAGE

Lors du chargement de la page, vérifiez la console :

```
✅ Total utilisateurs: 5
✅ Gestionnaires filtrés: 2
📋 Rôles trouvés: ["Super-Admin", "Admin", "Gestionnaire", ...]
```

Cela vous indique :
- Combien d'utilisateurs au total dans l'API
- Combien de gestionnaires après filtrage
- Quels rôles existent dans la base

---

## 📋 EXEMPLE DE DONNÉES

### Avant Filtre (5 utilisateurs)

| ID | Nom | Rôle | Affiché ? |
|----|-----|------|-----------|
| 1 | MUDISI Espoir | Gestionnaire | ✅ OUI |
| 2 | MALONGA Jean | Gestionnaire | ✅ OUI |
| 3 | NGIELE Shekinah | Utilisateur | ❌ NON |
| 4 | Super-Admin | Super-Admin | ❌ NON |
| 5 | Admin | Admin | ❌ NON |

### Après Filtre (2 gestionnaires)

| ID | Nom | Rôle | Actions |
|----|-----|------|---------|
| 1 | MUDISI Espoir | Gestionnaire | 👁️ 🔄 ✏️ 🗑️ |
| 2 | MALONGA Jean | Gestionnaire | 👁️ 🔄 ✏️ 🗑️ |

---

## 🔧 MODIFICATIONS APPORTÉES

### `src/views/Utilisateurs.vue`

**1. Nouvelle variable pour les gestionnaires**
```javascript
const utilisateurs = ref([]); // TOUS les utilisateurs
const utilisateursGestionnaires = ref([]); // SEULEMENT les gestionnaires
const ROLE_GESTIONNAIRE = 'Gestionnaire';
```

**2. Fonction de filtrage**
```javascript
const enrichWithNames = async () => {
  // ... enrichir avec noms sites/rôles
  
  // Filtrer pour ne garder QUE les gestionnaires
  utilisateursGestionnaires.value = utilisateurs.value.filter(user => {
    const roleName = user.roleName || '';
    return roleName.toLowerCase().includes('gestionnaire');
  });
  
  console.log('✅ Gestionnaires filtrés:', utilisateursGestionnaires.value.length);
};
```

**3. DataTable utilise la liste filtrée**
```vue
<data-table
  title="Gestion des Gestionnaires"
  :data="utilisateursGestionnaires"
  empty-text="Aucun gestionnaire trouvé"
/>
```

**4. Badge indicateur**
```vue
<span class="badge bg-gradient-info">
  <i class="fas fa-filter"></i>
  Rôle: Gestionnaire uniquement
</span>
```

---

## ⚙️ CONFIGURATION

### Changer le Rôle Filtré

Pour afficher un autre rôle, modifiez la constante :

```javascript
// Afficher les Administrateurs
const ROLE_FILTRE = 'Admin';

// Ou afficher les Super-Admin
const ROLE_FILTRE = 'Super-Admin';
```

Puis adaptez le filtre :

```javascript
utilisateursGestionnaires.value = utilisateurs.value.filter(user => {
  return user.roleName.toLowerCase().includes(ROLE_FILTRE.toLowerCase());
});
```

### Afficher TOUS les Utilisateurs

Pour désactiver le filtre :

```vue
<!-- Dans le DataTable -->
<data-table
  :data="utilisateurs"
/>
```

---

## 🔒 SÉCURITÉ

### Accès à la Page

- ✅ **SuperAdmin uniquement** - Vérifié par `requireSuperAdmin()`
- ❌ Gestionnaires - Pas d'accès à `/utilisateurs`
- ❌ Utilisateurs normaux - Pas d'accès

### Actions CRUD

Toutes les actions (Créer, Modifier, Supprimer) sont :
- ✅ Réservées aux SuperAdmin
- ✅ Fonctionnent sur les gestionnaires filtrés
- ✅ Protégées par l'API côté serveur

---

## 📊 STATISTIQUES

### Performance

- **Temps de filtrage :** < 1ms (côté client)
- **Aucun impact** sur le chargement API
- **Recherche :** Fonctionne uniquement sur les gestionnaires affichés

### Pagination

Si vous avez beaucoup de gestionnaires :
- Pagination automatique (10 par page)
- Recherche multi-champs
- Tri par colonnes

---

## 🧪 TESTER

1. **Ouvrir** `/utilisateurs`
2. **Vérifier** le titre : "Gestion des Gestionnaires"
3. **Voir** le badge : "🔹 Rôle: Gestionnaire uniquement"
4. **Compter** les utilisateurs affichés
5. **Console** : Vérifier les logs de filtrage

### Console de Débogage

Tapez dans la console du navigateur :

```javascript
// Voir tous les utilisateurs
console.log(utilisateurs.value);

// Voir seulement les gestionnaires
console.log(utilisateursGestionnaires.value);

// Voir les rôles
console.log([...new Set(utilisateurs.value.map(u => u.roleName))]);
```

---

## 💡 POURQUOI CE FILTRE ?

### Séparation des Responsabilités

- **Gestionnaires** → Gèrent leur société (interface limitée)
- **Super-Admin** → Gère TOUS les gestionnaires (cette page)
- **Admin** → Rôle technique/système (ne pas modifier)

### Sécurité

Évite de supprimer accidentellement :
- Le compte Super-Admin
- Les comptes système
- Les autres administrateurs

### Clarté

Interface plus claire :
- Seulement les utilisateurs pertinents
- Pas de confusion avec les rôles système
- Actions appropriées au contexte

---

## 🎯 RÉSULTAT

✅ **Page `/utilisateurs`** → Affiche seulement les gestionnaires  
✅ **Badge indicateur** → "Rôle: Gestionnaire uniquement"  
✅ **Titre adapté** → "Gestion des Gestionnaires"  
✅ **Logs clairs** → Console montre le filtrage  
✅ **Performance** → Filtrage instantané côté client  

---

## 📝 NOTES

### Filtrage Côté Client vs Serveur

**Actuellement : Côté Client**
- ✅ Plus rapide (pas de requête API)
- ✅ Plus flexible (facile à changer)
- ⚠️ Charge tous les utilisateurs

**Alternative : Côté Serveur**
```javascript
// Ajouter un paramètre à l'API
const response = await api.getUsers({ role: 'Gestionnaire' });
```

Avantages :
- Moins de données transférées
- Plus sûr (ne pas exposer tous les utilisateurs)

---

## 🎉 TERMINÉ !

Le SuperAdmin voit maintenant **uniquement les gestionnaires** dans la liste ! 

**Rechargez `/utilisateurs` pour tester !** 🚀

