import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MedicationReminder } from "@/lib/demo-data"

type MedicationReminderListProps = {
  reminders: MedicationReminder[]
}

export function MedicationReminderList({ reminders }: MedicationReminderListProps) {
  return (
    <Card className="border-border/80 bg-white shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-brand-dark">Traitements du jour</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table className="rounded-md border border-border/70">
          <TableHeader>
            <TableRow>
              <TableHead>Medicament</TableHead>
              <TableHead>Posologie</TableHead>
              <TableHead>Horaire</TableHead>
              <TableHead className="text-right">Etat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>
                  <p className="font-medium text-brand-dark">{reminder.name}</p>
                  <p className="text-xs text-brand-dark/60">{reminder.period}</p>
                </TableCell>
                <TableCell className="text-brand-dark/70">{reminder.dosage}</TableCell>
                <TableCell className="text-brand-dark/70">{reminder.schedule}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={reminder.state === "done" ? "secondary" : "outline"}
                    className="justify-center"
                  >
                    {reminder.state === "done" ? "Pris" : "A venir"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

