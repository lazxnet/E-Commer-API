"use client"

import React from "react"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("http://localhost:8080/useradmin/loginAdminUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(500000000)
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error HTTP: ${response.status}`)
        } catch (jsonError) {
          if (response.status === 401) {
            throw new Error("Credenciales inválidas")
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }

      // Redirección después de éxito
      const data = await response.json()
      sessionStorage.setItem("userAdminId", data.userAdminId);
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard") // Aquí la redirección

    } catch (err) {
      let errorMessage = "Error crítico. Contacta al soporte técnico."
      
      if (err instanceof TypeError) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = `Error de conexión:
          1. Verifica que el servidor esté corriendo
          2. Asegúrate que el puerto 8080 esté accesible
          3. Revisa la configuración CORS del servidor`
        } else if (err.message.includes("aborted due to timeout")) {
          errorMessage = "Timeout: El servidor no respondió en 5 segundos"
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      console.error("Error en login:", err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Columna izquierda - Formulario */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Panel Administrativo
            </h1>
            <p className="text-gray-500">Ingrese sus credenciales para continuar</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 transform ${
                !loading && "hover:scale-[1.02]"
              } shadow-md relative`}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
              <span className={loading ? "invisible" : ""}>Iniciar Sesión</span>
            </button>
          </form>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="flex-1 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md">
            <img 
              src="/placeholder.svg" 
              alt="Seguridad" 
              className="w-full h-auto drop-shadow-2xl animate-float" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}