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
    <div className="w-271">
      <label>Perguntas:</label><br />
      <div className="input w-full mb-sm">
        <div>
          <input id="multiple" name="multiple" type="checkbox" checked={question.multiple || false} onChange={(e) => onChange({ ...question, multiple: e.target.checked })} />
          <label htmlFor="multiple">Múltipla seleção</label><br />
          <label htmlFor="question">Pergunta:</label><br />
          <input type="text" id="question" name="question" className="w-98" placeholder="Pergunta" value={question.text} onChange={(e) => onChange({ ...question, text: e.target.value })} />
        </div>   
      
        <div className="mt-sm">
          {question.options.map((opt, i) => (
            <OptionForm
              key={i}
              option={opt}
              onChange={(newOpt) => updateOption(i, newOpt)}
              onRemove={() => removeOption(i)}
            />
          ))}
        </div>          

        <div className="text-center mt-xl">
          <button onClick={addOption}>+ Opção</button> &ensp;
          <button onClick={onRemove}>Remover questão</button>
        </div>
      </div>
    </div>
  );
}
