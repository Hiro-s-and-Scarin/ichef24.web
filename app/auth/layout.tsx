import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "iChef24 - Autenticação",
  description: "Entre ou registre-se no iChef24",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}