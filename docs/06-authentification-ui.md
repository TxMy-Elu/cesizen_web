# 📝 06 - Formulaires d'authentification (Login/Register UI)

**Temps de lecture** : 10-12 minutes  
**Public cible** : Développeurs Frontend, Designers  
**Dernière mise à jour** : 21 Avril 2026

---

## 📍 Routes

```
/auth/connexion      → Login form
/auth/inscription    → Register form
/auth/reset-mot-de-passe → Password reset (bonus)
```

---

## 🎨 Wireframe formulaires

### Connexion

```
┌─────────────────────────────────┐
│      Connexion                  │
│  Accédez à votre compte         │
│                                 │
│  Email: [________________]      │
│  ❌ Email invalide              │
│                                 │
│  Mot de passe: [____________]   │
│  (Oublié?)                      │
│                                 │
│  [Se connecter]                 │
│                                 │
│  Pas de compte? Créer un compte │
└─────────────────────────────────┘
```

### Inscription

```
┌─────────────────────────────────────┐
│      Créer un compte                │
│  Rejoignez la communauté CESIZen    │
│                                     │
│  Email: [_______________________]  │
│  Prénom: [_______________________]  │
│  Nom: [_______________________]     │
│                                     │
│  Mot de passe: [_________________]  │
│  Min 8 car., 1 maj., 1 min., 1 #   │
│                                     │
│  Confirmer: [_________________]    │
│  ❌ Mots de passe ne match         │
│                                     │
│  ☐ J'accepte les CGU (link)        │
│  ☐ Consentement données (RGPD)    │
│                                     │
│  [Créer mon compte]                │
│                                     │
│  Déjà inscrit? Se connecter        │
└─────────────────────────────────────┘
```

---

## ⚙️ Validation avec Zod

### Schéma Login

```typescript
const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(5, "Email trop court")
    .max(255, "Email trop long"),
    
  password: z
    .string()
    .min(6, "Min 6 caractères")
    .max(128, "Max 128 caractères"),
})
```

**Validation côté client** :
- Format email valide
- Min/max lengths

**Validation côté backend (IMPORTANT)** :
- Email existe?
- Password correct?
- Account actif?
- Rate limiting

### Schéma Register

```typescript
const registerSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(5)
    .max(255),
    
  firstName: z
    .string()
    .min(1, "Prénom requis")
    .max(50),
    
  lastName: z
    .string()
    .min(1, "Nom requis")
    .max(50),
    
  password: z
    .string()
    .min(8, "Min 8 caractères")
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Nécessite: min 1 majuscule, 1 minuscule, 1 chiffre"
    ),
    
  confirmPassword: z.string(),
  
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Accepter les CGU" })
  }),
  
  dataConsent: z.literal(true, {
    errorMap: () => ({ message: "Consentement données requis" })
  }),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
)
```

**Password strength** :
- ✅ Min 8 caractères
- ✅ Au moins 1 MAJUSCULE
- ✅ Au moins 1 minuscule
- ✅ Au moins 1 chiffre

---

## 🎯 États formulaires

### Loading state

```typescript
const [isLoading, setIsLoading] = useState(false)

// Inputs disabled
<Input disabled={isLoading} />

// Button text
<Button disabled={isLoading}>
  {isLoading ? "Connexion en cours..." : "Se connecter"}
</Button>
```

### Error states

```typescript
// Error display
{errors.email && (
  <p className="text-xs text-destructive">
    {errors.email.message}
  </p>
)}

// Input border
<Input
  className={errors.email ? "border-destructive" : ""}
/>
```

### Success states

```typescript
// Toast notification
toast.success("Bienvenue! 👋")

// Auto-redirect
router.push("/profil")
```

---

## 🔄 Flux d'authentification (Détail UI)

### 1️⃣ Login form submit

```
User clique "Se connecter"
         ↓
Form validation (Zod)
         ↓
         ├─ Erreur? Afficher messages locaux
         └─ OK? Continuer
         ↓
setIsLoading(true)
Input disabled, spinner button
         ↓
POST /api/auth/login
Authorization header SANS token (login)
         ↓
Response 200:
  {
    accessToken: "eyJ...",
    refreshToken: "eyJ...",
    user: { ... },
    expiresIn: 900
  }
         ↓
setToken(accessToken) → localStorage
setCookie(refreshToken) → backend
setUser(user) → Zustand
         ↓
toast.success("Bienvenue!")
reset()
router.push("/profil")
         ↓
FIN (user redirected au dashboard)
```

### 2️⃣ Register form submit

```
Validation locale (Zod)
  - Emails match?
  - Passwords match?
  - CGU accepted?
  - Data consent?
         ↓
POST /api/auth/register
Body:
  {
    email,
    firstName,
    lastName,
    password,
    termsAccepted: true,
    dataConsent: true
  }
         ↓
Backend:
  - Email déjà utilisé?
  - Hash password avec Bcrypt
  - Create user in DB
  - Send verification email (optionnel)
  - Return JWT tokens
         ↓
Auto-login (même que Login flow)
         ↓
toast.success("Compte créé! 🎉")
router.push("/profil")
```

---

## 🔐 Points d'attention sécurité

### ❌ Mauvais patterns

```typescript
// ❌ Afficher "Email n'existe pas" vs "Password incorrect"
if (!user) return "Email n'existe pas"
if (!passwordMatch) return "Password incorrect"

// Pourquoi? Permet énumération emails (user enumeration attack)

// ❌ Token dans URL
window.location.href = `/profil?token=${accessToken}`

// Pourquoi? Logs, browser history, referer headers

// ❌ Stocker sensible data
localStorage.setItem("userData", JSON.stringify(userData))

// Pourquoi? localStorage accessible via XSS
```

### ✅ Bons patterns

```typescript
// ✅ Message générique
return "Email ou mot de passe incorrect"

// ✅ Token en localStorage (courte durée)
localStorage.setItem("accessToken", token)

// ✅ RefreshToken en httpOnly cookie (auto-managed)
// (Backend envoie Set-Cookie header)

// ✅ Password masqué
<Input type="password" />

// ✅ Pas d'auto-complete sur password reset
<Input autoComplete="current-password" />
```

---

## 🎨 Styling et accessibilité

### Classes Tailwind

```typescript
// Container centré
className="mx-auto max-w-md"

// Espacement
className="space-y-4"  // Y-axis spacing
className="gap-4"     // Grid gap

// Typographie
className="text-2xl font-bold"
className="text-sm text-muted-foreground"

// Couleurs
className="text-destructive"   // Rouge (errors)
className="text-primary"       // Bleu (links)

// Responsiveness
className="w-full"   // Full width mobile
className="md:w-1/2" // 50% width desktop
```

### Accessibilité WCAG

```typescript
// 1️⃣ LABELS
<label htmlFor="email" className="text-sm font-medium">
  Email
</label>
<Input id="email" />

// 2️⃣ ERROR MESSAGES
{errors.email && (
  <p id="email-error" className="text-xs text-destructive" role="alert">
    {errors.email.message}
  </p>
)}
<Input
  id="email"
  aria-describedby={errors.email ? "email-error" : undefined}
/>

// 3️⃣ FORM STRUCTURE
<form onSubmit={handleSubmit(onSubmit)}>
  <fieldset>
    <legend>Connexion</legend>
    {/* Inputs */}
  </fieldset>
</form>

// 4️⃣ FOCUS MANAGEMENT
// React Hook Form handle automatiquement
// Tab order: logique de haut en bas

// 5️⃣ COLOR CONTRAST
// ✅ Noir sur blanc: ratio 21:1
// ✅ Red errors: ratio > 4.5:1

// 6️⃣ DISABLED STATE
<Button disabled={isLoading}>
  {/* Button text changes to indicate loading */}
</Button>

// 7️⃣ PASSWORD STRENGTH INDICATOR (optional)
<div className="mt-2 space-y-2">
  <div className="h-1 bg-muted rounded-full overflow-hidden">
    <div
      className={`h-full transition-all ${strength === 'weak' ? 'w-1/3 bg-red-500' : 'w-full bg-green-500'}`}
    />
  </div>
  <p className="text-xs text-muted-foreground">
    Force: {strength}
  </p>
</div>
```

---

## 💬 Messages d'erreur convenus

| Condition | Message |
|-----------|---------|
| Email invalide | "Email invalide" |
| Email requis | "Email requis" |
| Email trop long | "Email trop long (max 255 car.)" |
| Password trop court | "Min 6 caractères" |
| Password weak | "Nécessite: 1 maj., 1 min., 1 chiffre" |
| Passwords ne match pas | "Les mots de passe ne correspondent pas" |
| Prénom vide | "Prénom requis" |
| Nom vide | "Nom requis" |
| Terms non-acceptés | "Accepter les CGU pour continuer" |
| Email exists | "Cet email existe déjà" |
| Account locked | "Compte verrouillé (trop de tentatives)" |
| Generic error | "Une erreur est survenue. Réessayez." |

---

## 🧪 Testabilité

```typescript
// Form validation tests
describe("LoginForm", () => {
  it("should validate email", async () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.type(emailInput, "invalid-email")
    
    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument()
    })
  })
})

// API mocking with MSW
server.use(
  http.post("*/api/auth/login", () => {
    return HttpResponse.json({
      accessToken: "test-token",
      user: { id: "1", email: "test@test.fr" }
    })
  })
)

// Form submission
it("should submit login form", async () => {
  render(<LoginPage />)
  
  const emailInput = screen.getByLabelText(/email/i)
  const passwordInput = screen.getByLabelText(/mot de passe/i)
  const button = screen.getByRole("button", { name: /se connecter/i })
  
  await userEvent.type(emailInput, "test@example.fr")
  await userEvent.type(passwordInput, "password123")
  await userEvent.click(button)
  
  await waitFor(() => {
    expect(mockRouter.push).toHaveBeenCalledWith("/profil")
  })
})
```

---

## 📋 Checklist implémentation

```
✅ LOGIN PAGE:
☐ Email input avec validation
☐ Password input (type="password")
☐ Submit button
☐ Error messages display
☐ Loading state
☐ Forgot password link
☐ Register link (footer)
☐ Toast notifications (success/error)
☐ Redirect /profil on success
☐ Accessibility labels

✅ REGISTER PAGE:
☐ Email input
☐ FirstName/LastName inputs
☐ Password input avec strength indicator
☐ ConfirmPassword input
☐ Terms checkbox (avec link)
☐ Data consent checkbox
☐ Submit button
☐ Error messages per field
☐ Loading state
☐ Login link (footer)
☐ Redirect /profil on success

✅ SECURITY:
☐ Password NOT echoed in any log
☐ Email enumeration protected
☐ HTTPS enforced (prod)
☐ CSRF tokens (if needed)
☐ Rate limiting (backend)
☐ Tokens NOT in URL

✅ UX/DESIGN:
☐ Responsive mobile/desktop
☐ Proper spacing
☐ Consistent colors
☐ Clear error states
☐ Loading indicators
☐ Focus management
☐ Keyboard navigation
```

---

## 🔗 Voir aussi

- [03-security.md](./03-security.md) - Concepts JWT
- [04-auth.md](./04-auth.md) - Implémentation complète
- [13-exemples-integration.md](./13-exemples-integration.md) - Code examples
- [12-composants.md](./12-composants.md) - Input, Button composants

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Avril 2026  
**Composants** : 5 UI (Input, Button, Card, Checkbox, Dialog) + Zod validation

