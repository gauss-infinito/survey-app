export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://survey-api-flaviacb-dev.apps.rm1.0a51.p1.openshiftapps.com";

async function handleResponse(res) {
  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || "Erro na requisição";
    throw new Error(message);
  }

  return data;
}

export async function createSurvey(data) {
  const res = await fetch(`${API_URL}/surveys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
