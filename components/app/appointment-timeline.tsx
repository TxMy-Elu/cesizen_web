import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Appointment } from "@/lib/demo-data"

type AppointmentTimelineProps = {
  appointments: Appointment[]
}

export function AppointmentTimeline({ appointments }: AppointmentTimelineProps) {
  return (
    <Card className="border-border/80 bg-white shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-brand-dark">Prochains rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="flex gap-4">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-olive/70" aria-hidden />
              <div className="min-w-0 flex-1 rounded-md border border-border/80 bg-brand-sage-50/25 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-brand-dark">
                    {appointment.date} a {appointment.hour}
                  </p>
                  <Badge variant={appointment.status === "confirmed" ? "secondary" : "outline"}>
                    {appointment.status === "confirmed" ? "Confirme" : "En attente"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-brand-dark/70">{appointment.practitioner}</p>
                <p className="text-sm text-brand-dark/60">{appointment.specialty}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

