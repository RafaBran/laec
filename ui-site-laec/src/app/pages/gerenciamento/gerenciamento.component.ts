import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CadastrarUsuariosComponent } from './cadastrar-usuarios/cadastrar-usuarios.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';

interface ModuloGerenciamento {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  rota: string;
  cor: string;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: string;
  action: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  expanded: boolean;
  subItems: SubMenuItem[];
}

@Component({
  selector: 'app-gerenciamento',
  standalone: true,
  templateUrl: './gerenciamento.component.html',
  styleUrl: './gerenciamento.component.scss',
  imports: [CommonModule, FormsModule, CadastrarUsuariosComponent, ListarUsuariosComponent]
})
export class GerenciamentoComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAuthorized: boolean = false;
  usuario: any = null;
  selectedView: string = '';
  
  // Tipos permitidos: administrador, técnico, professor, monitor
  private allowedTypes = ['admin', 'administrador', 'tecnico', 'professor', 'monitor'];
  
  // Menu lateral
  menuItems: MenuItem[] = [
    {
      id: 'turmas',
      label: 'Turmas',
      icon: 'pi pi-building',
      expanded: false,
      subItems: [
        { id: 'listar', label: 'Listar', icon: 'pi pi-list', action: 'listar' },
        { id: 'cadastrar', label: 'Cadastrar', icon: 'pi pi-plus', action: 'cadastrar' }
      ]
    },
    {
      id: 'grupos',
      label: 'Grupos',
      icon: 'pi pi-users',
      expanded: false,
      subItems: [
        { id: 'listar', label: 'Listar', icon: 'pi pi-list', action: 'listar' },
        { id: 'cadastrar', label: 'Cadastrar', icon: 'pi pi-plus', action: 'cadastrar' }
      ]
    },
    {
      id: 'procedimentos',
      label: 'Procedimentos',
      icon: 'pi pi-file-edit',
      expanded: false,
      subItems: [
        { id: 'listar', label: 'Listar', icon: 'pi pi-list', action: 'listar' },
        { id: 'cadastrar', label: 'Cadastrar', icon: 'pi pi-plus', action: 'cadastrar' }
      ]
    },
    {
      id: 'aulas-praticas',
      label: 'Aulas Práticas',
      icon: 'pi pi-desktop',
      expanded: false,
      subItems: [
        { id: 'listar', label: 'Listar', icon: 'pi pi-list', action: 'listar' },
        { id: 'cadastrar', label: 'Cadastrar', icon: 'pi pi-plus', action: 'cadastrar' }
      ]
    },
    {
      id: 'usuarios',
      label: 'Usuários',
      icon: 'pi pi-user',
      expanded: false,
      subItems: [
        { id: 'listar', label: 'Listar', icon: 'pi pi-list', action: 'listar' },
        { id: 'cadastrar', label: 'Cadastrar', icon: 'pi pi-plus', action: 'cadastrar' }
      ]
    }
  ];

  modulos: ModuloGerenciamento[] = [
    {
      id: 'usuarios',
      titulo: 'Usuários',
      descricao: 'Gerenciar usuários, permissões e acessos ao sistema',
      icone: 'pi pi-users',
      rota: '/gerenciamento/usuarios',
      cor: '#8b5cf6'
    },
    
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar autenticação e autorização
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.usuario = user;
      
      // Verificar se o tipo do usuário está na lista de permitidos
      if (user) {
        const userType = user.tipo?.toLowerCase();
        this.isAuthorized = this.allowedTypes.includes(userType);
      } else {
        this.isAuthorized = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  // Toggle menu item
  toggleMenuItem(itemId: string): void {
    const item = this.menuItems.find(m => m.id === itemId);
    if (item) {
      item.expanded = !item.expanded;
    }
  }

  // Selecionar ação do submenu
  selectAction(menuId: string, action: string): void {
    this.selectedView = `${menuId}-${action}`;
    console.log('View selecionada:', this.selectedView);
  }

  // Callback quando usuário for cadastrado com sucesso
  onUsuarioCadastrado(): void {
    this.selectedView = 'usuarios-listar';
    // Aqui você pode adicionar lógica adicional, como atualizar a lista
  }
}

