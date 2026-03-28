"use client";

import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");  

  async function register() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
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
      <h2>Registre-se</h2>
      <div>
        <div>
          <label htmlFor="email">E-mail:</label><br />
          <input id="email" name="email" required onChange={(e) => setEmail(e.target.value)} type="email" x-moz-errormessage="Por favor, especifique um endereço de e-mail." placeholder="email" />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="code">Código:</label><br />
          <input id="code" name="code" required onChange={(e) => setCode(e.target.value)} type="text" placeholder="código" /><br />
        </div>
        <div style={{ marginTop: "10px" }}>
          <p>Idade:</p>
          <input id="age1" name="age" value="jovem" required onChange={(e) => setAge(e.target.value)} type="radio" />
          <label htmlFor="age1">Jovem - indivíduo de até 19 anos</label><br />
          <input id="age2" name="age" value="adulto" required onChange={(e) => setAge(e.target.value)} type="radio" />
          <label htmlFor="age2">Adulto - indivíduo entre 20 e 59 anos</label><br /> 
          <input id="age3" name="age" value="idoso" required onChange={(e) => setAge(e.target.value)} type="radio" />
          <label htmlFor="age3">Idoso - indivíduo de 60 anos em diante</label><br><br />
        </div>
        <div style={{ marginTop: "10px" }}>
          <p>Gênero:</p>
          <input id="gender1" name="gender1" value="wcis" required onChange={(e) => setGender(e.target.value)} type="checkbox" />
          <label htmlFor="gender1">Mulher cisgênero</label><br />
          <input id="gender2" name="gender2" value="wtrans" required onChange={(e) => setGender(e.target.value)} type="checkbox" />
          <label htmlFor="gender2">Mulher transgênero</label><br /> 
          <input id="gender3" name="gender3" value="mcis" required onChange={(e) => setGender(e.target.value)} type="checkbox" />
          <label htmlFor="gender3">Homem cisgênero</label><br />
          <input id="gender4" name="gender4" value="mtrans" required onChange={(e) => setGender(e.target.value)} type="checkbox" />
          <label htmlFor="gender4">Homem transgênero</label><br /> 
          <input id="gender5" name="gender5" value="no" required onChange={(e) => setGender(e.target.value)} type="checkbox" />
          <label htmlFor="gender5">Gênero não-binário</label><br><br />
        </div>
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button onClick={register}>Salvar</button>
          <input id="role" name="role" value="1" required onChange={(e) => setRole(e.target.value)} type="hidden" />
        </div>
      </div>
    </div>
  );
}
