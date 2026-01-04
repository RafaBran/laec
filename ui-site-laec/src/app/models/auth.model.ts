export interface LoginRequest {
  username: string;
  senha: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  nome: string;
  id: number;
  email: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
}
