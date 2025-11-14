# 🎯 ACTIONS SUR LES SOCIÉTÉS

## ✅ 4 ACTIONS DISPONIBLES

Dans le tableau des sociétés, vous avez maintenant **4 actions distinctes** :

```
┌────────────────────────────────────────────────┐
│ Société     Actions                            │
├────────────────────────────────────────────────┤
│ cadolux     [👁️] [🔄] [✏️] [🗑️]               │
└────────────────────────────────────────────────┘
```

---

## 1️⃣ **VOIR** 👁️

**Icône :** Œil (noir)  
**Action :** Afficher les détails de la société  
**Effet :** Redirection vers `/societes/:id`

```
Clic sur 👁️
   ↓
Page détails s'ouvre
   ↓
Toutes les informations affichées
```

**Aucune modification** - Consultation uniquement

---

## 2️⃣ **ACTIVER / DÉSACTIVER** 🔄 ⭐ NOUVEAU

**Icône :** 
- 🟢 Toggle ON (vert) si société active
- ⚫ Toggle OFF (gris) si société inactive

**Label :**
- "Désactiver" si société active
- "Activer" si société inactive

**Action :** Change uniquement le statut

### Flux Complet

```
Société ACTIVE (🟢)
   ↓
Clic sur "Désactiver"
   ↓
Confirmation: "Voulez-vous désactiver cadolux ?"
   ↓
Clic "Oui, désactiver"
   ↓
PUT /api/Societes/13 avec statut: false
   ↓
Message: "cadolux a été désactivée avec succès"
   ↓
Badge devient "Inactif" ⚫
   ↓
Société toujours dans la liste (pas supprimée !)
```

### Avantages

✅ **Rapide** - 1 clic pour changer le statut  
✅ **Réversible** - On peut réactiver ensuite  
✅ **Pas de perte de données** - Toutes les infos conservées  
✅ **Pas de suppression** - La société reste en base  

---

## 3️⃣ **MODIFIER** ✏️

**Icône :** Crayon (gris)  
**Action :** Ouvrir le modal de modification  
**Effet :** Modifier tous les champs (nom, email, logo, etc.)

```
Clic sur ✏️
   ↓
Modal s'ouvre avec données pré-remplies
   ↓
Modification des champs
   ↓
Clic "Modifier"
   ↓
PUT /api/Societes/13
   ↓
Message de succès
   ↓
Tableau mis à jour
```

**Permet de modifier** tous les champs de la société

---

## 4️⃣ **SUPPRIMER** 🗑️

**Icône :** Poubelle (rouge)  
**Action :** Supprimer définitivement la société  
**Effet :** Suppression irréversible

```
Clic sur 🗑️
   ↓
Confirmation: "Cette action est irréversible"
   ↓
Clic "Oui, supprimer"
   ↓
DELETE /api/Societes/13
   ↓
Message: "Supprimé avec succès"
   ↓
Société disparaît de la liste
   ↓
⚠️ DONNÉES PERDUES DÉFINITIVEMENT
```

---

## 🔄 DÉSACTIVER vs SUPPRIMER

### DÉSACTIVER 🔄 (Recommandé)

**Quand utiliser :**
- ✅ Société temporairement inactive
- ✅ Suspension temporaire
- ✅ Archivage sans perte de données
- ✅ Possibilité de réactivation

**Effets :**
- ✅ Société conservée en base
- ✅ Toutes les données préservées
- ✅ Badge devient "Inactif" ⚫
- ✅ Possibilité de réactiver plus tard

**Exemple d'usage :**
- Société en cours de restructuration
- Contrat suspendu temporairement
- Client qui met son activité en pause

---

### SUPPRIMER 🗑️ (Attention !)

**Quand utiliser :**
- ⚠️ Doublon à supprimer
- ⚠️ Société créée par erreur
- ⚠️ Données de test à nettoyer

**Effets :**
- ❌ Société supprimée définitivement
- ❌ Toutes les données perdues
- ❌ **Action irréversible**
- ❌ Impossible de récupérer

**Exemple d'usage :**
- Données de test
- Doublons
- Erreurs de saisie

---

## 🎯 ORDRE DES ACTIONS

```
[👁️ Voir] [🔄 Activer/Désactiver] [✏️ Modifier] [🗑️ Supprimer]
```

**Logique :**
1. **Consultation** (Voir)
2. **Action rapide** (Toggle statut)
3. **Modification complète** (Modifier)
4. **Action dangereuse** (Supprimer)

---

## 💡 EXEMPLES D'UTILISATION

### Scénario 1 : Suspendre temporairement

```
Société: "Hotel Palace" (Actif 🟢)
Raison: Travaux de rénovation (3 mois)

Action:
1. Clic sur 🔄 "Désactiver"
2. Confirmation
3. Société devient "Inactif" ⚫
4. Après 3 mois: Clic 🔄 "Activer"
5. Société redevient "Actif" 🟢

✅ Aucune donnée perdue !
```

### Scénario 2 : Modification d'informations

```
Société: "Tech Corp" (Actif 🟢)
Raison: Changement d'adresse et logo

Action:
1. Clic sur ✏️ "Modifier"
2. Changement adresse
3. Upload nouveau logo
4. Sauvegarde
5. Société reste "Actif" 🟢 avec nouvelles infos

✅ Statut inchangé, infos mises à jour
```

### Scénario 3 : Suppression d'un doublon

```
Société: "Test 123" (doublon créé par erreur)
Raison: Doublon à supprimer

Action:
1. Clic sur 🗑️ "Supprimer"
2. Confirmation
3. Suppression définitive

⚠️ Société disparaît complètement
```

---

## 🎨 FEEDBACK VISUEL

### Statut Actif
```
Société active
Badge: [✓ Actif] 🟢
Action: [🔄 Désactiver] (vert)
```

### Statut Inactif
```
Société inactive
Badge: [Inactif] ⚫
Action: [🔄 Activer] (gris)
```

---

## 📊 TABLEAU DES ACTIONS

| Action | Icône | Couleur | Effet | Irréversible |
|--------|-------|---------|-------|--------------|
| **Voir** | 👁️ | Noir | Consultation | Non |
| **Toggle** | 🔄 | Vert/Gris | Change statut | Non ✅ |
| **Modifier** | ✏️ | Gris | Édite infos | Non |
| **Supprimer** | 🗑️ | Rouge | Supprime | Oui ⚠️ |

---

## 🎊 RÉSULTAT

**4 ACTIONS DISTINCTES DISPONIBLES !**

✅ **Voir** → Consultation  
✅ **Toggle Statut** → ⭐ Active/Désactive (nouveau)  
✅ **Modifier** → Édition complète  
✅ **Supprimer** → Suppression définitive  

**Vous pouvez maintenant activer/désactiver une société en 1 clic !** 🎉

---

## 🧪 TESTER

1. **Rechargez** la page `/societes`
2. **Regardez** les actions à droite de "cadolux"
3. **Vous verrez** 4 icônes :
   - 👁️ Voir (noir)
   - 🔄 Désactiver (vert si actif)
   - ✏️ Modifier (gris)
   - 🗑️ Supprimer (rouge)
4. **Cliquez** sur 🔄 "Désactiver"
5. **Confirmez**
6. **Vérifiez** que le badge devient "Inactif" ⚫
7. **Cliquez** à nouveau sur 🔄 "Activer"
8. **Société** redevient active 🟢

**La société n'est JAMAIS supprimée avec le toggle !** ✅

**Testez maintenant !** 🚀

