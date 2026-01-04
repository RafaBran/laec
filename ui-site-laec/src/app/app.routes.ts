import { Routes } from '@angular/router';
import { authGuard, publicGuard, roleGuard, alunoGuard, staffGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/informacoes',
    pathMatch: 'full'
  },
  {
    path: 'informacoes',
    loadComponent: () => import('./pages/informacoes/informacoes.component').then(m => m.InformacoesComponent)
  },
  {
    path: 'procedimentos',
    loadComponent: () => import('./pages/procedimentos/procedimentos.component').then(m => m.ProcedimentosComponent)
  },
  {
    path: 'sessoes',
    loadComponent: () => import('./pages/sessoes/sessoes.component').then(m => m.SessoesComponent),
    canActivate: [alunoGuard] // Apenas alunos
  },
  {
    path: 'uso-laboratorio',
    loadComponent: () => import('./pages/uso-laboratorio/uso-laboratorio.component').then(m => m.UsoLaboratorioComponent)
  },
  {
    path: 'equipe',
    loadComponent: () => import('./pages/equipe/equipe.component').then(m => m.EquipeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard] // Não permitir acesso se já estiver logado
  },
  {
    path: 'gerenciamento',
    loadComponent: () => import('./pages/gerenciamento/gerenciamento.component').then(m => m.GerenciamentoComponent),
    canActivate: [staffGuard] // Apenas staff (admin, técnico, professor, monitor)
  },
  {
    path: 'gerenciamento/cadastrar-aulas',
    loadComponent: () => import('./pages/gerenciamento/cadastrar-aulas/cadastrar-aulas.component').then(m => m.CadastrarAulasComponent),
    canActivate: [staffGuard]
  },
  {
    path: 'gerenciamento/listar-aulas',
    loadComponent: () => import('./pages/gerenciamento/listar-aulas/listar-aulas.component').then(m => m.ListarAulasComponent),
    canActivate: [staffGuard]
  },
  {
    path: 'gerenciar-aulas',
    loadComponent: () => import('./pages/gerenciar-aulas/gerenciar-aulas.component').then(m => m.GerenciarAulasComponent),
    canActivate: [staffGuard]
  },
  {
    path: 'gerenciamento/cadastrar-usuarios',
    loadComponent: () => import('./pages/gerenciamento/cadastrar-usuarios/cadastrar-usuarios.component').then(m => m.CadastrarUsuariosComponent),
    canActivate: [staffGuard]
  },
  {
    path: '**',
    redirectTo: '/informacoes'
  }
];
