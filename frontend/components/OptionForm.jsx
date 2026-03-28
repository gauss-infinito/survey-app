export default function OptionForm({ option, onChange, onRemove }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
      <input
        type="text"
        placeholder="Texto da opção"
        value={option.text}
        onChange={(e) => onChange({ ...option, text: e.target.value })}
      />
      <button onClick={onRemove}>Remover</button>
    </div>
  );
}
