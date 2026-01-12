import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TurmaService } from '../../services/turma.service';
import { AulaPraticaService } from '../../services/aula-pratica.service';
import { Turma, TurmaDisplay, TurmaUtils } from '../../models/turma.model';
import { AulaPratica, PrioridadeGrupos } from '../../models/aula-pratica.model';
import { AulaCardComponent } from '../../components/aula-card/aula-card.component';
import { ProximaAulaComponent } from '../../components/proxima-aula/proxima-aula.component';

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
  selector: 'app-uso-laboratorio',
  templateUrl: './uso-laboratorio.component.html',
  styleUrl: './uso-laboratorio.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, AulaCardComponent, ProximaAulaComponent]
})
export class UsoLaboratorioComponent implements OnInit {
  isAuthenticated: boolean = false;
  usuario: any = null;
  
  // Estrutura hierárquica de anos
  anos: AnoLetivo[] = [];
  
  // Turma selecionada para exibir detalhes
  turmaSelecionada: TurmaUI | null = null;
  
  // Aulas práticas da turma selecionada
  aulasPraticas: AulaPratica[] = [];
  
  // Prioridade para próxima aula
  proximaAulaPrioridade: PrioridadeGrupos | null = null;
  
  // Estados de carregamento
  carregandoAnos = false;
  carregandoAulas = false;
  carregandoPrioridade = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private turmaService: TurmaService,
    private aulaPraticaService: AulaPraticaService
  ) {}

  ngOnInit() {
    // Verificar autenticação
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.usuario = user;
    });
    
    this.carregarAnos();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  carregarAnos() {
    this.carregandoAnos = true;
    
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        console.log('Turmas recebidas da API:', turmas);
        this.anos = this.processarTurmas(turmas);
        console.log('Anos processados:', this.anos);
        this.carregandoAnos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar turmas:', erro);
        this.carregandoAnos = false;
        this.anos = [];
      }
    });
  }

  /**
   * Processa as turmas do banco e organiza em estrutura hierárquica
   */
  private processarTurmas(turmas: Turma[]): AnoLetivo[] {
    // Agrupar por ano
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

    // Converter para estrutura de AnoLetivo
    const anos: AnoLetivo[] = [];
    const anoAtual = new Date().getFullYear();

    anoMap.forEach((semestres, ano) => {
      const semestresList: Semestre[] = [];

      // Processar primeiro semestre
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

      // Processar segundo semestre
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
        expanded: ano === anoAtual, // Expandir automaticamente o ano atual
        semestres: semestresList
      });
    });

    // Ordenar por ano (mais recente primeiro)
    return anos.sort((a, b) => b.ano - a.ano);
  }

  /**
   * Ordena turmas por dia da semana (segunda a sexta)
   */
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

  // Toggle ano
  toggleAno(ano: AnoLetivo): void {
    ano.expanded = !ano.expanded;
  }

  // Toggle semestre
  toggleSemestre(semestre: Semestre): void {
    semestre.expanded = !semestre.expanded;
  }

  // Selecionar turma
  selecionarTurma(turma: TurmaUI): void {
    this.turmaSelecionada = turma;
    console.log('Turma selecionada:', turma);
    this.carregarAulasPraticas(turma.id);
    this.carregarProximaAulaPrioridade(turma.id);
  }

  // Carregar prioridade para próxima aula
  carregarProximaAulaPrioridade(turmaId: number): void {
    this.carregandoPrioridade = true;
    
    this.aulaPraticaService.getPrioridadeParaProximaAula(turmaId).subscribe({
      next: (prioridade) => {
        console.log('Prioridade para próxima aula:', prioridade);
        this.proximaAulaPrioridade = prioridade;
        this.carregandoPrioridade = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar prioridade:', erro);
        this.carregandoPrioridade = false;
        this.proximaAulaPrioridade = null;
      }
    });
  }

  // Carregar aulas práticas da turma
  carregarAulasPraticas(turmaId: number): void {
    this.carregandoAulas = true;
    
    this.aulaPraticaService.getAulasByTurma(turmaId).subscribe({
      next: (aulas) => {
        console.log('Aulas práticas recebidas:', aulas);
        this.aulasPraticas = aulas;
        this.carregandoAulas = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar aulas práticas:', erro);
        this.carregandoAulas = false;
        this.aulasPraticas = [];
      }
    });
  }

  // Marcar presença/falta
  onPresencaChange(event: { grupoAulaId: number, presente: boolean }): void {
    this.aulaPraticaService.marcarPresenca(event.grupoAulaId, event.presente).subscribe({
      next: () => {
        console.log('Presença atualizada com sucesso');
        // Atualizar a lista de aulas
        if (this.turmaSelecionada) {
          this.carregarAulasPraticas(this.turmaSelecionada.id);
        }
      },
      error: (erro) => {
        console.error('Erro ao marcar presença:', erro);
        alert('Erro ao atualizar presença. Tente novamente.');
      }
    });
  }

  // Concluir aula
  onConcluirAula(aulaId: number): void {
    this.aulaPraticaService.concluirAula(aulaId).subscribe({
      next: () => {
        console.log('Aula concluída com sucesso');
        alert('Aula concluída! As prioridades dos grupos foram atualizadas automaticamente.');
        // Atualizar a lista de aulas
        if (this.turmaSelecionada) {
          this.carregarAulasPraticas(this.turmaSelecionada.id);
        }
      },
      error: (erro) => {
        console.error('Erro ao concluir aula:', erro);
        alert('Erro ao concluir aula. Tente novamente.');
      }
    });
  }

  // Ver detalhes da aula (placeholder para futura implementação)
  onDetalhesAula(aulaId: number): void {
    console.log('Ver detalhes da aula:', aulaId);
    // TODO: Abrir modal ou navegação para detalhes
  }
}
