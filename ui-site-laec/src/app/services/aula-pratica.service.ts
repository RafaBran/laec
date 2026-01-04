import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AulaPratica, Grupo, PrioridadeGrupos } from '../models/aula-pratica.model';

@Injectable({
  providedIn: 'root'
})
export class AulaPraticaService {
  private readonly API_URL = '/api/aulas';
  private readonly GRUPOS_URL = '/api/grupos';

  constructor(private http: HttpClient) {}

  // Aulas Práticas
  getAulasByTurma(turmaId: number): Observable<AulaPratica[]> {
    return this.http.get<AulaPratica[]>(`${this.API_URL}/turma/${turmaId}`);
  }

  getAulaById(id: number): Observable<AulaPratica> {
    return this.http.get<AulaPratica>(`${this.API_URL}/${id}`);
  }

  criarAula(aula: Partial<AulaPratica>): Observable<AulaPratica> {
    return this.http.post<AulaPratica>(this.API_URL, aula);
  }

  alocarGruposAutomaticamente(aulaId: number): Observable<AulaPratica> {
    return this.http.post<AulaPratica>(`${this.API_URL}/${aulaId}/alocar-grupos`, {});
  }

  concluirAula(aulaId: number): Observable<AulaPratica> {
    return this.http.put<AulaPratica>(`${this.API_URL}/${aulaId}/concluir`, {});
  }

  marcarPresenca(grupoAulaId: number, presente: boolean): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/presenca/${grupoAulaId}?presente=${presente}`, {});
  }

  deletarAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Grupos
  getGruposByTurma(turmaId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.GRUPOS_URL}/turma/${turmaId}`);
  }

  getPrioridadeParaProximaAula(turmaId: number): Observable<PrioridadeGrupos> {
    return this.http.get<PrioridadeGrupos>(`${this.GRUPOS_URL}/turma/${turmaId}/prioridade`);
  }

  criarGrupo(grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.post<Grupo>(this.GRUPOS_URL, grupo);
  }

  deletarGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.GRUPOS_URL}/${id}`);
  }
}
