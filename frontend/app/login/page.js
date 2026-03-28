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
    <div>
      <h2>Login</h2>
      <label for="email">E-mail</label><br>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" id="email" name="email" required /><br>
      <label for="password">Senha</label><br>
      <input onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" id="password" name="password" required /><br>
      <button onClick={login}>Entrar</button>
    </div>
  );
}
