"use client";

export default function PublicSurvey({ params }) {
  async function send() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/surveys/public/${params.id}/respond`,
      {
        method: "POST",
        body: JSON.stringify({
          answers: { q1: "sim" },
        }),
      }
    );
  }

  return (
    <div>
      <h1>Responder Pesquisa</h1>
      <button onClick={send}>Enviar</button>
    </div>
  );
}
