export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'professor' | 'tecnico' | 'aluno';
  curso?: string;
  periodo?: string;
  telefone?: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  nome: string;
  id: number;
  email: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'professor' | 'tecnico' | 'aluno';
  curso?: string;
  periodo?: string;
  telefone?: string;
}
