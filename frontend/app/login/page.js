"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
  }

  return (
    <div style={{ width: "186px" }}>
      <h2>Login</h2>
      <div>
        <div>
          <label htmlFor="email">E-mail:</label><br />
          <input id="email" name="email" required onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="password">Senha:</label><br />
          <input id="password" name="password" required onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" /><br />
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={login}>Entrar</button>
        </div>
      </div>
    </div>
  );
}
