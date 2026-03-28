"use client";

import OptionForm from "./OptionForm";

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
      />

      {question.options.map((opt, i) => (
        <OptionForm
          key={i}
          option={opt}
          onChange={(newOpt) => updateOption(i, newOpt)}
          onRemove={() => removeOption(i)}
        />
      ))}

      <button onClick={addOption}>+ Opção</button>
      <button onClick={onRemove}>Remover questão</button>
    </div>
  );
}
