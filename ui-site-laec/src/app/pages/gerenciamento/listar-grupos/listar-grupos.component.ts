import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
import { GrupoService } from '../../../services/grupo.service';
import { Grupo, GrupoUtils } from '../../../models/grupo.model';

@Component({
  selector: 'app-listar-grupos',
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
  templateUrl: './listar-grupos.component.html',
  styleUrl: './listar-grupos.component.scss'
})
export class ListarGruposComponent implements OnInit {
  @Input() turmaId?: number;
  @Output() editarGrupoEvento = new EventEmitter<number>();
  
  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  carregando = false;
  filtroBusca: string = '';

  constructor(
    private grupoService: GrupoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.turmaId) {
      this.carregarGrupos();
    }
  }

  ngOnChanges(): void {
    if (this.turmaId) {
      this.carregarGrupos();
    }
  }

  carregarGrupos(): void {
    if (!this.turmaId) {
      this.grupos = [];
      this.gruposFiltrados = [];
      return;
    }

    this.carregando = true;
    this.grupoService.getGruposByTurma(this.turmaId).subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar grupos'
        });
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    if (!this.filtroBusca) {
      this.gruposFiltrados = [...this.grupos];
      return;
    }

    const busca = this.filtroBusca.toLowerCase();
    this.gruposFiltrados = this.grupos.filter(grupo => {
      return (
        grupo.nomeGrupo?.toLowerCase().includes(busca) ||
        grupo.numeroGrupo.toString().includes(busca) ||
        grupo.turma?.nomeTurma?.toLowerCase().includes(busca) ||
        grupo.turma?.ano.toString().includes(busca)
      );
    });
  }

  getTotalAulas(grupo: Grupo): number {
    return GrupoUtils.getTotalAulas(grupo);
  }

  formatarPrioridade(prioridade: number): string {
    return GrupoUtils.formatarPrioridade(prioridade);
  }

  getStatusSeverity(ativo: boolean): string {
    return ativo ? 'success' : 'danger';
  }

  getStatusLabel(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  editarGrupo(grupo: Grupo): void {
    this.editarGrupoEvento.emit(grupo.grupoId);
  }

  confirmarExclusao(grupo: Grupo): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o grupo "${grupo.nomeGrupo}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.excluirGrupo(grupo.grupoId);
      }
    });
  }

  excluirGrupo(id: number): void {
    this.grupoService.deleteGrupo(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo excluído com sucesso'
        });
        this.carregarGrupos();
      },
      error: (error) => {
        console.error('Erro ao excluir grupo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir grupo'
        });
      }
    });
  }

  toggleAtivo(grupo: Grupo): void {
    const novoStatus = !grupo.ativo;
    this.grupoService.toggleAtivo(grupo.grupoId, novoStatus).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Grupo ${novoStatus ? 'ativado' : 'desativado'} com sucesso`
        });
        this.carregarGrupos();
      },
      error: (error) => {
        console.error('Erro ao alterar status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar status do grupo'
        });
      }
    });
  }
}
