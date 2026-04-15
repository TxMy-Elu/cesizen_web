"use client"

import { AdminGuard } from "@/components/app/admin-guard"

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminGuard>{children}</AdminGuard>
}

