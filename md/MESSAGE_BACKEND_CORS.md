# Configuration CORS requise pour MomBongo V2

## Problème
Le frontend en développement local (`http://localhost:3000`) ne peut pas se connecter au backend à cause des restrictions CORS.

## Solution

### 1. Modifier `appsettings.json`

Ajouter les origines locales dans la section CORS :

```json
{
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:6600",
      "https://mombongov2.asdc-rdc.org"
    ]
  }
}
```

### 2. Vérifier `Program.cs`

S'assurer que la configuration CORS est bien appliquée :

```csharp
// Récupérer les origines depuis appsettings.json
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .WithHeaders(
                      "Content-Type",
                      "Authorization",
                      "Accept",
                      "Origin",
                      "X-Requested-With",
                      "Cache-Control",
                      "Pragma",
                      "Expires"
                  )
                  .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                  .AllowCredentials()
                  .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
        }
    });
});

// Plus loin dans le code, activer CORS
app.UseCors("AllowFrontend");
```

### 3. Ordre important dans Program.cs

```csharp
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");  // ← AVANT UseAuthentication
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

## Headers CORS requis

Les headers suivants DOIVENT être autorisés :
- **Content-Type** : Pour les requêtes JSON
- **Authorization** : Pour le token Bearer JWT
- **Accept** : Pour spécifier le type de réponse
- **Origin** : Pour identifier l'origine de la requête
- **X-Requested-With** : Pour les requêtes AJAX
- **Cache-Control, Pragma, Expires** : Pour la gestion du cache

## Test de la configuration

Après avoir redémarré le backend, tester avec curl :

```bash
curl -X OPTIONS https://mombongov2.asdc-rdc.org/api/Utilisateurs/Authentifier \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v
```

La réponse doit contenir :
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, ...
Access-Control-Allow-Credentials: true
```

## URLs Frontend actuelles

- **Développement local** : `http://localhost:3000` (port Vite par défaut)
- **Développement alternatif** : `http://localhost:6600` (configuré dans vite.config.js)
- **Backend API** : `https://mombongov2.asdc-rdc.org`

## Important

⚠️ **En production**, ne jamais utiliser :
- `AllowAnyOrigin()`
- `SetIsOriginAllowed(origin => true)`
- `AllowedHosts: "*"` avec CORS permissif

Toujours spécifier explicitement les origines autorisées pour la sécurité.

