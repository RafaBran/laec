import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from '../models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private readonly API_URL = '/api/grupos';

  constructor(private http: HttpClient) {}

  /**
   * Buscar todos os grupos
   */
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.API_URL);
  }

  /**
   * Buscar grupos por turma
   */
  getGruposByTurma(turmaId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.API_URL}/turma/${turmaId}`);
  }

  /**
   * Buscar grupo por ID
   */
  getGrupoById(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.API_URL}/${id}`);
  }

  /**
   * Criar novo grupo
   */
  createGrupo(grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.post<Grupo>(this.API_URL, grupo);
  }

  /**
   * Atualizar grupo existente
   */
  updateGrupo(id: number, grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.API_URL}/${id}`, grupo);
  }

  /**
   * Excluir grupo
   */
  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Ativar/Desativar grupo
   */
  toggleAtivo(id: number, ativo: boolean): Observable<Grupo> {
    return this.http.patch<Grupo>(`${this.API_URL}/${id}/ativo`, { ativo });
  }
}
