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
  
    async function load() {
      try {
        // dashboard
        const dashRes = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const dashText = await dashRes.text();
        console.log("Dashboard:", dashText);
        
        const dashData = JSON.parse(dashText);
  
        // surveys
        const surveyRes = await fetch(`${API_URL}/surveys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const surveyText = await surveyRes.text();
        console.log("Surveys:", surveyText);
        
        const surveyData = JSON.parse(surveyText);
  
        // user
        const userRes = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const userText = await userRes.text();
        console.log("User:", userText);
        
        const userData = JSON.parse(userText);
  
        setData(dashData);
        setSurveys(surveyData);
        setUser(userData);
  
      } catch (err) {
        console.error("Erro no dashboard:", err);
      }
    }
  
    load();
  }, []);
  
  if (!data) return <p>Carregando...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h2>Painel de controle</h2>

      {/* usuário */}
      {user && (
        <div style={{ marginBottom: "20px" }}>
          <strong>{user.email}</strong><br />
          <span
            style={{
              margin: "0 17px 0 0",
              padding: "0 20px 0 0",
              lineHeight: "42px",
              borderRightColor: "rgba(0, 0, 0, 0.3)",
              borderRightStyle: "solid",
              borderRightWidth: "1px"
            }}
          >
            {user.age}
          </span>
          
          <span style={{ lineHeight: "42px" }}>
            {user.gender}
          </span>
        </div>
      )}

      {/* métricas */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Pesquisas</h3>
          <span style={{ textAlign: "center", fontSize: "24px", fontWeight: "350" }}>
            {data.totalSurveys}
          </span>
        </div>
        <div>
          <h3>Respostas</h3>
          <span style={{ textAlign: "center", fontSize: "24px", fontWeight: "350" }}>
            {data.totalResponses}
          </span>
        </div>
        <div>
          <h3>Participação</h3>
          <span style={{ textAlign: "center", fontSize: "24px", fontWeight: "350" }}>
            {data.myTotalResponses}
          </span>
        </div>
      </div>

      {/* ações */}
      <div style={{ marginTop: "20px" }}>
        <Link href="/surveys/create">Criar nova pesquisa</Link><br />
        <Link href="/surveys/view">Visualizar pesquisas</Link><br />
        <Link href="/surveys/reply">Responder pesquisas</Link>
      </div>

      {/* lista */}
      <div style={{ marginTop: "30px" }}>
        <h3>Minhas pesquisas ({data.myTotalSurveys})</h3>

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
