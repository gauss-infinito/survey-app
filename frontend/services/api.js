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
    throw new Error(data?.error || data?.message || "Erro na requisição");
  }

  return data;
}

export async function loginRequest({ email, code }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  return handleResponse(res);
}

export async function createSurvey(data) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/surveys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function recoverRequest({ email, age, gender }) {
  const res = await fetch(`${API_URL}/recover`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, age, gender }),
  });

  return handleResponse(res);
}
