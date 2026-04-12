import { z } from "zod"

export const contactFormSchema = z.object({
  email: z.email("Email invalide"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message est trop long"),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

