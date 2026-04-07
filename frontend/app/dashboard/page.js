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
  
  if (!data) return <div className="w-285 ml-lg mt-xxl font-system">Carregando...</div>;

  return (
    <div className="p-md font-system">
      <h2>Painel de controle</h2>

      {/* usuário */}
      {user && (
        <div>
          <strong>{user.email}</strong><br />
          <span className="mr pr line-40 border-right">
            {user.age}
          </span>
          
          <span className="mr pr line-40 border-right">
            {user.gender}
          </span>

          <span className="line-40">
            {user.role}
          </span>            
        </div>
      )}

      {/* métricas */}
      <div className="flex gap-sm">
        <div className="column">
          <h3 className="mt-xxs">Pesquisas</h3>
          <p className="metric-value mt-0">{data.totalSurveys}</p>
        </div>
        <div className="column">
          <h3 className="mt-xxs">Respostas</h3>
          <p className="metric-value mt-0">{data.totalResponses}</p>
        </div>
        <div className="column">
          <h3 className="mt-xxs">Participação</h3>
          <p className="metric-value mt-0">{data.myTotalResponses}</p>
        </div>
      </div>

      {/* ações */}
      <div className="gap-sm">
        <h3 className="mt-xxs">Ações</h3>
        <Link href="/users">Gerenciar usuários</Link><br />        
        <Link href="/surveys/create">Criar nova pesquisa</Link><br />
        <Link href="/surveys/view">Visualizar pesquisas</Link><br />
        <Link href="/surveys/reply">Responder pesquisas</Link>
      </div>

      {/* lista */}
      <div className="gap-sm">
        <h3 className="mt-xxs">Minhas pesquisas ({data.myTotalSurveys})</h3>

        {surveys.map((s) => (
          <div key={s.id} className="mb-sm">
            <strong>{s.title}</strong>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
