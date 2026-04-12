import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ProfileStat = {
  label: string
  value: string
}

type ProfilePreviewProps = {
  name: string
  role: string
  subtitle?: string
  stats: ProfileStat[]
}

export function ProfilePreview({ name, role, subtitle, stats }: ProfilePreviewProps) {
  return (
    <Card className="border-surface-border bg-linear-to-br from-surface-strong via-surface-strong to-brand-sage-50/45 shadow-soft">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-foreground">{name}</CardTitle>
        <p className="text-sm font-medium text-muted-foreground">{role}</p>
        {subtitle ? <p className="text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/70 bg-surface-strong p-3 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-sage-300 hover:shadow-soft"
          >
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-base font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
