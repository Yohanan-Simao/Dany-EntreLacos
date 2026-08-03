import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { validateToken } from "@/lib/auth"
import LoginForm from "./login-form"

export default async function AdminPage() {
  const token = (await cookies()).get("admin_token")?.value
  if (token && validateToken(token)) {
    redirect("/admin/dashboard")
  }
  return <LoginForm />
}
