export async function createSurvey(data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surveys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar pesquisa");
  }

  return res.json();
}
