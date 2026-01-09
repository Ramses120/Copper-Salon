"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateAdmin = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/create-admin", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Admin creado/actualizado exitosamente!\n\nEmail: ${data.credentials.email}\nContraseña: ${data.credentials.password}`
        );
      } else {
        setError(`❌ Error: ${data.error}\n${data.details}`);
      }
    } catch (err) {
      setError(`❌ Error de conexión: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/diagnose");
      const data = await response.json();

      if (response.ok) {
        setMessage(`📊 Diagnóstico:\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        setError(`❌ Error: ${data.error}\n${data.details}`);
      }
    } catch (err) {
      setError(`❌ Error de conexión: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-copper-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
              Configurar Administrador
            </h1>
            <p className="text-gray-600 text-sm">Copper Beauty Salon & Spa</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Procesando..." : "🔍 Diagnosticar Sistema"}
            </Button>

            <Button
              onClick={handleCreateAdmin}
              disabled={loading}
              variant="copper"
              className="w-full"
            >
              {loading ? "Procesando..." : "✨ Crear/Actualizar Admin"}
            </Button>
          </div>

          {message && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 whitespace-pre-wrap font-mono">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                {error}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3">Credenciales por defecto:</p>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs">
              <p className="text-gray-900">
                <strong>Email:</strong> admin@yourdomain.com
              </p>
              <p className="text-gray-900">
                <strong>Contraseña:</strong> admin123@
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              → Ir al Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
