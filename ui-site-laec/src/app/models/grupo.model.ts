export interface Grupo {
  grupoId: number;
  turmaId: number;
  numeroGrupo: number;
  nomeGrupo: string;
  prioridadeAtual: number;
  totalFaltas: number;
  ultimaPosicao?: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
  totalPrimeiroTurno: number;
  totalSegundoTurno: number;
  // Dados da turma (pode vir do join no backend)
  turma?: {
    turmaId: number;
    nomeTurma: string;
    ano: number;
    semestre: string;
  };
}

export interface GrupoAula {
  grupoAulaId: number;
  aulaId: number;
  grupoId: number;
  turno: 1 | 2;
  ordemExecucao: number;
  presente: boolean;
  horarioInicio?: string;
  horarioFim?: string;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Funções auxiliares para formatação
export class GrupoUtils {
  static formatarTurno(turno: number): string {
    return turno === 1 ? '1º Turno' : '2º Turno';
  }

  static getTotalAulas(grupo: Grupo): number {
    return grupo.totalPrimeiroTurno + grupo.totalSegundoTurno;
  }

  static getStatusAtividade(grupo: Grupo): 'ativo' | 'inativo' {
    return grupo.ativo ? 'ativo' : 'inativo';
  }

  static formatarPrioridade(prioridade: number): string {
    return `#${prioridade}`;
  }
}
