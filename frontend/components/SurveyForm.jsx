"use client";

import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { createSurvey } from "../services/api";
import { useFormFeedback } from "@/components/hooks/useFormFeedback";
import MessageForm from "@/components/MessageForm";
import Link from "next/link";

export default function SurveyForm() {
  const {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
  } = useFormFeedback();  
  
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
      startLoading();      
      await createSurvey(survey);
      showSuccess("Pesquisa criada!");
      console.log(survey)
    } catch (err) {
      showError(err.message);
    } finally {
      stopLoading();
    }
  };
  
  return (
    <div style={{ width: "285px", marginLeft: "28px", fontFamily: "system-ui" }}>
      <h2>Crie nova pesquisa</h2>

      <MessageForm error={error} success={success} />

      <label htmlFor="title">Título:</label><br />
      <input id="title" name="title" style={{ width: "100%" }} placeholder="Título" value={survey.title} onChange={(e) => setSurvey({ ...survey, title: e.target.value })} /><br />

      <label htmlFor="description">Descrição:</label><br />
      <textarea id="description" name="description" placeholder="Descrição" rows="4" style={{ width: "100%", fontFamily: "system-ui" }} value={survey.description} onChange={(e) => setSurvey({ ...survey, description: e.target.value })} /><br />

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

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
     
      <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "24px" }}>
        <Link href="/dashboard">Voltar ao painel</Link>
      </div>
      
    </div>
  );
}
