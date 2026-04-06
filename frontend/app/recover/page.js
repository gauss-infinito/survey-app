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
    if (loading) return;

    if (!email || !age || !gender) {
      showError("Preencha todos os campos");
      return;
    }

    try {
      startLoading();

      const res = await fetch(`${API_URL}/auth/recover`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, age, gender }),
      });

      if (!res.ok) {
        console.error("Erro backend:", await res.text());
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setRecoveredCode(data.code);
      
      showSuccess("Se os dados estiverem corretos, você receberá um código");

    } catch (err) {
      console.error(err);
      showError("Erro de conexão");
    } finally {
      stopLoading();
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(recoveredCode);
    showSuccess("Código copiado!");
  }
  
  return (
    <div className="w-285 ml-lg font-system">
      <h2>Recupere o seu código</h2>

      <MessageForm error={error} success={success} />
  
      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="email"
          className="w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mt-sm">
        <label>Idade:</label><br />
        <input type="radio" name="age" value="young" onChange={(e) => setAge(e.target.value)} /> Jovem: 18 a 20 anos<br />
        <input type="radio" name="age" value="adult" onChange={(e) => setAge(e.target.value)} /> Adulto(a): 21 a 59 anos<br />
        <input type="radio" name="age" value="elderly" onChange={(e) => setAge(e.target.value)} /> Idoso(a): 60 anos ou mais<br />
      </div>

      <div className="mt-sm">
        <label>Gênero:</label><br />
        <input type="radio" name="gender" value="cis-woman" onChange={(e) => setGender(e.target.value)} /> Mulher cis<br />
        <input type="radio" name="gender" value="trans-woman" onChange={(e) => setGender(e.target.value)} /> Mulher trans<br />
        <input type="radio" name="gender" value="cis-man" onChange={(e) => setGender(e.target.value)} /> Homem cis<br />
        <input type="radio" name="gender" value="trans-man" onChange={(e) => setGender(e.target.value)} /> Homem trans<br />
        <input type="radio" name="gender" value="non-binary" onChange={(e) => setGender(e.target.value)} /> Não-binário<br />
      </div>

      <div className="text-center mt-xl">
        <button onClick={recover} disabled={loading}>
          {loading ? "Recuperando..." : "Recuperar"}
        </button>
      </div>

      {/* resultado */}
      {recoveredCode && (
        <div className="mt-md text-center">
          <strong>Seu novo código:</strong><br />
          <span>{recoveredCode}</span><br /><br />
          <button onClick={copyCode}>Copiar</button>
        </div>
      )}
          
      <div className="text-center mt-lg">
        <Link href="/login">Voltar ao login</Link>
      </div>
    </div>
  );
}
