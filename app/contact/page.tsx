"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact"

const emergencyContacts = [
  { label: "SAMU", value: "15" },
  { label: "Urgences Europe", value: "112" },
  { label: "Prevention suicide", value: "3114" },
]

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    toast.success("Message envoye", {
      description: `Merci ${values.email}, notre equipe vous repond rapidement.`,
    })
    reset()
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <Card className="border-surface-border bg-surface-strong shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">Contact</CardTitle>
          <CardDescription className="text-base">
            Besoin d&apos;aide, d&apos;une information ou d&apos;un signalement ? Ecrivez-nous via ce formulaire.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-[#7aa88a]/22 bg-surface/95 shadow-subtle">
          <CardHeader>
            <CardTitle className="text-xl">Nous ecrire</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-brand-dark">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@example.com"
                  className="border-[#7aa88a]/35 bg-white hover:border-[#6ba382]/55 focus-visible:border-[#6ba382]"
                  {...register("email")}
                />
                {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-brand-dark">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Decrivez votre demande..."
                  className="border-[#7aa88a]/35 bg-white hover:border-[#6ba382]/55 focus-visible:border-[#6ba382]"
                  {...register("message")}
                />
                {errors.message ? <p className="text-xs text-destructive">{errors.message.message}</p> : null}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Envoyer le message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-[#7aa88a]/22 bg-surface/95 shadow-subtle">
          <CardHeader>
            <CardTitle className="text-xl">Urgence immediate</CardTitle>
            <CardDescription>
              En cas de crise, contactez directement les services prioritaires.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.map((item) => (
              <a
                key={item.value}
                href={`tel:${item.value}`}
                className="flex items-center justify-between rounded-lg border border-[#7aa88a]/30 bg-surface-strong px-3 py-2 text-sm shadow-subtle transition-colors hover:border-[#6ba382]/55"
              >
                <span>{item.label}</span>
                <span className="font-bold text-brand-dark">{item.value}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

