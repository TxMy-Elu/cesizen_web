export type Appointment = {
  id: string
  date: string
  hour: string
  practitioner: string
  specialty: string
  status: "confirmed" | "pending"
}

export type HealthMetric = {
  id: string
  label: string
  value: string
  helper: string
  status: "stable" | "warning" | "critical"
}

export type MedicationReminder = {
  id: string
  name: string
  period: string
  dosage: string
  schedule: string
  state: "done" | "todo"
}


export const appointments: Appointment[] = [
  {
    id: "rdv-1",
    date: "14 avril",
    hour: "09:30",
    practitioner: "Dr. Morel",
    specialty: "Medecine generale",
    status: "confirmed",
  },
  {
    id: "rdv-2",
    date: "21 avril",
    hour: "11:00",
    practitioner: "Mme Laurent",
    specialty: "Psychologie",
    status: "pending",
  },
]

export const healthMetrics: HealthMetric[] = [
  {
    id: "metric-1",
    label: "Sommeil",
    value: "7h 15",
    helper: "Moyenne sur les 7 derniers jours",
    status: "stable",
  },
  {
    id: "metric-2",
    label: "Stress percu",
    value: "Moyen",
    helper: "A surveiller en fin de journee",
    status: "warning",
  },
]

export const medicationReminders: MedicationReminder[] = [
  {
    id: "med-1",
    name: "Traitement A",
    period: "Matin",
    dosage: "1 comprime",
    schedule: "08:00",
    state: "done",
  },
  {
    id: "med-2",
    name: "Traitement B",
    period: "Soir",
    dosage: "10 ml",
    schedule: "20:00",
    state: "todo",
  },
]

