"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  async function login() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
  }

  return (
    <div style={{ width: "177px" }}>
      <h2>Login</h2>
      <div>
        <div>
          <label htmlFor="email">E-mail:</label><br />
          <input id="email" name="email" required onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="code">Código:</label><br />
          <input id="code" name="code" required onChange={(e) => setCode(e.target.value)} placeholder="código" /><br />
        </div>
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button onClick={login}>Entrar</button>
        </div>
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <a href="#">Obter código</a><br />
          <a href="#">Registrar-se</a>
        </div>
      </div>
    </div>
  );
}
