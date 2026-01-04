import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';
  private readonly REMEMBER_KEY = 'remember_me';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Determinar qual storage usar baseado na preferência do usuário
  private getStorage(): Storage {
    const rememberMe = localStorage.getItem(this.REMEMBER_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  private loadUserFromStorage(): void {
    // Tentar carregar de ambos os storages
    const storage = this.getStorage();
    let userStr = storage.getItem(this.USER_KEY);
    
    // Se não encontrar no storage preferido, tentar no outro
    if (!userStr) {
      const alternateStorage = storage === localStorage ? sessionStorage : localStorage;
      userStr = alternateStorage.getItem(this.USER_KEY);
    }
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.clearStorage();
      }
    }
  }

  login(username: string, senha: string, rememberMe: boolean = false): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, senha, rememberMe };
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Salvar preferência de "lembrar-me" no localStorage
            localStorage.setItem(this.REMEMBER_KEY, rememberMe.toString());
            
            // Escolher storage baseado na preferência
            const storage = rememberMe ? localStorage : sessionStorage;
            
            // Salvar token e informações do usuário
            storage.setItem(this.TOKEN_KEY, response.token);
            const user = {
              id: response.id,
              email: response.email,
              nome: response.nome,
              tipo: response.tipo
            };
            storage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, registerData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Após registro bem-sucedido, fazer login automaticamente
            localStorage.setItem(this.TOKEN_KEY, response.token);
            const user = {
              id: response.id,
              email: response.email,
              nome: response.nome,
              tipo: response.tipo
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    // Limpar de ambos os storages
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar se o token está expirado
    try {
      const payload = this.decodeToken(token);
      const expiration = payload.exp * 1000; // Converter para milissegundos
      return Date.now() < expiration;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    const storage = this.getStorage();
    let token = storage.getItem(this.TOKEN_KEY);
    
    // Se não encontrar no storage preferido, tentar no outro
    if (!token) {
      const alternateStorage = storage === localStorage ? sessionStorage : localStorage;
      token = alternateStorage.getItem(this.TOKEN_KEY);
    }
    
    return token;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserType(): string | null {
    const user = this.getCurrentUser();
    return user?.tipo || null;
  }

  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user?.email || null;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user?.nome || null;
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
}
