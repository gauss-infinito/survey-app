"use client";

import { useEffect, useState } from "react";

function generateCode(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState([]);
  const [role, setRole] = useState("1");

  // gera o código automaticamente ao carregar
  useEffect(() => {
    setCode(generateCode());
  }, []);

  function handleGenderChange(value) {
    setGender((prev) =>
      prev.includes(value)
        ? prev.filter((g) => g !== value)
        : [...prev, value]
    );
  }

  async function register() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, age, gender, role }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
  }

  return (
    <div style={{ width: "177px" }}>
      <h2>Registre-se</h2>

      <div>
        <label>E-mail:</label><br />
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>

      {/* código agora automático */}
      <div style={{ marginTop: "10px" }}>
        <label>Código gerado:</label><br />
        <input value={code} readOnly />
      </div>

      <div style={{ marginTop: "10px" }}>
        <p>Idade:</p>
        <input type="radio" value="jovem" onChange={(e) => setAge(e.target.value)} /> Jovem<br />
        <input type="radio" value="adulto" onChange={(e) => setAge(e.target.value)} /> Adulto<br />
        <input type="radio" value="idoso" onChange={(e) => setAge(e.target.value)} /> Idoso<br />
      </div>

      <div style={{ marginTop: "10px" }}>
        <p>Gênero:</p>
        <input type="checkbox" value="wcis" onChange={(e) => handleGenderChange(e.target.value)} /> Mulher cis<br />
        <input type="checkbox" value="wtrans" onChange={(e) => handleGenderChange(e.target.value)} /> Mulher trans<br />
        <input type="checkbox" value="mcis" onChange={(e) => handleGenderChange(e.target.value)} /> Homem cis<br />
        <input type="checkbox" value="mtrans" onChange={(e) => handleGenderChange(e.target.value)} /> Homem trans<br />
        <input type="checkbox" value="no" onChange={(e) => handleGenderChange(e.target.value)} /> Não-binário<br />
      </div>

      <button onClick={register} style={{ marginTop: "20px" }}>
        Salvar
      </button>
    </div>
  );
}
