"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/services/api";

export default function ViewSurveys() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/surveys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSurveys);
  }, []);

  return (
    <div className="w-285 ml-lg font-system">
      <h2>Pesquisas</h2>
      {surveys.map((s) => (
        <div key={s.id}>
          <strong>{s.title}</strong>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  );
}
