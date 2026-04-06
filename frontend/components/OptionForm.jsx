"use client";

export default function OptionForm({ option, onChange, onRemove }) {
  return (
    <div className="flex gap-xs mb-xs">
      <input
        type="text"
        placeholder="Texto da opção"
        value={option.text}
        className="w-72"
        onChange={(e) => onChange({ ...option, text: e.target.value })}
      />
      <button onClick={onRemove}>Remover</button>
    </div>
  );
}
