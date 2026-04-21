export interface CurrentUser {
  sub: string;
  email: string;
  role: 'admin' | 'operator';
  country: string; // 'all' pour le siège, 'BR'/'EC'/'CO' pour un exploitant
}

function decodeJwt(token: string): CurrentUser | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as CurrentUser;
  } catch {
    return null;
  }
}

export function useCurrentUser(): CurrentUser | null {
  const token = localStorage.getItem('fk_token');
  if (!token) return null;
  return decodeJwt(token);
}

export const isSiege = (user: CurrentUser | null) => user?.role === 'admin';
export const isOperator = (user: CurrentUser | null) => user?.role === 'operator';
