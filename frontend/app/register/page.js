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
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("respondent");

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
        <label htmlFor="email">E-mail:</label><br />
        <input id="email" name="email" onChange={(e) => setEmail(e.target.value)} type="email" x-moz-errormessage="Por favor, especifique um endereço de e-mail." placeholder="email" />
      </div>

      {/* código agora automático */}
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="code">Código gerado:</label><br />
        <input id="code" name="code" value={code} readOnly />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="age">Idade:</label><br />
        <input id="age1" name="age" type="radio" value="young" onChange={(e) => setAge(e.target.value)} /> Jovem: 18 a 20 anos<br />
        <input id="age2" name="age" type="radio" value="adult" onChange={(e) => setAge(e.target.value)} /> Adulto: 21 a 59 anos<br />
        <input id="age3" name="age" type="radio" value="elderly" onChange={(e) => setAge(e.target.value)} /> Idoso: 60 anos ou mais<br />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="gender">Gênero:</label><br />
        <input id="gender1" name="gender" type="radio" value="cis-woman" onChange={(e) => handleGenderChange(e.target.value)} /> Mulher cis<br />
        <input id="gender2" name="gender" type="radio" value="trans-woman" onChange={(e) => handleGenderChange(e.target.value)} /> Mulher trans<br />
        <input id="gender3" name="gender" type="radio" value="cis-man" onChange={(e) => handleGenderChange(e.target.value)} /> Homem cis<br />
        <input id="gender4" name="gender" type="radio" value="trans-man" onChange={(e) => handleGenderChange(e.target.value)} /> Homem trans<br />
        <input id="gender5" name="gender" type="radio" value="non-binary" onChange={(e) => handleGenderChange(e.target.value)} /> Não-binário<br />
      </div>

      <button onClick={register} style={{ textAlign: "center", marginTop: "28px" }}>
        Salvar
      </button>
    </div>
  );
}
