# 📧 Message pour le Développeur Backend - Journal des Ventes

---

## 🎯 Contexte

Le **module Journal des Ventes** a été créé dans le frontend et fonctionne parfaitement pour :
- ✅ Visualiser les ventes
- ✅ Filtrer par société/date/utilisateur
- ✅ Consulter les statistiques
- ✅ Exporter les données

**Cependant**, les fonctionnalités de **modification** et **annulation** de ventes ne fonctionnent pas à cause de limitations backend.

---

## ❌ Problèmes Rencontrés

### 1. Endpoint PUT `/api/Commande/{id}` - Erreur 400

**Appel frontend** :
```javascript
PUT /api/Commande/43
Body: {
  ...commandeComplete, // Tous les champs de la commande
  statutCommande: "Annulée",
  dateLastModification: "2025-11-06T21:59:07.090Z"
}
```

**Résultat** : `400 Bad Request`

**Message d'erreur** : (vérifier dans response.data)

**Ce dont nous avons besoin** :
```javascript
PUT /api/Commande/43/annuler
Body: {} // Vide, ou juste { statutCommande: "Annulée" }

OU

PUT /api/Commande/43
Body: {
  statutCommande: "Annulée" // Seulement le champ modifié
}
```

---

### 2. Endpoint PUT `/api/LigneCommande/{id}` - Erreur 400

**Appel frontend** :
```javascript
PUT /api/LigneCommande/43
Body: {
  quantite: 5,
  prixUnitaire: 25000,
  total: 125000,
  dateLastModification: "2025-11-06T21:59:07.090Z"
}
```

**Résultat** : `400 Bad Request`

**Ce dont nous avons besoin** :
```javascript
PUT /api/LigneCommande/43/modifier
Body: {
  quantite: 5,
  prixUnitaire: 25000
}
// Le backend recalcule automatiquement le total
```

---

### 3. Endpoint GET `/api/LigneCommande/commande/{idCommande}` - Manquant ?

**Besoin** : Récupérer toutes les lignes d'une commande pour trouver la ligne à modifier

**Endpoint souhaité** :
```
GET /api/LigneCommande/commande/23
Response: [
  {
    idLigneCommande: 1,
    idCommande: 23,
    idStock: 8,
    quantite: 1,
    prixUnitaire: 116000,
    total: 116000
  }
]
```

**Contournement actuel** : Désactivation de la modification

---

### 4. PageSize Respecté ?

**Appel** :
```
GET /api/V_JournalVenteParSite/paged?pageSize=9999
```

**Résultat** : Seulement 42 ventes retournées (au lieu de potentiellement 100+)

**Question** : Le backend limite-t-il le `pageSize` maximum ?

**Besoin** :
- Respecter le pageSize demandé (jusqu'à 9999)
- Ou créer un endpoint `/api/V_JournalVenteParSite/all` sans pagination

---

## 🛠️ Solutions Proposées

### Option 1 : Endpoints Simplifiés (RECOMMANDÉ)

**Créer 2 nouveaux endpoints** :

#### A. Annuler une Vente

```csharp
[HttpPut("{id}/annuler")]
public async Task<IActionResult> AnnulerCommande(int id)
{
    var commande = await _context.Commandes.FindAsync(id);
    if (commande == null) return NotFound();
    
    // Vérifier que l'utilisateur a le droit (même société)
    if (!User.IsSuperAdmin && commande.IdSociete != User.SocieteId)
        return Forbid();
    
    commande.StatutCommande = "Annulée";
    commande.DateLastModification = DateTime.Now;
    
    await _context.SaveChangesAsync();
    return Ok();
}
```

#### B. Modifier une Ligne de Commande

```csharp
[HttpPut("{id}/modifier")]
public async Task<IActionResult> ModifierLigneCommande(int id, [FromBody] ModifierLigneDto dto)
{
    var ligne = await _context.LignesCommande.FindAsync(id);
    if (ligne == null) return NotFound();
    
    ligne.Quantite = dto.Quantite;
    ligne.PrixUnitaire = dto.PrixUnitaire;
    ligne.Total = dto.Quantite * dto.PrixUnitaire;
    ligne.DateLastModification = DateTime.Now;
    
    await _context.SaveChangesAsync();
    return Ok();
}

public class ModifierLigneDto
{
    public decimal Quantite { get; set; }
    public decimal PrixUnitaire { get; set; }
}
```

---

### Option 2 : Modifier Endpoints Existants

**Rendre les endpoints actuels plus flexibles** :

```csharp
[HttpPut("{id}")]
public async Task<IActionResult> UpdateCommande(int id, [FromBody] JObject data)
{
    var commande = await _context.Commandes.FindAsync(id);
    if (commande == null) return NotFound();
    
    // Mettre à jour SEULEMENT les champs fournis
    if (data.ContainsKey("statutCommande"))
        commande.StatutCommande = data["statutCommande"].ToString();
    
    // ... autres champs optionnels
    
    await _context.SaveChangesAsync();
    return Ok();
}
```

---

### Option 3 : GET Lignes par Commande

**Créer l'endpoint manquant** :

```csharp
[HttpGet("commande/{idCommande}")]
public async Task<IActionResult> GetLignesParCommande(int idCommande)
{
    var lignes = await _context.LignesCommande
        .Where(l => l.IdCommande == idCommande)
        .ToListAsync();
    
    return Ok(lignes);
}
```

---

## 📊 Bénéfices Attendus

Avec ces endpoints, le frontend pourra :

1. ✅ **Annuler** une vente incorrecte (erreur de saisie)
2. ✅ **Modifier** la quantité ou le prix (correction)
3. ✅ **Audit complet** (qui a modifié quoi et quand)
4. ✅ **Meilleure UX** (pas besoin d'aller dans Commandes)
5. ✅ **Statistiques exactes** (recalculées après modification)

---

## 🔐 Sécurité à Implémenter

### Vérifications Obligatoires

1. **Authentification** : Utilisateur connecté
2. **Autorisation** : Gestionnaire ou Superadmin uniquement
3. **Isolation société** : Vérifier que la vente appartient à la société de l'utilisateur
4. **Validation** : Quantité > 0, Prix > 0
5. **Audit** : Logger qui modifie quoi

```csharp
// Exemple
if (!User.IsGestionnaire && !User.IsSuperAdmin)
    return Forbid("Vous n'avez pas le droit de modifier");

if (!User.IsSuperAdmin && vente.IdSociete != User.SocieteId)
    return Forbid("Cette vente ne vous appartient pas");
```

---

## 📝 Tests à Effectuer (Backend)

### Test 1 : Annuler une Vente

```bash
PUT https://mombongov2.asdc-rdc.org/api/Commande/23/annuler
Headers: Authorization: Bearer {token}
Body: {}

Expected: 200 OK
```

### Test 2 : Modifier une Ligne

```bash
PUT https://mombongov2.asdc-rdc.org/api/LigneCommande/45/modifier
Headers: Authorization: Bearer {token}
Body: {
  "quantite": 5,
  "prixUnitaire": 25000
}

Expected: 200 OK
```

### Test 3 : GET Lignes par Commande

```bash
GET https://mombongov2.asdc-rdc.org/api/LigneCommande/commande/23
Headers: Authorization: Bearer {token}

Expected: 200 OK
Response: [{idLigneCommande: ..., idCommande: 23, ...}]
```

---

## 🎯 Priorité

| Endpoint | Priorité | Impact |
|----------|----------|--------|
| `/annuler` | 🔴 **HAUTE** | Permet de corriger les erreurs |
| `/modifier` | 🟡 Moyenne | Améliore la flexibilité |
| `/commande/{id}/lignes` | 🟢 Basse | Nice to have |
| `pageSize` respecté | 🟡 Moyenne | Affiche toutes les ventes |

---

## 📞 Contact

Si vous avez des questions sur l'implémentation :
- Voir le code frontend : `src/views/JournalVentes.vue` (lignes 1609-1717)
- Voir les appels API : `src/services/api.service.js`
- Logs disponibles dans la console navigateur

---

**Merci d'avance pour ces améliorations !** 🙏

Elles permettront de débloquer les fonctionnalités avancées du Journal des Ventes.

---

**Date** : 6 novembre 2025  
**Auteur** : Équipe Frontend  
**Statut** : En attente backend

