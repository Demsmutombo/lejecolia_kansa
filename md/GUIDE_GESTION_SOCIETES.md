# 🏢 Guide Gestion des Sociétés - Page Complète

## ✅ Ce qui a été créé

### 1. **Page Societes.vue** - Gestion complète ⭐
- Liste des sociétés avec DataTable
- Recherche multi-champs
- Pagination automatique
- Actions : Voir, Modifier, Supprimer
- CRUD complet intégré

### 2. **SocieteModal.vue** - Modal Créer/Modifier ⭐
- Formulaire complet
- Upload de logo avec prévisualisation
- Validation
- Mode création ET édition

---

## 🎯 Fonctionnalités Implémentées

### ✅ **Liste des Sociétés**
- Affichage dans DataTable
- Colonnes : Logo, Nom, Contact, Téléphone, Secteur, Statut, Date
- Recherche dans tous les champs
- Pagination (10 par page)

### ✅ **Créer une Société**
- Bouton "Nouvelle Société"
- Modal avec formulaire complet
- Upload de logo (image)
- Tous les champs de l'API

### ✅ **Modifier une Société**
- Bouton "Modifier" sur chaque ligne
- Modal pré-rempli avec les données
- Mise à jour via API PUT

### ✅ **Supprimer une Société**
- Bouton "Supprimer" (icône)
- Confirmation SweetAlert
- Suppression via API DELETE
- Rafraîchissement automatique

### ✅ **Voir les Détails**
- Bouton "Voir"
- Redirection vers `/societes/{id}`

---

## 📋 Champs de la Société

Selon votre API, tous ces champs sont gérés :

### Informations Principales
- `nomSociete` * (obligatoire)
- `type` (ex: Hôtellerie, Restauration)
- `secteurActivite`
- `logo` (image en base64)

### Identifiants Fiscaux
- `impot` (Numéro d'impôt)
- `rccm` (Registre de commerce)
- `idNat` (ID National)

### Contact
- `email` * (obligatoire)
- `contact` * (téléphone, obligatoire)
- `siteWeb`

### Adresse Complète
- `province`
- `ville`
- `commune`
- `quartier`
- `avenue`
- `numero`

### Méta-données
- `statut` (actif/inactif)
- `dateCreation`
- `dateLastModification`
- `idSociete` (auto-généré)

---

## 🚀 Utilisation

### Accès à la Page
```
URL: http://localhost:6600/societes
Rôle requis: SuperAdmin uniquement
```

### Actions Disponibles

#### 1. **Créer une Société**
```
1. Clic sur "Nouvelle Société"
2. Modal s'ouvre
3. Remplir le formulaire
4. (Optionnel) Ajouter un logo
5. Clic "Créer"
6. SweetAlert de confirmation
7. Table se rafraîchit
```

#### 2. **Modifier une Société**
```
1. Clic sur "Modifier" (icône crayon)
2. Modal s'ouvre pré-rempli
3. Modifier les champs
4. (Optionnel) Changer le logo
5. Clic "Modifier"
6. Confirmation + rafraîchissement
```

#### 3. **Supprimer une Société**
```
1. Clic sur "Supprimer" (icône poubelle)
2. Confirmation SweetAlert
3. Si "Oui" → Suppression
4. Confirmation + rafraîchissement
```

#### 4. **Voir les Détails**
```
1. Clic sur "Voir" (icône œil)
2. Redirection vers /societes/{id}
3. Page de détails (SocieteDetail.vue)
```

#### 5. **Rechercher**
```
Tape dans le champ "Rechercher..."
Filtre automatique sur :
- Nom société
- Email
- Contact
- Ville
- Secteur d'activité
```

---

## 🖼️ Gestion du Logo

### Upload
```
1. Dans le modal, clic "Ajouter Logo"
2. Sélectionner une image (JPG, PNG, etc.)
3. Prévisualisation immédiate
4. Logo converti en base64
5. Envoyé à l'API dans le champ "logo"
```

### Affichage
- Logo affiché dans la première colonne du tableau
- Format: Avatar rond
- Si pas de logo → Logo par défaut

### Format
- Le logo est stocké en **base64** dans l'API
- Champ `logo` contient la chaîne base64 complète
- Ex: `"data:image/png;base64,iVBORw0KGgo..."`

---

## 📡 Appels API

### GET - Liste
```
GET /api/Societes
→ Retourne un array de sociétés
```

### POST - Créer
```
POST /api/Societes
Body: { nomSociete, email, contact, logo, ... }
→ Retourne la société créée avec idSociete
```

### PUT - Modifier
```
PUT /api/Societes/{id}
Body: { nomSociete, email, ... }
→ Retourne la société modifiée
```

### DELETE - Supprimer
```
DELETE /api/Societes/{id}
→ Supprime la société
```

### GET - Par ID
```
GET /api/Societes/{id}
→ Retourne une société spécifique
```

---

## 🎨 Colonnes du Tableau

| Colonne | Type | Description |
|---------|------|-------------|
| Logo | Image | Avatar rond |
| Société | HTML | Nom + Adresse |
| Contact | Link | Email cliquable |
| Téléphone | Link | Tel: cliquable |
| Secteur | Badge | Badge info |
| Statut | Badge | Actif/Inactif |
| Date | Date | Date création |
| Actions | Buttons | Voir/Modifier/Supprimer |

---

## 💡 Personnalisation

### Ajouter une Colonne

Dans `Societes.vue`, ajoutez dans `columns`:
```javascript
{
  key: 'type',
  label: 'Type',
  align: 'center'
}
```

### Modifier le Nombre par Page

```vue
<data-table
  :items-per-page="20"
  ...
/>
```

### Ajouter des Champs de Recherche

```vue
<data-table
  :search-fields="['nomSociete', 'email', 'contact', 'type', 'rccm']"
  ...
/>
```

---

## 🔒 Sécurité

### Frontend
- ✅ Route protégée (requiresSuperAdmin)
- ✅ Uniquement accessible aux SuperAdmin
- ✅ Redirection automatique si non autorisé

### Backend
⚠️ Assurez-vous que votre API :
- Vérifie le token JWT
- Vérifie que l'utilisateur est SuperAdmin
- Valide les données avant CREATE/UPDATE

---

## 🧪 Test de la Page

### 1. Se Connecter en SuperAdmin
```
1. Allez sur /signin
2. Connectez-vous avec un compte SuperAdmin
3. Le menu affiche "Sociétés"
```

### 2. Accéder à la Page
```
URL: http://localhost:6600/societes
ou
Clic sur "Sociétés" dans le menu
```

### 3. Tester les Fonctionnalités
- [ ] Voir la liste (devrait être vide ou avec vos sociétés)
- [ ] Rechercher une société
- [ ] Créer une nouvelle société
- [ ] Ajouter un logo
- [ ] Modifier une société
- [ ] Supprimer une société

---

## 🎯 Structure des Données

### Objet Société Complet

```javascript
{
  idSociete: 1,
  nomSociete: "Hotel Grand Palace",
  type: "Hôtellerie",
  secteurActivite: "Tourisme",
  
  // Fiscal
  impot: "A123456",
  rccm: "CD/KIN/RCCM/12-A-12345",
  idNat: "01-123-N12345",
  
  // Contact
  email: "contact@grandpalace.cd",
  contact: "+243 123 456 789",
  siteWeb: "https://www.grandpalace.cd",
  logo: "data:image/png;base64,...",
  
  // Adresse
  province: "Kinshasa",
  ville: "Kinshasa",
  commune: "Gombe",
  quartier: "Centre-ville",
  avenue: "Avenue de la Paix",
  numero: "123",
  
  // Méta
  statut: true,
  dateCreation: "2023-01-15T10:30:00Z",
  dateLastModification: "2025-11-01T15:20:00Z"
}
```

---

## 📊 Exemple Visuel

```
┌─────────────────────────────────────────────────────────────┐
│ Gestion des Sociétés                    [Nouvelle Société]  │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Rechercher...]                                          │
├──────┬──────────────────┬────────────┬─────────┬───────┬────┤
│ Logo │ Société          │ Contact    │ Tél     │Statut │Act │
├──────┼──────────────────┼────────────┼─────────┼───────┼────┤
│  🏢  │ Hotel Palace     │ @email     │ 📞 tel  │ Actif │👁✏🗑│
│  🏢  │ Restaurant...    │ @email     │ 📞 tel  │ Actif │👁✏🗑│
└──────┴──────────────────┴────────────┴─────────┴───────┴────┘
                    [< 1 2 3 4 5 >]
```

---

## ✨ Fonctionnalités Avancées

### SweetAlert Intégré
- ✅ Confirmation avant suppression
- ✅ Message de succès après action
- ✅ Message d'erreur si problème
- ✅ Loading pendant l'opération

### Validation
- ✅ Nom obligatoire
- ✅ Email obligatoire
- ✅ Contact obligatoire
- ✅ Validation côté frontend

### Responsive
- ✅ Fonctionne sur mobile
- ✅ Formulaire adaptatif
- ✅ Tableau scrollable

---

## 🎊 RÉSULTAT

**Page complète de gestion des sociétés avec :**
- ✅ DataTable réutilisable
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Upload de logo avec prévisualisation
- ✅ Recherche multi-champs
- ✅ Pagination
- ✅ SweetAlert pour les confirmations
- ✅ Intégration API complète
- ✅ Validation des données
- ✅ Design élégant

---

**🚀 Accédez à la page : http://localhost:6600/societes**  
(Connectez-vous en SuperAdmin d'abord)

**📚 Consultez aussi :**
- `GUIDE_DATATABLE.md` - Documentation DataTable
- `GUIDE_SWEETALERT.md` - Documentation SweetAlert

**🎯 Vous pouvez maintenant gérer toutes vos sociétés depuis cette interface !** ✨

