"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/services/api";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveredCode, setRecoveredCode] = useState("");

  const {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
  } = useFormFeedback();

  async function recover() {
    if (!email || !age || !gender) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, age, gender }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro na recuperação");
        return;
      }

      setRecoveredCode(data.code);

    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(recoveredCode);
    alert("Código copiado!");
  }

  return (
    <div style={{ width: "285px", marginLeft: "28px", fontFamily: "system-ui" }}>
      <h2>Recupere seu código</h2>

      <MessageForm error={error} success={success} />
  
      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="email"
          style={{ width: "100%" }}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Idade:</label><br />
        <input type="radio" name="age" value="young" onChange={(e) => setAge(e.target.value)} /> Jovem: 18 a 20 anos<br />
        <input type="radio" name="age" value="adult" onChange={(e) => setAge(e.target.value)} /> Adulto(a): 21 a 59 anos<br />
        <input type="radio" name="age" value="elderly" onChange={(e) => setAge(e.target.value)} /> Idoso(a): 60 anos ou mais<br />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Gênero:</label><br />
        <input type="radio" name="gender" value="cis-woman" onChange={(e) => setGender(e.target.value)} /> Mulher cis<br />
        <input type="radio" name="gender" value="trans-woman" onChange={(e) => setGender(e.target.value)} /> Mulher trans<br />
        <input type="radio" name="gender" value="cis-man" onChange={(e) => setGender(e.target.value)} /> Homem cis<br />
        <input type="radio" name="gender" value="trans-man" onChange={(e) => setGender(e.target.value)} /> Homem trans<br />
        <input type="radio" name="gender" value="non-binary" onChange={(e) => setGender(e.target.value)} /> Não-binário<br />
      </div>

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button onClick={recover} disabled={loading}>
          {loading ? "Recuperando..." : "Recuperar"}
        </button>
      </div>

      {/* resultado */}
      {recoveredCode && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <strong>Seu novo código:</strong><br />
          <span>{recoveredCode}</span><br /><br />
          <button onClick={copyCode}>Copiar</button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link href="/login">Voltar ao login</Link>
      </div>
    </div>
  );
}
