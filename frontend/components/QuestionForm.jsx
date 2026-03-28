import OptionForm from "./OptionForm";
import { useState } from "react";

export default function QuestionForm({ question, onChange, onRemove }) {
  const addOption = () => {
    onChange({
      ...question,
      options: [...question.options, { text: "" }],
    });
  };

  const updateOption = (index, newOption) => {
    const updated = [...question.options];
    updated[index] = newOption;
    onChange({ ...question, options: updated });
  };

  const removeOption = (index) => {
    const updated = question.options.filter((_, i) => i !== index);
    onChange({ ...question, options: updated });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <input
        type="text"
        placeholder="Pergunta"
        value={question.text}
        onChange={(e) =>
          onChange({ ...question, text: e.target.value })
        }
        style={{ width: "100%", marginBottom: 10 }}
      />

      <div>
        {question.options.map((opt, i) => (
          <OptionForm
            key={i}
            option={opt}
            onChange={(newOpt) => updateOption(i, newOpt)}
            onRemove={() => removeOption(i)}
          />
        ))}
      </div>

      <button onClick={addOption}>+ Adicionar opção</button>
      <button onClick={onRemove} style={{ marginLeft: 10 }}>
        Remover questão
      </button>
    </div>
  );
}
