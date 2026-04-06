"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/api";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();
  
  const {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
  } = useFormFeedback();

  async function login() {
    if (loading) return;
    
    if (!email || !code) {
      showError("Preencha e-mail e código");
      return;
    }

    try {
      startLoading();

      const data = await loginRequest({ email, code });

      if (!data?.token) {
        throw new Error("Credenciais inválidas");
      }

      localStorage.setItem("token", data.token);

      showSuccess("Login realizado com sucesso"); 
      
      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      showError(err.message || "Erro de conexão");
    } finally {
      stopLoading();
    }
  }

  return (
    <div className="w-285 ml-lg font-system">
      <h2>Acesse a sua conta</h2>

      <MessageForm error={error} success={success} />

      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          type="email"
          required
          placeholder="email"
          className="w-full"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
      </div>

      <div className="mt-sm">
        <label htmlFor="code">Código:</label><br />
        <input
          id="code"
          required
          placeholder="código"
          className="w-full"
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
      </div>

      <div className="text-center mt-xl">
        <button onClick={login} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      <div className="text-center mt-lg">
        <Link href="/recover">Recupere o seu código</Link><br />
        <Link href="/register">Registre-se agora mesmo</Link>
      </div>
    </div>
  );
}
