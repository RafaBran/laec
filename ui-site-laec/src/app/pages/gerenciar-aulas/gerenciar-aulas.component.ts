import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';

interface AnoLetivo {
  id: number;
  ano: number;
  descricao: string;
}

interface Semestre {
  id: number;
  numero: number;
  descricao: string;
}

interface Turma {
  id: number;
  nome: string;
  periodo: string;
  numero_grupos: number;
}

interface Procedimento {
  id: number;
  titulo: string;
}

interface Grupo {
  id: number;
  nome: string;
  numero: number;
  selecionado: boolean;
  ordem?: number;
  horario_inicio?: string;
  horario_fim?: string;
  observacoes?: string;
}

interface PrioridadeSugerida {
  grupo_id: number;
  grupo_nome: string;
  grupo_numero: number;
  ordem_sugerida: number;
  ultima_ordem?: number;
  prioridade: number;
}

interface AulaPratica {
  id?: number;
  data_aula: Date | null;
  numero_aula: number;
  tema: string;
  procedimento_id: number | null;
  observacoes?: string;
}

@Component({
  selector: 'app-gerenciar-aulas',
  templateUrl: './gerenciar-aulas.component.html',
  styleUrl: './gerenciar-aulas.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Select,
    ButtonDirective,
    InputText,
    Textarea,
    DatePicker,
    Dialog,
    Message
  ]
})
export class GerenciarAulasComponent implements OnInit {
  // Seleções
  anos: AnoLetivo[] = [];
  semestres: Semestre[] = [];
  turmas: Turma[] = [];
  procedimentos: Procedimento[] = [];
  
  anoSelecionado: AnoLetivo | null = null;
  semestreSelecionado: Semestre | null = null;
  turmaSelecionada: Turma | null = null;
  
  // Dados da aula
  aulaAtual: AulaPratica = {
    data_aula: null,
    numero_aula: 1,
    tema: '',
    procedimento_id: null,
    observacoes: ''
  };
  
  // Grupos
  grupos: Grupo[] = [];
  prioridadesSugeridas: PrioridadeSugerida[] = [];
  mostrarSugestao = false;
  
  // UI States
  carregando = false;
  dialogRegistroVisible = false;
  grupoSendoEditado: Grupo | null = null;
  etapaAtual: 'selecao' | 'aula' | 'grupos' | 'confirmacao' = 'selecao';
  
  // Mensagens
  mensagemSucesso = '';
  mensagemErro = '';

  ngOnInit() {
    this.carregarAnos();
  }

  // ==========================================
  // CARREGAMENTO DE DADOS
  // ==========================================

  carregarAnos() {
    // TODO: Chamar API real
    this.anos = [
      { id: 1, ano: 2024, descricao: '2024' },
      { id: 2, ano: 2025, descricao: '2025' },
      { id: 3, ano: 2026, descricao: '2026' }
    ];
  }

  onAnoChange() {
    this.semestreSelecionado = null;
    this.turmaSelecionada = null;
    this.semestres = [];
    this.turmas = [];
    this.resetarFormulario();
    
    if (this.anoSelecionado) {
      this.carregarSemestres(this.anoSelecionado.id);
    }
  }

  carregarSemestres(anoId: number) {
    // TODO: Chamar API real
    this.semestres = [
      { id: 1, numero: 1, descricao: '1º Semestre' },
      { id: 2, numero: 2, descricao: '2º Semestre' }
    ];
  }

  onSemestreChange() {
    this.turmaSelecionada = null;
    this.turmas = [];
    this.resetarFormulario();
    
    if (this.semestreSelecionado) {
      this.carregarTurmas(this.semestreSelecionado.id);
    }
  }

  carregarTurmas(semestreId: number) {
    // TODO: Chamar API real
    this.turmas = [
      {
        id: 1,
        nome: '5º Período - Análise do Comportamento',
        periodo: '5º Período',
        numero_grupos: 6
      }
    ];
  }

  onTurmaChange() {
    this.resetarFormulario();
    
    if (this.turmaSelecionada) {
      this.carregarProcedimentos();
      this.carregarGrupos(this.turmaSelecionada.id);
      this.carregarProximoNumeroAula(this.turmaSelecionada.id);
      this.etapaAtual = 'aula';
    }
  }

  carregarProcedimentos() {
    // TODO: Chamar API real
    this.procedimentos = [
      { id: 1, titulo: 'Caixa de Skinner - Condicionamento Operante' },
      { id: 2, titulo: 'Esquemas de Reforçamento' },
      { id: 3, titulo: 'Extinção de Comportamento' },
      { id: 4, titulo: 'Modelagem de Comportamento' }
    ];
  }

  carregarGrupos(turmaId: number) {
    // TODO: Chamar API real
    this.grupos = [
      { id: 1, nome: 'Grupo 1', numero: 1, selecionado: false },
      { id: 2, nome: 'Grupo 2', numero: 2, selecionado: false },
      { id: 3, nome: 'Grupo 3', numero: 3, selecionado: false },
      { id: 4, nome: 'Grupo 4', numero: 4, selecionado: false },
      { id: 5, nome: 'Grupo 5', numero: 5, selecionado: false },
      { id: 6, nome: 'Grupo 6', numero: 6, selecionado: false }
    ];
  }

  carregarProximoNumeroAula(turmaId: number) {
    // TODO: Chamar API real para buscar o próximo número
    // SELECT COALESCE(MAX(numero_aula), 0) + 1 FROM aulas_praticas WHERE turma_id = ?
    this.aulaAtual.numero_aula = 1;
  }

  // ==========================================
  // SUGESTÃO DE PRIORIDADE
  // ==========================================

  carregarSugestoesPrioridade() {
    if (!this.turmaSelecionada) return;
    
    this.carregando = true;
    
    // TODO: Chamar função SQL: sugerir_ordem_proxima_aula(turma_id, numero_aula_atual)
    setTimeout(() => {
      this.prioridadesSugeridas = [
        {
          grupo_id: 4,
          grupo_nome: 'Grupo 4',
          grupo_numero: 4,
          ordem_sugerida: 1,
          ultima_ordem: 6,
          prioridade: 100
        },
        {
          grupo_id: 5,
          grupo_nome: 'Grupo 5',
          grupo_numero: 5,
          ordem_sugerida: 2,
          ultima_ordem: 5,
          prioridade: 90
        },
        {
          grupo_id: 6,
          grupo_nome: 'Grupo 6',
          grupo_numero: 6,
          ordem_sugerida: 3,
          ultima_ordem: 4,
          prioridade: 80
        }
      ];
      this.mostrarSugestao = true;
      this.carregando = false;
    }, 500);
  }

  aplicarSugestao() {
    this.prioridadesSugeridas.forEach(sugestao => {
      const grupo = this.grupos.find(g => g.id === sugestao.grupo_id);
      if (grupo) {
        grupo.selecionado = true;
        grupo.ordem = sugestao.ordem_sugerida;
      }
    });
    this.mostrarSugestao = false;
    this.ordenarGrupos();
  }

  ignorarSugestao() {
    this.mostrarSugestao = false;
  }

  // ==========================================
  // GERENCIAMENTO DE GRUPOS
  // ==========================================

  toggleGrupo(grupo: Grupo) {
    grupo.selecionado = !grupo.selecionado;
    
    if (grupo.selecionado && !grupo.ordem) {
      // Atribuir próxima ordem disponível
      const ordens = this.grupos
        .filter(g => g.selecionado && g.ordem)
        .map(g => g.ordem!);
      grupo.ordem = ordens.length > 0 ? Math.max(...ordens) + 1 : 1;
    }
    
    if (!grupo.selecionado) {
      grupo.ordem = undefined;
      grupo.horario_inicio = undefined;
      grupo.horario_fim = undefined;
      grupo.observacoes = undefined;
    }
    
    this.ordenarGrupos();
  }

  ordenarGrupos() {
    this.grupos.sort((a, b) => {
      if (a.selecionado && !b.selecionado) return -1;
      if (!a.selecionado && b.selecionado) return 1;
      if (a.ordem && b.ordem) return a.ordem - b.ordem;
      return a.numero - b.numero;
    });
  }

  editarGrupo(grupo: Grupo) {
    this.grupoSendoEditado = { ...grupo };
    this.dialogRegistroVisible = true;
  }

  salvarEdicaoGrupo() {
    if (this.grupoSendoEditado) {
      const grupo = this.grupos.find(g => g.id === this.grupoSendoEditado!.id);
      if (grupo) {
        Object.assign(grupo, this.grupoSendoEditado);
      }
    }
    this.dialogRegistroVisible = false;
    this.grupoSendoEditado = null;
  }

  moverGrupoCima(grupo: Grupo) {
    if (!grupo.ordem || grupo.ordem === 1) return;
    
    const grupoAcima = this.grupos.find(g => g.ordem === grupo.ordem! - 1);
    if (grupoAcima) {
      grupoAcima.ordem = grupo.ordem;
      grupo.ordem = grupo.ordem - 1;
      this.ordenarGrupos();
    }
  }

  moverGrupoBaixo(grupo: Grupo) {
    const maxOrdem = Math.max(...this.grupos.filter(g => g.ordem).map(g => g.ordem!));
    if (!grupo.ordem || grupo.ordem === maxOrdem) return;
    
    const grupoAbaixo = this.grupos.find(g => g.ordem === grupo.ordem! + 1);
    if (grupoAbaixo) {
      grupoAbaixo.ordem = grupo.ordem;
      grupo.ordem = grupo.ordem + 1;
      this.ordenarGrupos();
    }
  }

  // ==========================================
  // NAVEGAÇÃO DE ETAPAS
  // ==========================================

  avancarParaGrupos() {
    if (!this.validarDadosAula()) return;
    
    this.etapaAtual = 'grupos';
    this.carregarSugestoesPrioridade();
  }

  voltarParaAula() {
    this.etapaAtual = 'aula';
  }

  avancarParaConfirmacao() {
    if (!this.validarGrupos()) return;
    this.etapaAtual = 'confirmacao';
  }

  voltarParaGrupos() {
    this.etapaAtual = 'grupos';
  }

  // ==========================================
  // VALIDAÇÕES
  // ==========================================

  validarDadosAula(): boolean {
    if (!this.aulaAtual.data_aula) {
      this.mensagemErro = 'Selecione a data da aula';
      return false;
    }
    if (!this.aulaAtual.tema.trim()) {
      this.mensagemErro = 'Digite o tema da aula';
      return false;
    }
    if (!this.aulaAtual.procedimento_id) {
      this.mensagemErro = 'Selecione um procedimento';
      return false;
    }
    this.mensagemErro = '';
    return true;
  }

  validarGrupos(): boolean {
    const gruposSelecionados = this.grupos.filter(g => g.selecionado);
    
    if (gruposSelecionados.length === 0) {
      this.mensagemErro = 'Selecione pelo menos um grupo';
      return false;
    }
    
    this.mensagemErro = '';
    return true;
  }

  // ==========================================
  // SALVAR REGISTRO
  // ==========================================

  salvarRegistro() {
    this.carregando = true;
    
    const dados = {
      turma_id: this.turmaSelecionada!.id,
      aula: {
        data_aula: this.aulaAtual.data_aula,
        numero_aula: this.aulaAtual.numero_aula,
        tema: this.aulaAtual.tema,
        procedimento_id: this.aulaAtual.procedimento_id,
        observacoes: this.aulaAtual.observacoes
      },
      usos: this.grupos
        .filter(g => g.selecionado)
        .map(g => ({
          grupo_id: g.id,
          ordem_execucao: g.ordem,
          horario_inicio: g.horario_inicio,
          horario_fim: g.horario_fim,
          observacoes: g.observacoes
        }))
    };
    
    console.log('Dados a salvar:', dados);
    
    // TODO: Chamar API real
    // this.apiService.salvarAulaPratica(dados).subscribe(...)
    
    setTimeout(() => {
      this.mensagemSucesso = 'Aula registrada com sucesso! Prioridades calculadas automaticamente.';
      this.carregando = false;
      
      // Reset após 3 segundos
      setTimeout(() => {
        this.resetarFormulario();
        this.etapaAtual = 'selecao';
        this.turmaSelecionada = null;
      }, 3000);
    }, 1000);
  }

  resetarFormulario() {
    this.aulaAtual = {
      data_aula: null,
      numero_aula: 1,
      tema: '',
      procedimento_id: null,
      observacoes: ''
    };
    this.grupos = [];
    this.prioridadesSugeridas = [];
    this.mostrarSugestao = false;
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }

  // ==========================================
  // HELPERS
  // ==========================================

  get gruposSelecionados(): Grupo[] {
    return this.grupos.filter(g => g.selecionado);
  }

  get progressoEtapa(): number {
    const etapas = ['selecao', 'aula', 'grupos', 'confirmacao'];
    return ((etapas.indexOf(this.etapaAtual) + 1) / etapas.length) * 100;
  }
}
