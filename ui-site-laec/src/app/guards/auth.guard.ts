import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Salvar URL tentada para redirecionar após login
  const returnUrl = state.url;
  console.log(`Acesso negado. Redirecionando para login. URL original: ${returnUrl}`);
  
  // Redirecionar para login com URL de retorno
  router.navigate(['/login'], { 
    queryParams: { returnUrl } 
  });
  
  return false;
};

// Guard para rotas públicas (evitar acesso se já estiver logado)
export const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Se já estiver logado, redirecionar baseado no tipo de usuário
  const userType = authService.getUserType()?.toLowerCase();
  console.log('Usuário já autenticado. Redirecionando...');
  
  if (userType === 'aluno') {
    router.navigate(['/sessoes']);
  } else {
    router.navigate(['/gerenciamento']);
  }
  
  return false;
};

// Guard para verificar se é aluno
export const alunoGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const userType = authService.getUserType()?.toLowerCase();
  if (userType === 'aluno') {
    return true;
  }

  // Se não for aluno, redirecionar para gerenciamento
  console.log(`Acesso negado a Sessões. Tipo: ${userType}. Redirecionando para Gerenciamento.`);
  router.navigate(['/gerenciamento']);
  return false;
};

// Guard para verificar se é staff (admin, técnico, professor, monitor)
export const staffGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const userType = authService.getUserType()?.toLowerCase();
  const allowedTypes = ['admin', 'administrador', 'tecnico', 'professor', 'monitor'];
  
  if (allowedTypes.includes(userType || '')) {
    return true;
  }

  // Se for aluno, redirecionar para sessões
  console.log(`Acesso negado a Gerenciamento. Tipo: ${userType}. Redirecionando para Sessões.`);
  router.navigate(['/sessoes']);
  return false;
};

// Guard para verificar tipo de usuário (admin, professor, etc)
export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userType = authService.getUserType();
    if (userType && allowedRoles.includes(userType)) {
      return true;
    }

    // Usuário não tem permissão
    console.log(`Acesso negado. Tipo de usuário: ${userType}, Permitidos: ${allowedRoles.join(', ')}`);
    router.navigate(['/']);
    return false;
  };
};
