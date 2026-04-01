export default function FormMessage({ error, success }) {
  if (!error && !success) return null;

  return (
    <div
      style={{
        marginBottom: "12px",
        fontSize: "14px",
        padding: "8px",
        borderRadius: "4px",
        background: error ? "#ffe6e6" : "#e6ffed",
        color: error ? "#b00020" : "#056b3b",
      }}
    >
      {error || success}
    </div>
  );
}
