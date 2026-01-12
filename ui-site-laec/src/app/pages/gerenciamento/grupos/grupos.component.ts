import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurmaService } from '../../../services/turma.service';
import { GrupoService } from '../../../services/grupo.service';
import { Turma, TurmaDisplay, TurmaUtils } from '../../../models/turma.model';
import { Grupo } from '../../../models/grupo.model';
import { ListarGruposComponent } from '../listar-grupos/listar-grupos.component';

interface TurmaUI extends TurmaDisplay {
  expanded: boolean;
}

interface Semestre {
  id: string;
  numero: number;
  tipo: 'primeiro' | 'segundo';
  descricao: string;
  expanded: boolean;
  turmas: TurmaUI[];
}

interface AnoLetivo {
  id: number;
  ano: number;
  descricao: string;
  ativo: boolean;
  expanded: boolean;
  semestres: Semestre[];
}

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, ListarGruposComponent]
})
export class GruposComponent implements OnInit {
  // Estrutura hierárquica de anos
  anos: AnoLetivo[] = [];
  
  // Turma selecionada para exibir grupos
  turmaSelecionada: TurmaUI | null = null;
  
  // Estados de carregamento
  carregandoAnos = false;

  constructor(
    private turmaService: TurmaService,
    private grupoService: GrupoService
  ) {}

  ngOnInit() {
    this.carregarAnos();
  }

  carregarAnos() {
    this.carregandoAnos = true;
    
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.anos = this.processarTurmas(turmas);
        this.carregandoAnos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar turmas:', erro);
        this.carregandoAnos = false;
        this.anos = [];
      }
    });
  }

  private processarTurmas(turmas: Turma[]): AnoLetivo[] {
    const anoMap = new Map<number, Map<string, Turma[]>>();

    turmas.forEach(turma => {
      if (!anoMap.has(turma.ano)) {
        anoMap.set(turma.ano, new Map());
      }
      
      const semestres = anoMap.get(turma.ano)!;
      if (!semestres.has(turma.semestre)) {
        semestres.set(turma.semestre, []);
      }
      
      semestres.get(turma.semestre)!.push(turma);
    });

    const anos: AnoLetivo[] = [];
    const anoAtual = new Date().getFullYear();

    anoMap.forEach((semestres, ano) => {
      const semestresList: Semestre[] = [];

      if (semestres.has('primeiro')) {
        const turmasPrimeiro = semestres.get('primeiro')!;
        semestresList.push({
          id: `${ano}-1`,
          numero: 1,
          tipo: 'primeiro',
          descricao: '1º Semestre',
          expanded: false,
          turmas: this.ordenarTurmasPorDiaSemana(turmasPrimeiro.map(t => ({
            ...TurmaUtils.converterParaDisplay(t),
            expanded: false
          })))
        });
      }

      if (semestres.has('segundo')) {
        const turmasSegundo = semestres.get('segundo')!;
        semestresList.push({
          id: `${ano}-2`,
          numero: 2,
          tipo: 'segundo',
          descricao: '2º Semestre',
          expanded: false,
          turmas: this.ordenarTurmasPorDiaSemana(turmasSegundo.map(t => ({
            ...TurmaUtils.converterParaDisplay(t),
            expanded: false
          })))
        });
      }

      anos.push({
        id: ano,
        ano: ano,
        descricao: ano.toString(),
        ativo: ano === anoAtual,
        expanded: ano === anoAtual,
        semestres: semestresList
      });
    });

    return anos.sort((a, b) => b.ano - a.ano);
  }

  private ordenarTurmasPorDiaSemana(turmas: TurmaUI[]): TurmaUI[] {
    const ordemDias: { [key: string]: number } = {
      'Segunda-feira': 1,
      'Terça-feira': 2,
      'Quarta-feira': 3,
      'Quinta-feira': 4,
      'Sexta-feira': 5
    };

    return turmas.sort((a, b) => {
      const ordenA = ordemDias[a.dia_semana] || 999;
      const ordenB = ordemDias[b.dia_semana] || 999;
      return ordenA - ordenB;
    });
  }

  toggleAno(ano: AnoLetivo): void {
    ano.expanded = !ano.expanded;
  }

  toggleSemestre(semestre: Semestre): void {
    semestre.expanded = !semestre.expanded;
  }

  selecionarTurma(turma: TurmaUI): void {
    this.turmaSelecionada = turma;
  }
}
