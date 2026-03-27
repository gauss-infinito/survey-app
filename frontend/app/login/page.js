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
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
