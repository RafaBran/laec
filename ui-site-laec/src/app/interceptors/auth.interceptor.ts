import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Interceptando requisição:', req.url);
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se houver token, adicionar ao cabeçalho Authorization
  if (token) {
    console.log('[AuthInterceptor] Token encontrado, adicionando ao header');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.log('[AuthInterceptor] Nenhum token encontrado');
  return next(req);
};
