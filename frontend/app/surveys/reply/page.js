"use client";

import { useState } from "react";
import { API_URL } from "@/services/api";

export default function ReplySurvey() {
  const [surveyId, setSurveyId] = useState("");
  const [answer, setAnswer] = useState("");

  async function sendReply() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/surveys/${surveyId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answer }),
    });

    if (res.ok) {
      alert("Resposta enviada!");
      setAnswer("");
    }
  }

  return (
    <div>
      <h2>Responder Survey</h2>
      <input
        placeholder="ID do survey"
        value={surveyId}
        onChange={(e) => setSurveyId(e.target.value)}
      />
      <textarea
        placeholder="Resposta"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={sendReply}>Enviar</button>
    </div>
  );
}
