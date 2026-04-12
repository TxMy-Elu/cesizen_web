import { Card, CardContent } from "@/components/ui/card"

type StatsCardProps = {
  label: string
  value: string
  description?: string
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <Card className="border-surface-border bg-linear-to-br from-surface-strong to-brand-sand-50/60 shadow-soft">
      <CardContent className="space-y-1.5 p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold leading-none text-foreground">{value}</p>
        {description ? <p className="text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  )
}
