import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isAuthenticated = false;
  userName = '';
  userType = '';
  menuItems: MenuItem[] = [];
  
  private baseMenuItems: MenuItem[] = [
    {
      id: 'informacoes',
      label: 'Informações',
      icon: 'pi pi-info-circle',
      routerLink: '/informacoes'
    },
    {
      id: 'equipe',
      label: 'Equipe',
      icon: 'pi pi-users',
      routerLink: '/equipe'
    },
    {
      id: 'procedimentos',
      label: 'Procedimentos',
      icon: 'pi pi-book',
      routerLink: '/procedimentos'
    },
    {
      id: 'uso-laboratorio',
      label: 'Uso do Laboratório',
      icon: 'pi pi-calendar',
      routerLink: '/uso-laboratorio'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticação e construir menu dinâmico
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userName = user?.nome || '';
      this.userType = user?.tipo?.toLowerCase() || '';
      
      // Construir menu baseado no perfil do usuário
      this.buildMenu();
    });
  }

  private buildMenu(): void {
    // Começar com itens base
    this.menuItems = [...this.baseMenuItems];
    
    if (this.isAuthenticated) {
      // Se for aluno, adicionar apenas Sessões
      if (this.userType === 'aluno') {
        this.menuItems.push({
          id: 'sessoes',
          label: 'Sessões',
          icon: 'pi pi-list',
          routerLink: '/sessoes'
        });
      } 
      // Se for staff (admin, técnico, professor, monitor), adicionar apenas Gerenciamento
      else if (['admin', 'administrador', 'tecnico', 'professor', 'monitor'].includes(this.userType)) {
        this.menuItems.push({
          id: 'gerenciamento',
          label: 'Gerenciamento',
          icon: 'pi pi-cog',
          routerLink: '/gerenciamento'
        });
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
