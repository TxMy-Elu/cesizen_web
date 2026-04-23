# 🧩 12 - Système de composants React

**Temps de lecture** : 12-15 minutes | **Public** : Développeurs, Designers | **Mise à jour** : 21 Avril 2026

---

## 📁 Arborescence composants

```
components/
├── ui/                    # Composants bruts (unstyled)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── tabs.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── separator.tsx
│   ├── carousel.tsx
│   ├── calendar.tsx
│   ├── alert.tsx
│   └── command.tsx
│
└── app/                   # Composants métier (styled)
    ├── site-header.tsx        # Navigation header
    ├── site-footer.tsx        # Footer
    ├── admin-guard.tsx        # Route protection
    ├── profile-preview.tsx    # User card
    ├── health-metric-card.tsx # Stats display
    ├── article-card.tsx       # Article preview
    ├── stats-card.tsx         # Metric card
    ├── appointment-timeline.tsx # Session history
    └── medication-reminder-list.tsx # Reminders
```

---

## 🎨 Composants UI (Radix + Tailwind)

### Button

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button
    className={clsx(buttonVariants({ variant, size }), className)}
    {...props}
  />
)
```

**Utilisations**:
```tsx
<Button>Default</Button>
<Button variant="destructive">Danger</Button>
<Button variant="outline">Secondary</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card

```typescript
// components/ui/card.tsx
export const Card = ({ className, ...props }) => (
  <div
    className={clsx(
      "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm",
      className
    )}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }) => (
  <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

export const CardTitle = ({ className, ...props }) => (
  <h2 className={clsx("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
)

export const CardDescription = ({ className, ...props }) => (
  <p className={clsx("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
)

export const CardContent = ({ className, ...props }) => (
  <div className={clsx("p-6 pt-0", className)} {...props} />
)
```

**Utilisations**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Input

```typescript
// components/ui/input.tsx
import { InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, type, ...props }: InputProps) => (
  <input
    type={type}
    className={clsx(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
)
```

### Select, Checkbox, Dialog, etc.

```typescript
// Tous suivent le pattern Radix UI + Tailwind
// Unstyled mais avec structure d'accessibilité complète
```

---

## 🎯 Composants métier (App)

### StatsCard

```typescript
// components/app/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: "up" | "down"
  trendValue?: string
}

export function StatsCard({ label, value, icon, trend, trendValue }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### ArticleCard

```typescript
// components/app/article-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  article: {
    slug: string
    title: string
    excerpt: string
    thumbnail?: string
    category: { name: string }
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      {article.thumbnail && (
        <Image
          src={article.thumbnail}
          alt={article.title}
          width={300}
          height={200}
          className="aspect-video object-cover"
        />
      )}

      <CardHeader className="space-y-2">
        <Badge variant="outline">{article.category.name}</Badge>
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
      </CardHeader>

      <CardContent>
        <Link
          href={`/prevention/${article.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Lire l'article →
        </Link>
      </CardContent>
    </Card>
  )
}
```

### AdminGuard

```typescript
// components/app/admin-guard.tsx
"use client"

import { useAuthStore } from "@/lib/auth/use-session"
import { redirect } from "next/navigation"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated() || user?.role !== "admin") {
    redirect("/auth/connexion")
  }

  return <>{children}</>
}
```

---

## 🎨 Design tokens (Tailwind)

### Couleurs

```typescript
// tailwind.config.ts
{
  theme: {
    colors: {
      primary: "#3b82f6",      // Bleu calming
      secondary: "#10b981",    // Vert succès
      destructive: "#ef4444",  // Rouge danger
      muted: "#6b7280",        // Gris neutre
      // ...
    }
  }
}
```

### Typography

```
h1: text-4xl font-bold
h2: text-3xl font-bold
h3: text-2xl font-bold
body: text-base font-normal
small: text-sm font-normal
```

### Spacing (Tailwind default)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

---

## 📐 Patterns de composants

### Compound component pattern

```typescript
// ✅ Flexible API
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Vs ❌ Rigid API
<Card title="Title" content="Content" />
```

### Render prop pattern

```typescript
<DataTable
  data={articles}
  columns={[
    { id: "title", label: "Title" },
    { id: "category", label: "Category" },
  ]}
  renderRow={(article) => (
    <tr>
      <td>{article.title}</td>
      <td>{article.category}</td>
    </tr>
  )}
/>
```

### Slot pattern (composition)

```typescript
// Radix UI pattern
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogBody>Content</DialogBody>
  </DialogContent>
</Dialog>
```

---

## 🧪 Props et TypeScript

### Bien typé

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export function Button({ variant = "default", size = "md", isLoading, ...props }: ButtonProps) {
  return (
    <button className={getClasses(variant, size)} disabled={isLoading} {...props}>
      {isLoading ? "Chargement..." : props.children}
    </button>
  )
}
```

### Composants avec Zod

```typescript
// Validation + Component
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  // ...
}
```

---

## 📦 Exports

```typescript
// components/index.ts (star-export)
export * from "./ui/button"
export * from "./ui/card"
export * from "./ui/input"
// ...
export * from "./app/stats-card"
export * from "./app/admin-guard"
// ...

// Usage
import { Button, Card, StatsCard } from "@/components"
```

---

## 🎯 Best practices

```
✅ DO:
- Props typées avec TypeScript
- Accessibility (aria-labels, roles)
- Flexible composition (compound components)
- Single responsibility
- Customizable (className prop)
- Proper exports

❌ DON'T:
- Hardcoded strings
- Tight coupling
- Too many props (interface bloat)
- Untyped components
- Inaccessible interactions
- Tightly coupled to styles
```

---

## 📋 Checklist

```
☐ UI components bruts (Button, Input, Card, etc.)
☐ App components métier (StatsCard, ArticleCard, etc.)
☐ TypeScript interfaces pour chaque component
☐ Tailwind classes (responsive, dark mode)
☐ ARIA labels et accessibility
☐ Prop spreading (...props)
☐ className merging (clsx)
☐ Proper exports
☐ Component documentation/stories
☐ Variants (CVA) pour complex components
```

---

**Voir aussi**: [06-authentification-ui.md](./06-authentification-ui.md) | [07-respiration.md](./07-respiration.md)

**Version** : 1.0.0 | **Mise à jour** : 21 Avril 2026

