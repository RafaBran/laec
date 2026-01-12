import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  username: string;
  tipo: string;
  ativo: boolean;
  telefone?: string;
  curso?: string;
  periodo?: string;
  grupoId?: number;
  numeroGrupo?: number;
  nomeGrupo?: string;
  nomeTurma?: string;
  fotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  username: string;
  senha: string;
  tipo: string;
  telefone?: string;
  curso?: string;
  periodo?: string;
  fotoUrl?: string;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  username?: string;
  senha?: string;
  tipo?: string;
  telefone?: string;
  curso?: string;
  periodo?: string;
  fotoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  buscarPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }

  listarPorTipo(tipo: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  criar(usuario: CreateUsuarioDTO): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  atualizar(id: number, usuario: UpdateUsuarioDTO): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  desativar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/desativar`, {});
  }

  ativar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/ativar`, {});
  }
}
