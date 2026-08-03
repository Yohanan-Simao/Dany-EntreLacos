"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, LogIn } from "lucide-react"

export default function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!password) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Senha inválida")
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch {
      setError("Erro de conexão")
      setLoading(false)
    }
  }

  return (
    <main id="main" className="min-h-screen bg-background flex items-center justify-center p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-lg border border-primary/10"
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary-dark mx-auto mb-6">
          <Lock size={24} aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Acesso Administrativo</h1>
        <p className="text-sm text-muted text-center mb-8">
          Insira a senha para continuar
        </p>

        {error && (
          <p role="status" aria-live="polite" className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Senha"
          aria-label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary-dark px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn size={18} aria-hidden="true" />
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  )
}
