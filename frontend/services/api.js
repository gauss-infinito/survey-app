export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://survey-api-flaviacb-dev.apps.rm1.0a51.p1.openshiftapps.com";

export async function createSurvey(data) {
  const res = await fetch(`${API_URL}/surveys`, {
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
