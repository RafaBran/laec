export interface Turma {
  turmaId: number;
  ano: number;
  semestre: 'primeiro' | 'segundo';
  turno: 'matutino' | 'vespertino' | 'noturno';
  unidade: 'bueno' | 'perimetral';
  diaSemana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';
  nomeTurma: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TurmaAgrupada {
  ano: number;
  semestre: 'primeiro' | 'segundo';
  turmas: Turma[];
}

export interface TurmaDisplay {
  id: number;
  codigo: string;
  nome: string;
  unidade: string;
  turno: string;
  dia_semana: string;
  ano: number;
  semestre: string;
}

// Funções auxiliares para formatação
export class TurmaUtils {
  static formatarSemestre(semestre: string): string {
    return semestre === 'primeiro' ? '1º Semestre' : '2º Semestre';
  }

  static formatarTurno(turno: string): string {
    const turnos: Record<string, string> = {
      'matutino': 'Matutino',
      'vespertino': 'Vespertino',
      'noturno': 'Noturno'
    };
    return turnos[turno] || turno;
  }

  static formatarUnidade(unidade: string): string {
    const unidades: Record<string, string> = {
      'bueno': 'Bueno',
      'perimetral': 'Perimetral'
    };
    return unidades[unidade] || unidade;
  }

  static formatarDiaSemana(dia: string): string {
    const dias: Record<string, string> = {
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira'
    };
    return dias[dia] || dia;
  }

  static gerarCodigoTurma(turma: Turma): string {
    const semestreNum = turma.semestre === 'primeiro' ? '1' : '2';
    const turnoLetra = turma.turno.charAt(0).toUpperCase();
    return `LAB-${turma.ano}-${semestreNum}-${turnoLetra}`;
  }

  static converterParaDisplay(turma: Turma): TurmaDisplay {
    return {
      id: turma.turmaId,
      codigo: this.gerarCodigoTurma(turma),
      nome: turma.nomeTurma,
      unidade: this.formatarUnidade(turma.unidade),
      turno: this.formatarTurno(turma.turno),
      dia_semana: this.formatarDiaSemana(turma.diaSemana),
      ano: turma.ano,
      semestre: this.formatarSemestre(turma.semestre)
    };
  }
}
