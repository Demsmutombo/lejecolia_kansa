# Message pour le Développeur Backend

---

## 📧 Texte à Envoyer

Bonjour,

Je rencontre un **problème de configuration CORS** avec le nouveau serveur API.

### 🔴 Problème Identifié

**URL concernée** : `https://mombongov2.asdc-rdc.org`

**Erreur dans la console du navigateur** :
```
Access-Control-Allow-Origin cannot contain more than one origin.
XMLHttpRequest cannot load https://mombongov2.asdc-rdc.org/api/Utilisateurs/Authentifier 
due to access control checks.
```

### 📋 Détails Techniques

L'erreur se produit lors de la tentative de connexion à l'endpoint :
- **Endpoint** : `/api/Utilisateurs/Authentifier`
- **Méthode** : POST
- **Frontend** : http://localhost:3000

Le serveur backend semble retourner **plusieurs origines** dans le header `Access-Control-Allow-Origin`, ce qui n'est pas autorisé par la spécification HTTP CORS.

### ✅ Solution Requise

Le header CORS doit contenir **UNE SEULE origine** ou utiliser le wildcard `*`.

#### Option 1 : Autoriser Toutes les Origines (Développement)
```csharp
// Dans Startup.cs ou Program.cs
app.UseCors(builder => builder
    .AllowAnyOrigin()     // ← UNE SEULE méthode
    .AllowAnyMethod()
    .AllowAnyHeader()
);
```

#### Option 2 : Autoriser des Origines Spécifiques (Production)
```csharp
// Dans Startup.cs ou Program.cs
app.UseCors(builder => builder
    .WithOrigins("http://localhost:3000")  // ← UNE SEULE origine à la fois
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);

// OU avec plusieurs origines (méthode correcte)
app.UseCors(builder => builder
    .WithOrigins(
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://votre-domaine-production.com"
    )
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);
```

### ⚠️ Configuration INCORRECTE (À Éviter)

Ne PAS faire :
```csharp
// ❌ MAUVAIS - Ceci cause l'erreur
response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000, http://127.0.0.1:3000");

// Le header ne peut contenir qu'UNE SEULE origine ou "*"
```

### 📊 Comparaison avec l'Ancien Serveur

L'ancienne URL `https://mombongo.asdc-rdc.org` fonctionne correctement avec CORS. Vous pouvez comparer la configuration CORS entre les deux serveurs.

### 🧪 Test Simple

Pour tester si CORS est bien configuré, vous pouvez utiliser curl :

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://mombongov2.asdc-rdc.org/api/Utilisateurs/Authentifier
```

Le serveur doit retourner :
```
Access-Control-Allow-Origin: http://localhost:3000
# OU
Access-Control-Allow-Origin: *
```

**Mais PAS** :
```
Access-Control-Allow-Origin: http://localhost:3000, http://127.0.0.1:3000
```

### 🔧 En Attendant

J'utilise temporairement l'ancienne URL `https://mombongo.asdc-rdc.org` qui fonctionne correctement.

### 📞 Besoin de Plus d'Informations ?

Si vous avez besoin de plus de détails ou de logs spécifiques, n'hésitez pas à me demander.

Merci pour votre aide !

---

**Date** : 4 novembre 2025  
**Erreur** : CORS - Access-Control-Allow-Origin  
**URL Problématique** : https://mombongov2.asdc-rdc.org  
**URL Fonctionnelle** : https://mombongo.asdc-rdc.org

---

## 📎 Pièces Jointes Suggérées

### Capture d'Écran Console

Faites une capture d'écran de la console (F12) montrant l'erreur :
```
Access-Control-Allow-Origin cannot contain more than one origin.
```

### Log Complet

```
[Error] Access-Control-Allow-Origin cannot contain more than one origin.
[Error] XMLHttpRequest cannot load https://mombongov2.asdc-rdc.org/api/Utilisateurs/Authentifier 
due to access control checks.
```

---

## 🔗 Ressources Utiles

Si le développeur backend a besoin de documentation :

- **CORS ASP.NET Core** : https://learn.microsoft.com/en-us/aspnet/core/security/cors
- **MDN CORS** : https://developer.mozilla.org/fr/docs/Web/HTTP/CORS
- **Spécification CORS** : https://www.w3.org/TR/cors/

---

**Ce message devrait aider le développeur backend à corriger rapidement le problème CORS.** ✅

