# 📸 UPLOAD LOGO - Guide Complet

## ✅ LE CHAMP D'UPLOAD EXISTE !

Le champ pour uploader le logo **est bien présent** dans le formulaire. Il a été **amélioré et rendu plus visible**.

---

## 📍 OÙ LE TROUVER ?

### Dans le Modal "Nouvelle Société"

```
┌──────────────────────────────────┐
│ Nouvelle Société            [X]  │
├──────────────────────────────────┤
│                                  │
│  📷 Logo de la Société           │ ← SECTION UPLOAD
│  ╔══════════════════════════╗   │
│  ║                          ║   │
│  ║      [  IMAGE  ]         ║   │
│  ║                          ║   │
│  ║  [🔼 Choisir un Logo]    ║   │
│  ║  JPG, PNG, GIF (max 2MB) ║   │
│  ╚══════════════════════════╝   │
│                                  │
│  Nom de la Société *             │
│  ___________________________     │
│                                  │
│  Type de Société                 │
│  [Sélectionner... ▼]             │
│  ...                             │
└──────────────────────────────────┘
```

**Position :** Tout en haut du formulaire, juste après le titre !

---

## 🎨 DESIGN AMÉLIORÉ

### Avant
❌ Petit logo en haut
❌ Bouton peu visible
❌ Pas de contexte

### Après ✅
✅ **Section encadrée** avec fond gris
✅ **Bordure en pointillés** pour indiquer zone d'upload
✅ **Label clair** : "📷 Logo de la Société"
✅ **Bouton bleu visible** : "Choisir un Logo"
✅ **Texte d'aide** : "JPG, PNG, GIF (max. 2MB)"
✅ **Image cliquable** : Cliquez sur l'image pour changer
✅ **Hover effect** : Section change de couleur au survol

---

## 🎯 COMMENT UPLOADER UN LOGO

### Méthode 1 : Cliquer sur le Bouton

1. **Ouvrir le modal** "Nouvelle Société"
2. **Regarder en haut** du formulaire
3. **Voir la section** avec fond gris
4. **Cliquer** sur le bouton bleu "Choisir un Logo"
5. **Sélectionner** une image sur votre ordinateur
6. **Voir** la prévisualisation instantanée

### Méthode 2 : Cliquer sur l'Image

1. **Cliquer directement** sur l'image (logo par défaut)
2. **Sélectionneur de fichier** s'ouvre
3. **Choisir** votre logo
4. **Image** se met à jour automatiquement

---

## 🖼️ FONCTIONNALITÉS

### Upload
✅ **Formats acceptés** : JPG, JPEG, PNG, GIF, WebP
✅ **Taille max** : 2 MB (recommandé)
✅ **Prévisualisation** : Instantanée
✅ **Conversion** : Automatique en base64
✅ **Stockage** : Dans le champ `logo` de l'API

### Prévisualisation
✅ **Taille** : 70x70 pixels (rond)
✅ **Position** : Centré dans la section
✅ **Hover** : Agrandissement au survol
✅ **Cliquable** : Pour changer le logo

### Validation
✅ **Type de fichier** : Vérifié par le navigateur
✅ **Optionnel** : Le logo n'est pas obligatoire
✅ **Logo par défaut** : Si aucun logo n'est fourni

---

## 🎨 STYLES CSS

### Section Encadrée

```css
.upload-logo-section {
  background: #f8f9fa;           /* Fond gris clair */
  border: 2px dashed #d2d6da;    /* Bordure pointillée */
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.upload-logo-section:hover {
  border-color: #5e72e4;         /* Bleu au survol */
  background: #f0f4ff;           /* Fond bleu clair */
}
```

### Logo Interactif

```css
.logo-preview {
  cursor: pointer;               /* Curseur main */
  transition: all 0.3s ease;
}

.logo-preview:hover {
  transform: scale(1.1);         /* Agrandir au survol */
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}
```

---

## 📋 CODE COMPLET

### Template

```vue
<div class="upload-logo-section">
  <label class="form-label d-block text-center mb-3">
    <i class="fas fa-image me-2"></i>Logo de la Société
  </label>
  
  <div class="text-center">
    <!-- Image de prévisualisation (cliquable) -->
    <div class="mb-3">
      <img 
        :src="logoPreview || '/img/logo-ct-dark.png'" 
        alt="Logo"
        class="img-fluid rounded-circle logo-preview"
        @click="logoInput.click()"
        title="Cliquez pour changer le logo"
      />
    </div>
    
    <!-- Input file caché -->
    <input
      type="file"
      ref="logoInput"
      @change="handleLogoChange"
      accept="image/*"
      class="d-none"
    />
    
    <!-- Bouton visible -->
    <argon-button 
      type="button"
      color="info" 
      size="sm"
      @click="logoInput.click()"
    >
      <i class="fas fa-upload me-2"></i>
      {{ logoPreview ? 'Changer le Logo' : 'Choisir un Logo' }}
    </argon-button>
    
    <!-- Aide -->
    <p class="text-xs text-secondary mt-2 mb-0">
      JPG, PNG, GIF (max. 2MB)
    </p>
  </div>
</div>
```

### Script

```javascript
const logoInput = ref(null);
const logoPreview = ref('');
const logoFile = ref(null);

// Gérer le changement de logo
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target.result;      // Prévisualisation
      formData.value.logo = e.target.result;    // Base64 pour l'API
    };
    reader.readAsDataURL(file);
  }
};
```

---

## 🔄 FLUX COMPLET

### Processus d'Upload

```
1. Utilisateur clique sur "Choisir un Logo"
   ↓
2. Input file s'ouvre (sélecteur de fichiers)
   ↓
3. Utilisateur sélectionne une image
   ↓
4. Événement @change déclenché
   ↓
5. handleLogoChange() appelé
   ↓
6. FileReader lit le fichier
   ↓
7. Conversion en base64
   ↓
8. logoPreview mis à jour (affichage)
   ↓
9. formData.logo mis à jour (pour l'API)
   ↓
10. Prévisualisation visible instantanément
```

### Lors de la Sauvegarde

```
1. Utilisateur clique "Créer"
   ↓
2. handleSubmit() appelé
   ↓
3. formData.logo contient le base64
   ↓
4. POST /api/Societes
   ↓
5. Body: { ..., logo: "data:image/png;base64,..." }
   ↓
6. Logo enregistré dans la base de données
```

---

## ✅ VÉRIFICATIONS

### Pour confirmer que le champ est visible :

1. **Rechargez la page** `/societes`
2. **Cliquez** "Nouvelle Société"
3. **Regardez EN HAUT** du formulaire
4. **Vous devez voir** :
   - ✅ Titre "📷 Logo de la Société"
   - ✅ Section avec fond gris et bordure pointillée
   - ✅ Image ronde au centre (70x70px)
   - ✅ Bouton bleu "Choisir un Logo"
   - ✅ Texte "JPG, PNG, GIF (max. 2MB)"

### Si vous ne voyez toujours pas :

1. **Vider le cache** : Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
2. **Vérifier la console** : F12 pour voir les erreurs
3. **Scroll vers le haut** : Le champ est tout en haut du formulaire

---

## 🎊 RÉSULTAT

**LE CHAMP D'UPLOAD EST MAINTENANT TRÈS VISIBLE !**

✅ **Section encadrée** avec fond gris clair  
✅ **Bordure pointillée** indiquant zone d'upload  
✅ **Label explicite** : "Logo de la Société"  
✅ **Bouton bleu** bien visible  
✅ **Texte d'aide** pour les formats acceptés  
✅ **Image cliquable** pour faciliter l'upload  
✅ **Hover effect** pour l'interaction  
✅ **Prévisualisation** instantanée  
✅ **Conversion base64** automatique  

**Le champ est impossible à manquer maintenant !** 🚀

---

## 📸 EXEMPLE D'UTILISATION

1. **Ouvrir** "Nouvelle Société"
2. **Voir** la section grise en haut
3. **Cliquer** "Choisir un Logo"
4. **Sélectionner** votre image
5. **Voir** la prévisualisation
6. **Remplir** le reste du formulaire
7. **Cliquer** "Créer"
8. **Logo enregistré** avec la société !

**C'est tout ! Simple et intuitif !** ✨

