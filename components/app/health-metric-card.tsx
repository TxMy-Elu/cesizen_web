import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type HealthMetric = {
  id: string
  label: string
  value: string
  helper: string
  status: "stable" | "warning" | "critical"
}

type HealthMetricCardProps = {
  metric: HealthMetric
}

const statusStyles: Record<HealthMetric["status"], { label: string; className: string }> = {
  stable: {
    label: "Stable",
    className: "border-transparent bg-brand-sage-100 text-brand-dark hover:bg-brand-sage-100",
  },
  warning: {
    label: "A surveiller",
    className: "border-transparent bg-brand-sand-100 text-brand-dark hover:bg-brand-sand-100",
  },
  critical: {
    label: "Critique",
    className: "border-transparent bg-destructive/15 text-foreground hover:bg-destructive/20",
  },
}

export function HealthMetricCard({ metric }: HealthMetricCardProps) {
  const status = statusStyles[metric.status]

  return (
    <Card className="border-border/80 bg-white shadow-none">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-brand-dark/75">
          {metric.label}
        </CardTitle>
        <Badge className={status.className}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <p className="text-3xl font-semibold tracking-tight text-brand-dark">{metric.value}</p>
        <p className="text-sm leading-relaxed text-brand-dark/65">{metric.helper}</p>
      </CardContent>
    </Card>
  )
}

