"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/services/api";
import Link from "next/link";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // carregar dashboard
    fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData);

    // carregar surveys
    fetch(`${API_URL}/surveys`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSurveys);

    // carregar usuário
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!data) return <p>Carregando...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>

      {/* usuário */}
      {user && (
        <div style={{ marginBottom: "20px" }}>
          <strong>{user.email}</strong>
          <p>{user.age} | {user.gender}</p>
        </div>
      )}

      {/* métricas */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Surveys</h3>
          <p>{data.totalSurveys}</p>
        </div>
        <div>
          <h3>Respostas</h3>
          <p>{data.totalResponses}</p>
        </div>
      </div>

      {/* ações */}
      <div style={{ marginTop: "20px" }}>
        <Link href="/surveys/create">Criar Survey</Link><br />
        <Link href="/surveys/view">Ver Surveys</Link><br />
        <Link href="/surveys/reply">Responder Survey</Link>
      </div>

      {/* lista */}
      <div style={{ marginTop: "30px" }}>
        <h2>Seus Surveys</h2>

        {surveys.map((s) => (
          <div key={s.id} style={{ marginBottom: "10px" }}>
            <strong>{s.title}</strong>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
