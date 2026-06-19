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

      localStorage.setItem("admin_token", data.token)
      router.push("/admin/dashboard")
    } catch {
      setError("Erro de conexão")
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-lg border border-primary/10">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-6">
          <Lock size={24} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Acesso Administrativo</h1>
        <p className="text-sm text-muted text-center mb-8">
          Insira a senha para continuar
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all mb-4"
          autoFocus
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleLogin}
          className="w-full rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn size={18} />
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  )
}
