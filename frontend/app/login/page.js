"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !code) {
      alert("Preencha e-mail e código");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro no login");
        return;
      }

      localStorage.setItem("token", data.token);

      // opcional: redirecionar
      // window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "285px", marginLeft: "28px", fontFamily: "system-ui" }}>
      <h2>Login</h2>

      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          name="email"
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
          name="code"
          required
          style={{ width: "100%" }}
          placeholder="código"
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
