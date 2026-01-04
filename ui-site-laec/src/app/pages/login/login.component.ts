import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;
  returnUrl: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obter URL de retorno dos query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    
    // Verificar se foi deslogado por inatividade
    const reason = this.route.snapshot.queryParams['reason'];
    if (reason === 'inactivity') {
      this.loginError = 'Sua sessão expirou por inatividade. Faça login novamente.';
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginError = '';
    
    if (!this.username || !this.password) {
      this.loginError = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;

    // Autenticação real com o auth-service
    this.authService.login(this.username, this.password, this.rememberMe).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Se tiver returnUrl, usar ela
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }
        
        // Caso contrário, redirecionar baseado no tipo de usuário
        const userType = this.authService.getUserType()?.toLowerCase();
        if (userType === 'aluno') {
          this.router.navigate(['/sessoes']);
        } else {
          this.router.navigate(['/gerenciamento']);
        }
      },
      error: (error) => {
        
        if (error.status === 401) {
          this.loginError = 'Usuário ou senha inválidos.';
        } else if (error.status === 0) {
          this.loginError = 'Não foi possível conectar ao servidor. Verifique se o auth-service está rodando na porta 8081.';
        } else {
          this.loginError = `Erro ao fazer login: ${error.error?.message || error.message || 'Tente novamente.'}`;
        }
        this.isLoading = false;
      }
    });
  }
}

