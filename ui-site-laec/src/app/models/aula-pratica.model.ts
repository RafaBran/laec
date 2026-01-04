export interface Grupo {
  grupoId: number;
  turmaId: number;
  numeroGrupo: number;
  nomeGrupo: string;
  prioridadeAtual: number;
  totalFaltas: number;
  totalPrimeiroTurno: number;
  totalSegundoTurno: number;
  ultimaPosicao: number | null;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrupoAula {
  grupoAulaId: number;
  grupoId: number;
  numeroGrupo: number;
  nomeGrupo: string;
  turno: number;
  ordemExecucao: number;
  presente: boolean | null;
  horarioInicio?: string;
  horarioFim?: string;
  observacoes?: string;
}

export interface AulaPratica {
  aulaId: number;
  turmaId: number;
  dataAula: string;
  numeroAula: number;
  tema: string;
  procedimento: string;
  nomeProcedimento?: string;  // Campo adicional que pode vir do backend
  observacoes?: string;
  gruposParticipantes: GrupoAula[];
  totalGruposPrimeiroTurno: number;
  totalGruposSegundoTurno: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrioridadeGrupo {
  grupoId: number;
  numeroGrupo: number;
  nomeGrupo: string;
  prioridadeAtual: number;
  turnoSugerido: number;
  ordemSugerida: number;
  motivoPrioridade: string;
}

export interface PrioridadeGrupos {
  turmaId: number;
  gruposOrdenados: PrioridadeGrupo[];
  explicacao: string;
}

// Utilitários
export class AulaUtils {
  static formatarData(data: string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  static formatarDataCurta(data: string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  static getGruposPorTurno(aula: AulaPratica, turno: number): GrupoAula[] {
    return aula.gruposParticipantes
      .filter(g => g.turno === turno)
      .sort((a, b) => a.ordemExecucao - b.ordemExecucao);
  }

  static contarPresentes(aula: AulaPratica): number {
    return aula.gruposParticipantes.filter(g => g.presente === true).length;
  }

  static contarFaltas(aula: AulaPratica): number {
    return aula.gruposParticipantes.filter(g => g.presente === false).length;
  }
}
