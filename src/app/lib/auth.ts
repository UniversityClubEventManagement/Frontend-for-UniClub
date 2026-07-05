import { apiFetch } from "./api";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: string;
  faculty?: string;
  department?: string;
  academicYear?: string;
  clubName?: string;
};

export async function loginRequest(data: LoginData) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerRequest(data: RegisterData) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMe() {
  return apiFetch("/api/auth/me");
}
