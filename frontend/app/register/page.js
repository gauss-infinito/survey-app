"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/services/api";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");  

  const {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
  } = useFormFeedback();

  async function register() {
    if (loading) return;
    
    if (!email || !age || !gender) {
      showError("Preencha todos os campos");
      return;
    }

    try {
      startLoading();

      const res = await fetch(`${API_URL}/auth/register`, {
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

      setGeneratedCode(data.code);

      showSuccess("Se os dados estiverem corretos, você receberá um código");
      
    } catch (err) {
      console.error(err);
      showError("Erro de conexão");
    } finally {
      stopLoading();
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(generatedCode);
    showSuccess("Código copiado!");
  }

  return (
    <div className="w-285 ml-lg font-system">
      <h2>Crie a sua conta</h2>

      <MessageForm error={error} success={success} />

      <div>
        <label htmlFor="email">E-mail:</label><br />
        <input
          id="email"
          type="email"
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
        <button onClick={register} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>

      {generatedCode && (
        <div className="mt-md text-center">
          <strong>Guarde o seu código:</strong><br />
          <span>{generatedCode}</span><br /><br />
          <button onClick={copyCode}>Copiar</button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link href="/login">Volte ao login</Link>
      </div>
    </div>
  );
}
