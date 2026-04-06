"use client";

export default function FormMessage({ error, success }) {
  if (!error && !success) return null;

  return (
    <div className={`alert mb-md ${error ? "alert-error" : "alert-success"}`}>
      {error || success}
    </div>
  );
}
