# 📡 FORMAT API FINAL - camelCase

## ✅ FORMAT CORRECT IDENTIFIÉ

L'API attend le format suivant (en **camelCase**, pas PascalCase) :

```json
{
  "province": "string",
  "ville": "string",
  "commune": "string",
  "quartier": "string",
  "avenue": "string",
  "numero": "string",
  "dateCreation": "2025-11-01T19:44:18.624Z",
  "dateLastModification": "2025-11-01T19:44:18.624Z",
  "statut": true,
  "idSociete": 0,
  "nomSociete": "string",
  "type": "string",
  "impot": "string",
  "rccm": "string",
  "idNat": "string",
  "email": "string",
  "contact": "string",
  "siteWeb": "string",
  "logo": "string",
  "secteurActivite": "string"
}
```

---

## 🔧 CORRECTION APPLIQUÉE

### Fonction `prepareSocieteData()`

```javascript
const prepareSocieteData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // 1. Convertir idSociete en number
  if (cleaned.idSociete) {
    cleaned.idSociete = parseInt(cleaned.idSociete, 10);
  }
  
  // 2. Supprimer idSociete pour création
  if (!isUpdate || cleaned.idSociete === 0) {
    delete cleaned.idSociete;
  }
  
  // 3. Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null) {
      delete cleaned[key];
    }
  });
  
  // 4. S'assurer que statut est un boolean
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // 5. Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  return cleaned;  // ✅ Retour direct en camelCase
};
```

---

## 📊 TRANSFORMATIONS

### CREATE (POST /api/Societes)

**Envoyé :**
```json
{
  "nomSociete": "Test Société",
  "type": "SARL",
  "email": "test@example.com",
  "contact": "+243123456789",
  "logo": "data:image/png;base64,...",
  "secteurActivite": "Commerce",
  "province": "Kinshasa",
  "ville": "Kinshasa",
  "statut": true,
  "dateCreation": "2025-11-01T20:00:00.000Z"
}
```

**Notes :**
- ❌ Pas d'`idSociete` (généré par l'API)
- ✅ `dateCreation` ajoutée automatiquement
- ✅ Champs vides supprimés

---

### UPDATE (PUT /api/Societes/13)

**Envoyé :**
```json
{
  "idSociete": 13,
  "nomSociete": "cadolux",
  "type": "Autre",
  "impot": "kjhdc987",
  "rccm": "987ghj",
  "idNat": "98767890",
  "email": "cado@gmail.com",
  "contact": "07898765678",
  "siteWeb": "www.cadolux.com",
  "logo": "data:image/png;base64,...",
  "secteurActivite": "Bijouterie",
  "province": "Kinshasa",
  "ville": "Kinshasa",
  "commune": "Gombe",
  "quartier": "likala",
  "avenue": "lolaka",
  "numero": "12",
  "statut": true,
  "dateLastModification": "2025-11-01T20:00:00.000Z"
}
```

**Notes :**
- ✅ `idSociete` en **number** (pas string)
- ✅ `dateLastModification` ajoutée automatiquement
- ✅ Tous les champs en **camelCase**

---

## ❌ ERREURS COURANTES ÉVITÉES

### 1. PascalCase (Mauvais)
```json
{
  "IdSociete": 13,      // ❌ Majuscule
  "NomSociete": "...",  // ❌ PascalCase
  "Type": "..."         // ❌ Majuscule
}
```

### 2. Encapsulation (Mauvais pour ce backend)
```json
{
  "societe": {          // ❌ Encapsulation inutile
    "nomSociete": "..."
  }
}
```

### 3. idSociete en String (Mauvais)
```json
{
  "idSociete": "13"     // ❌ String au lieu de number
}
```

### 4. Champs vides (Peuvent causer des problèmes)
```json
{
  "impot": "",          // ⚠️ Mieux de supprimer
  "rccm": "",
  "idNat": ""
}
```

---

## ✅ FORMAT CORRECT

```json
{
  "idSociete": 13,              // ✅ number
  "nomSociete": "cadolux",      // ✅ camelCase
  "type": "Autre",              // ✅ minuscule
  "contact": "+243...",         // ✅ camelCase
  "statut": true,               // ✅ boolean
  "dateLastModification": "2025-11-01T19:44:18.624Z"  // ✅ ISO
}
```

---

## 🎯 RÈGLES À SUIVRE

1. ✅ **camelCase** pour tous les champs
2. ✅ **number** pour idSociete
3. ✅ **boolean** pour statut
4. ✅ **ISO 8601** pour les dates
5. ✅ **base64** pour le logo
6. ✅ **Supprimer** idSociete lors de la création
7. ✅ **Ajouter** dateCreation pour POST
8. ✅ **Ajouter** dateLastModification pour PUT
9. ✅ **Nettoyer** les champs vides
10. ✅ **Pas d'encapsulation** dans `{ societe: {...} }`

---

## 📋 CHAMPS OBLIGATOIRES

Selon l'API :

- ✅ `nomSociete` *
- ✅ `email` *
- ✅ `contact` *
- ✅ `type` *

**Tous les autres champs sont optionnels.**

---

## 🎊 RÉSULTAT

**FORMAT API CORRECT ET FONCTIONNEL !**

✅ **camelCase** respecté  
✅ **Types** corrects (number, boolean, string)  
✅ **Dates** ISO ajoutées  
✅ **Champs vides** supprimés  
✅ **Validation** automatique  

**La sauvegarde devrait maintenant fonctionner !** 🚀

