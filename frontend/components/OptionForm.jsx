"use client";

export default function OptionForm({ option, onChange, onRemove }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
      <input
        type="text"
        placeholder="Texto da opção"
        value={option.text}
        style={{ width: "75%" }}
        onChange={(e) => onChange({ ...option, text: e.target.value })}
      />
      <button onClick={onRemove}>Remover</button>
    </div>
  );
}
