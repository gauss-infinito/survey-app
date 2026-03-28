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
      questions: [
        ...survey.questions,
        { text: "", options: [] },
      ],
    });
  };

  const updateQuestion = (index, newQuestion) => {
    const updated = [...survey.questions];
    updated[index] = newQuestion;
    setSurvey({ ...survey, questions: updated });
  };

  const removeQuestion = (index) => {
    const updated = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSurvey(survey);
      alert("Pesquisa criada com sucesso!");
      setSurvey({ title: "", description: "", questions: [] });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Pesquisa</h2>

      <input
        type="text"
        placeholder="Título"
        value={survey.title}
        onChange={(e) =>
          setSurvey({ ...survey, title: e.target.value })
        }
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Descrição"
        value={survey.description}
        onChange={(e) =>
          setSurvey({ ...survey, description: e.target.value })
        }
        style={{ width: "100%", marginBottom: 10 }}
      />

      <h3>Questões</h3>

      {survey.questions.map((q, i) => (
        <QuestionForm
          key={i}
          question={q}
          onChange={(newQ) => updateQuestion(i, newQ)}
          onRemove={() => removeQuestion(i)}
        />
      ))}

      <button type="button" onClick={addQuestion}>
        + Adicionar questão
      </button>

      <br /><br />

      <button type="submit">Salvar Pesquisa</button>
    </form>
  );
}
