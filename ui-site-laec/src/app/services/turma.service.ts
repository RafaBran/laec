import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Turma, TurmaAgrupada } from '../models/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private readonly API_URL = '/api/turmas';

  constructor(private http: HttpClient) {}

  /**
   * Buscar todas as turmas
   */
  getTurmas(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.API_URL);
  }

  /**
   * Buscar turma por ID
   */
  getTurmaById(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.API_URL}/${id}`);
  }

  /**
   * Buscar turmas por ano
   */
  getTurmasByAno(ano: number): Observable<Turma[]> {
    const params = new HttpParams().set('ano', ano.toString());
    return this.http.get<Turma[]>(this.API_URL, { params });
  }

  /**
   * Buscar turmas por ano e semestre
   */
  getTurmasByAnoSemestre(ano: number, semestre: 'primeiro' | 'segundo'): Observable<Turma[]> {
    const params = new HttpParams()
      .set('ano', ano.toString())
      .set('semestre', semestre);
    return this.http.get<Turma[]>(this.API_URL, { params });
  }

  /**
   * Buscar turmas agrupadas por ano e semestre
   */
  getTurmasAgrupadas(): Observable<TurmaAgrupada[]> {
    return this.getTurmas().pipe(
      map(turmas => this.agruparTurmas(turmas))
    );
  }

  /**
   * Buscar anos letivos disponíveis
   */
  getAnosLetivos(): Observable<number[]> {
    return this.getTurmas().pipe(
      map(turmas => {
        const anos = [...new Set(turmas.map(t => t.ano))];
        return anos.sort((a, b) => b - a); // Ordenar decrescente
      })
    );
  }

  /**
   * Criar nova turma
   */
  criarTurma(turma: Omit<Turma, 'turma_id' | 'created_at' | 'updated_at'>): Observable<Turma> {
    return this.http.post<Turma>(this.API_URL, turma);
  }

  /**
   * Atualizar turma existente
   */
  atualizarTurma(id: number, turma: Partial<Turma>): Observable<Turma> {
    return this.http.put<Turma>(`${this.API_URL}/${id}`, turma);
  }

  /**
   * Deletar turma
   */
  deletarTurma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Agrupar turmas por ano e semestre
   */
  private agruparTurmas(turmas: Turma[]): TurmaAgrupada[] {
    const grupos = new Map<string, TurmaAgrupada>();

    turmas.forEach(turma => {
      const chave = `${turma.ano}-${turma.semestre}`;
      
      if (!grupos.has(chave)) {
        grupos.set(chave, {
          ano: turma.ano,
          semestre: turma.semestre,
          turmas: []
        });
      }

      grupos.get(chave)!.turmas.push(turma);
    });

    // Converter para array e ordenar
    return Array.from(grupos.values())
      .sort((a, b) => {
        // Ordenar por ano (decrescente)
        if (a.ano !== b.ano) return b.ano - a.ano;
        // Depois por semestre (primeiro antes de segundo)
        return a.semestre === 'primeiro' ? -1 : 1;
      });
  }
}
