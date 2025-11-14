# 🍬 Guide SweetAlert - Alertes Réutilisables

## 📦 Installation

✅ **SweetAlert2 est déjà installé et configuré !**

## 🚀 Utilisation

### Import du composable

```javascript
import { useSweetAlert } from '@/composables';

const { 
  showSuccess, 
  showError, 
  showWarning, 
  showWelcome,
  showConfirm,
  showToast
} = useSweetAlert();
```

---

## 🎨 Méthodes Disponibles

### 1. **showSuccess** - Alerte de succès

```javascript
// Simple
showSuccess('Opération réussie !');

// Avec texte
showSuccess('Succès !', 'L\'élément a été ajouté avec succès');

// Avec options personnalisées
showSuccess('Enregistré !', 'Vos modifications ont été sauvegardées', {
  timer: 5000,
  showConfirmButton: true
});
```

### 2. **showError** - Alerte d'erreur

```javascript
showError('Erreur !', 'Une erreur est survenue');

// Exemple d'utilisation
try {
  await deleteItem(id);
  showSuccess('Supprimé !', 'L\'élément a été supprimé');
} catch (error) {
  showError('Erreur de suppression', error.message);
}
```

### 3. **showWarning** - Alerte d'avertissement

```javascript
showWarning('Attention !', 'Cette action nécessite votre attention');
```

### 4. **showInfo** - Alerte d'information

```javascript
showInfo('Information', 'Veuillez noter que...');
```

### 5. **showWelcome** - Message de bienvenue ⭐

```javascript
// Message de bienvenue après connexion
showWelcome('Jean Dupont', 'Super Administrateur', 'Hotel Congo');

// Utilisé automatiquement lors de la connexion
// Affiche :
// 🎉 Bienvenue Jean Dupont !
// Super Administrateur
// Hotel Congo
```

### 6. **showConfirm** - Confirmation Oui/Non

```javascript
const result = await showConfirm(
  'Êtes-vous sûr ?',
  'Cette action est irréversible'
);

if (result.isConfirmed) {
  // Utilisateur a cliqué "Oui"
  await deleteItem();
} else {
  // Utilisateur a cliqué "Non" ou fermé
  console.log('Action annulée');
}
```

### 7. **showLoading** - Indicateur de chargement

```javascript
// Afficher le chargement
showLoading('Chargement...', 'Veuillez patienter');

// Faire l'opération
await fetchData();

// Fermer l'alerte
close();
```

### 8. **showToast** - Notification discrète

```javascript
// Toast simple
showToast('Sauvegardé !');

// Toast avec options
showToast('Erreur !', 'error', 'bottom-end');

// Positions disponibles:
// 'top', 'top-start', 'top-end'
// 'center', 'center-start', 'center-end'
// 'bottom', 'bottom-start', 'bottom-end'
```

---

## 💡 Exemples Pratiques

### Exemple 1 : Suppression avec confirmation

```vue
<script setup>
import { useSweetAlert } from '@/composables';

const { showConfirm, showSuccess, showError } = useSweetAlert();

const handleDelete = async (id) => {
  // Demander confirmation
  const result = await showConfirm(
    'Supprimer cet élément ?',
    'Cette action est irréversible',
    {
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33'
    }
  );

  if (result.isConfirmed) {
    try {
      await api.deleteItem(id);
      showSuccess('Supprimé !', 'L\'élément a été supprimé avec succès');
    } catch (error) {
      showError('Erreur', 'Impossible de supprimer l\'élément');
    }
  }
};
</script>

<template>
  <argon-button @click="handleDelete(item.id)" color="danger">
    Supprimer
  </argon-button>
</template>
```

### Exemple 2 : Sauvegarde avec loading

```vue
<script setup>
import { useSweetAlert } from '@/composables';

const { showLoading, showSuccess, showError, close } = useSweetAlert();

const handleSave = async () => {
  // Afficher le chargement
  showLoading('Enregistrement...', 'Veuillez patienter');
  
  try {
    await api.saveData(formData);
    close(); // Fermer le loading
    showSuccess('Enregistré !', 'Vos données ont été sauvegardées');
  } catch (error) {
    close();
    showError('Erreur', 'Impossible de sauvegarder');
  }
};
</script>
```

### Exemple 3 : Toast pour notifications légères

```vue
<script setup>
import { useSweetAlert } from '@/composables';

const { showToast } = useSweetAlert();

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  showToast('Copié dans le presse-papier !', 'success');
};

const likePost = () => {
  showToast('❤️ Publication aimée', 'success', 'bottom-end');
};
</script>
```

### Exemple 4 : Message de bienvenue personnalisé

```vue
<script setup>
import { useSweetAlert } from '@/composables';
import { useAuth } from '@/composables';

const { showWelcome } = useSweetAlert();
const { userName, role, societeName } = useAuth();

const showCustomWelcome = () => {
  const roleText = role.value === 'superadmin' 
    ? 'Super Administrateur' 
    : 'Gestionnaire';
    
  showWelcome(userName.value, roleText, societeName.value);
};
</script>
```

---

## 🎨 Personnalisation

### Options communes SweetAlert2

```javascript
showSuccess('Titre', 'Texte', {
  // Temps avant fermeture auto (ms)
  timer: 3000,
  
  // Barre de progression
  timerProgressBar: true,
  
  // Bouton de confirmation
  showConfirmButton: true,
  confirmButtonText: 'OK',
  confirmButtonColor: '#3085d6',
  
  // Bouton d'annulation
  showCancelButton: true,
  cancelButtonText: 'Annuler',
  
  // Animations
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  },
  
  // Position
  position: 'center', // ou 'top', 'bottom', etc.
  
  // Clic en dehors pour fermer
  allowOutsideClick: true
});
```

### Thème personnalisé

```javascript
showSuccess('Succès !', 'Message', {
  customClass: {
    popup: 'my-custom-popup',
    title: 'my-custom-title',
    confirmButton: 'my-custom-button'
  }
});
```

---

## 🎯 Cas d'usage dans l'application

### Connexion réussie
```javascript
// Déjà implémenté dans Signin.vue
showWelcome(userName, 'Super Administrateur', 'Hotel Congo');
```

### Déconnexion
```javascript
const handleLogout = async () => {
  const result = await showConfirm(
    'Se déconnecter ?',
    'Voulez-vous vraiment vous déconnecter ?'
  );
  
  if (result.isConfirmed) {
    logout();
    showToast('Déconnecté avec succès', 'success');
  }
};
```

### Création d'un élément
```javascript
const createSociete = async (data) => {
  showLoading('Création en cours...');
  
  try {
    await api.createSociete(data);
    close();
    showSuccess('Société créée !', 'La nouvelle société a été ajoutée');
  } catch (error) {
    close();
    showError('Erreur', 'Impossible de créer la société');
  }
};
```

### Validation avec erreurs
```javascript
const validate = () => {
  if (!formData.nom) {
    showWarning('Champ requis', 'Le nom est obligatoire');
    return false;
  }
  return true;
};
```

---

## 📊 Toutes les méthodes disponibles

| Méthode | Usage | Icône |
|---------|-------|-------|
| `showSuccess` | Opération réussie | ✅ |
| `showError` | Erreur | ❌ |
| `showWarning` | Avertissement | ⚠️ |
| `showInfo` | Information | ℹ️ |
| `showWelcome` | Bienvenue personnalisée | 🎉 |
| `showConfirm` | Confirmation Oui/Non | ❓ |
| `showLoading` | Chargement | ⏳ |
| `showToast` | Notification discrète | 💬 |
| `close` | Fermer l'alerte | ✖️ |

---

## 🎨 Intégration dans vos composants

### Composant avec SweetAlert

```vue
<template>
  <div>
    <argon-button @click="handleAction" color="primary">
      Effectuer l'action
    </argon-button>
  </div>
</template>

<script setup>
import { useSweetAlert } from '@/composables';
import { ArgonButton } from '@/components';

const { showSuccess, showError, showConfirm } = useSweetAlert();

const handleAction = async () => {
  const result = await showConfirm(
    'Confirmer l\'action ?',
    'Êtes-vous sûr de vouloir continuer ?'
  );

  if (result.isConfirmed) {
    try {
      // Votre logique ici
      showSuccess('Terminé !', 'L\'action a été effectuée');
    } catch (error) {
      showError('Erreur', error.message);
    }
  }
};
</script>
```

---

## 🔗 Documentation SweetAlert2

Pour plus d'options : [SweetAlert2 Documentation](https://sweetalert2.github.io/)

---

## ✅ Message de Bienvenue Déjà Implémenté

Lors de la connexion, l'utilisateur voit automatiquement :

```
🎉 Bienvenue [Nom de l'utilisateur] !

[Rôle] - Super Administrateur ou Gestionnaire
[Nom de la société]

Vous êtes maintenant connecté(e)
```

Ce message apparaît automatiquement après une connexion réussie et se ferme après 4 secondes ! ✨

---

**🎊 SweetAlert est maintenant disponible partout dans votre application !** 🚀

