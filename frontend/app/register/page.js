"use client";

import { useEffect, useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // gera o código automaticamente ao carregar
  useEffect(() => {
    setCode(generateCode());
  }, []);

  async function register() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, age, gender }),
    });
  
    const data = await res.json();
  
    localStorage.setItem("token", data.token);
  
    alert(`Guarde seu código: ${data.code}`);
  }
  
  return (
    <div style={{ width: "177px", marginLeft: "28px" }}>
      <h2>Registre-se</h2>

      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input id="email" name="email" onChange={(e) => setEmail(e.target.value)} type="email" x-moz-errormessage="Por favor, especifique um endereço de e-mail." placeholder="email" />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="age">Idade:</label><br />
        <input id="age1" name="age" type="radio" value="young" onChange={(e) => setAge(e.target.value)} /> Jovem: 18 a 20 anos<br />
        <input id="age2" name="age" type="radio" value="adult" onChange={(e) => setAge(e.target.value)} /> Adulto: 21 a 59 anos<br />
        <input id="age3" name="age" type="radio" value="elderly" onChange={(e) => setAge(e.target.value)} /> Idoso: 60 anos ou mais<br />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="gender">Gênero:</label><br />
        <input id="gender1" name="gender" type="radio" value="cis-woman" onChange={(e) => setGender(e.target.value)} /> Mulher cis<br />
        <input id="gender2" name="gender" type="radio" value="trans-woman" onChange={(e) => setGender(e.target.value)} /> Mulher trans<br />
        <input id="gender3" name="gender" type="radio" value="cis-man" onChange={(e) => setGender(e.target.value)} /> Homem cis<br />
        <input id="gender4" name="gender" type="radio" value="trans-man" onChange={(e) => setGender(e.target.value)} /> Homem trans<br />
        <input id="gender5" name="gender" type="radio" value="non-binary" onChange={(e) => setGender(e.target.value)} /> Não-binário<br />
      </div>

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button onClick={register}>Salvar</button>
      </div>
    </div>
  );
}



