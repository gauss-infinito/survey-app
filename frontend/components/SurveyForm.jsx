"use client";

import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { createSurvey } from "../services/api";

export default function SurveyForm() {
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const addQuestion = () => {
    setSurvey({
      ...survey,
      questions: [...survey.questions, { text: "", options: [] }],
    });
  };

  const updateQuestion = (index, newQuestion) => {
    const updated = [...survey.questions];
    updated[index] = newQuestion;
    setSurvey({ ...survey, questions: updated });
  };

  const removeQuestion = (index) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      await createSurvey(survey);
      alert("Pesquisa criada!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ width: "277px", marginLeft: "28px" }}>
      <h2>Crie Pesquisa</h2>

      <label htmlFor="title">Título:</label><br />
      <input id="title" name="title" placeholder="Título" value={survey.title} onChange={(e) => setSurvey({ ...survey, title: e.target.value })} /><br />

      <label htmlFor="description">Descrição:</label><br />
      <textarea id="description" name="description" placeholder="Descrição" rows="4" cols="30" value={survey.description} onChange={(e) => setSurvey({ ...survey, description: e.target.value })} /><br />

      {survey.questions.map((q, i) => (
        <QuestionForm
          key={i}
          question={q}
          onChange={(newQ) => updateQuestion(i, newQ)}
          onRemove={() => removeQuestion(i)}
        />
      ))}

      <button type="button" onClick={addQuestion}>
        + Questão
      </button>

      <br /><br />

      <button onClick={handleSubmit}>
        Salvar
      </button>
    </div>
  );
}
