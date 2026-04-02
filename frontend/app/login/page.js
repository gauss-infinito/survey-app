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
    <div style={{ width: "285px", marginLeft: "28px", fontFamily: "system-ui" }}>
      <h2>Login</h2>

      <MessageForm error={error} success={success} />

      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          type="email"
          required
          placeholder="email"
          style={{ width: "100%" }}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="code">Código:</label><br />
        <input
          id="code"
          required
          placeholder="código"
          style={{ width: "100%" }}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button onClick={login} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link href="/recover">Recuperar código</Link><br />
        <Link href="/register">Registrar-se</Link>
      </div>
    </div>
  );
}
