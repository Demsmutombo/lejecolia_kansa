# 🔍 DEBUG Erreur 400 - Bad Request

## ❌ ERREUR RENCONTRÉE

```
Failed to load resource: 400 (Bad Request)
Request failed with status code 400
```

**Cause :** Les données envoyées à l'API ne correspondent pas au format attendu par le backend.

---

## 🧪 ÉTAPES DE DEBUG

### 1. **Rechargez la page**
- Appuyez sur `Cmd+R` (Mac) ou `Ctrl+R` (Windows)

### 2. **Ouvrez la console**
- Appuyez sur `F12`
- Onglet "Console"

### 3. **Essayez de créer une société**
1. Cliquez "Nouvelle Société"
2. Remplissez au minimum :
   - Nom de la société
   - Email
   - Contact
3. Cliquez "Créer"

### 4. **Regardez les logs dans la console**

Vous verrez :
```javascript
💾 Tentative de sauvegarde...
📦 Données envoyées: { ... }
🖼️ Fichier logo: null
➕ Mode CRÉATION
❌ Erreur sauvegarde: ...
📋 Détails de l'erreur: {
  status: 400,
  data: "MESSAGE D'ERREUR DU BACKEND"
}
```

---

## 🎯 IDENTIFIER LE PROBLÈME

### Vérifiez le message d'erreur

Dans `📋 Détails de l'erreur → data`, vous verrez :

#### Cas 1 : Champ obligatoire manquant
```json
{
  "message": "Le champ 'nomSociete' est obligatoire",
  "errors": {
    "nomSociete": "Required field"
  }
}
```

#### Cas 2 : Format de données incorrect
```json
{
  "message": "Format invalide pour le champ 'email'",
  "errors": {
    "email": "Invalid email format"
  }
}
```

#### Cas 3 : Type de données incorrect
```json
{
  "message": "Le champ 'idSociete' doit être un nombre"
}
```

---

## 🔧 SOLUTIONS COURANTES

### Problème 1 : `idSociete` envoyé lors de la création

**Symptôme :** L'API refuse un `idSociete = 0` ou `idSociete = null`

**Solution :** Ne pas envoyer `idSociete` lors de la création

```javascript
// Dans handleSave
const dataToSend = { ...societeData };
if (!dataToSend.idSociete || dataToSend.idSociete === 0) {
  delete dataToSend.idSociete; // Supprimer le champ
}
await api.createSociete(dataToSend);
```

---

### Problème 2 : Logo en base64 trop long

**Symptôme :** L'API refuse le logo

**Solution :** Vérifier la taille du logo ou l'envoyer séparément

```javascript
// Option 1 : Limiter la taille
if (formData.value.logo && formData.value.logo.length > 100000) {
  alert('Le logo est trop volumineux (max 1MB)');
  return;
}

// Option 2 : Ne pas envoyer si vide
const dataToSend = { ...societeData };
if (!dataToSend.logo || dataToSend.logo === '') {
  delete dataToSend.logo;
}
```

---

### Problème 3 : Champs vides envoyés comme `""`

**Symptôme :** L'API attend `null` ou pas de champ

**Solution :** Nettoyer les champs vides

```javascript
const cleanData = (data) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

const dataToSend = cleanData(societeData);
```

---

### Problème 4 : Format de date incorrect

**Symptôme :** `dateCreation` ou autre date refusée

**Solution :** Formater correctement la date

```javascript
if (societeData.dateCreation) {
  societeData.dateCreation = new Date(societeData.dateCreation).toISOString();
}
```

---

## 📋 FORMAT ATTENDU PAR L'API

D'après vos données existantes, le format devrait être :

```json
{
  "nomSociete": "string",
  "type": "string",
  "impot": "string",
  "rccm": "string",
  "idNat": "string",
  "email": "string",
  "contact": "string",
  "siteWeb": "string",
  "logo": "data:image/png;base64,...",
  "secteurActivite": "string",
  "province": "string",
  "ville": "string",
  "commune": "string",
  "quartier": "string",
  "avenue": "string",
  "numero": "string",
  "statut": true
}
```

**Important :**
- ❌ **NE PAS** envoyer `idSociete` pour une création
- ❌ **NE PAS** envoyer de champs vides (ou envoyer `null`)
- ✅ **ENVOYER** au minimum : `nomSociete`, `email`, `contact`

---

## 🛠️ FIX RAPIDE

Ajoutez ceci dans `src/views/Societes.vue` :

```javascript
// Avant l'appel API
const prepareDataForAPI = (data) => {
  const prepared = { ...data };
  
  // Supprimer idSociete si c'est une création
  if (!prepared.idSociete || prepared.idSociete === 0) {
    delete prepared.idSociete;
  }
  
  // Supprimer les champs vides
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === '' || prepared[key] === null) {
      delete prepared[key];
    }
  });
  
  // S'assurer que statut est un boolean
  if (typeof prepared.statut === 'string') {
    prepared.statut = prepared.statut === 'true';
  }
  
  return prepared;
};

// Dans handleSave
const cleanedData = prepareDataForAPI(societeData);
console.log('🧹 Données nettoyées:', cleanedData);
await api.createSociete(cleanedData);
```

---

## 🎯 PROCHAINE ÉTAPE

1. **Rechargez** la page
2. **Ouvrez** la console (F12)
3. **Essayez** de créer une société
4. **Copiez** tout le contenu de :
   ```
   📦 Données envoyées: { ... }
   📋 Détails de l'erreur: { ... }
   ```
5. **Partagez** ces logs pour que je puisse identifier le problème exact

---

## 💡 VÉRIFICATIONS RAPIDES

### Champs obligatoires remplis ?
- ✅ Nom de la société
- ✅ Email
- ✅ Contact

### Format des données ?
- ✅ Email valide (contient @)
- ✅ Contact (numéro de téléphone)
- ✅ Logo (si fourni) en base64

### Type de requête ?
- ✅ POST pour création
- ✅ PUT pour modification
- ✅ Endpoint correct : `/api/Societes`

---

## 🔍 EXEMPLE DE LOGS À VÉRIFIER

Après avoir essayé de créer une société, partagez ces informations :

```
💾 Tentative de sauvegarde...
📦 Données envoyées: {
  idSociete: 0,              ← Problème potentiel ?
  nomSociete: "Test",
  type: "SARL",
  email: "test@example.com",
  contact: "+243123456789",
  logo: "data:image/png;base64,..." ← Trop long ?
  // ... autres champs
}
🖼️ Fichier logo: null
➕ Mode CRÉATION
❌ Erreur sauvegarde: ...
📋 Détails de l'erreur: {
  status: 400,
  data: {
    message: "VOICI LE MESSAGE EXACT DU BACKEND"
  }
}
```

**Partagez le message exact du backend pour que je puisse corriger !** 🎯

