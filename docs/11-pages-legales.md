# ⚖️ 11 - Pages légales et conformité

**Temps de lecture** : 5 minutes | **Auth** : Non | **Mise à jour** : 21 Avril 2026

---

## 📍 Routes

```
/mentions-legales     → Informations légales
/confidentialite      → Politique de confidentialité (RGPD)
/cookies              → Politique des cookies
/accessibilite        → Déclaration accessibilité
/faq                  → Foire aux questions
/contact              → Formulaire contact
```

---

## 📄 Mentions légales

```
- Raison sociale et adresse
- Responsable publication
- Hébergeur
- Conditions d'utilisation
- Disclaimer de responsabilité
- Copyright et droits d'auteur
- Données de santé (disclaimer)
```

**Important** : "Les contenus ne remplacent pas un avis médical professionnel"

---

## 🔒 Politique de confidentialité (RGPD)

### Sections

```
1. Responsable du traitement
2. Données collectées
3. Base légale
4. Durée de rétention
5. Droits des utilisateurs (CNIL)
6. Mesures de sécurité
7. Cookies et trackers
8. Contact DPO
```

### Données collectées

```
Utilisateurs non-connectés:
- IP (anonymisée après 7j)
- User-Agent
- Pages visitées (anonyme)

Utilisateurs connectés:
- Email, Prénom, Nom
- Historique sessions
- Feedback utilisateur
- Préférences

Données de santé (optionnel):
- Métriques cohérence cardiaque
- Durée sessions
- Stress level (self-reported)
```

### Droits utilisateurs

```
✅ Droit d'accès (GET /api/users/me/data)
✅ Droit de rectification (PUT /api/users/{id})
✅ Droit d'oubli (DELETE /api/users/{id})
✅ Droit de portabilité (GET /api/users/export)
✅ Droit d'opposition
```

---

## 🍪 Gestion des cookies

### Types de cookies

```
1. Essentiels (sans consentement)
   - JWT tokens (httpOnly)
   - Session CSRF

2. Analytiques (consentement requisiREQUIRED)
   - Google Analytics
   - Mixpanel
   
3. Marketing (consentement requis)
   - Publicités
   - Tracking
```

### Banner consentement

```typescript
// app/components/cookie-banner.tsx
<div className="fixed bottom-0 bg-white border-t p-4 shadow">
  <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
  <Button>Accepter tout</Button>
  <Button variant="outline">Paramètres</Button>
</div>
```

---

## ♿ Accessibilité WCAG

### Conformité

```
Standard: WCAG 2.1 Level AA
Guidelines:
- Perceivable: Images alt-text, couleurs contrastées
- Operable: Keyboard navigation, sans piège clavier
- Understandable: Langage simple, structure logique
- Robust: HTML valide, ARIA labels
```

### Déclaration d'accessibilité

```
"CESIZen s'engage pour l'accessibilité.

Conformité: Partiellement conforme (WCAG 2.1 AA)
Contenu non-conforme: Vidéos sans sous-titres
Moyens de contact: accessibility@cesizen.com
Date évaluation: 21-04-2024"
```

---

## ❓ FAQ

```
Q: Mes données sont-elles sécurisées?
R: Oui, chiffrement HTTPS et stockage sécurisé.

Q: Comment supprimer mon compte?
R: Paramètres → Zone danger → Supprimer compte

Q: Puis-je télécharger mes données?
R: Oui, format JSON: Profil → Exporter mes données

Q: Y a-t-il un support?
R: Email: support@cesizen.com (48h max)

Q: Les données de santé sont confidentielles?
R: Oui, conformité RGPD et CNIL (si applicable).
```

---

## 📧 Formulaire contact

```typescript
// app/contact/page.tsx
<form>
  <Input name="name" placeholder="Votre nom" required />
  <Input name="email" type="email" required />
  <Select name="subject">
    <option>Support technique</option>
    <option>Suggestion feature</option>
    <option>Signaler bug</option>
    <option>Autre</option>
  </Select>
  <Textarea name="message" placeholder="Votre message..." rows={5} />
  <Button>Envoyer</Button>
</form>

// Email: contact@cesizen.com
// Response time: 48 heures
```

---

## 📋 Checklist légale

```
☐ Mentions légales complètes
☐ Politique confidentialité (RGPD)
☐ Gestion cookies (consent banner)
☐ Déclaration accessibilité
☐ FAQ complète
☐ Formulaire contact
☐ Termes d'utilisation
☐ CGU claires
☐ CNIL déclaration (si données santé)
☐ DPO contact (si applicable)
☐ Droit d'oubli implémenté
☐ Data export implémenté
```

---

**Versions** : 1.0.0 | **Mise à jour** : 21 Avril 2026

**Note**: Adapter avec votre structure légale réelle!

