const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5173";

export interface GroupTripLoginRequest {
  authKey: string;
  password: string;
}

export interface GroupTripLoginResponse {
  id: number;
  groupName: string;
  email: string;
}

export interface CreateGroupTripRequest {
  groupName: string;
  pax: number;
  email: string;
  password: string;
  members: string[];
}

export interface CreateGroupTripResponse {
  id: number;
  groupName: string;
  email: string;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

export const groupTripApi = {
  login: (data: GroupTripLoginRequest) =>
    request<GroupTripLoginResponse>("/api/users/group/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: CreateGroupTripRequest) =>
    request<CreateGroupTripResponse>("/api/users/group/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
