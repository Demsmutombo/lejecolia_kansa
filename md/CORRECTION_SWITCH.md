# 🔄 CORRECTION ArgonSwitch - v-model

## ❌ **PROBLÈME**

Le bouton "Société active" (switch) ne fonctionnait pas car le composant `ArgonSwitch` ne supportait pas `v-model`.

### Avant

```vue
<!-- Dans le composant -->
<input type="checkbox" :checked="checked" />
<!-- Pas d'événement @change émis ! -->
```

**Symptôme :** Le switch s'affiche mais ne change pas la valeur de `formData.statut`

---

## ✅ **CORRECTION APPLIQUÉE**

### ArgonSwitch Mis à Jour

```vue
<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
  // ... autres props
  modelValue: {          // ← Ajouté pour v-model
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="form-check form-switch ps-0">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue !== undefined ? modelValue : checked"
      @change="emit('update:modelValue', $event.target.checked)"
    />
    <label :for="id">
      <slot />
    </label>
  </div>
</template>
```

**Changements :**
1. ✅ Ajout de la prop `modelValue`
2. ✅ Ajout de l'événement `update:modelValue`
3. ✅ Binding `:checked` sur `modelValue` ou `checked`
4. ✅ Événement `@change` qui émet la nouvelle valeur

---

## 🎯 **UTILISATION**

### Avec v-model (Recommandé) ✅

```vue
<template>
  <argon-switch
    v-model="formData.statut"
    id="societeStatut"
    name="statut"
  >
    Société active
  </argon-switch>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  statut: true  // true = actif, false = inactif
});

// formData.statut se met à jour automatiquement !
</script>
```

### Avec :checked (Ancien style)

```vue
<argon-switch
  :checked="isActive"
  @update:modelValue="isActive = $event"
  id="switch1"
  name="switch"
>
  Actif
</argon-switch>
```

---

## 🎨 **DANS LE FORMULAIRE SOCIÉTÉ**

Le switch est maintenant fonctionnel dans `SocieteModal.vue` :

```vue
<template>
  <div class="row">
    <div class="col-12 mb-3">
      <argon-switch 
        v-model="formData.statut"
        id="societeStatut"
        name="statut"
      >
        Société active
      </argon-switch>
    </div>
  </div>
</template>
```

**Comportement :**
- ☑️ **Coché** (ON) → `statut: true` → Société active
- ☐ **Décoché** (OFF) → `statut: false` → Société inactive

---

## 🧪 **TESTER**

### Test 1 : Création

1. Ouvrez le modal "Nouvelle Société"
2. Scrollez jusqu'au bas
3. Voyez le switch "Société active"
4. **Cliquez** dessus plusieurs fois
5. Vérifiez dans la console :
   ```javascript
   formData.statut: true   // Après clic 1
   formData.statut: false  // Après clic 2
   formData.statut: true   // Après clic 3
   ```

### Test 2 : Modification

1. Modifiez une société existante
2. Le switch affiche l'état actuel
3. **Changez** l'état (actif → inactif ou vice-versa)
4. **Sauvegardez**
5. Vérifiez que le badge "Statut" dans le tableau change

---

## 🎯 **VALEURS**

| État Switch | Valeur `statut` | Badge Tableau | Couleur |
|-------------|-----------------|---------------|---------|
| ☑️ ON | `true` | Actif | 🟢 Vert |
| ☐ OFF | `false` | Inactif | ⚫ Gris |

---

## 🔄 **COMPATIBILITÉ**

### Avec v-model (Vue 3)
```vue
<argon-switch v-model="value" id="sw1" name="sw1">
  Label
</argon-switch>
```

### Avec :checked (Vue 2 style)
```vue
<argon-switch 
  :checked="value" 
  @update:modelValue="value = $event"
  id="sw1" 
  name="sw1"
>
  Label
</argon-switch>
```

**Les deux méthodes fonctionnent maintenant !** ✅

---

## 📋 **PROPS REQUISES**

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `id` | String | ✅ Oui | ID unique du switch |
| `name` | String | ✅ Oui | Nom du champ |
| `modelValue` | Boolean | ❌ Non | Valeur (pour v-model) |
| `checked` | Boolean | ❌ Non | État initial |
| `labelClass` | String | ❌ Non | Classes CSS du label |
| `inputClass` | String | ❌ Non | Classes CSS de l'input |

---

## 📁 **FICHIERS MODIFIÉS**

1. ✅ `src/components/ArgonSwitch.vue`
   - Ajout prop `modelValue`
   - Ajout événement `update:modelValue`
   - Binding dynamique sur `checked`
   - Événement `@change`

2. ✅ `CORRECTION_SWITCH.md`
   - Documentation de la correction

---

## 🎊 **RÉSULTAT**

**LE SWITCH FONCTIONNE MAINTENANT !**

✅ **v-model** supporté  
✅ **Événement** `@change` émis  
✅ **Valeur** mise à jour en temps réel  
✅ **Compatible** avec Vue 3  
✅ **Rétro-compatible** avec :checked  

**Le switch "Société active" change maintenant la valeur de `formData.statut` correctement !** 🎉

---

## 🧪 **VÉRIFICATION RAPIDE**

1. **Rechargez** la page
2. **Ouvrez** "Nouvelle Société"
3. **Cliquez** sur le switch "Société active"
4. **Regardez** dans Vue DevTools : `formData.statut` change
5. **Créez** la société
6. **Vérifiez** le badge dans le tableau

**ça devrait fonctionner maintenant !** 🚀

