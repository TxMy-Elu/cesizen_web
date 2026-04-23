# ⚙️ 10 - Admin Panel

**Temps de lecture** : 8 minutes | **Auth** : ✅ Admin only | **Mise à jour** : 21 Avril 2026

---

## 📍 Routes

```
/admin              → Dashboard
/admin/contenus     → Gestion articles
/admin/utilisateurs → Gestion users
/admin/statistiques → Analytics
```

---

## 🔐 Protection

```typescript
// components/app/admin-guard.tsx
<AdminGuard>
  <AdminPanel />
</AdminGuard>

// Vérifie: user.role === "admin"
// Redirige sinon vers /auth/connexion
```

---

## 🎯 Sections

### Dashboard

```
Utilisateurs actifs: 1,234
Sessions aujourd'hui: 567
Cohérence moyenne: 76/100
Taux completion: 89%

[Voir détails] [Exporter]
```

### Gestion articles

```
[+ Créer article]

| Titre | Catégorie | Vues | Actions |
|-------|-----------|------|---------|
| Article 1 | Stress | 245 | Edit/Delete |

[Pagination]
```

### Gestion utilisateurs

```
[Search] [Filtres]

| Email | Name | Role | Actions |
|-------|------|------|---------|
| ... | ... | user | Ban/Edit |

[Export CSV] [Send email]
```

### Statistiques

```
Sessions par jour (graph)
Catégories populaires (pie)
Utilisateurs par région (map)
Taux engagement (metrics)

[Date range picker]
[Export rapport]
```

---

## 💻 Code structure

```typescript
// app/admin/page.tsx - Dashboard
export default function AdminDashboard() {
  return (
    <AdminGuard>
      {/* Stats cards */}
      {/* Charts */}
      {/* Recent activity */}
    </AdminGuard>
  )
}

// app/admin/contenus/page.tsx - Articles
export default function AdminArticles() {
  return (
    <AdminGuard>
      {/* Article table */}
      {/* Create/Edit form */}
    </AdminGuard>
  )
}

// app/admin/utilisateurs/page.tsx - Users
export default function AdminUsers() {
  return (
    <AdminGuard>
      {/* User table */}
      {/* Search/filters */}
    </AdminGuard>
  )
}

// app/admin/statistiques/page.tsx - Analytics
export default function AdminStats() {
  return (
    <AdminGuard>
      {/* Charts */}
      {/* Metrics */}
    </AdminGuard>
  )
}
```

---

## 📊 API Endpoints (admin-only)

```
GET    /api/admin/users           → List users (paginated)
POST   /api/admin/users/{id}/ban  → Ban user
DELETE /api/admin/users/{id}      → Delete user

GET    /api/admin/articles        → List articles
POST   /api/admin/articles        → Create article
PUT    /api/admin/articles/{id}   → Update article
DELETE /api/admin/articles/{id}   → Delete article

GET    /api/admin/stats           → Statistiques
GET    /api/admin/logs            → Audit logs
POST   /api/admin/settings        → Mise à jour paramètres
```

---

## 🔐 Sécurité

```
Backend MUST verify:
✅ JWT token valide
✅ user.role === "admin"
✅ Logging des actions
✅ Rate limiting
✅ CSRF protection

Frontend:
✅ AdminGuard component
✅ Client-side validation
✅ Confirmation modals
✅ Error handling
```

---

## 📋 Checklist

```
☐ Layout protégé (AdminGuard)
☐ Navigation admin (sidebar)
☐ Dashboard with stats
☐ Article CRUD
☐ User management
☐ Analytics/charts
☐ Audit logs
☐ Settings panel
☐ Export CSV
☐ Confirmation modals
```

---

**Voir aussi**: [03-security.md](./03-security.md) | [08-prevention.md](./08-prevention.md)

**Version** : 1.0.0 | **Mise à jour** : 21 Avril 2026

