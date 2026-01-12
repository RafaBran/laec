import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, type Usuario } from '../../../services/usuario.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CadastrarUsuariosComponent } from '../cadastrar-usuarios/cadastrar-usuarios.component';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    CadastrarUsuariosComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss'
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading: boolean = false;
  searchValue: string = '';
  displayEditDialog: boolean = false;
  usuarioParaEditar?: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    console.log('[ListarUsuarios] Constructor chamado');
  }

  ngOnInit() {
    console.log('[ListarUsuarios] ngOnInit chamado');
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    console.log('[ListarUsuarios] carregarUsuarios chamado');
    this.loading = true;
    this.usuarioService.listarTodos().subscribe({
      next: (response: Usuario[]) => {
        this.usuarios = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de usuários'
        });
        this.loading = false;
      }
    });
  }

  getSeverity(tipo: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (tipo) {
      case 'admin':
        return 'danger';
      case 'professor':
        return 'info';
      case 'tecnico':
        return 'warn';
      case 'monitor':
        return 'success';
      case 'aluno':
        return 'secondary';
      default:
        return 'contrast';
    }
  }

  getStatusSeverity(ativo: boolean): 'success' | 'danger' {
    return ativo ? 'success' : 'danger';
  }

  confirmarDesativar(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `Deseja realmente desativar o usuário ${usuario.nome}?`,
      header: 'Confirmar Desativação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.desativarUsuario(usuario.id);
      }
    });
  }

  confirmarAtivar(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `Deseja realmente ativar o usuário ${usuario.nome}?`,
      header: 'Confirmar Ativação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.ativarUsuario(usuario.id);
      }
    });
  }

  confirmarDeletar(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `Deseja realmente deletar permanentemente o usuário ${usuario.nome}? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deletarUsuario(usuario.id);
      }
    });
  }

  desativarUsuario(id: number) {
    this.usuarioService.desativar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário desativado com sucesso'
        });
        this.carregarUsuarios();
      },
      error: (error: any) => {
        console.error('Erro ao desativar usuário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao desativar usuário'
        });
      }
    });
  }

  ativarUsuario(id: number) {
    this.usuarioService.ativar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário ativado com sucesso'
        });
        this.carregarUsuarios();
      },
      error: (error: any) => {
        console.error('Erro ao ativar usuário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao ativar usuário'
        });
      }
    });
  }

  deletarUsuario(id: number) {
    this.usuarioService.deletar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário deletado com sucesso'
        });
        this.carregarUsuarios();
      },
      error: (error: any) => {
        console.error('Erro ao deletar usuário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar usuário'
        });
      }
    });
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioParaEditar = usuario;
    this.displayEditDialog = true;
  }

  onUsuarioEditado() {
    this.displayEditDialog = false;
    this.usuarioParaEditar = undefined;
    this.carregarUsuarios();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Usuário atualizado com sucesso'
    });
  }

  onCancelarEdicao() {
    this.displayEditDialog = false;
    this.usuarioParaEditar = undefined;
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }
}
