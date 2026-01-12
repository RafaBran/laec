import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { TurmaService } from '../../services/turma.service';
import { CadastrarUsuariosComponent } from './cadastrar-usuarios/cadastrar-usuarios.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { CadastrarAulasComponent } from './cadastrar-aulas/cadastrar-aulas.component';
import { ListarTurmasComponent } from './listar-turmas/listar-turmas.component';
import { CadastrarTurmasComponent } from './cadastrar-turmas/cadastrar-turmas.component';
import { ListarGruposComponent } from './listar-grupos/listar-grupos.component';

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

interface TurmaUI {
  id: number;
  nome: string;
  diaSemana: string;
}

interface Semestre {
  id: string;
  nome: string;
  descricao: string;
  turmas: TurmaUI[];
  expanded: boolean;
}

interface AnoLetivo {
  id: number;
  descricao: string;
  ativo: boolean;
  semestres: Semestre[];
  expanded: boolean;
}

@Component({
  selector: 'app-gerenciamento',
  standalone: true,
  templateUrl: './gerenciamento.component.html',
  styleUrl: './gerenciamento.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    CadastrarUsuariosComponent,
    ListarUsuariosComponent,
    CadastrarAulasComponent,
    ListarTurmasComponent,
    CadastrarTurmasComponent,
    ListarGruposComponent
  ]
})
export class GerenciamentoComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAuthorized: boolean = false;
  usuario: any = null;
  selectedView: string = '';
  turmaIdEdicao?: number;
  
  // Navegação hierárquica de grupos
  anosGrupos: AnoLetivo[] = [];
  turmaSelecionadaGrupos: TurmaUI | null = null;
  carregandoAnosGrupos = false;
  
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
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private turmaService: TurmaService
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
      
      // Carregar anos quando menu Grupos for expandido pela primeira vez
      if (itemId === 'grupos' && item.expanded && this.anosGrupos.length === 0) {
        this.carregarAnosGrupos();
      }
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

  // ===== Navegação hierárquica de Grupos =====
  
  carregarAnosGrupos(): void {
    this.carregandoAnosGrupos = true;
    
    this.turmaService.getAllTurmas().subscribe({
      next: (turmas: any[]) => {
        this.anosGrupos = this.processarTurmasGrupos(turmas);
        this.carregandoAnosGrupos = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar turmas para grupos:', erro);
        this.carregandoAnosGrupos = false;
        this.anosGrupos = [];
      }
    });
  }

  private processarTurmasGrupos(turmas: any[]): AnoLetivo[] {
    const anosMap = new Map<number, AnoLetivo>();

    turmas.forEach(turma => {
      const anoId = turma.anoLetivo.anoLetivoId;
      
      if (!anosMap.has(anoId)) {
        anosMap.set(anoId, {
          id: anoId,
          descricao: turma.anoLetivo.descricao,
          ativo: turma.anoLetivo.ativo,
          semestres: [],
          expanded: turma.anoLetivo.ativo
        });
      }

      const ano = anosMap.get(anoId)!;
      let semestre = ano.semestres.find(s => s.nome === turma.semestre);

      if (!semestre) {
        semestre = {
          id: `${anoId}-${turma.semestre}`,
          nome: turma.semestre,
          descricao: turma.semestre.toUpperCase() === 'PRIMEIRO' ? '1º Semestre' : '2º Semestre',
          turmas: [],
          expanded: false
        };
        ano.semestres.push(semestre);
      }

      semestre.turmas.push({
        id: turma.turmaId,
        nome: turma.nomeTurma,
        diaSemana: turma.diaSemana
      });
    });

    const anos = Array.from(anosMap.values());
    anos.sort((a, b) => b.id - a.id);
    
    anos.forEach(ano => {
      ano.semestres.sort((a, b) => a.nome === 'PRIMEIRO' ? -1 : 1);
      ano.semestres.forEach(semestre => {
        this.ordenarTurmasPorDiaSemana(semestre.turmas);
      });
    });

    return anos;
  }

  private ordenarTurmasPorDiaSemana(turmas: TurmaUI[]): void {
    const ordemDias: { [key: string]: number } = {
      'SEGUNDA': 1, 'TERCA': 2, 'QUARTA': 3,
      'QUINTA': 4, 'SEXTA': 5, 'SABADO': 6, 'DOMINGO': 7
    };
    
    turmas.sort((a, b) => {
      const ordemA = ordemDias[a.diaSemana] || 999;
      const ordemB = ordemDias[b.diaSemana] || 999;
      return ordemA - ordemB;
    });
  }

  toggleAnoGrupos(ano: AnoLetivo): void {
    ano.expanded = !ano.expanded;
  }

  toggleSemestreGrupos(semestre: Semestre): void {
    semestre.expanded = !semestre.expanded;
  }

  selecionarTurmaGrupos(turma: TurmaUI): void {
    this.turmaSelecionadaGrupos = turma;
    this.selectedView = 'grupos-listar';
  }

  // Callback para editar turma
  editarTurma(turmaId: number): void {
    this.turmaIdEdicao = turmaId;
    this.selectedView = 'turmas-editar';
  }
}

