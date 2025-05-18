"use client";

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiLock, FiMail } from "react-icons/fi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/useradmin/loginAdminUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          signal: AbortSignal.timeout(500000000),
        }
      );

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Error HTTP: ${response.status}`
          );
        } catch (jsonError) {
          if (response.status === 401) {
            throw new Error("Credenciales inválidas");
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // Redirección después de éxito
      const data = await response.json();
      sessionStorage.setItem("userAdminId", data.userAdminId);
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard"); // Aquí la redirección
    } catch (err) {
      let errorMessage = "Error crítico. Contacta al soporte técnico.";

      if (err instanceof TypeError) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = `Error de conexión:
          1. Verifica que el servidor esté corriendo
          2. Asegúrate que el puerto 8080 esté accesible
          3. Revisa la configuración CORS del servidor`;
        } else if (err.message.includes("aborted due to timeout")) {
          errorMessage = "Timeout: El servidor no respondió en 5 segundos";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-sm">
        {/* Columna izquierda - Formulario */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Acceso Administrativo
            </h1>
            <p className="text-gray-500 text-sm">
              Gestión de contenido y usuarios
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <FiAlertCircle className="flex-shrink-0" />
              <span className="text-sm whitespace-pre-line">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/50 transition-all placeholder-gray-400 disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/50 transition-all placeholder-gray-400 disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-3.5 px-6 rounded-lg font-medium transition-all duration-300 shadow-sm relative`}
            >
              <div className="flex items-center justify-center gap-2">
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                )}
                <span>Iniciar Sesión</span>
              </div>
            </button>
          </form>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="flex-1 bg-gradient-to-br from-green-500 to-green-600 hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="./gestor-img.webp"
              alt="Seguridad"
              className="h-full w-full object-cover animate-float"
              style={{
                objectPosition: "center center",
                minWidth: "100%",
                minHeight: "100%",
                maxWidth: "none",
                maxHeight: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
