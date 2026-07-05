const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("authToken");

const buildHeaders = (headers = {}) => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(options.headers as Record<string, string>),
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || "API request failed";
    throw new Error(errorMessage);
  }

  return data;
}
