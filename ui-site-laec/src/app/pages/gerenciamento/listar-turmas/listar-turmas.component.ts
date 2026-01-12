import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { TurmaService } from '../../../services/turma.service';
import { Turma, TurmaUtils } from '../../../models/turma.model';

@Component({
  selector: 'app-listar-turmas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ConfirmDialog,
    Toast,
    Tooltip
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listar-turmas.component.html',
  styleUrl: './listar-turmas.component.scss'
})
export class ListarTurmasComponent implements OnInit {
  @Output() editarTurmaEvento = new EventEmitter<number>();
  
  turmas: Turma[] = [];
  turmasFiltradas: Turma[] = [];
  carregando = false;
  filtroBusca: string = '';

  constructor(
    private turmaService: TurmaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTurmas();
  }

  carregarTurmas(): void {
    this.carregando = true;
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar turmas'
        });
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    if (!this.filtroBusca) {
      this.turmasFiltradas = [...this.turmas];
      return;
    }

    const busca = this.filtroBusca.toLowerCase();
    this.turmasFiltradas = this.turmas.filter(turma => {
      return (
        turma.nomeTurma.toLowerCase().includes(busca) ||
        TurmaUtils.formatarDiaSemana(turma.diaSemana).toLowerCase().includes(busca) ||
        TurmaUtils.formatarTurno(turma.turno).toLowerCase().includes(busca) ||
        TurmaUtils.formatarUnidade(turma.unidade).toLowerCase().includes(busca) ||
        turma.ano.toString().includes(busca)
      );
    });
  }

  formatarSemestre(semestre: string): string {
    return TurmaUtils.formatarSemestre(semestre);
  }

  formatarTurno(turno: string): string {
    return TurmaUtils.formatarTurno(turno);
  }

  formatarUnidade(unidade: string): string {
    return TurmaUtils.formatarUnidade(unidade);
  }

  formatarDiaSemana(dia: string): string {
    return TurmaUtils.formatarDiaSemana(dia);
  }

  editarTurma(turma: Turma): void {
    this.editarTurmaEvento.emit(turma.turmaId);
  }

  confirmarExclusao(turma: Turma): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a turma "${turma.nomeTurma}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.excluirTurma(turma);
      }
    });
  }

  excluirTurma(turma: Turma): void {
    this.turmaService.deletarTurma(turma.turmaId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Turma excluída com sucesso'
        });
        this.carregarTurmas();
      },
      error: (error) => {
        console.error('Erro ao excluir turma:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro ao excluir turma'
        });
      }
    });
  }

  novaTurma(): void {
    this.router.navigate(['/gerenciamento/cadastrar-turma']);
  }

  voltarGerenciamento(): void {
    this.router.navigate(['/gerenciamento']);
  }
}
